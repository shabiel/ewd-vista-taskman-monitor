/* Load infrastructure */
let vista = require('ewd-vista');

/* Set-up module.export.handlers structure */
module.exports          = {};
module.exports.handlers = {};

/* Sets up Symbol Table management
 * Called when module is loaded by QEWD */
module.exports.init = function() {
  vista.init.call(this);
};

// Get ^%ZTSCH status nodes
module.exports.handlers.status = function(messageObj, session, send, finished) {
  let ztsch = new this.documentStore.DocumentNode('%ZTSCH').getDocument();

  finished({ztsch: ztsch});
};

// Get tasks from ^%ZTSK
module.exports.handlers.tasks = function(messageObj, session, send, finished) {
  let dateTimeHorolog = this.db.symbolTable.getVar('$H');
  let dateHorolog = dateTimeHorolog.piece(1,',');

  let tasksNode = new this.documentStore.DocumentNode('%ZTSK');

  tasksNode.forEachChild(function(subscript, node) {
    if (subscript > 0) {
      let task = {};
      task.number = subscript;
      task.fields = node.getDocument();

      let taskStatus = task.fields['0.1'] ? task.fields['0.1'].$p(1) : task.fields['.1'].$p(1);

      if (taskStatus != '6') {
        send({task: task});
      }
    }
  });

  finished({});
};
