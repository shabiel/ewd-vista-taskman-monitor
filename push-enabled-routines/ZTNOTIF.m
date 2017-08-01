ZTNOTIF ; OSE/SMH - Taskman Notifications API;2017-08-01  12:31 PM
 ;;8.0;KERNEL;;
 ;
NOT(ZTSK,ACTION) ; [Public] Notifications API to QEWD
 N SERVER S SERVER="QEWD"
 N SERVICE S SERVICE="NOTIFICATIONS SERVICE"
 N PATH S PATH="taskman"
 ; Get Server IEN
 ;
 N SERVERIEN S SERVERIEN=+$ORDER(^XOB(18.12,"B",SERVER,0)) ; per getWebServerId
 I 'SERVERIEN QUIT
 ;
 ; Get Service IEN
 N SERVICEIEN S SERVICEIEN=+$order(^XOB(18.02,"B",SERVICE,0)) ; per getWebServiceId(webServiceName)
 I 'SERVICEIEN QUIT
 ;
 ; Service Type must be REST
 I $P(^XOB(18.02,SERVICEIEN,0),U,2)'=2 QUIT
 ;
 ; Is Web Server disabled?
 N Z S Z=^XOB(18.12,SERVERIEN,0) ; Zero node
 I '$P(Z,U,6) QUIT
 ;
 ; Is web service authorized? per getAuthorizedWebServiceId
 N SUBSERVICEIEN S SUBSERVICEIEN=$O(^XOB(18.12,SERVERIEN,100,"B",SERVICEIEN,""))
 I 'SUBSERVICEIEN QUIT
 ;
 ; Is the service disabled at the server level?
 N SN S SN=^XOB(18.12,SERVERIEN,100,SUBSERVICEIEN,0) ; SN = service node
 I '$P(SN,U,6) QUIT
 ;
 ; Get Username and password if present
 ; TODO: Not implemented by Sam. Easy to implement.
 ; Note: Code below different than Cache logic. Will only get un/pw if
 ; it's Yes. Cache code gets it if Yes or empty.
 ; I $G(^XOB(18.12,SERVERIEN,1)) D
 ; . N UN S UN=^XOB(18.12,SERVERIEN,200)
 ; . N PW S PW=$$DECRYP^XOBVPWD($G(^XOB(18.12,SERVERIEN,300)))
 ; ;
 ; Then
 ; curl un:pw@url
 ;
 N FQDN S FQDN=$P(Z,U,4) ; IP or Domain name
 N PORT S PORT=$P(Z,U,3) ; Http Port
 N TO S TO=$P(Z,U,7) ; HTTP Timeout
 N ISTLS S ISTLS=$P($G(^XOB(18.12,SERVERIEN,3)),U) ; Is SSL/TLS on?
 I ISTLS S PORT=$P($G(^XOB(18.12,SERVERIEN,3)),U,3) ; replace port
 N CONTEXT S CONTEXT=$G(^XOB(18.02,SERVICEIEN,200)) ; really, just the path on the server.
 ;
 ; Create URL
 N URL S URL="http"_$S(ISTLS:"s",1:"")_"://"_FQDN_":"_PORT_CONTEXT_PATH_"?task="_ZTSK
 I $G(ACTION)]"" S URL=URL_"&action="_ACTION
 ;
 ; For this service -- be as fast as possible. zero timeout.
 N STATUS S STATUS=$$GETURL^XTHC10(URL,0)
 QUIT
