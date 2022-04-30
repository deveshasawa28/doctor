var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("hello", salt);
console.log('jklfjdlasjkjds',salt);
console.log(hash);