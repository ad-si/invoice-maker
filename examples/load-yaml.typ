#import "../invoice-maker.typ": *
#import "../fixtures/example-data.typ": *

#show: invoice.with(
  banner-image: image("../fixtures/banner.png"),
  data: yaml("../fixtures/example-data.yaml"),
  styling: ( font: none ), // Explicitly use Typst's default font
)
