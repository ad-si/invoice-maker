const Tabledown = require('tabledown').default

const formatTask = require('./formatTask')
const headerTexts = require('./headerTexts')
const alignments = {
  number: 'center',
  date: 'center',
  description: 'left',
  duration: 'right',
  quantity: 'right',
  price: 'right',
  priceTotal: 'right',
}


function sanitizeContact (contact) {
  contact = Object.assign(
    {
      name: '',
      address: {},
    },
    contact
  )

  if (contact.addresses) contact.address = contact.addresses[0]
  if (contact.emails) contact.email = contact.emails[0]

  contact.address = Object.assign(
    {
      country: '',
      city: '',
      zip: '',
      street: '',
      number: '',
    },
    contact.address
  )

  return contact
}

function getSubTotal (items) {
  return items
    .map(item => Number(item.priceTotal))
    .reduce((current, next) => current + next)
}

function calcDeliveryDate (deliveryDate, items) {
  return items
    .map(item => item.date || new Date(deliveryDate))
    .reduce(
      (previousDate, currentDate) =>
        previousDate > currentDate ? previousDate : currentDate,
      '0000-00-00'
    )
}

function buildTaskTable (data, items) {
  const headerStructure = {}
  Object
    .keys(headerTexts[data.language])
    .forEach(key => headerStructure[key] = undefined)

  if (items.every(item => !Boolean(item.duration))) {
    delete headerStructure.duration
    delete alignments.duration
  }

  const formattedItems = items
    .map(item => {
      if (typeof item.priceTotal === 'number') {
        item.priceTotal = item.priceTotal.toFixed(2)
      }
      return item
    })
    .map((item, index) =>
      formatTask(item, headerStructure, index)
    )

  return new Tabledown({
    data: formattedItems,
    alignments,
    headerTexts: headerTexts[data.language],
    capitalizeHeaders: true,
  })
}


module.exports = (biller, recipient, data) => {
  const invoice = {}

  invoice.type = data.type || 'invoice'
  invoice.issuingDate = data.issuingDate || new Date()
  invoice.id = data.id || invoice.issuingDate
    .toISOString()
    .substr(0, 10) + '_1'
  invoice.deliveryDate = calcDeliveryDate(data.deliveryDate, data.items)

  invoice.dueDate = new Date(invoice.issuingDate)
  invoice.dueDate.setDate(invoice.issuingDate.getDate() + 14)

  invoice.from = sanitizeContact(biller)
  invoice.to = sanitizeContact(recipient)

  invoice.language = data.language || 'en'

  if (data.items) {
    invoice.items = data.items
      .map(item => {
        item.date = item.date || invoice.deliveryDate
        item.quantity = Number.isFinite(item.quantity)
          ? item.quantity
          : 1

        if (Number.isFinite(item.price)) {
          item.priceTotal = item.price * item.quantity
        }
        else if (Number.isFinite(item.duration)) {
          const duration = item.duration // minutes
          const hourlyWage = data.hourlyWage || 20 // $/hour
          const minutesPerHour = 60
          const price = (duration / minutesPerHour) * hourlyWage
          item.price = price
          item.priceTotal = price
        }
        else {
          throw new Error('Set price or duration')
        }
        return item
      })
      .sort((itemA, itemB) => itemA.date - itemB.date)

    invoice.total = invoice.subTotal = getSubTotal(invoice.items)

    if (data.discount) {
      if (data.discount.type === 'fixed') {
        invoice.discount = data.discount
        invoice.discount.amount = data.discount.value
      }
      else if (
          typeof data.discount.type === 'undefined' ||
          data.discount.type === 'proportionate'
        ) {
        invoice.discount = data.discount
        invoice.discount.amount = invoice.subTotal * invoice.discount.value
      }
      else  {
        throw new Error(`"${data.discount.type} is no valid discount type"`)
      }

      invoice.total -= invoice.discount.amount
    }

    if (data.vat) {
      invoice.vat = data.vat
      invoice.tax = invoice.total * invoice.vat
      invoice.total += invoice.tax
    }

    invoice.logoPath = data.logoPath

    invoice.totalDuration = invoice.items
      .map(item => Number(item.duration || 0))
      .reduce((current, next) => current + next)

    invoice.taskTable = buildTaskTable(data, invoice.items)
  }

  invoice.deliveryDate = new Date(invoice.deliveryDate || invoice.issuingDate)

  return invoice
}
