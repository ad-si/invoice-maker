#import "../invoice-maker.typ": *

#show: invoice.with(
  hourly-rate: 1,
  issuing-date: "2024-03-24", // Must be set to not break tests
  biller: (
    name: "ACME Corporation",
    vat-id: "GB123456789",
    iban: "GB29 NWBK 6016 1331 9268 19",
    address: (
      country: "United Kingdom",
      city: "London",
      street: "Abbey Road",
      postal-code: "NW8 0AE",
    ),
  ),
  recipient: (
    name: "John Doe",
    vat-id: "GB987654321",
    address: (
      country: "United Kingdom",
      city: "London",
      street: "Baker Street",
      postal-code: "W1U 6TJ",
    )
  ),
  items: (
    (
      date: "2024-03-20",
      description: "Minimal amount of work",
      price: 1,
    ),
  ),
  styling: ( font: none ), // Explicitly use Typst's default font
)
