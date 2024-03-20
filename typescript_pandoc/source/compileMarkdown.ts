import { stripIndent, oneLineTrim } from "common-tags"
import createInvoice from "./createInvoice.ts"
import deTemplate from "../templates/de.ts"
import enTemplate from "../templates/en.ts"
import type { FromContact, Invoice, ToContact, YamlData } from "./types.ts"

// eslint-disable-next-line no-unused-vars
const templates: Record<"de" | "en", (invoice: Invoice) => string> = {
  de: deTemplate,
  en: enTemplate,
}

export default function (
  biller: FromContact,
  recipient: ToContact,
  invoiceData: YamlData,
) {
  const author = invoiceData.logoPath
    ? oneLineTrim`
      \\includegraphics
      [
        width=80mm,
        height=20mm,
        keepaspectratio
      ]
      {${invoiceData.logoPath}}`
    : ""
  const metaData = stripIndent`
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
      \`\`\`{=latex}
      ${author}
      \\vspace{-2ex}
      \`\`\`
  `
  const invoice: Invoice = createInvoice(biller, recipient, invoiceData)
  const invoiceDoc =
    invoice.language === "de"
      ? deTemplate(invoice)
      : invoice.language === "en"
        ? enTemplate(invoice)
        : "ERROR: Language not supported"

  templates[invoice.language](invoice) + "\n"
  const invoiceDocWithMeta = invoiceDoc.replace("---", metaData)

  return invoiceDocWithMeta
}
