watch:
	tsc -w

generate-examples:
	node lib/jss_test.js gen

test:
	tape lib/*_test.js

.PHONY: test generate-examples watch