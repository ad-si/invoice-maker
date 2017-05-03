module.exports = (invoice) => {
  const billerUstId = invoice.from['umsatzsteuer-identifikationsnummer']
  const recipientUstId = invoice.to['umsatzsteuer-identifikationsnummer']

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
 Rechnungsnummer: ${invoice.id}

Austellungsdatum: ${invoice.issuingDate
                    .toISOString()
                    .substr(0, 10)}

     Lieferdatum: ${invoice.deliveryDate
                    .toISOString()
                    .substr(0, 10)}
-----------------------------------

&nbsp;
&nbsp;

\\begin{multicols}{2}

  \\subsection{Rechnungsempfänger}

  ${invoice.to.name} \\\\
  ${invoice.to.organization} \\\\
  ${invoice.to.address.country},
  ${invoice.to.address.city} ${invoice.to.address.zip},
  ${invoice.to.address.street} ${invoice.to.address.number} \\\\
  ${recipientUstId ? 'USt-IdNr.: ' + recipientUstId : ''}

\\columnbreak

  \\subsection{Rechnungssteller}

  ${invoice.from.name}
  ${Array.isArray(invoice.from.emails)
    ? `(\\href{${invoice.from.emails[0]}}{${invoice.from.emails[0]}})`
    : ''
  } \\\\
  ${invoice.from.job} \\\\
  ${invoice.from.address.country},
  ${invoice.from.address.city} ${invoice.from.address.zip},
  ${invoice.from.address.street} ${invoice.from.address.number}\
  ${invoice.from.address.flat
    ? `/ ${invoice.from.address.flat}`
    : ''
  } \\\\
  USt-IdNr.: ${billerUstId}

\\end{multicols}


## Leistungen

${invoice.taskTable}

${invoice.totalDuration
  ? `Gesamtarbeitszeit: ${invoice.totalDuration} min`
  : ''
}

${invoice.discount
  ? `Zwischensumme: ${invoice.subTotal} €\n\n` +
    `Rabatt von ${invoice.discount.value * 100} %
      ${invoice.discount.reason
        ? `(${invoice.discount.reason}):`
        : ''
      } \u2212${invoice.discount.amount}` // Unicode minus
  : ''
}

\\setlength{\\fboxsep}{2mm}
\\fbox{Gesamtbetrag: \\textbf{${invoice.total} €}}

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
