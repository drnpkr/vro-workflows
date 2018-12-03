var executionContext = System.getContext();

System.log("BlueprintName: " + payload.get("blueprintName")) ;
System.log("ComponentId: " + payload.get("componentId")) ;
System.log("ComponentTypeId: " + payload.get("componentTypeId")) ;
System.log("EndpointId: " + payload.get("endpointId")) ;
System.log("RequestId: " + payload.get("requestId")) ;
System.log("VirtualMachineEvent: " + payload.get("virtualMachineEvent")) ;
System.log("WorkflowNextState: " + payload.get("workflowNextState")) ;

var lifecycleState = payload.get("lifecycleState") ;
System.log("State: " + lifecycleState.get("state")) ;
System.log("Phase: " + lifecycleState.get("phase")) ;
System.log("Event: " + lifecycleState.get("event")) ;

var machine = payload.get("machine") ;
System.log("ID: " + machine.get("id")) ;
System.log("Name: " + machine.get("name")) ;
System.log("ExternalReference: " + machine.get("externalReference")) ;
System.log("Owner: " + machine.get("owner")) ;
System.log("Type: " + machine.get("type")) ;
System.log("Properties: " + machine.get("properties")) ;

//////////////////////////////
AllUserData = ActiveDirectory.searchExactMatch("User",machine.get("owner"));  

username = AllUserData[0].getAttribute("displayName");
System.log("Username: " + username);
var name = username.replace(/ .*$/i, "");
System.log("Name: " + name);
 
login = AllUserData[0].getAttribute("sAMAccountName");
System.log("Login: " + login); 
email = AllUserData[0].getAttribute("mail");
System.log("Email: " + email);

//////////////////////////////////////////

	var vRAVmProperties = machine.get("properties") ;

	var log = "";
	log += "vRA VM properties :\n";
	var array = new Array();
	for each (var key in vRAVmProperties.keys) {
		array.push(key + " : " + vRAVmProperties.get(key));	
	}
	array.sort();
	
	for each (var line in array) {
		log += "\t" + line + "\n";
	}	
	System.log(log);


var IP = vRAVmProperties.get("VirtualMachine.Network0.Address");
var OS = vRAVmProperties.get("guest.os")
System.log("IP = " + IP);
System.log("OS = " + OS);
if (OS == 'linux-server'){ var ipUrl = "ssh://" + IP;}
if (OS == 'linux-desktop'){ var ipUrl = "ssh://" + IP;}
if (OS == 'windows-desktop'){ var ipUrl = "rdp://" + IP;}
if (OS == 'windows-server'){ var ipUrl = "rdp://" + IP;}

System.log("ipUrl is " + ipUrl);

	System.log("Creating the email");
	var emailRequired="true";
	var toAddress = email;    
	
		var subject = "Your " + payload.get("blueprintName") + " has been completely disposed" ;

		System.log("Building content line by line");
		
//		content = '<img src="http://" alt="tuke cloud logo">' +
		content = '<h2>Dear '+ name + '! Your request for disposing a ' + payload.get("blueprintName") + ' VM, named as ' + machine.get("name") + ' has been completed.</h2>'+ 
		'<p></p>Thank you for using our IaaS services so far! We hope to hear from you soon!<br>' +
		'<p></p>If we can be of any further assistance to you, feel free to <a href="mailto:a@b.c?Subject=[CLOUD] Personal request" target="_top">contact us</a>.<p></p>Cheers,<br>Your Cloud Team';

	
