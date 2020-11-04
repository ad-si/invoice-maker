const {stripIndent, oneLineTrim} = require('common-tags')
const createInvoice = require('./createInvoice')
const templates = {
  de: require('../templates/de.js'),
  en: require('../templates/en.js'),
}

module.exports = (biller, recipient, invoiceData) => {
  const author = invoiceData.logoPath
    ? oneLineTrim `
      \\includegraphics
      [
        width=80mm,
        height=20mm,
        keepaspectratio
      ]
      {${invoiceData.logoPath}}`
    : ''
  const metaData = stripIndent `
    ---
    papersize: a4
    geometry: top=25mm, bottom=25mm, left=25mm, right=25mm
    mainfont: LiberationSans
    header-includes:
      - '\\usepackage[utf8]{inputenc}'
      - '\\usepackage{multicol}'
      - '\\usepackage{graphicx}'
      - '\\usepackage{eurosym}'
      # Top align columns in multicolumn environment
      - '\\raggedcolumns'
    author: |
      ${author}
      \\vspace{-2ex}
  `
  const invoice = createInvoice(biller, recipient, invoiceData)
  const invoiceDoc = templates[invoice.language](invoice) + '\n'
  const invoiceDocWithMeta = invoiceDoc.replace('---', metaData)

  return invoiceDocWithMeta
}
