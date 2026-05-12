#import "../invoice-maker.typ": *

// Example for a small-business owner without a VAT ID
// (e.g. German "Kleinunternehmerregelung" per §19 UStG).
// Neither biller nor recipient has a `vat-id`, and VAT is set to 0.

#show: invoice.with(
  language: "en",
  invoice-id: "2024-03-10t172205",
  issuing-date: "2024-03-10",
  delivery-date: "2024-02-29",
  due-date: "2024-03-20",
  hourly-rate: 1,
  vat: 0,
  biller: (
    name: "Jane Doe",
    iban: "GB29 NWBK 6016 1331 9268 19",
    address: (
      country: "United Kingdom",
      city: "London",
      street: "Abbey Road",
      postal-code: "NW8 0AE",
    ),
  ),
  recipient: (
    name: "John Smith",
    address: (
      country: "United Kingdom",
      city: "London",
      street: "Baker Street",
      postal-code: "W1U 6TJ",
    ),
  ),
  items: (
    (
      date: "2024-03-20",
      description: "Consulting",
      price: 1,
    ),
  ),
  styling: ( font: none ),
)
