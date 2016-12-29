let clientMethods = {};

// Set up menu
clientMethods.prep = function(EWD) {
  $('#app-taskman-monitor').on('click', function(e) {
    clientMethods.showTasks(EWD);
    return false;
  });
};

clientMethods.showTasks = function(EWD) {
  // Clear the page
  $('#main-content').html('');
  
  let messageObj = {
    service: 'ewd-vista-taskman-monitor',
    type: 'tasks'
  };
  EWD.send(messageObj, function(responseObj) {
    let tasks = responseObj.message.tasks;
    // console.log(tasks);
    
    let html='<div id="taskman-monitor" class="row collapse"></div>';
    $('#main-content').append(html);
    
    html = '';
    html = html + '<div class="main col-md-5">';
    html = html + '<h2 class="sub-header">Taskman Tasks</h2>';
    html = html + '<div class="table-responsive">';
    html = html + '<table class="table table-striped">';
    html = html + '<thead>';
    html = html + '<tr>';
    html = html + '<td>Number</td>';
    html = html + '<td>Name</td>';
    html = html + '<td>Status</td>';
    html = html + '<td>Scheduled</td>';
    html = html + '<td>Updated</td>';
    html = html + '</tr>';
    html = html + '</thead>';
    html = html + '<tbody>';
    
    tasks.forEach(function(task, index, array) {
      html = html + '<tr>';
      html = html + '<td>' + task.number + '</td>';
      html = html + '<td>' + task.fields['0.03'] + '</td>';
      html = html + '<td>' + clientMethods.taskStatus(task.fields['0.1'].split('^')[0]) + '</td>';
      html = html + '<td>' + clientMethods.horologToExternal(task.fields['0'].split('^')[5]) + '</td>';
      html = html + '<td>' + clientMethods.horologToExternal(task.fields['0.1'].split('^')[1]) + '</td>';
      html = html + '</tr>';
    });
    
    html = html + '</tbody>';
    html = html + '</table>';
    html = html + '</div>';
    html = html + '</div>';
    
    $('#taskman-monitor').append(html).show();
  });
};

clientMethods.horologToExternal = function(horoTimeStamp) {
  let horoZero = -4070880000000;
  let horoDays = horoTimeStamp.split(',')[0];
  let horoSecs = horoTimeStamp.split(',')[1];
  
  let epochTime = horoZero;
  epochTime     = epochTime + horoDays*86400*1000;
  epochTime     = epochTime + horoSecs*1000;
  
  return new Date(epochTime);
};

clientMethods.taskStatus = function(code) {
  let status = '';
  
  switch (code) {
    case '1':
      status = 'Scheduled';
      break;
    case '6':
      status = 'Completed';
      break;
    default:
      status = code;
  }
  
  return status;
};

module.exports = clientMethods;