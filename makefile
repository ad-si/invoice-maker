.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


.PHONY: unit-tests
unit-tests:
	typst compile tests.typ


examples/%.check: examples/%.typ
	@typst compile --root="." $<
	@printf "Compare '%s.pdf' to expected output " "$(basename $<)"
	@magick "$(basename $<).pdf" \
		null: "fixtures/expected-$*.pdf" \
		-compose difference \
		-layers composite \
		"diff_$*_%d.png"
	@identify -format "%@" "diff_$*_0.png" \
	2>&1 | grep -q 'not contain' \
	&& echo "✅" || echo "❌: examples/$*.pdf changed -> diff_$*_0.png"


.PHONY: test
test: \
	unit-tests \
	examples/en.check \
	examples/de.check \
	examples/load-yaml.check


examples/en.pdf: examples/en.typ
	typst compile $<


images/example-invoice.png: examples/en.pdf
	convert \
		-density 300 \
		-resize 640 \
		$< \
		-flatten \
		\( +clone -background black -shadow 30x25+0+0 \) \
		+swap -background white -layers merge +repage \
		$@


images/example-invoice-hq.png: examples/en.pdf
	convert -density 250  -flatten $<  $@


clean:
	rm -f diff_*.png
	rm -f examples/*.pdf
