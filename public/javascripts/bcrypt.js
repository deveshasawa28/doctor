var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("bye", salt); //$2a$10$FziOHhir72EKVhtSbPrcMexRUz.UTzmYjiyIYyupysGN1oE7LvdbG
console.log(salt);
console.log(hash);