var crypto = require('crypto');
var base64 = require('base64');

exports.cryptutils = function() {
  return {

    algorithm: "aes-256-cbc",

    digestKey: function(key) {
      return crypto.createHash('sha256').update(key).digest();
    },

    decrypt: function(data, key) {
      var digestkey = this.digestKey(key);

      var decryptedResponse = { id: data.id };

      for(var key in data) {
        var name = key;
        var value = data[key];
        if (key != "id") {
          if (value.version == 1) {
            var decipher = crypto.createDecipheriv(value.cipher, digestkey, base64.decode(value.iv));
            var plaintext = decipher.update(base64.decode(value.encrypted_data)) + decipher.final();
            decryptedResponse[key] = JSON.parse(plaintext).json_wrapper;
          } else {
            decryptedResponse[key] = value;
          }
        }
      }

      return decryptedResponse;
    },

    encrypt: function(plaindata, key) {
      var digestkey = this.digestKey(key);

      var encryptedData = { id: plaindata.id };

      for(var key in plaindata) {
        var name = key;
        var value = plaindata[key];
        if (key != "id") {
          var iv = crypto.randomBytes(16);
          var cipher = crypto.createCipheriv(this.algorithm, digestkey, iv);
          var encrypted = cipher.update(JSON.stringify({json_wrapper: value}), 'utf8', 'base64') + cipher.final('base64');
          encryptedData[key] = {encrypted_data: encrypted + "\n",
                                cipher: this.algorithm,
                                version: 1,
                                iv: base64.encode(iv) + '\n'  
                               };
        }
      }

      return encryptedData;
    }
  }
}

