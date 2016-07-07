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

module.exports = (biller, recipient, data) => {
  const invoice = {}

  invoice.issuingDate = new Date()
  invoice.id = invoice.issuingDate
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
      .reverse()
      .map(item => {
        const hourlyWage = data.hourlyWage || 20
        const minutesPerHour = 60
        const price = (item.duration / minutesPerHour) * hourlyWage
        item.price = Number.isFinite(price) ? price : item.price
        return item
      })

    invoice.total = invoice.items
      .map(item => Number(item.price))
      .reduce((current, next) => current + next)
      .toFixed(2)

    invoice.totalDuration = invoice.items
      .map(item => Number(item.duration))
      .reduce((current, next) => current + next)

    invoice.taskTable = new Tabledown({
      data: invoice.items
        .map(item => {
          item.price = item.price.toFixed(2)
          return item
        })
        .map(formatTask),
      alignments,
      headerTexts: headerTexts[data.language],
      capitalizeHeaders: true,
    })

    if (!invoice.deliveryDate) {
      invoice.deliveryDate = invoice.items
        .map(item => item.date)
        .reduce(
          (previousDate, currentDate) =>
            previousDate > currentDate ? previousDate : currentDate,
          '0000-00-00'
        )
    }
  }

  invoice.deliveryDate = new Date(invoice.deliveryDate || invoice.issuingDate)

  return invoice
}
