#import "../invoice-maker.typ": *
#import "../fixtures/example-data.typ": *

#show: invoice.with(
  language: "en",
  banner-image: image("../fixtures/banner.png"),
  invoice-id: "2024-03-10t172205",
  // Set this to create a cancellation invoice
  // cancellation-id: "2024-03-24t210835",
  issuing-date: "2024-03-10",
  delivery-date: "2024-02-29",
  due-date: "2024-03-20",
  biller: biller,
  hourly-rate: 100,
  recipient: recipient,
  items: table-data,
)
