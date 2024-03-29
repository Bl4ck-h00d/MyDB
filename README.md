# MyDB
MyDB is a slim alternative to heavyweight databases. An easy to use JSON database written with ease of
setup and memory management. Save your data in .json files and query it with create, delete, update and find.

It can be used as a package or as a CLI tool for fast testing of the project

Installation-
```
git clone https://github.com/Bl4ck-h00d/MyDB.git

npm i
```
For running as CLI 
```
node myDB --help
```

![image](https://user-images.githubusercontent.com/61791315/125151907-2f841b00-e167-11eb-8c53-cdaa7cbf6ad2.png)


![image](https://user-images.githubusercontent.com/61791315/125151944-6ce8a880-e167-11eb-9466-be621ab16ab0.png)


![image](https://user-images.githubusercontent.com/61791315/125151955-7f62e200-e167-11eb-9ac8-b19616d5a79c.png)


Using as library

#### Documentation:
```js
let db=require("./app.js");
let pokemon=db('data/deta',{pretty: true});
```
It will use a `pokemons.json` file to store data.  
If file does not exist, it will be created.  

You can create with deep path too, example:  
`db('my/list/of/pokemons')`   

Also, you can pass .json directly, if you want for something reason:  
`db('my/pokemons.json')`  

`{pretty: true}` means that file will be saved in readable json (with tabs)

Pretty shorthand:
```js
var pokemons = jsondb.pretty('pokemons');  
```

#### Create:
```js
pokemons.create({name: 'Rattata', types: ['normal']});

pokemons.create([
    {name: 'Pikachu', types: ['electric']},
    {name: 'Bulbasaur', types: ['grass', 'poison']}
]);

pokemons.create(function(){
    return {name: 'Exeggcute', types: ['grass', 'psychic']};
});
```
Don't care about IDs!  
MyDB uses auto incremention to generate ids, like mysql (1, 2, 3...);

#### Find:
```js
var grassPokemons = pokemons.find({types: ['grass']});
console.log(grassPokemons);
// [ {name: 'Bulbasaur', types: ['grass', 'poison'], id: 3},
//   {name: 'Exeggcute', types: ['grass', 'psychic'] id: 4} ]

var normalPokemons = pokemons.find({types: ['normal']})
console.log(normalPokemons);
// [ {name: 'Rattata', ...} ]

var normalPokemon = pokemons.findOne({types: ['normal']})
console.log(normalPokemon);
// {name: 'Rattata', ...}

var byId = pokemons.findOne(2);
console.log(byId);
// {name: 'Pikachu', ...}

var byIds = pokemons.find([1, 2]);
console.log(byIds);
// [ {name: 'Rattata', ...},
//   {name: 'Pikachu', ...} ]

var byFunc = pokemons.find(function(pokemon){
    return pokemon.id == 1 || pokemon.name == 'Pikachu'
});
console.log(byFunc);
// [ {name: 'Rattata', ...},
//   {name: 'Pikachu', ...} ]

var last = pokemons.findLast();
console.log(last.name);
// Exeggcute

var lastGrass = pokemons.findLast({types: ['poison']});
console.log(lastGrass.name);
// Exeggcute

var first = pokemons.findFirst();
console.log(first.name);
// Rattata

var firstGrass = pokemons.findFirst({types: ['grass']});
console.log(firstGrass.name);
// Bulbasaur

```

`.find()` always return an array of documents. Even if it's an id.  
`.findOne()` always return the document. If query match more than one, it will return the first only.   
`.findAll()` is shorthand for `collection.find({})`  
`.findLast(query)` is shorthand for `_.last(collection.find(query))`  
`.findFirst(query)` is shorthand for `_.first(collection.find(query))`  

You can find with Int (document id), Object (query) or a Function that return an id or query; Also, you can pass an Array with Objects (two or more queries), or array with Ids

#### Update:
```js
pokemons.update({name: 'Pikachu'}, {name: 'Pika Pika', foo: 'bar'});
// -> {id: 2, name: 'Pika Pika', types: ['electric'], foo: 'bar'}

pokemons.update({name: 'Rattata'}, {foo: 'bar'}, true);
// -> {id: 2, foo: 'bar'}

pokemons.update({types: ['grass']}, {foo: 'bar'});
// -> {id: 3, name: 'Bulbasaur', types: ['grass', 'poison'], foo: 'bar'}
// -> {id: 4, name: 'Exeggcute', types: ['grass', 'psychic'], foo: 'bar'}

pokemons.update(1, {foo: 'bar'});
// -> {id: 1, name: 'Rattata', types: ['normal'], foo: 'bar'}
```

You can also query with functions and arrays:
```js
pokemons.update(function(pokemon){
    return pokemon.name == 'Rattata' || pokemon.id == 2
}, {...});
// updates Rattata and Pikachu

pokemons.update([1, 2], {...});
// updates Rattata and Pikachu

pokemons.update([{name: 'Rattata'}, {name: 'Pikachu'}], {...});
// updates Rattata and Pikachu
```

#### Delete:
```js
pokemons.delete(1); // Rattata
pokemons.delete([1, 2]); // Rattata and Pikachu
pokemons.delete({types: ['grass']}); // Bulbasaur and Exeggcute
pokemons.delete([{name: 'Rattata'}, {types: ['grass']}]); // Bulbasaur, Exeggcute and Rattata
pokemons.delete(function(pokemon){
    return pokemon.id == 2
}); // Pikachu
```

#### Save:
```js
pokemons.save({id: 1, ...}); // update
pokemons.save({id: 1, ...}, true); // update identical
pokemons.save({...}); // create
```

`.save()` is a shorthand of create and update.  
Will update if has `id` property in query, or create if not.  
Accept second boolean argument for identical, in updates.  

#### Others:
```js
var people = jsondb('people');
people.create([
    {name: 'Foo'},
    {name: 'Renato'}
]);

// getLastInsertId
var lastid = people.getLastInsertId();
console.log(lastid); // 2
```

## File Data:
The file is an object with a settings and data properties:  
**Empty collection:**
```json
{
    "settings": {
        "ai": 1
    },
    "data": []
}
```

**With documents:**
```json
{
    "settings": {
        "ai": 4
    },
    "data": [
        {
            "id": 1,
            "name": "Rattata",
            "types": [
                "normal"
            ]
        },
        {
            "id": 2,
            "name": "Pikachu",
            "types": [
                "electric"
            ]
        },
        {
            "id": 3,
            "name": "Bulbasaur",
            "types": [
                "grass",
                "poison"
            ]
        },
        {
            "id": 4,
            "name": "Exeggcute",
            "types": [
                "grass",
                "psychic"
            ]
        }
    ]
}
```

