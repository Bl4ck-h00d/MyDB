const jsondb = require('./app.js');
const db = jsondb('./data/db',{pretty: true});

db.create({name: 'Rohan', Age: 20});

let ans=db.get();
console.log(ans);