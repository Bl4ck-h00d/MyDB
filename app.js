const _ = require('lodash');
const mkdirp = require('mkdirp');
const path = require('path');
const file = require('./file');
const fileName = require('./script');
const dirname = path.dirname;

//db constructor
let db = function(dbname,options)
{
    //if options not set
    if(!_.isPlainObject(options))
    {
        options={};
        
    }

    //pretty -> Readable JSON format

    //Default value
    this.options = _.defaultsDeep(options,{
        pretty:true
    });
    
    // this._=_;
    this.dbName=fileName.jsonFileName(dbname);//naming of file

    this.start(); 

    this.open();
    

}

db.prototype.start = function(){
    //For storing in deep path (creates directory if specified)
    mkdirp.sync(dirname(this.dbName));
    let object={
        settings: {index: 1, model:{}},
        data: []
    };
    
    //Check if such file is open or not
    if(!file.exists(this.dbName))
    {
        //If not open then create and write
        this.set(object);
    }
}

//Setter
db.prototype.set = function(objects){

    //if pretty is set to true
    if(this.options.pretty)
        return file.write(this.dbName,JSON.stringify(objects,null,'\t'));
    //else
    return file.write(this.dbName,JSON.stringify(objects));
}

//Getter
db.prototype.get = function() {
    //String to JSON
    return JSON.parse(file.read(this.dbName));
}

db.prototype.show = function () {
    return JSON.parse(file.read(this.dbName));
}

db.prototype.open = function() {
    this.object=this.get();
}

db.prototype.close = function() {
    this.set(this.object);
}

db.prototype.reopen = function() {
    this.close();
    this.open();
}

db.prototype.pushData = function(obj) {
    if(this.object.data===undefined)
        return false;
    return this.object.data.push(obj);
}


db.prototype.CLImodel = function(keys) {
    if(!_.isArray(keys))
        return false;
    
    let newModel = {};

    if(this.object.settings.index){
        newModel.id = this.object.settings.index;
    }

    let object = {}

    for(let key in keys)
    {
        object[keys[key]] = "";
    }

    
    var created = _.assign(object,newModel);
    _.assign(this.object.settings.model,object)

    this.reopen();
}




db.prototype.model = function(obj) {
    if(_.isPlainObject(obj))
    {
        let newModel = {};

        if(this.object.settings.index){
            newModel.id = this.object.settings.index;
        }

        var created = _.assign(obj, newModel);
        _.assign(this.object.settings.model,obj)
        
    }

    this.reopen();


}


db.prototype.createByModel = function(array){
    
    if(!_.isArray(array))
         return false;

    let newData = {};
       
     _.assign(newData,this.object.settings.model);
     
    let index = 0;

    for(let key in newData)
    {
        
        newData[key]=array[index++];
        
    }
   
    newData.id = this.object.settings.index++;

    this.pushData(newData);
    
   
    this.reopen();
    return newData;
   
}


db.prototype.create = function(obj){
    if(_.isPlainObject(obj))
        return this.createOne(obj);
    if(_.isArray(obj))
        return this.createMany(obj);
}

db.prototype.createOne = function(obj){
    
    if(!_.isPlainObject(obj))
         return false;

    let newData = {};
    newData.id = this.object.settings.index++;

    let created = _.assign(obj,newData);
    this.pushData(created);

    
    this.reopen();
    return created;

}



db.prototype.createMany = function(obj) {

    

    if(!_.isArray(obj))
        return false;
    
    let array = [];

    _.forEach(obj, function(obj){
        let created = this.createOne(obj);
        array.push(created);
    }.bind(this));

   
    this.reopen();
    return array;
}


db.prototype.deleteOne = function(identifier,write) {
    if(this.object.data===undefined)
        return false;
    
        if(!_.isBoolean(write)) write = true;

        if(_.isNumber(identifier))
        {
            identifier = {id:identifier};
        }

        let deleted = _.findWhere(this.object.data,identifier);
        
        

        if(deleted)
        {

            _.remove(this.object.data, {id: deleted.id});
        }

       if(write)
        this.reopen();
        
        return deleted;
    
}



