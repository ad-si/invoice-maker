const createInvoice = require('./createInvoice')
const templates = {
  de: require('../templates/de.js'),
  en: require('../templates/en.js'),
}

module.exports = (biller, recipient, invoiceData) => {
  const invoice = createInvoice(biller, recipient, invoiceData)

  return templates[invoice.language](invoice) + '\n'
}
