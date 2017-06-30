module.exports = (invoice) => {
  const billerUstId = invoice.from['umsatzsteuer-identifikationsnummer']
  const recipientUstId = invoice.to['umsatzsteuer-identifikationsnummer']
  const unicodeMinus = '\u2212'

  // Biller newline
  const billerAddressTooLong = Object
    .values(invoice.from.address)
    .join()
    .length > 50
  const bnl = billerAddressTooLong ? '\\\\' : ''

  // Recipient newline
  const recipientAddressTooLong = Object
    .values(invoice.to.address)
    .join()
    .length > 50
  const rnl = recipientAddressTooLong ? '\\\\' : ''

  if (!billerUstId) {
    throw new Error(
      'The USt-IdNr of the biller is mandatory in german invoices'
    )
  }

  return `
---
title: \\vspace{-5ex} Rechnung
---

----------------- -----------------
 Rechnungsnummer: **${invoice.id}**

Austellungsdatum: **${invoice.issuingDate
                    .toISOString()
                    .substr(0, 10)}**

     Lieferdatum: **${invoice.deliveryDate
                    .toISOString()
                    .substr(0, 10)}**
-----------------------------------

&nbsp;
&nbsp;

\\begin{multicols}{2}

  \\subsection{Rechnungsempfänger}

  ${invoice.to.name} \\\\
  ${invoice.to.organization ? `${invoice.to.organization}\\\\` : '\\'}
  ${invoice.to.address.country},
  ${invoice.to.address.city} ${invoice.to.address.zip}, ${rnl}
  ${invoice.to.address.street} ${invoice.to.address.number}
  ${invoice.to.address.addition
    ? `/ ${invoice.to.address.addition.replace('#', '\\#')}`
    // TODO: Escape all special LaTeX characters
    : ''
  } \\\\
  ${recipientUstId ? `USt-IdNr.: ${recipientUstId}` : ''}

\\columnbreak

  \\subsection{Rechnungssteller}

  ${invoice.from.name}
  ${Array.isArray(invoice.from.emails)
    ? `(\\href{${invoice.from.emails[0]}}{${invoice.from.emails[0]}})`
    : ''
  } \\\\
  ${invoice.from.job ? `${invoice.from.job}\\\\` : '\\'}
  ${invoice.from.address.country},
  ${invoice.from.address.city} ${invoice.from.address.zip}, ${bnl}
  ${invoice.from.address.street} ${invoice.from.address.number}
  ${invoice.from.address.addition
    ? `/ ${invoice.from.address.addition.replace('#', '\\#')}`
    : ''
  } \\\\
  USt-IdNr.: ${billerUstId}

\\end{multicols}


## Leistungen

${invoice.taskTable}


\\begin{flushright}

${invoice.totalDuration
  ? `Gesamtarbeitszeit: \\textbf{${invoice.totalDuration} min}`
  : ''
}

${invoice.discount || invoice.vat
  ? `Zwischensumme: ${invoice.subTotal.toFixed(2)} €\n\n`
  : ''
}

${invoice.discount
  ? `Rabatt von ${invoice.discount.value * 100} \\%
    ${invoice.discount.reason
      ? `(${invoice.discount.reason})`
      : ''
    }: ${unicodeMinus}${invoice.discount.amount.toFixed(2)}  €`
  : ''
}

${invoice.vat
  ? `Umsatzsteuer von ${invoice.vat * 100} \\%: ` +
    `${invoice.tax.toFixed(2)} €`
  : recipientUstId && !recipientUstId.startsWith('DE')
    ? 'Steuerschuldnerschaft des Leistungsempfängers'
    : ''
}

\\setul{3mm}{0.25mm}
\\ul{\\textbf{Gesamtbetrag: ${invoice.total.toFixed(2)} \\euro}}

\\end{flushright}


&nbsp;

${invoice.from.smallBusiness
  ? 'Gemäß § 19 UStG ist in dem ausgewiesenen Betrag ' +
    'keine Umsatzsteuer enthalten.&nbsp;'
  : ''
}

Bitte überweisen sie den Betrag bis
**${invoice.dueDate
  .toISOString()
  .substr(0, 10)
}** auf folgendes Konto:


&nbsp;

--------- ---------------------
 Inhaber: **${invoice.from.name}**

    IBAN: **${invoice.from.iban}**
-------------------------------

&nbsp;


Vielen Dank für die gute Zusammenarbeit!
`
}
