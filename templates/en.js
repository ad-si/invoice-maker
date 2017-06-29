module.exports = (invoice) => {
  const unicodeMinus = '\u2212'

  return `
---
title: \\vspace{-5ex} Invoice
---

-------------- --------------
   Invoice ID: **${invoice.id}**

 Issuing Date: **${invoice.issuingDate
                  .toISOString()
                  .substr(0, 10)}**

Delivery Date: **${invoice.deliveryDate
                  .toISOString()
                  .substr(0, 10)}**
-----------------------------

&nbsp;
&nbsp;

\\begin{multicols}{2}

  \\subsection{Invoice Recipient}

  ${invoice.to.name} \\\\
  ${invoice.to.organization ? `${invoice.to.organization}\\\\` : '\\'}
  ${invoice.to.address.country},
  ${invoice.to.address.city} ${invoice.to.address.zip},
  ${invoice.to.address.street} ${invoice.to.address.number} \\\\
  ${invoice.to.vatin ? 'Tax ID Number: ' + invoice.to.vatin : ''}

\\columnbreak

  \\subsection{Biller}

  ${invoice.from.name}
  ${Array.isArray(invoice.from.emails)
    ? `([${invoice.from.emails[0]}](mailto:${invoice.from.emails[0]}))`
    : ''
  } \\\\
  ${invoice.from.job ? `${invoice.from.job}\\\\` : '\\'}
  ${invoice.from.address.country},
  ${invoice.from.address.city} ${invoice.from.address.zip},
  ${invoice.from.address.street} ${invoice.from.address.number}\
  ${invoice.from.address.flat
    ? '/' + invoice.from.address.flat
    : ''
  } \\\\
  ${invoice.from.vatin ? 'Tax ID Number: ' + invoice.from.vatin : ''}

\\end{multicols}


## Items

${invoice.taskTable}


\\begin{flushright}

${invoice.totalDuration
  ? `Total working time: ${invoice.totalDuration} min`
  : ''
}

${invoice.discount || invoice.vat
  ? `Subtotal: ${invoice.subTotal.toFixed(2)} €\n\n`
  : ''
}

${invoice.discount
  ? `Discount of ${invoice.discount.value * 100} \%
    ${invoice.discount.reason
      ? `(${invoice.discount.reason}):`
      : ''
    } ${unicodeMinus}${invoice.discount.amount.toFixed(2)}  €`
  : ''
}

${invoice.vat
  ? `VAT of ${invoice.vat * 100} \\%: ` +
    `${invoice.tax.toFixed(2)} €`
  : ''
}

\\setul{3mm}{0.25mm}
\\ul{\\textbf{Total amount: ${invoice.total.toFixed(2)} \\euro}}

\\end{flushright}


&nbsp;

${invoice.from.smallBusiness
  ? 'The amount is without tax as this is a small business.'
  : ''
}


Please transfer the money onto following bank account due to
**${invoice.dueDate
  .toISOString()
  .substr(0, 10)
}**:


&nbsp;

--------- ---------------------
   Owner: **${invoice.from.name}**

    IBAN: **${invoice.from.iban}**
-------------------------------

&nbsp;


Thank you for the good cooperation!
`
}
