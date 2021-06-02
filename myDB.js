const program = require('commander');
const {
    addData,
    createModel,
    find,
    remove,
    show
} = require('./index');

program
    .version('1.0.0')
    .description('CLI for MyDB')


program
    .command('create <props...>')
    .description('Creates a data schema \n Syntax - create <prop1> <prop2> ...')
    .action((props) => {
        createModel(props);
    })

program
    .command('add <values...>')
    .description('Adds new data \n Syntax - add <value1> <value2> ...')
    .action((values) => {
        addData(values);
    })

program
    .command('find id')
    .description('Returns data with the given id if it exists')
    .action((id)=>{
        find(id);
    })



program
    .command('remove <id...>')
    .description('Deletes data fields and returns deleted data')
    .action((id)=>{
        remove(id);
    })

program
    .command('show')
    .description('Shows all of the data')
    .action(()=>{
        show();
        
    })

program.parse(process.argv);