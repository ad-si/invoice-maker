import type { Invoice } from "../source/types"

function emptyObj (obj: Record<string, string>) {
  return Object.entries(obj)
    .every(([, val]) => val === "")
}

export default function (invoice: Invoice) {
  const billerUstId = invoice.from["umsatzsteuer-identifikationsnummer"]
  const recipientUstId = invoice.to["umsatzsteuer-identifikationsnummer"]
  const unicodeMinus = "\u2212"

  // Biller newline
  const billerAddressTooLong =
    Object.values(invoice.from.address)
      .join().length > 50
  const bnl = billerAddressTooLong ? "\\\\" : ""

  // Recipient newline
  const recipientAddressTooLong =
    Object.values(invoice.to.address)
      .join().length > 50
  const rnl = recipientAddressTooLong ? "\\\\" : ""

  if (!billerUstId) {
    throw new Error(
      "The USt-IdNr of the biller is mandatory in german invoices",
    )
  }

  /* eslint-disable indent */

  //   let paypalme = ""
  //   const paypalUrl = `paypal.me/${invoice.from.paypalme}/${
  //     invoice.total.toFixed(2)}`

  //   if (invoice.from && invoice.from.paypalme) {
  //     paypalme = `
  // \\begin{center}
  // oder
  // \\end{center}

  // -------- -----------------------
  //  PayPal: [**${paypalUrl}**][paypal]
  //  ${"" /* This empty line is necessary for formatting */}
  // --------------------------------

  // [paypal]: https://www.${paypalUrl}
  // `
  //   }

  let discountValue = ""

  if (invoice.discount) {
    discountValue =
      invoice.discount.type === "fixed"
        ? `${invoice.discount.value} €`
        : invoice.discount.type === "proportionate"
          ? `${invoice.discount.value * 100} \\%`
          : `ERROR: ${invoice.discount.type} is no valid discount type`
  }

  const invoiceType = invoice.type === "quote" ? "Angebot" : "Rechnung"

  const invoiceHeader = `
------------------ -----------------
  Rechnungsnummer: **${invoice.id}**

Ausstellungsdatum: **${invoice.issuingDate.toISOString()
.substr(0, 10)}**

      Lieferdatum: **${invoice.deliveryDate.toISOString()
.substr(0, 10)}**
-----------------------------------
`

  const quoteHeader = `
----------------- ----------------
  Angebotsnummer: **${invoice.id}**

Austellungsdatum: **${invoice.issuingDate.toISOString()
.substr(0, 10)}**
-----------------------------------
`

  const invoiceEnd = `
${
  invoice.from.smallBusiness
    ? "Gemäß § 19 UStG ist in dem ausgewiesenen Betrag " +
      "keine Umsatzsteuer enthalten.&nbsp;"
    : ""
}

Bitte überweise den Betrag bis
**${invoice.dueDate.toISOString()
.substr(0, 10)}** auf folgendes Konto:
${/* }** auf eines der folgenden Konten: */ ""}

--------- ----------------------
 Inhaber: **${invoice.from.name}**

    IBAN: **${invoice.from.iban}**
--------------------------------

${/* ${paypalme} */ ""}

Vielen Dank für die gute Zusammenarbeit!
`

  const quoteEnd = ""

  return `
---
title: |
  \`\`\`{=latex}
  \\vspace{-5ex} ${invoiceType}
  \`\`\`
---

${invoice.type === "quote" ? quoteHeader : invoiceHeader}

&nbsp;
&nbsp;

\\begin{multicols}{2}

  \\subsection{Empfänger}

  ${[
    invoice.to.name ? `${invoice.to.name}\\\\` : null,
    invoice.to.organization ? `${invoice.to.organization}\\\\` : null,
    invoice.to.address.country ? `${invoice.to.address.country},` : null,
    invoice.to.address.city && invoice.to.address.zip
      ? `${invoice.to.address.city} ${invoice.to.address.zip}, ${rnl}`
      : null,
    `${invoice.to.address.street} ${invoice.to.address.number} ${
      invoice.to.address.addition
        ? `/ ${invoice.to.address.addition.replace("#", "\\#")}`
        : "" // TODO: Escape all special LaTeX characters
    } ${emptyObj(invoice.to.address) ? "" : "\\\\"}`,
    recipientUstId ? `USt-IdNr.: ${recipientUstId}` : null,
  ]
    .filter(Boolean)
    .join("\n")}

\\columnbreak

  \\subsection{Aussteller}

  ${[
    invoice.from.name ? `${invoice.from.name}\\\\` : null,
    Array.isArray(invoice.from.emails)
      ? `(\\href{${invoice.from.emails[0]}}{${invoice.from.emails[0]}})\\\\`
      : null,
    invoice.from.job ? `${invoice.from.job}\\\\` : "",
    invoice.from.address.country ? `${invoice.from.address.country},` : null,
    `${invoice.from.address.city} ${invoice.from.address.zip}, ${bnl}`,
    `${invoice.from.address.street} ${invoice.from.address.number} ${
      invoice.from.address.addition
        ? `/ ${invoice.from.address.addition.replace("#", "\\#")}\\\\`
        : ""
    }`,
    `USt-IdNr.: ${billerUstId}`,
  ]
    .filter(Boolean)
    .join("\n")}

\\columnbreak

\\end{multicols}


## Leistungen

${invoice.taskTable}


\\begin{flushright}

${
  invoice.totalDuration
    ? `Gesamtarbeitszeit:\\qquad{\\textbf{${invoice.totalDuration} min}}`
    : ""
}

${
  invoice.discount || invoice.vat
    ? `Zwischensumme:\\qquad{${invoice.subTotal.toFixed(2)} €}\n\n`
    : ""
}

${
  invoice.discount
    ? `Rabatt von ${discountValue}
    ${
      invoice.discount.reason ? `(${invoice.discount.reason})` : ""
    }:\\qquad{${unicodeMinus}${invoice.discount.amount.toFixed(2)}  €}`
    : ""
}

${
  invoice.vat
    ? `Umsatzsteuer von ${invoice.vat * 100} \\%:\\qquad{` +
      `${invoice.tax.toFixed(2)} €}`
    : recipientUstId && !recipientUstId.startsWith("DE")
      ? "Steuerschuldnerschaft des Leistungsempfängers"
      : ""
}

Gesamtbetrag: \\textbf{\\qquad{${invoice.total.toFixed(2)}}}
${"\\textbf{€}" /* TODO: Also underline € sign */}

\\end{flushright}


&nbsp;

${invoice.type === "quote" ? quoteEnd : invoiceEnd}
`
}
