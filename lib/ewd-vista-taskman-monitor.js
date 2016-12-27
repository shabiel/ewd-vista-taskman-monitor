/* Two needed imports */
// const sessions = require('ewd-session');
// const runRPC   = require('ewd-vista/lib/runRPC');

/* Set-up module.export.handlers structure */
module.exports          = {};
module.exports.handlers = {};

// Get tasks
module.exports.handlers.tasks = function(messageObj, session, send, finished) {
    let dateTimeHorolog = this.db.function({function: 'GetVar^ewdVistAUtils', arguments: ['$H']}).result;
    let dateHorolog = dateTimeHorolog.piece(1,',');
    
    let tasksNode = new this.documentStore.DocumentNode('%ZTSK');
    let tasksData = tasksNode.getDocument();
    
    console.log('Bad tasks:');
    
    let tasks = [];
    let keys = Object.keys(tasksData).slice(1);
    keys.forEach(function(key, index, array) {
        if (key > 0) {
            let task = {};
            task.number = key;
            task.fields = tasksData[key];
        
            let taskDateHorolog = (task.fields['0.1'].piece(2,'^')).piece(1,',');
            if (taskDateHorolog >= dateHorolog) {
                tasks.push(task);
            }
        }
    });

    finished({tasks: tasks});
};
