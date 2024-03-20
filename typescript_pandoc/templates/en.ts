import type { Invoice } from "../source/types.ts"

function emptyObj (obj: Record<string, string>) {
  return Object.entries(obj)
    .every(([, val]) => val === "")
}

export default function (invoice: Invoice) {
  const unicodeMinus = "\u2212"

  // Recipient newline
  const recipientAddressTooLong =
    Object.values(invoice.to.address)
      .join().length > 50
  const rnl = recipientAddressTooLong ? "\\\\" : ""

  let discountValue = ""

  if (invoice.discount) {
    discountValue =
      invoice.discount.type === "fixed"
        ? `${invoice.discount.value} €`
        : invoice.discount.type === "proportionate"
          ? `${invoice.discount.value * 100} \\%`
          : `ERROR: ${invoice.discount.type} is no valid discount type`
  }

  /* eslint-disable indent */

  return `
---
title: |
  \`\`\`{=latex}
  \\vspace{-5ex} Invoice
  \`\`\`
---

-------------- --------------
   Invoice ID: **${invoice.id}**

 Issuing Date: **${invoice.issuingDate.toISOString()
.slice(0, 10)}**

Delivery Date: **${invoice.deliveryDate.toISOString()
.slice(0, 10)}**
-----------------------------

&nbsp;
&nbsp;

\\begin{multicols}{2}

  \\subsection{Invoice Recipient}

  ${invoice.to.name} \\\\
  ${invoice.to.organization ? `${invoice.to.organization}\\\\` : "\\"}
  ${invoice.to.address.country ? `${invoice.to.address.country},` : ""}
  ${
    invoice.to.address.city && invoice.to.address.zip
      ? `${invoice.to.address.city} ${invoice.to.address.zip}, ${rnl}`
      : ""
  }
  ${invoice.to.address.street} ${invoice.to.address.number} ${
    invoice.to.address.addition
      ? `/ ${invoice.to.address.addition.replace("#", "\\#")}`
      : "" // TODO: Escape all special LaTeX characters
  } ${emptyObj(invoice.to.address) ? "" : "\\\\"}
  ${invoice.to.vatin ? "Tax ID Number: " + invoice.to.vatin : ""}

\\columnbreak

  \\subsection{Biller}

  ${invoice.from.name}
  ${
    Array.isArray(invoice.from.emails)
      ? `([${invoice.from.emails[0]}](mailto:${invoice.from.emails[0]}))`
      : ""
  } \\\\
  ${invoice.from.job ? `${invoice.from.job}\\\\` : "\\"}
  ${invoice.from.address.country},
  ${invoice.from.address.city} ${invoice.from.address.zip},
  ${invoice.from.address.street} ${invoice.from.address.number}\
  ${invoice.from.address.flat ? "/" + invoice.from.address.flat : ""} \\\\
  ${invoice.from.vatin ? "Tax ID Number: " + invoice.from.vatin : ""}

\\end{multicols}


## Items

${invoice.taskTable}


\\begin{flushright}

${
  invoice.totalDuration
    ? `Total working time:\\qquad{\\textbf{${invoice.totalDuration} min}}`
    : ""
}

${
  invoice.discount || invoice.vat
    ? `Subtotal:\\qquad${invoice.subTotal.toFixed(2)} €\n\n`
    : ""
}

${
  invoice.discount
    ? `Discount of  ${discountValue}
    ${
      invoice.discount.reason ? `(${invoice.discount.reason}):\\qquad` : ""
    } ${unicodeMinus}${invoice.discount.amount.toFixed(2)}  €`
    : ""
}

${
  invoice.vat
    ? `VAT of ${invoice.vat * 100} \\%:\\qquad` + `${invoice.tax.toFixed(2)} €`
    : invoice.vatid && !invoice.vatid.startsWith("DE")
      ? "Reverse Charge"
      : ""
}

Total amount: \\textbf{\\qquad{${invoice.total.toFixed(2)}}}
${"\\textbf{€}" /* TODO: Also underline € sign */}

\\end{flushright}


&nbsp;

${
  invoice.from.smallBusiness
    ? "The amount is without tax as this is a small business."
    : ""
}


Please transfer the money onto following bank account due to
**${invoice.dueDate.toISOString()
.substr(0, 10)}**:


&nbsp;

--------- ---------------------
   Owner: **${invoice.from.name}**

    IBAN: **${invoice.from.iban}**
-------------------------------

&nbsp;


Thank you for the good cooperation!
`
}
