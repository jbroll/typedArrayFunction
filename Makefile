
test: 
	nodeunit typed-test.js

npm:
	npm install ndarray

npm-test:
	npm install ndarray-ops

publish-typed-array-function: npm/typed-array-function/typed-array-function.js

npm/$(PUBLISH_TARGET)/$(PUBLISH_TARGET).js : $(PUBLISH_TARGET).js
	cp $(PUBLISH_TARGET).js npm/$(PUBLISH_TARGET)/$(PUBLISH_TARGET).js
	cd npm/$(PUBLISH_TARGET); npm version patch; npm publish
	git commit -a -m "publish $(PUBLISH_TARGET)"; git push hub master

publish-target: npm/$(PUBLISH_TARGET)/$(PUBLISH_TARGET).js
	
publish: 
	$(MAKE) PUBLISH_TARGET=typed-array-function 	publish-target
	$(MAKE) PUBLISH_TARGET=typed-array-ops 		publish-target
	$(MAKE) PUBLISH_TARGET=typed-matrix-ops 	publish-target
	$(MAKE) PUBLISH_TARGET=numeric-uncmin		publish-target
