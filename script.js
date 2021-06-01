module.exports = {
    endWith: function (str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    },
    jsonFileName: function(fileName){
        return this.endWith(fileName, '.json') ? fileName : fileName + '.json';
    },
   
};