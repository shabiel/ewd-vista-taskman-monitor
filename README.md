# ewd-vista-taskman-monitor
The module will install normally like any Panorama module.

If you want to get push capabilities, you will need to do some extra work.

Make sure to get the push handler module as a sibling of this module: https://github.com/shabiel/ewd-vista-push-handler.

Add this express config to your qewd.js file that starts the server:

```
var config = <your server configuration>
var routes = [{
    path: '/ewd-vista-pushdata',
      module: 'ewd-vista-push-handler'
}]

var qewd = require('qewd').master;
qewd.start(config, routes);
```

Routines are: %ZTLOAD1.m, %ZTM4.m, %ZTMS2.m, and  %ZTMS3.m. Drop the routines
into your GT.M or Cache environment. On GT.M, you will need to get the
https://github.com/shabiel/Kernel-TLS code, which removes the DNS calls, as
they are not needed on GT.M.

You need to configure a web server and a web service in the XOBW package. The
server name must be QEWD, and the service must be NOTIFICATION SERVICE.

### WEB SERVER CONFIG
```
NAME: QEWD                              PORT: 8081
  SERVER: LOCALHOST                     STATUS: ENABLED
  DEFAULT HTTP TIMEOUT: 5
WEB SERVICE: NOTIFICATIONS SERVICE      STATUS: ENABLED
```

### WEB SERVICE CONFIG
```
                     Name: NOTIFICATIONS SERVICE                                
             Service Type: REST                                                 
     Registered Date/Time: AUG 01, 2017@10:05:47                                
             Context Root: /ewd-vista-pushdata/                                 
    Availability Resource: ping                                                 
```

### DEMO
[Demo](demo.gif?raw=true "Demo")
