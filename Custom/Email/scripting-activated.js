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
	
		var subject = "Your " + payload.get("blueprintName") + " is activated and ready for use" ;

		System.log("Building content line by line");
//		content = '<img src="http://" alt="tuke cloud logo">' +
		content = '<h2>Dear '+ name + '! Great news! Your requested VM ('+ payload.get("blueprintName") +') is activated and ready for use!</h2>'+
		'<p></p>' + 
		'<ul>' + 
		'<li>Your virtual machine ID is: ' + machine.get("name") + ' </li>' +
		'<li>Was provisioned with the following CPU: ' + vRAVmProperties.get("VirtualMachine.CPU.Count") + 
			', RAM: '+ vRAVmProperties.get("VirtualMachine.Memory.Size") + ' MB' +
			', and DISK: ' + vRAVmProperties.get("VirtualMachine.Disk0.Size") + ' GB.</li>' + 
/*		'<li>Is available at the following IP address: <a href="' + ipUrl + '"> ' + ipUrl + '</a></li>';*/
			'<li>Is available at the following IP address: <b>' + IP + '</b></a></li>';
		if (OS == 'linux-server') {content = content + '<li>You can log in with the <b>root</b> username.</li>';}
		else if (OS == 'linux-desktop') {content = content + '<li>You can log in with the <b>vmware</b> username.</li>';}
		else if (OS == 'windows-server') {content = content + '<li>You can log in with the <b>administrator</b> username.</li>';}
		else if (OS == 'windows-desktop') {content = content + '<li>You can login with the <b>vmware</b> username.</li>';}
		else {
				throw ("Ups. Something went wrong. Canceling email send.");
			 }

        // the passwords set by the Change.Password workflow are stored in a plaintext file.
        // do not do this in production
		//var fileName = "/vro/osPassFile";
		var fileName = "/var/log/vco/chpass/osPassFile";
		//File reader constructor
		var myFileReader = new FileReader(fileName);
		// check if the file actually exists
		if (myFileReader.exists){
			//Open the file
			myFileReader.open();
			//read line by line until the file is empty
			fileLine=myFileReader.readLine();
			while (fileLine.indexOf(machine.get("name")) == '-1') {
				fileLine=myFileReader.readLine();
			}
			System.log(machine.get("name") + ' has the following password: ' + fileLine.split(":").pop());
		}

			
		content = content + '<li>We generated the following password for you: <b>' + fileLine.split(":").pop() + '</b><br><br>' +
    	'<font color="red">Please note that this password serves only as a temporary password for initial configuration.<br>' +
		'<b>We highly recommend you change it as soon as possible but please keep in mind that if you experience any issue with loggin in, <br>' +
		'you will have to share the password with the cloud team. So please be wise when selecting a new password <br>(e.g. do not set the same password you use for your gMail account).</b></font> </li></ul>';
	
		//content = content + '<br>We hope you still remember the password you set for your VM at request.<br>' +
		//'If not, you might want to contact us at <a href="mailto:a@b.c?Subject=Password reset request" target="_top">cloud help-desk</a>.<br>' +

		if (OS == 'windows-desktop' || OS == 'windows-server') { content = content + 
	'<font color="blue">Your VM with a Microsoft Windows OS comes unlicensed!<br>' +
	'Employees and students can obtain Microsoft Windows OS license keys free of charge using ' +
	'the <a href="https://">Microsoft Developer Network (MSDN)</a>.</font><br><br>' ; }
	
	content = content + '<font color="red"><br>IMPORTANT NOTICE! <br><br> Please note that it is strictly <b><u>prohibited</u></b> to <b><u>remove</u></b> pre-installed components (e.g. VMware Tools) from the provisioned VM.<br>' +
	'If you do so, your VM will be <b><u>immediately unprovisioned and all your files deleted</u></b> without warning!<br>' +
	'If your packages conflict with the pre-installed ones, please consult this issue with ' +
	'the <a href="mailto:a@b.c?Subject=[CLOUD] Conflicting packages" target="_top">Cloud Team</a>.</font><br><br>';
						
		content = content + 'We also strongly advise you take a look at the <a href="http://">cloud portal user guide</a>.' +
		'<p></p>If we can be of any further assistance to you, feel free to <a href="mailto:a@b.c?Subject=[CLOUD] Personal request" target="_top">contact us</a>.<p></p>Cheers,<br>Your Cloud Team';
