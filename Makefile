REPORTER = dot

setup:
	vagrant ssh -c 'sudo cat /etc/chef-server/admin.pem' > ./test/admin.pem

test: setup
	@NODE_ENV=test ./node_modules/.bin/mocha \
	  --reporter $(REPORTER) \

.PHONY: test
