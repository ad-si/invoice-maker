module.exports = (invoice) =>

`---
title: Invoice
geometry: margin=2cm
---

Invoice ID:
: ${invoice.id}

Issuing Date:
: ${invoice.issuingDate.toISOString().substr(0, 10)}

Delivery Date:
: ${invoice.deliveryDate.toISOString().substr(0, 10)}


## Biller

${invoice.from.name}
([${invoice.from.emails[0]}](mailto:${invoice.from.emails[0]}))

${invoice.from.job}

${invoice.from.address.country},
${invoice.from.address.zip} ${invoice.from.address.city},
${invoice.from.address.street} ${invoice.from.address.number}\
${invoice.from.address.flat ? ('/' + invoice.from.address.flat) : ''}

Tax ID number:
: ${invoice.from['umsatzsteuer-identifikationsnummer']}


## Invoice Recipient

${invoice.to.name}

${invoice.to.address.country},
${invoice.to.address.zip} ${invoice.to.address.city},
${invoice.to.address.street} ${invoice.to.address.number}

Tax ID number:
${invoice.to['umsatzsteuer-identifikationsnummer']}


## Services

${invoice.taskTable}

Total amount: ${invoice.total} €


According to § 19 UStG there is no sales tax liability.


Please transfer the money onto following bank account due to
${invoice.dueDate.toISOString().substr(0, 10)}:


&nbsp;

**${invoice.from.name}**

**IBAN: ${invoice.from.iban}**

&nbsp;


Best regards,

${invoice.from.name}
`
