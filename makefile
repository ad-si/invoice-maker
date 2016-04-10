invoices := $(wildcard data/*.yaml)
templateFiles := $(wildcard templates/*.js)

invoice_pattern := data/%.yaml

markdown_pattern := build/%.md
pdf_pattern := build/%.pdf
tex_pattern := build/%.tex
html_pattern := build/%.html


pdf_files: $(invoices:$(invoice_pattern)=$(pdf_pattern))
# markdown_files: $(invoices:$(invoice_pattern)=$(markdown_pattern))
# html_files: $(invoices:$(invoice_pattern)=$(html_pattern))
# tex_files: $(patsubst $(invoice_pattern),$(tex_pattern),$(invoices))

$(pdf_pattern): $(markdown_pattern)
	pandoc $< \
		--standalone \
		--latex-engine xelatex \
		--output $@

$(tex_pattern): $(markdown_pattern)
	pandoc $< --standalone --output $@

$(html_pattern): $(markdown_pattern)
	pandoc $< --standalone --output $@

$(markdown_pattern): $(invoice_pattern) compile.js $(templateFiles) | build
	node compile.js < $< > $@

build:
	-mkdir build

clean:
	-rm -rf build/*

.PHONY: pdf_files

.SECONDARY:
