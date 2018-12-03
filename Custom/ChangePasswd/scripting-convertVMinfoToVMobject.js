//convert array to vc:virtualmachine
System.log('Converting VMs array to VM object') ;
vm=vms[0] ;
System.log('Found VM = ' + vm) ;

//detect OS version
System.log('Detecting OS and setting commands') ;
if (os=='linux-server'){
	vmUsername='root' ;
	programPath='/bin/echo' ;
	arguments='"root:' + pass + '" | chpasswd' ;
	System.log('Detected OS: ' + os) ;
	System.log('Command to execute: ' + arguments);
}
else if (os=='linux-desktop'){
	vmUsername='root' ;
	programPath='/bin/echo' ;
	arguments='-e "root:' + pass + '\nvmware:'+ pass + '" | chpasswd' ;
	System.log(arguments);
//	arguments='"cloud-user:' + pass + '" | chpasswd' ;
	System.log('Detected OS: ' + os) ;
}
else if (os=='windows-server'){
	vmUsername='administrator' ;
	programPath='C:\\windows\\system32\\net.exe' ;
	arguments='user administrator ' + pass ;
	System.log('Detected OS: ' + os) ;
}
else if (os=='windows-desktop'){
	vmUsername='administrator' ;
	programPath='C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe' ;
	arguments='net user vmware ' + pass + '; net user administrator /active:no' ;
	System.log('Detected OS: ' + os) ;
	System.log('Command to execute: ' + arguments) ;
}
else
{
	throw "OS is not supported. Please contact the administrator" ;
}

