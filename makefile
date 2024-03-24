.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


.PHONY: unit-tests
unit-tests:
	typst compile tests.typ


examples/%.check: examples/%.typ
	@typst compile --root="." $<
	@printf \
		"Compare '%s.pdf' to expected output '%s' " \
		"$(basename $<)" \
		"fixtures/expected-$*.pdf"
	@magick "$(basename $<).pdf" \
		null: "fixtures/expected-$*.pdf" \
		-compose difference \
		-layers composite \
		"diff_$*_%d.png"
	@identify -format "%@" "diff_$*_0.png" \
	2>&1 | grep -q 'not contain' \
	&& echo "✅" || echo "❌: examples/$*.pdf changed -> diff_$*_0.png"


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
	examples/de.check \
	examples/with-body.check \
	examples/discount-fixed.typ \
	examples/discount-proportionate.typ \
	examples/load-yaml.check \
	template/main.pdf


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
