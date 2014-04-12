
test: 
	nodeunit typed-test.js

npm:
	npm install ndarray

npm-test:
	npm install ndarray-ops

publish:
	cp typed-array-function.js npm/typed-array-function/typed-array-function.js; cd npm/typed-array-function; npm version patch; npm publish
	cp typed-array-ops.js           npm/typed-array-ops/typed-array-ops.js;      cd npm/typed-array-ops;      npm version patch; npm publish
