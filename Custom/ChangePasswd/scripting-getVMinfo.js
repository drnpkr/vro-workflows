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

var vCACVmProperties = machine.get("properties") ;
if (vCACVmProperties != null) {
	var log = "";
	log += "vCAC VM properties :\n";
	var array = new Array();
	for each (var key in vCACVmProperties.keys) {
		array.push(key + " : " + vCACVmProperties.get(key));	
	}
	array.sort();
	
	for each (var line in array) {
		log += "\t" + line + "\n";
	}	
	System.log(log);	
}

//----------------------------//

function getNum() {
    // Generate a random number between 33 and 126
    return ((parseInt((Math.random()) * 1000) % 94) + 33);
}
 
function isPunctuation(num) {
    // ASCII characters 33-47, 58-64, 91-96 and 123-126 are punctuation
    if (((num >=33) && (num <=47)) || ((num >=58) && (num <=64)) || ((num >=91) && (num <=96)) || ((num >=123) && (num <=126))) { return true; }
    return false;
}

function isColon(num) {
    // Password is distinguished from VM name via colons -- ':'
    if (num == 58) { return true; }
    return false;
}

// Initialise a string
var strPassword = "";

// Count over the password length
passwordLength=9;
for (i=0; i < passwordLength; i++) {
    // Get a random number
    nextCharacter = getNum();
    // If we are excluding punctuation
    if (true) {
        // Check if the random number is punctuation and get a new one until it's not
        while (isPunctuation(nextCharacter)) {
            nextCharacter = getNum();
        }
    }
    // Add the character to the string password
    // This method is silly, but keep in mind that too high password
    // complexity can prevent the password to be applied at the VM
    // (e.g. because of escape characters)
    strPassword = strPassword + String.fromCharCode(nextCharacter);
	if (i == 2) {
		strPassword = strPassword + String.fromCharCode(43);
	}
	if (i == 4) {
		strPassword = strPassword + String.fromCharCode(61);
	}
	if (i == 7) {
		strPassword = strPassword + String.fromCharCode(45);
	}
}

// Write the password to the output - for testing only!
System.log("Secure password generated: " + strPassword); // For production, you might want to comment this line out
// Assign the string to the secureString Output parameter.
var pass = strPassword;
//Filename with absolute path
var fileName = "/var/log/vco/chpass/osPassFile";
//the /var/log/vco/chpass directory has 755 permissions. The directory and file owner is vco:vco. The osPassFile permissions are 640
//In addition, edit the /etc/vco/app-server/js-io-rights.conf file. To give Orchestrator access to a directory add the following +rwx /var/log/vco/chpass/


//FileWriter constructor
var myFileWriter = new FileWriter(fileName);
//open the file for writing
myFileWriter.open();
//write a line into the file
myFileWriter.writeLine(machine.get("name")+':'+pass);
System.log('Line written into file: ' + machine.get("name")+':'+pass);
//Close the file
myFileWriter.close();

//----------------------------//

//Custom intelligence for setting root and admin passwords
System.log('Getting the custom properties needed') ;
var criteria = machine.get("name") ;
//var pass = vCACVmProperties.get("extendingclouds.admin.pass") ;
var os = vCACVmProperties.get("guest.os") ;
