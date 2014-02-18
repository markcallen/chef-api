REPORTER = dot

setup:
	vagrant ssh -c 'sudo cat /etc/chef-server/admin.pem' > ./test/admin.pem

setup-knife:
	vagrant ssh -c 'sudo cat /etc/chef-server/admin.pem' > ./.chef/admin.pem
	vagrant ssh -c 'sudo cat /etc/chef-server/chef-validator.pem ' > ./.chef/chef-validator.pem 

test: setup
	@NODE_ENV=test ./node_modules/.bin/mocha \
	  --reporter $(REPORTER) \

t: 
	@NODE_ENV=test ./node_modules/.bin/mocha \
	  --reporter $(REPORTER) \

.PHONY: test
