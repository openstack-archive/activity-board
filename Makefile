# See the README for installation instructions.

JS_UGLIFY = uglifyjs
JSHINT = jshint
# CSSHINT = csslint

all: \
	vizgrimoire.js \
	jshint \
	vizgrimoire.min.js \
	vizgrimoire.css
	
.INTERMEDIATE vizgrimoire.js: \
	vizgrimoire.deps.js \
	vizgrimoire.core.js

.INTERMEDIATE vizgrimoire.css: \
	vizgrimoire.deps.css \
	vizgrimoire.core.css

vizgrimoire.deps.js: \
    src/License.js \
    src/envision.js \
    src/d3-treemap.min.js \
    src/jquery.gridster.js

vizgrimoire.core.js: \
    src/Envision_Report.js \
    src/Loader.js \
    src/DataProcess.js \
    src/Report.js \
    src/DataSource.js \
    src/Viz.js \
    src/ITS.js \
    src/MLS.js \
    src/SCM.js \
    src/SCR.js \
    src/Identity.js
    
vizgrimoire.deps.css: \
    src/envision.min.css \
    src/jquery.gridster.css
        
vizgrimoire.core.css: \
    src/report.css \
    src/report-envision.css

%.min.js: %.js Makefile
	@rm -f $@
	# $(JS_UGLIFY) -o $@ -c -m $<
	$(JS_UGLIFY) -o $@ $<  

vizgrimoire%js: Makefile
	echo $@
	@rm -f $@
	@cat $(filter %.js,$^) > $@
	# @cat $(filter %.js,$^) > $@.tmp
	# $(JS_UGLIFY) -o $@  $@.tmp
	# @rm $@.tmp
	@chmod a-w $@

jshint: vizgrimoire.core.js
	@echo "JSHINT Checking ..."
	@$(JSHINT) $(filter %.js,$^)
	
test: all
	cd test/jasmine; jasmine-headless-webkit -j jasmine.yml -c
	cd ../..

testci: all
	cd test/jasmine; xvfb-run jasmine-headless-webkit -j jasmine.yml -c
	cd ../..

vizgrimoire%css: Makefile
	@rm -f $@
	@cat $(filter %.css,$^) > $@
	
clean:
	rm -f vizgrimoire*.js vizgrimoire*.css
