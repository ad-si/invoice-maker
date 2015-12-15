invoices := $(wildcard data/*.yaml)

invoice_pattern := data/%.yaml
markdown_pattern := build/%.md
pdf_pattern := build/%.pdf

pdf_files: $(patsubst $(invoice_pattern),$(pdf_pattern),$(invoices))

$(markdown_pattern): $(invoice_pattern)
	node compile.js < $< > $@

$(pdf_pattern): $(markdown_pattern)
	pandoc $< -o $@

clean:
	rm -rf build/*

.PHONY: pdf_files
