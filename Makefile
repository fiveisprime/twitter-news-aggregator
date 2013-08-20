SRC = server.js

test: $(SRC)
	@./node_modules/.bin/jshint $^
