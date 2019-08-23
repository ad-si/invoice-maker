tests/invoice.pdf: docker-build
	docker run --rm --volume "$$PWD":/workdir adius/invoice-maker \
		--biller tests/biller.yaml \
		--recipient tests/recipient.yaml \
		--data tests/invoice.yaml \
		--logo images/wordmark.png \
		--output tests/invoice.pdf


.PHONY: docker-build
docker-build:
	docker build \
		--tag adius/invoice-maker:$$(git describe --tags --dirty) \
		--tag adius/invoice-maker:latest \
		.
