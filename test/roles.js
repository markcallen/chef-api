var expect = require("../node_modules/expect.js");

var chef = require('./setup').chef;

var role = {
  "name": "test-role-1",
  "description": "Role One for Testing",
  "run_list": [
  ],
  "override_attributes": {
    "mysql": {
      "bind_address": "localhost"
    }
  },
  "env_run_lists": {
  },
  "default_attributes": {
  }
};

describe('roles', function() {
  before(function(done){
    chef.createRole(role, function(err, res) {
      if (err) 
        throw err;

      expect(res.uri).to.eql("https://33.33.33.50/roles/test-role-1");
      done();
    });
  });

  describe('getRoles', function(){
    it('get all roles', function(done){
      chef.getRoles(function(err, res){
        if(err)
          done(err);
  
        expect(res['test-role-1']).to.eql("https://33.33.33.50/roles/test-role-1");
        done();
      });
    });
    it('edit role', function(done) {
      role.description = "Changed the description";
      chef.editRole(role.name, role, function(err, res) {
        if (err)
          done(err);
        
        expect(res.description).to.eql(role.description);
        done();
      });
    });
  });

  after(function(done) {
    chef.deleteRole("test-role-1", function(err, res) {
      if (err)
        done(err);

      done();
    });
  });
});
