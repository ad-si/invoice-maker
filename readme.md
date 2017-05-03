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

```sh
invoice-maker \
  --biller tests/biller.yaml \
  --recipient tests/recipient.yaml \
  --data tests/invoice.yaml \
  --logo images/wordmark.png \
  --output invoice.pdf
```

Checkout the [tests](./tests) directory for example files.
