var options = {
    user_name: "admin",
    key_path: "./test/admin.pem",
    url: "https://33.33.33.50",
    ca: null
};

var ChefApi = require("../main");
var chef = new ChefApi();
chef.config(options);

module.exports = {
  chef: chef
}
