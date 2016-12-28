let clientMethods = {};

// Set up menu
clientMethods.prep = function(EWD) {
    $('#app-taskman-monitor').on('click', function(e) {
        clientMethods.showTasks(EWD);
        return false;
    });
}

clientMethods.showTasks = function(EWD) {
    // Clear the page
    $('#main-content').html('');
    
    let messageObj = {
        service: 'ewd-vista-taskman-monitor',
        type: 'tasks'
    }
    EWD.send(messageObj, function(responseObj) {
        let tasks = responseObj.message.tasks;

        console.log(tasks);
    });
}

module.exports = clientMethods