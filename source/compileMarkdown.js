const {stripIndent, oneLineTrim} = require('common-tags')
const createInvoice = require('./createInvoice')
const templates = {
  de: require('../templates/de.js'),
  en: require('../templates/en.js'),
}

module.exports = (biller, recipient, invoiceData) => {
  const metaData = stripIndent `
    ---
    papersize: a4
    geometry: top=30mm, bottom=30mm, left=30mm, right=30mm
    mainfont: Helvetica
    header-includes:
      - '\\usepackage{multicol}'
      - '\\usepackage{graphicx}'
      - '\\usepackage{soul}'
      - '\\usepackage[right]{eurosym}'
      # Top align columns in multicolumn environment
      - '\\raggedcolumns'
    author: |
      ${invoiceData.logoPath
        ? oneLineTrim `
          \\includegraphics
          [
            width=80mm,
            height=20mm,
            keepaspectratio
          ]
          {${invoiceData.logoPath}}`
        : ''
      }
      \\vspace{-2ex}
  `
  const invoice = createInvoice(biller, recipient, invoiceData)
  const invoiceDoc = templates[invoice.language](invoice) + '\n'
  const invoiceDocWithMeta = invoiceDoc.replace('---', metaData)

  return invoiceDocWithMeta
}
