.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


node_modules: package.json package-lock.json
	if test ! -d $@; \
	then bun install; \
	fi


.PHONY: test
test: | node_modules
	bun run ./tests/cli.ts


.PHONY: lint
lint:
	bun x eslint --max-warnings 0 ./**/*.ts


.PHONY: cli-test
cli-test:
	bun run tests/cli.ts


.PHONY: test
test: lint cli-test


tests/invoice-en-docker.pdf: tests/invoice-en.yaml docker-build
	docker run --rm --volume "$$PWD":/workdir adius/invoice-maker \
		--biller tests/biller.yaml \
		--recipient tests/recipient.yaml \
		--data $< \
		--logo images/wordmark.png \
		--output $@


.PHONY: docker-build
docker-build:
	docker build \
		--tag adius/invoice-maker:$$(git describe --tags --dirty) \
		--tag adius/invoice-maker:latest \
		.


clean:
	rm -rf node_modules
