#import "../invoice-maker.typ": *
#import "../fixtures/example-data.typ": *

#biller.insert("vat-id", "DE123456789")
#recipient.insert("vat-id","DE987654321")

#show: invoice.with(
  language: "de",
  banner-image: image("../fixtures/banner.png"),
  invoice-id: "2024-03-10t172205",
  // Set this to create a cancellation invoice
  // cancellation-id: "2024-03-24t210835",
  issuing-date: "2024-03-10",
  delivery-date: "2024-02-29",
  due-date: "2024-03-20",
  hourly-rate: 100,
  biller: biller,
  recipient: recipient,
  items: table-data,
)
