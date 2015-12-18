invoices := $(wildcard data/*.yaml)

invoice_pattern := data/%.yaml
markdown_pattern := build/%.md
pdf_pattern := build/%.pdf
tex_pattern := build/%.tex

pdf_files: $(patsubst $(invoice_pattern),$(pdf_pattern),$(invoices))
#tex_files: $(patsubst $(invoice_pattern),$(tex_pattern),$(invoices))

$(pdf_pattern): $(markdown_pattern)
	pandoc $< --standalone --latex-engine xelatex --output $@

$(tex_pattern): $(markdown_pattern)
	pandoc $< --standalone --output $@

$(markdown_pattern): $(invoice_pattern) | build
	node compile.js < $< > $@

build:
	-mkdir build

clean:
	-rm -rf build/*

.PHONY: pdf_files

.SECONDARY: build/2015-12-09_stegherr.md
