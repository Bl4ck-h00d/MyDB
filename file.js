let fs = require("fs");
let path = require("path");

let file = {
    write: function(path, contents) {
        return fs.writeFileSync(path, contents);
    },
    read: function(path) {
        return fs.readFileSync(path, 'utf8');
    },
    exists: function(path){
        try {
            fs.accessSync(path);
            return true;
        } catch(ex) {
            return false;
        }
    },
    stat: function(path) {
        return fs.statSync(path);
    }
}

module.exports = file;