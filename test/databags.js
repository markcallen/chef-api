var expect = require("../node_modules/expect.js");
var jsonfile = require("../node_modules/jsonfile");

var chef = require('./setup').chef;

function run_cmd(cmd, args, cb ) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var res = "";
    var err = "";

    child.stdout.on('data', function (buffer) { res += buffer.toString() });
    child.stdout.on('err', function (buffer) { err += buffer.toString() });
    child.stdout.on('end', function() { cb (err, res) });
} // ()

var databag = {
  "name": "testdatabag"
}

describe('databags', function() {

  describe('getDataBag', function(){
    it('create data bag', function(done) {
      chef.createDataBag(databag, function(err, res) {
        if (err) {
          if (res.statusCode == 409) {
            err = null;
          }
        } else {
          expect(res.uri).to.eql("https://33.33.33.50/data/testdatabag");
        }
        done(err);
      });
    });

    it('get all data bags', function(done){
      chef.getDataBags(function(err, res){
        if(err)
          done(err);
  
        expect(res[databag.name]).to.eql("https://33.33.33.50/data/testdatabag");
        done();
      });
    });

    it('delete data bag', function(done) {
      chef.deleteDataBag(databag.name, function(err, res) {
        if (err)
          done(err);
  
        done();
      });
    });
  });

});

var databagitem = {
  "id": "testdatabagitem1",
  "one": "1",
  "two": "2"
}

var encrypteditem = {
  "id": "encrypteddatabagitem",
  "username": "me",
  "password": "secret"
}

var knifeitem = { 
  "id": "marioworld",
  "user": "luigi",
  "pass": "yahoo"
}

var secret = "Oh0mL2/3yk04F9VAVzo0E+XnLjfPEtaoZPAPFLmFcbZJELIt0bvhnt99e8vnDlno9n7Gk3RjNdJ43hXErnKkL0m+xacRdtu+4cJzevN3Qnl3uprDwo0Xhn1nP1zrDgyodXftygbQw7Jz3jTrYhwUvKwOxru3VTP2qHnEttiMYVytQBgPhK2KPIWUFzCInXjTpleTvNlRBiMfpu6VjydhTtmzZfG7d0ZgYURNtIy5DPxMokbHPX5//9ey//XmI80fbp9y16+AaRwHN0jtSP+JG6cKSpU9ZbYGqUltxdedFuvqW/TPJWeEje3reNLX3w83W9VIuwGXgkWXVeCcpYWZVEuoORNnxS1WwJNGCv6mAJUBVUlDzyR55i9SE9poCNJUdw7LbRfz1NTNGGG5zmi8TzYVlKZj7kCjgV9f/gd19souOIOSZGG+cdlPDqN+Rk+IQmWLqBlGzSip5cQPPZ6JLAhEDxjkIE9MLq+CMss+kxPmdVvKMnTXY94eOVwdnYrwwxCa2tsCOhLR8BAFFRhj6FElKyC+dKg9Hlt4U1blLOtsWY9bXhJ8xITsfpLUSoXz44sstNiE5A18W9Ybkp/D0nDOtwcWz+OODJTJmMud0RC6xQ9emp/i2o4RwtofG8rj0CSWd2iGwmOHEvRY3ehmauhsLZ5X7s9t7wccL7Egoyw=";

describe('databagitems', function() {
  before(function(done){
    chef.createDataBag(databag, function(err, res) {
      if (err) {
        done(err);
      }

      expect(res.uri).to.eql("https://33.33.33.50/data/testdatabag");

      var filename = '/tmp/' + knifeitem.id + '.json';

      jsonfile.writeFile(filename, knifeitem, function(err) {
        run_cmd("/usr/bin/knife", ["data", "bag", "from", "file", databag.name, filename, "-s", secret], function(err, res) {
          done(err);
        });
      });
    });
  });

  describe('DataBagItem', function(){
    it('show data bag items', function(done) {
      chef.getDataBag(databag.name, function(err, res) {
        expect(res[knifeitem.id]).to.eql('https://33.33.33.50/data/' + databag.name + '/' + knifeitem.id);
        done(err);
      });
    });

    it('create data bag item', function(done){
      chef.createDataBagItem(databag.name, databagitem, function(err, res){
        if(err) {
          console.log(err);
        }

        expect(res.id).to.eql(databagitem.id);
        done(err);
      });
    });

    it('get data bag item', function(done){
      chef.getDataBagItem(databag.name, databagitem.id, function(err, res){
        if(err) {
          console.log(err);
        }

        expect(res).to.eql(databagitem);
        done(err);
      });
    });

    it('decrypt existing bag item', function(done){
      chef.getEncDataBagItem(databag.name, knifeitem.id, secret, function(err, res){
        if(err) {
          console.log(err);
        }

        expect(res.user).to.eql('luigi');
        done(err);
      });
    });

    it('create encrypted data bag item', function(done){
      chef.createEncDataBagItem(databag.name, encrypteditem, secret, function(err, res){
        if(err) {
          console.log(err);
        }
 
        expect(res.id).to.eql(encrypteditem.id);
        done(err);
      });
    });


    it('decrypt created data bag item', function(done){
      chef.getEncDataBagItem(databag.name, encrypteditem.id, secret, function(err, res){
        if(err) {
          console.log(err);
        }

        expect(res).to.eql(encrypteditem);
        done(err);
      });
    });

    it('get encrypted data bag item using knife', function(done){
      run_cmd("/usr/bin/knife", ["data", "bag", "show", databag.name, encrypteditem.id, "-Fj", "-s", secret], function(err, res) {
        expect(JSON.parse(res)).to.eql(encrypteditem);
        done(err);
      });
    });

  });

  after(function(done) {
    chef.deleteDataBag(databag.name, function(err, res) {
      if (err)
        done(err);

      done();
    });
  });
});
