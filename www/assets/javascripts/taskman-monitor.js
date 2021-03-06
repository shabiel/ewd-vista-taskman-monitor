var taskmanMonitor = {};

// Load CSS & set up nav
taskmanMonitor.prep = function(EWD) {
  $('#main-content').append('<div id="taskman-monitor" class="row"></div>');
  taskmanMonitor.showStatus(EWD);
  taskmanMonitor.showTasks(EWD);
  taskmanMonitor.setupEvents(EWD);
};

taskmanMonitor.showStatus = function(EWD) {
  if ($('#taskman-info').length) {
    $('#taskman-info').html('');
  }
  else {
    let html = '';
    html = html + '<div id="taskman-info" class="main col-md-6">';
    html = html + '</div>';
    $('#taskman-monitor').append(html);
  }

  let messageObj = {
    service: 'ewd-vista-taskman-monitor',
    type: 'status'
  };
  EWD.send(messageObj, function(responseObj) {
    let ztsch = responseObj.message.ztsch;
    let taskman = {
      cpuVolumePair: Object.keys(ztsch.SUB)[0],
      status: '',
      submanagers: 0,
      tasks: {
        scheduled: 0,
        partition: 0,
        device: 0,
        running: 0
      }
    };
    if (ztsch.STATUS) {
      taskman.status = ztsch.STATUS[Object.keys(ztsch.STATUS)[0]].split('^').slice(-1)[0];
    }
    Object.keys(ztsch.SUB[taskman.cpuVolumePair]).forEach(function(element, index, array) {
      if (element > 0) taskman.submanagers++;
    });
    Object.keys(ztsch).forEach(function(time, timesIndex, timesArray) {
      if (parseInt(time) > 0) {
        Object.keys(ztsch[time]).forEach(function(task, tasksIndex, tasksArray) {
          taskman.tasks.scheduled++;
        });
      }
    });
    if (ztsch.JOB) {
      taskman.tasks.partition = Object.keys(ztsch.JOB).length;
    }
    if (ztsch.IO) {
      taskman.tasks.device = Object.keys(ztsch.IO).length;
    }
    if (ztsch.TASK) {
      taskman.tasks.running = Object.keys(ztsch.TASK).length;
    }

    switch (taskman.status) {
      case 'Main Loop': {
        if (ztsch.WAIT) taskman.status = 'Entering Wait State';
        else if (ztsch.STOP && ztsch.STOP.MGR) taskman.status = 'Stopping';
        break;
      }
      case 'Taskman Job Limit Reached': {
        taskman.status = 'Job Limit Reached';
        break;
      }
      case 'Taskman Waiting': {
        if (ztsch.WAIT) taskman.status = 'Waiting';
        else taskman.status = 'Exiting Wait State';
        break;
      }
      case 'Startup Hang': {
        break;
      }
      case '': {
        taskman.status = 'Stopped';
        break;
      }
      default: {
        taskman.status = 'Unknown';
      }
    }

    // console.log(taskman);
    // console.log(ztsch);

    let html = '';
    html = html + '<h3 class="sub-header">Taskman Info&nbsp;<i id="tm-refresh-info" class="fa fa-refresh" aria-hidden="true"></i></h3>';
    html = html + '<h5><strong>CPU-Volume Pair:</strong> ' + taskman.cpuVolumePair + '</h5>';
    html = html + '<h5><strong>Status:</strong> ' + taskman.status + '</h5>';
    html = html + '<h5><strong>Free Submanagers:</strong> ' + taskman.submanagers + '</h5>';
    html = html + '<h5><strong>Tasks Scheduled:</strong> ' + taskman.tasks.scheduled + '</h5>';
    html = html + '<h5><strong>Tasks Waiting For Partition:</strong> ' + taskman.tasks.partition + '</h5>';
    html = html + '<h5><strong>Tasks Waiting For Device:</strong> ' + taskman.tasks.device + '</h5>';
    html = html + '<h5><strong>Tasks Running:</strong> ' + taskman.tasks.running + '</h5>';

    $('#taskman-info').append(html);
    $('#tm-refresh-info').click(function() {taskmanMonitor.showStatus(EWD); });
  });
};

