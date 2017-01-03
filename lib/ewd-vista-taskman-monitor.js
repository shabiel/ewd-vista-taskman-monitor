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
  
  tasksNode.forEachChild(function(subscript, node) {
    if (subscript > 0) {
      let task = {};
      task.number = subscript;
      task.fields = node.getDocument();
      
      let taskStatus = task.fields['0.1'].piece(1,'^');
      if (taskStatus != '6') {
        send({task: task});
      }
    };
  });
  
  finished({});
};
