
test: 
	nodeunit typed-test.js

npm-install:
	npm install ndarray
	npm install numeric
	npm install typed-array-function
	npm install typed-array-ops
	npm install typed-array-rotate
	npm install typed-matrix-ops
	npm install typed-numeric-uncmin

npm-test:
	npm install ndarray-ops

publish-typed-array-function: npm/typed-array-function/typed-array-function.js

npm/$(PUBLISH_TARGET)/package.json :	npm/$(PUBLISH_TARGET)/README.md			\
					npm/$(PUBLISH_TARGET)/$(PUBLISH_TARGET).js
	cd npm/$(PUBLISH_TARGET); npm version patch; npm publish
	git commit -a -m "publish $(PUBLISH_TARGET)"
	git push hub master

npm/$(PUBLISH_TARGET)/$(PUBLISH_TARGET).js : $(PUBLISH_TARGET).js
	cp $(PUBLISH_TARGET).js npm/$(PUBLISH_TARGET)/$(PUBLISH_TARGET).js

publish-target: npm/$(PUBLISH_TARGET)/package.json
	
publish: 
	$(MAKE) PUBLISH_TARGET=typed-array-function 	publish-target
	$(MAKE) PUBLISH_TARGET=typed-array-ops 		publish-target
	$(MAKE) PUBLISH_TARGET=typed-array-rotate 	publish-target
	$(MAKE) PUBLISH_TARGET=typed-array-warp 	publish-target
	$(MAKE) PUBLISH_TARGET=typed-matrix-ops 	publish-target
	$(MAKE) PUBLISH_TARGET=typed-numeric-uncmin	publish-target
