module.exports = (invoice) =>
`% Invoice
% ${invoice.id.substr(0, 10)}

ID
: ${invoice.id}


## From

${invoice.from.name}

${invoice.from.address.country}

${invoice.from.address.zip} ${invoice.from.address.city}

${invoice.from.address.street} ${invoice.from.address.number}


## For

${invoice.for.name}

${invoice.for.address.country}

${invoice.for.address.zip} ${invoice.for.address.city}

${invoice.for.address.street} ${invoice.for.address.number}


## Tasks

${invoice.taskTable}


According to § 19 UStG there is no sales tax liability.


Please transfer the money onto my bank account due to
${invoice.dueDate}.

IBAN
: ${invoice.from.iban}

BIC
: ${invoice.from.bic}


Best regards,

${invoice.from.name}
`
