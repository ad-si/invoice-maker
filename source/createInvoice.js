const Tabledown = require('tabledown').default

const formatTask = require('./formatTask')
const headerTexts = require('./headerTexts')
const alignments = {
  number: 'center',
  date: 'center',
  description: 'left',
  duration: 'right',
  price: 'right',
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
    .map(item => Number(item.price))
    .reduce((current, next) => current + next)
    .toFixed(2)
}

function calcDeliveryDate (items) {
  return items
    .map(item => item.date)
    .reduce(
      (previousDate, currentDate) =>
        previousDate > currentDate ? previousDate : currentDate,
      '0000-00-00'
    )
}

function buildTaskTable (data, items) {
  return new Tabledown({
    data: items
      .map(item => {
        if (typeof item.price === 'number') {
          item.price = item.price.toFixed(2)
        }
        return item
      })
      .map(formatTask),
    alignments,
    headerTexts: headerTexts[data.language],
    capitalizeHeaders: true,
  })
}


module.exports = (biller, recipient, data) => {
  const invoice = {}

  invoice.issuingDate = new Date()
  invoice.id = data.id || invoice.issuingDate
    .toISOString()
    .substr(0, 10) + '_1'
  invoice.deliveryDate = data.deliveryDate

  invoice.dueDate = new Date(invoice.issuingDate)
  invoice.dueDate.setDate(invoice.issuingDate.getDate() + 14)

  invoice.from = sanitizeContact(biller)
  invoice.to = sanitizeContact(recipient)

  invoice.language = data.language || 'en'

  if (data.items) {
    invoice.items = data.items
      .reverse() // TODO: Sort by date
      .map(item => {
        if (item.price) return item

        const duration = item.duration || 15 // minutes
        const hourlyWage = data.hourlyWage || 20 // $/hour
        const minutesPerHour = 60
        const price = (duration / minutesPerHour) * hourlyWage
        item.price = price
        return item
      })

    invoice.subTotal = getSubTotal(invoice.items)
    invoice.discount = data.discount || {value: 0}
    invoice.discount.amount = invoice.subTotal * invoice.discount.value
    invoice.total = invoice.subTotal - invoice.discount.amount
    invoice.logoPath = data.logoPath

    invoice.totalDuration = invoice.items
      .map(item => Number(item.duration || 0))
      .reduce((current, next) => current + next)

    invoice.taskTable = buildTaskTable(data, invoice.items)

    if (!invoice.deliveryDate) {
      invoice.deliveryDate = calcDeliveryDate(invoice.items)
    }
  }



  invoice.deliveryDate = new Date(invoice.deliveryDate || invoice.issuingDate)

  return invoice
}
