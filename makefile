.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


.PHONY: test
test:
	typst compile typst/example-en.typ
	typst compile typst/example-de.typ


clean:
	rm -rf node_modules