taskmanMonitor.showTasks = function(EWD) {
  if ($('#taskman-tasks > div.table-responsive').length) {
    $('#taskman-tasks > div.table-responsive').html('');
  }
  else {
    let html = '';
    html = html + '<div id="taskman-tasks" class="main col-md-6">';
    html = html + '<h3 class="sub-header">Taskman Tasks&nbsp;<i id="tm-refresh-tasks" class="fa fa-refresh" aria-hidden="true"></i></h3>';
    html = html + '  <div class="table-responsive">';
    html = html + '  </div>';
    html = html + '</div>';
    $('#taskman-monitor').append(html);
    $('#tm-refresh-tasks').click(function() {
      $('#tm-refresh-tasks').css('opacity', '0.3');
      taskmanMonitor.showTasks(EWD);
    });
  } //else

  let html = '';
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
  html = html + '</tbody>';
  html = html + '</table>';

  $('#taskman-tasks > div.table-responsive').append(html);

  let messageObj = {
    service: 'ewd-vista-taskman-monitor',
    type: 'tasks'
  };
  EWD.send(messageObj, function(responseObj) {
    if (responseObj.finished == false) {
      let task = responseObj.message.task;
      taskmanMonitor.addTaskToPage(task);
    }

    $('#tm-refresh-tasks').css('opacity', '1.0');
  });
};

taskmanMonitor.addTaskToPage = function(task, animate) {
  let oldrow = $('#taskman-tasks tbody #' + task.number);
  oldrow.fadeOut('fast');
  oldrow.remove();

  let html = '';
  html = html + '<tr id="' + task.number + '">';
  html = html + '<td>' + task.number + '</td>';
  html = html + '<td>' + (task.fields['0.03'] ? task.fields['0.03'] : task.fields['.03']) +  '</td>';
  html = html + '<td>' + taskmanMonitor.taskStatus(task.fields['0.1'] ? task.fields['0.1'].split('^')[0] : task.fields['.1'].split('^')[0] ) + '</td>';
  html = html + '<td>' + vista.horologToExternal(task.fields['0'].split('^')[5]) + '</td>';
  html = html + '<td>' + vista.horologToExternal(task.fields['0.1'] ? task.fields['0.1'].split('^')[1] : task.fields['.1'].split('^')[1]) + '</td>';
  html = html + '</tr>';
  let row = $(html);

  if (animate) row.hide();

  $('#taskman-tasks tbody').prepend($(row));
  if (animate) row.fadeIn('slow');
};

taskmanMonitor.statusCodes = {
  '0': 'Incomplete',
  '1': 'Scheduled',
  '2': 'Being inspected',
  '3': 'Waiting for partition',
  '4': 'Being prepared',
  '5': 'Running',
  '6': 'Completed',
  'A': 'Waiting for device',
  'B': 'Rejected',
  'C': 'Error',
  'D': 'Stopped by user',
  'E': 'Interrupted while running',
  'F': 'Uscheduled',
  'G': 'Waiting for link to volume',
  'H': 'Edited but not rescheduled',
  'I': 'Discarded by Taskman',
  'J': 'Being edited',
  'K': 'Created but not scheduled',
  'L': 'Task caused Submanager error',
  'M': 'Waiting for Compute Server partition'
};

taskmanMonitor.taskStatus = function(code) {
  let status = taskmanMonitor.statusCodes[code];
  if (!status) status = code;

  return status;
};

taskmanMonitor.setupEvents = function(EWD) {
  EWD.off('taskmanPush'); // Prevent rebinding the same event
  EWD.off('taskmanDelete'); // Prevent rebinding the same event
  EWD.on('taskmanPush', function(responseObj) {
    taskmanMonitor.addTaskToPage(responseObj.message, true);
  });
  EWD.on('taskmanDelete', function(responseObj) {
    let oldrow = $('#taskman-tasks tbody #' + responseObj.message);
    oldrow.fadeOut('slow', function() { $(this).remove();});
  });

};
