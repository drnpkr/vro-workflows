# VMware vRealize Orchestrator Server Workflows
---

**Workflows Developed by:** [Gary Coburn](http://extendingclouds.com/)

**Optimized and Customized by:** Adrian Pekar

**Tested Product Versions:** vRA 7.3 with built-in vRO


## Disclaimer:
---

These workflows have been created entirely for educational and informational purpose. They do not come with any warranty or support but will provide a good base understanding of how you can accomplish your goals. These are not intended for production. Use at your own risk.

## Description
---

This workflows in the repositories are a modified versions of the original workflows posted by [Gary Coburn](http://extendingclouds.com/).

The workflows provide two functionalities:
   * Change the default passwords configured on the VM Golden Images (Debian-based Linux Destop and Server, Windows Server and Destop).
   * Send custom notification emails to the users including the generated new passwords.
 
The password change is necessary for improved security. The Golden Image has a master login and password that is set during its creation. If the password is not changee, cloud users can potentially log in to VMs that are not provisioned for them. The IP addresses are usually assigned to the VMs from a pool. It is not complex to find other VMs within the same IP range.

The custom notification emails are required for sending the users the generated passwords.

**Note:** The workflows are configured in a way that the passwords are stored in a local file (on the vRO server). This is not an optimal and secure way. **It is the user's responsibility to change the generated passwords as soon as possible.**

## Instructions
---

1. Import the workflows into the appropriate folders (there have been a standardization for directory sturcture and naming in 2016).
2. Customise the workflows.

---

The worklflows here are provided in an 'as is basis'. You should know how to install and configure VMware vRO.

**For configuring the Event Broker follow [part-1](http://extendingclouds.com/2016/01/19/enabling-the-event-broker/) and [part-2](https://extendingclouds.com/2016/05/02/vrealize-automation-7-enabling-the-event-broker-part-2/) of the tutorials.** 

**For custom email notifications follow [this](https://extendingclouds.com/2016/04/28/vrealize-automation-7-custom-email-notifications-with-the-event-broker/) tutorial and follow the discussion in the Comments section.**

**For an example how to provide the users with an option to change their password follow [this](http://extendingclouds.com/2016/01/01/updated-for-vra-7-how-bout-we-let-users-set-their-default-admin-or-root-password/) tutorial and follow the discussion in the Comments section.**

## Windows 10 password change problems:
---

In W10 the NET command requires elevated command prompt mode, ie., you have to run it as an Administrator. However, in W10, admin account is deactivated by default. In addition, even if you activate it in your reference machine (template), the Sysprep procedure resets it to the default deactivated mode (when you are cloning it in vRA (actually vCenter)). So when the vRO workflow tries to change the password, it will fail (a standard user account with administrator privileges is not suitable for password change).

To resolve the issue:
   * First, you have to force W10 to activate the administrator account when finishing Sysprep. For this task, you can use the procedure in KB2034622 (do not forget to set a password and check your Customization Specification (CS) in vCenter as well - by mistake, I kept overwriting this password with the one I forget to change in the CS).
   * Then, in the workflow, you will connect to the VM using the Administrator account instead of the standard user account.
   * At last, in the workflow, you first set the user password using the administrator account and then deactivate it (the admin account).

## How to configure the AD with your workflow

Prerequisites:

1. Configure AD
2. Set Default AD (“Configure AD plug-in options” – workflow name is a bit misleading) – needed for the way how I query AD.

Code for AD query:
```javascript
AllUserData = ActiveDirectory.searchExactMatch(“User”,machine.get(“owner”));
username = AllUserData[0].getAttribute(“displayName”);
System.log(“Username: ” + username);
login = AllUserData[0].getAttribute(“sAMAccountName”);
System.log(“Login: ” + login);
email = AllUserData[0].getAttribute(“mail”);
System.log(“Email: ” + email);
```
