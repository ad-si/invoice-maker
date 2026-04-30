.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


.PHONY: unit-tests
unit-tests:
	typst compile tests.typ


examples/%.check: examples/%.typ
	@typst compile --root="." $<
	@printf \
		"Compare '%s' to expected output '%s' " \
		"$(basename $<).pdf" \
		"fixtures/expected-$*.pdf"
	@pdftotext "$(basename $<).pdf" - \
		| awk '{$$1=$$1};NF' > "/tmp/actual-$*.txt"
	@pdftotext "fixtures/expected-$*.pdf" - \
		| awk '{$$1=$$1};NF' > "/tmp/expected-$*.txt"
	@diff -q "/tmp/actual-$*.txt" "/tmp/expected-$*.txt" > /dev/null \
	&& (echo "✅"; exit 0) \
	|| (echo "❌: examples/$*.pdf text differs from fixture"; \
		diff "/tmp/expected-$*.txt" "/tmp/actual-$*.txt"; exit 1)


examples/%.html.check: examples/%.typ fixtures/expected-%.html
	@typst compile \
		--features html \
		--format html \
		--input invoice-format=html \
		--root="." \
		$< "$(basename $<).html"
	@printf \
		"Compare '%s' to expected output '%s' " \
		"$(basename $<).html" \
		"fixtures/expected-$*.html"
	@diff -q "$(basename $<).html" "fixtures/expected-$*.html" > /dev/null \
	&& (echo "✅"; exit 0) \
	|| (echo "❌: examples/$*.html differs from fixture"; \
		diff "fixtures/expected-$*.html" "$(basename $<).html"; exit 1)


template/main.pdf: template/main-local.typ invoice-maker.typ
	typst compile --root='.' $< $@


.INTERMEDIATE: template/main-local.typ
template/main-local.typ: template/main.typ
	echo '#import "../invoice-maker.typ": *' > $@
	tail -n +2 $< >> $@


.PHONY: test
test: \
	unit-tests \
	examples/minimal-data.check \
	examples/en.check \
	examples/fr.check \
	examples/de.check \
	examples/with-body.check \
	examples/discount-fixed.typ \
	examples/discount-proportionate.typ \
	examples/load-yaml.check \
	examples/custom-language.check \
	examples/minimal-data.html.check \
	examples/en.html.check \
	template/main.pdf


examples/%.pdf: examples/%.typ
	typst compile --root="." $<


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
	rm -f examples/*.html
