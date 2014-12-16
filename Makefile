LIBDIR ?= /usr/lib
BASE=$(DESTDIR)$(LIBDIR)/node_modules/
OMCACHE_BIN:=./build/Release/omcache.node

PACKAGE_NAME := node-omcache
VERSION := 0.0.1

NODEJS_PACKAGE ?= nodejs

NODEJS_VERSION ?= $(shell node --version)
NODEGYP_TARGET := --target=$(NODEJS_VERSION)

export DEB_DH_GENCONTROL_ARGS_ALL = -- -Vmisc:Depends=$(NODEJS_PACKAGE)
export DEB_DH_INSTALL_ARGS := $(BASE)/omcache.node

omcache: $(OMCACHE_BIN)

$(OMCACHE_BIN): build/binding.Makefile
	node-gyp build --verbose

build/binding.Makefile:
	node-gyp $(NODEGYP_TARGET) --ensure --verbose install
	node-gyp $(NODEGYP_TARGET) configure

test: $(OMCACHE_BIN)
	mkdir -p tests/node_modules
	cp $< tests/node_modules
	cd tests && $(MAKE)

install: $(OMCACHE_BIN)
	mkdir -p $(BASE)
	cp package.json $(BASE)
	cp $< $(BASE)

deb:
	dpkg-buildpackage -b -uc -us
	mv ../$(PACKAGE_NAME)_$(VERSION)* .

clean:
	node-gyp clean
	rm -rf node-omcache*.changes node-omcache*.deb

deb-clean:

.PHONY: all omcache deb install clean deb-clean
