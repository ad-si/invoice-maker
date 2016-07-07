module.exports = (invoice) =>

`---
title: Invoice
geometry: margin=2cm
---

Invoice ID:
: ${invoice.id}

Issuing Date:
: ${invoice.issuingDate
  .toISOString()
  .substr(0, 10)
}

Delivery Date:
: ${invoice.deliveryDate
  .toISOString()
  .substr(0, 10)
}


## Biller

${invoice.from.name}
${Array.isArray(invoice.from.emails) ?
  `([${invoice.from.emails[0]}](mailto:${invoice.from.emails[0]}))` :
  ''
}

${invoice.from.job}

${invoice.from.address.country},
${invoice.from.address.zip} ${invoice.from.address.city},
${invoice.from.address.street} ${invoice.from.address.number}\
${invoice.from.address.flat ?
  '/' + invoice.from.address.flat :
  ''
}

${invoice.from.vatin ? 'Tax ID Number: ' + invoice.from.vatin : ''}


## Invoice Recipient

${invoice.to.name}

${invoice.to.organisation}

${invoice.to.address.country},
${invoice.to.address.zip} ${invoice.to.address.city},
${invoice.to.address.street} ${invoice.to.address.number}

${invoice.to.vatin ? 'Tax ID Number: ' + invoice.to.vatin : ''}


## Items

${invoice.taskTable}

${invoice.totalDuration ?
  `**Total working time: ${invoice.totalDuration} min**` : ''
}

**Total amount: ${invoice.total} $**


${invoice.from.smallBusiness ?
  'The amount is without tax as this is a small business.' :
  ''
}

&nbsp;

Please transfer the money onto following bank account due to
${invoice.dueDate
  .toISOString()
  .substr(0, 10)
}:


&nbsp;

**${invoice.from.name}**

**IBAN: ${invoice.from.iban}**

&nbsp;


Thank you for the good cooperation!
`
