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

//////////////////////////////////

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
	
	var subject = "Your request for " + payload.get("blueprintName") + " has been submitted" ;

	System.log("Building content line by line");
	
	// content = '<img src="http://" alt="tuke cloud logo">' +
	content = '<h2>Dear '+ name + '! Your request for ' + payload.get("blueprintName") + ' has been submitted. Thank you!</h2>'+ 
	/*'<p>This is an email to let you know your request is in process and you will get updates throughout.</p>' + 
	'<p></p>' + 
	'<h3>Your request for ' + payload.get("blueprintName") + ' has been submitted.</h3>' + */
	'<p></p>' + 
	'<ul>' + 
	'<li>Your virtual machine ID is: ' + machine.get("name") + ' </li>' +
	'<li>Is being provisioned with the following CPU: ' + vRAVmProperties.get("VirtualMachine.CPU.Count") + 
		', RAM: '+ vRAVmProperties.get("VirtualMachine.Memory.Size") + ' MB' +
		', and DISK: ' + vRAVmProperties.get("VirtualMachine.Disk0.Size") + ' GB.</li></ul>' +
	'<p></p>So what now? Sit back and relax! We are working hard to create your VM.<br>' +
	'<br>While you are waiting you might be interested in the <a href="http://">cloud portal user guide</a>.<br>' +
	'<font color="red"><br>IMPORTANT NOTICE! <br><br> Please note that it is strictly <b><u>prohibited</u></b> to <b><u>remove</u></b> pre-installed components (e.g. VMware Tools) from the provisioned VM.<br>' +
	'If you do so, your VM will be <b><u>immediately unprovisioned and all your files deleted</u></b> without warning!<br>' +
	'If your packages conflict with the pre-installed ones, please consult this issue with ' +
	'the <a href="mailto:a@b.c?Subject=[CLOUD] Conflicting packages" target="_top">Cloud Team</a>.</font><br><br>';
	
	if (OS == 'windows-desktop' || OS == 'windows-server') { content = content + 
	'<font color="blue">Since you are requesting a VM with a Microsoft Windows OS, you will need a license key (the provisioned VM comes unlicensed).<br>' +
	'Employees and students can obtain Microsoft Windows OS license keys free of charge using the <a href="https://">Microsoft Developer Network (MSDN)</a>.</font><br><br>' ; }
	
	content = content + 'We will let you know when your VM is ready to use.<p></p>Cheers,<br>Your Cloud Team';
	