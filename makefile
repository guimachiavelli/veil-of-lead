BIN=node_modules/.bin
DEPLOY_TARGET = `cat target.txt`
BUILD_DIR=./public

SRC_DIR=src
ASSETS_DIR=public/assets

SASS_DIR=$(SRC_DIR)/scss
CSS_DIR=$(ASSETS_DIR)/css
SASS_DEPS=$(wildcard $(SASS_DIR)/styles.scss $(SASS_DIR)/*.scss)

FONTS=$(wildcard $(SRC_DIR)/fonts/*.woff $(SRC_DIR)/fonts/*.woff2)

DATA_DIR=./data
DATA=$(wildcard $(DATA_DIR)/*.json)

TEMPLATES=$(wildcard $(SRC_DIR)/js/templates/*.html)

server:
	ruby -run -e httpd ./public -v -p 8000

setup: ./package.json
	@npm install

deploy:
	rsync --verbose --progress -r $(BUILD_DIR) $(DEPLOY_TARGET)

build: $(BUILD_DIR)/index.html assets

$(BUILD_DIR)/index.html: $(DATA) $(TEMPLATES)
	@cd ./src/js && node ./build-site.js

assets: $(CSS_DIR)/styles.css fonts

fonts: $(FONTS)
	@cp -R ./src/fonts ./public/assets

develop: $(SRC_DIR)
	@$(BIN)/chokidar $(SASS_DIR) $(DATA_DIR) -c '${MAKE} build' $<

$(CSS_DIR)/styles.css: $(SASS_DEPS)
	@$(BIN)/node-sass $< -o $(CSS_DIR)
	@$(BIN)/postcss --use autoprefixer --autoprefixer.browsers ">1%" $@ -o $@
