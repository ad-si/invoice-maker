# Invoice Maker

Generate beautiful invoices from YAML files.


## Installation

```
npm install --global invoice-maker
```


## Usage

```shell
invoice-maker \
	--biller biller.yaml \
	--recipient recipient.yaml \
	--data invoice.yaml \
	--output invoice.pdf
```

Checkout the [tests](./tests) directory for example files.


![Example invoice](./examples/invoice.png)
