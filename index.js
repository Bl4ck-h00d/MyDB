const jsondb = require('./app.js');
const db = jsondb('./data/db',{pretty: true});





const createModel = (keys) => {

    db.CLImodel(keys)
    console.info("New Model Created!");
    
    
}

const addData = (values) => {
    db.createByModel(values)
    console.info("New Data Added!");
    
    
    
}

const find = (id) => {
        let data=db.find(id);
        console.info(data);
       
    
}

const remove = (id) => {
    let indices = Array(id);
    for(let index in id)
    {
        
        db.delete(Number(id[index]));
    }
    
    console.info("Deleted!");
    
}

const show = () => {
    let data=db.findAll();
    console.log(data);
}


module.exports = {
    addData,
    createModel,
    find,
    remove,
    show

}