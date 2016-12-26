/* Two needed imports */
// const sessions = require('ewd-session');
// const runRPC   = require('ewd-vista/lib/runRPC');

/* Set-up module.export.handlers structure */
module.exports          = {};
module.exports.handlers = {};

// Get tasks
module.exports.handlers.tasks = function(messageObj, session, send, finished) {
	var tasksNode = new this.documentStore.DocumentNode('%ZTSK');
//	var tasks = tasksNode.forEach(function(task, index, array) {
//		
//	});
	
	console.log("");
	console.log("");
	console.log(tasksNode);
	console.log("");
	console.log("");
	
	finished({ok: true});
};