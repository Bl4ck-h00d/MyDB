const jsondb = require('./app.js');
const db = jsondb('./data/db',{pretty: true});

db.create([
    {name: 'Pikachu', types: ['electric']},
    {name: 'Bulbasaur', types: ['grass', 'poison']}
]);

// let ans=db.get();
// console.log(ans);

db.update(5, {foo: 'bar'});