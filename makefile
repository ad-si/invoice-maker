.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


.PHONY: unit-tests
unit-tests:
	typst compile typst/tests.typ


typst/%.check: typst/%.typ
	@typst compile $<
	@printf "Compare '%s.pdf' to expected output " "$(basename $<)"
	@magick "$(basename $<).pdf" \
		null: "typst/fixtures/expected-$*.pdf" \
		-compose difference \
		-layers composite \
		"diff_$*_%d.png"
	@identify -format "%@" "diff_$*_0.png" \
	2>&1 | grep -q 'not contain' \
	&& echo "✅" || echo "❌: typst/$*.pdf changed -> diff_$*_0.png"


.PHONY: test
test: \
	unit-tests \
	typst/example-en.check \
	typst/example-de.check \
	typst/example-load-yaml.check


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


images/example-invoice-hq.png: typst/example-en.pdf
	convert -density 250  -flatten $<  $@


clean:
	rm -f diff_*.png
	rm -f typst/example-*.pdf