db.prototype.deleteMany = function(identifier,write) {
    if(this.object.data === undefined)
        return false;
    
    if(!_.isBoolean(write)) write = true;
  

    if(_.isArray(identifier)) {
        _.forEach(identifier,function(index){
            if(!_.isPlainObject(index))
            {
                index={id:index};
            }
            _.remove(this.object.data, index);
        }.bind(this));

    }
    else
    {
        _.remove(this.object.data, identifier);
    }
    
    if(write)
        this.reopen();
    
    return true;
        
}


db.prototype.delete = function(query) {

    if(_.isNumber(query))
        return this.deleteOne(query);
    
    return this.deleteMany(query);
}


db.prototype.updateOne = function(query,update,replace)
{
    if(this.object.data===undefined)
        return false;
    
        if(_.isNumber(query))
        {
            query={id:query};
        }

        let found = _.findWhere(this.object.data,query);

        if(found)
        {

            if(replace)
            {
                //index of found data
                let index=_.indexOf(this.object.data, found);
                this.object.data[index]=_.assign(update, {id: found.id});

            }
            else
            {
                _.assign(found,update);
            }
        }
        else
        {
            console.log("Not Found!");
            return false;
        }

        this.reopen();
        return found;

}


db.prototype.updateMany = function(query, update,replace)
{
    if(this.object.data === undefined)
         return false;
    
    if(_.isPlainObject(query)) {
        var found = _.where(this.object.data,query);
        if(found){
            _.forEach(found, function(obj){
                if(replace){
                    var index = _.indexOf(this.object.data, obj);
                    this.object.data[index] = _.assign(update, {id: obj.id});
                } else {
                    _.assign(obj, update);
                }
            }.bind(this));
        }
    }

    if(_.isArray(query)){
        _.forEach(query, function(obj){
            if(_.isNumber(obj)){
                return this.updateOne(obj,update,replace);
            }
            else
            {
                return this.updateMany(obj,update,replace)
            }
        }.bind(this));
    }

    if(_.isFunction(query)){
        var found = _.filter(this.object.data,query);
        return this.updateMany(found, update,replace);
    }

    this.reopen();
    return found || false;

}

db.prototype.update = function(query,update,replace) {
    if(_.isNumber(query))
        return this.updateOne(query,update,replace);
    
    return this.updateMany(query, update,replace);
}


db.prototype.findOne = function(query) {
    if(this.object.data === undefined)
        return false;
    
    if(query === undefined)
        query = {};
    
    if(_.isNumber(query))
    {
        query = {id:query};
    }

    return _.findWhere(this.object.data,query);
}

db.prototype.findMany = function(query) {

    if(this.object.data === undefined)
        return false;
    
    if(query === undefined)
        query = {};
    
    if(_.isNumber(query))
        query = {id:query};
    
    if(_.isArray(query))
    {
        var found = [];
        _.forEach(query, function(data){
            if(_.isNumber(data))
            {
                data = {id:data};
            }
            found.push(this.findOne(data));
        }.bind(this));

        return _.flattenDeep(found);
    }


    if(_.isFunction(query)) {
        return _.filter(this.object.data,query)
    }

    return _.where(this.object.data, query);
}

db.prototype.findHelper = function (query, func) {

    let find = this.findMany(query);
    return func(find);
}

db.prototype.find = function(query) {
    return this.findMany(query);
}

db.prototype.findAll = function(){
    return this.find({});
}

db.prototype.findFirst = function(query) {
    return this.findHelper(query,_.first);
}

db.prototype.findLast = function(query) {
    return this.findHelper(query,_.last);
}





let database = function(dbname, options){
    return new db(dbname, options);
}
database.collection = database;

database.pretty = function(dbname, options){
    if(!_.isPlainObject(options)) options = {};
    options = _.defaultsDeep(options, {pretty: true});
    return new db(dbname, options);
}



module.exports = database;
