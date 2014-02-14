var expect = require("../node_modules/expect.js");

var chef = require('./setup').chef;

var node = {
  "name": "test-node-1",
  "run_list": [
  ],
  "normal": {
    "tags": [
    ]
  }
};
    
describe('nodes', function() {
  before(function(done){
    chef.createNode(node, function(err, res) {
      if (err) 
        throw err;

      expect(res.uri).to.eql("https://33.33.33.50/nodes/test-node-1");
      done();
    });
  });

  describe('getNodes', function(){
    it('get all nodes', function(done){
      chef.getNodes(function(err, res){
        if(err)
          done(err);
  
        expect(res['test-node-1']).to.eql("https://33.33.33.50/nodes/test-node-1");
        done();
      });
    });
  });

  after(function(done) {
    chef.deleteNode("test-node-1", function(err, res) {
      if (err)
        done(err);

      done();
    });
  });
});
