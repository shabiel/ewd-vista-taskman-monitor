let clientMethods = {};

clientMethods.showTasks = function(EWD) {
    let messageObj = {
        service: 'ewd-vista-taskman-monitor',
        type: 'tasks'
    }
    EWD.send(messageObj, function(responseObj) {
        let tasks = responseObj.message.tasks;

        console.log(tasks);
    });
}

module.exports = clientMethods;
