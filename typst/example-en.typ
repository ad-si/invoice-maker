#import "invoice-maker.typ": *
#import "fixtures/example-data.typ": *

#show: invoice.with(
  language: "en",
  banner_image: image("fixtures/banner.png"),
  invoice_id: "2024-03-10t172205",
  // Set this to create a cancellation invoice
  // cancellation_id: "2024-03-24t210835",
  issuing_date: "2024-03-10",
  delivery_date: "2024-02-29",
  due_date: "2024-03-20",
  biller: biller,
  hourly_rate: 100,
  recipient: recipient,
  items: table_data,
)
