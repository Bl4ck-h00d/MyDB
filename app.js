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
        settings: {index: 1},
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

db.prototype.create = function(obj){
    if(_.isPlainObject(obj))
        return this.createOne(obj);
    if(_.isArray(obj))
        return this.createMany(obj);
}

db.prototype.createOne = function(obj,write){
    if(!_.isBoolean(write))
         write = true;
    if(!_.isPlainObject(obj))
         return false;

    let newData = {};
    newData.id = this.object.settings.index++;

    let created = _.assign(obj,newData);
    this.pushData(created);

    if(write)
        this.reopen();
    return created;

}

db.prototype.createMany = function(obj, write) {

    if(!_.isBoolean(write))
        write = true;

    if(!_.isArray(obj))
        return false;
    
    let array = [];

    _.forEach(obj, function(obj){
        let created = this.createOne(obj);
        array.push(created);
    }.bind(this));

    if(write)
        this.reopen();
    return array;
}


db.prototype.deleteOne = function(identifier, write) {
    if(this.object.data===undefined)
        return false;
    if(!_.isBoolean(write))
        write = true;
    
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



db.prototype.deleteMany = function(identifier, write) {
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
