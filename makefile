.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


.PHONY: test
test:
	typst compile typst/example-en.typ
	typst compile typst/example-de.typ


typst/example-en.pdf: typst/example-en.typ
	typst compile $<


images/example-invoice.png: typst/example-en.pdf
	convert \
		-density 300 \
		-resize 640 \
		$< \
		-flatten \
		\( +clone -background black -shadow 30x25+0+0 \) \
		+swap -background white -layers merge +repage \
		$@


clean:
	rm -rf node_modules
