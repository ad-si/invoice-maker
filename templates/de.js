module.exports = (invoice) =>

`---
title: Rechnung
geometry: margin=2cm
---

Rechnungsnummer:
: ${invoice.id}

Austellungsdatum:
: ${invoice.issuingDate.toISOString().substr(0, 10)}

Lieferdatum:
: ${invoice.deliveryDate.toISOString().substr(0, 10)}


## Rechnungssteller

${invoice.from.name}
([${invoice.from.emails[0]}](mailto:${invoice.from.emails[0]}))

${invoice.from.job}

${invoice.from.address.country},
${invoice.from.address.zip} ${invoice.from.address.city},
${invoice.from.address.street} ${invoice.from.address.number}\
${invoice.from.address.flat ? ('/' + invoice.from.address.flat) : ''}

Umsatzsteuer-Identifikationsnummer:
${invoice.from['umsatzsteuer-identifikationsnummer']}


## Rechnungsempfänger

${invoice.to.name}

${invoice.to.address.country},
${invoice.to.address.zip} ${invoice.to.address.city},
${invoice.to.address.street} ${invoice.to.address.number}

Umsatzsteuer-Identifikationsnummer:
${invoice.to['umsatzsteuer-identifikationsnummer']}


## Leistungen

${invoice.taskTable}

**Gesamtbetrag: ${invoice.total} €**

&nbsp;


Gemäß § 19 UStG ist in dem ausgewiesenen Betrag
keine Umsatzsteuer enthalten.

Bitte überweisen sie den Betrag bis
${invoice.dueDate.toISOString().substr(0, 10)} auf folgendes Konto:


&nbsp;

**${invoice.from.name}**

**IBAN: ${invoice.from.iban}**

&nbsp;


Mit freundlichen Grüßen,

${invoice.from.name}
`
