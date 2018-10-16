# Invoice Maker

Generate beautiful invoices from YAML files.

[![Example invoice](./images/example-invoice.png)](./tests/invoice.pdf)


## Installation

```sh
npm install --global invoice-maker
```

or

```sh
yarn global add invoice-maker
```


## Usage

Run the plain command to get usage information:

```sh
$ invoice-maker
Usage: invoice-maker \
        [--biller <*.yaml>] \
        [--recipient <*.yaml>] \
        [--output <*.pdf>] \
        [--logo <*.png>] \
        [--debug] \
        --data <*.yaml>
```

E.g. to generate the example invoice you must run:

```sh
invoice-maker \
  --biller tests/biller.yaml \
  --recipient tests/recipient.yaml \
  --data tests/invoice.yaml \
  --logo images/wordmark.png \
  --output tests/invoice.pdf
```

Checkout the [tests](./tests) directory for more example files.


## Development

Run Tests:
```sh
yarn test
```

Create screenshot:
```sh
convert -density 200 \
  tests/invoice.pdf \
  -background white \
  -flatten \
  images/example-invoice.png
```
