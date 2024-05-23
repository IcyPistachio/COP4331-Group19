const urlBase = 'http://104.236.195.48/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const ids = []

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister() {
	firstName = document.getElementById("firstName").value;
    	lastName = document.getElementById("lastName").value;

    	let username = document.getElementById("username").value;
    	let password = document.getElementById("password").value;


	if (!checkRegister(firstName, lastName, username, password)) {
        	document.getElementById("signupResult").innerHTML = "Invalid information";
        	return;
    	}

	document.getElementById("signupResult").innerHTML = "";

	let tmp = {firstName: firstName, lastName: lastName, login: username, password: password};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Register.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{

			if (this.readyState != 4) {
                		return;
            		}

            		if (this.status == 409) {
               			document.getElementById("signupResult").innerHTML = "User already exists";
               			return;
          		}

            		if (this.status == 200) {
                		let jsonObject = JSON.parse(xhr.responseText);
                		userId = jsonObject.id;
                		document.getElementById("signupResult").innerHTML = "Registration Complete";
                		firstName = jsonObject.firstName;
                		lastName = jsonObject.lastName;
                		saveCookie();
            		}
        	};

        	xhr.send(jsonPayload);
    	} catch (err) {
        	document.getElementById("signupResult").innerHTML = err.message;
    	}

	document.getElementById("signupResult").innerHTML = "Registration Complete";
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	let firstName = document.getElementById("firstName").value;
    	let lastName = document.getElementById("lastName").value;
	let phone = document.getElementById("phone").value;
    	let email = document.getElementById("email").value;

	if (!checkContact(firstName, lastName, phone, email)) {
        	document.getElementById("contactAddResult").innerHTML = "Invalid information";
        	return;
    	}

	let tmp = {firstName: firstName, lastName: lastName, phone: phone, email: email, userId: userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}	
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
}

function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );	

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				

				for( let i=0; i<jsonObject.results.length; i++ )
				{
					// This is responsible for how the List of contacts look *****IMPORTANT****
					contactList += jsonObject.results[i].FirstName + " | " + jsonObject.results[i].LastName + " | " + jsonObject.results[i].Phone + " | " + jsonObject.results[i].Email;
					
					contactList += " " + "<button type='button' onclick='deleteContact();'> Delete</button>";
					contactList += " " + "<button type='button' onclick='updateContact();'> Edit</button>";

					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}


				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

function deleteContact() {
	
}

function updateContact() {
	
}

function checkRegister(fName, lName, user, pass) {

    var fNameErr = lNameErr = userErr = passErr = true;

    if (fName == "") {
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("first name IS VALID");
        fNameErr = false;
    }

    if (lName == "") {
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST name IS VALID");
        lNameErr = false;
    }

    if (user == "") {
        console.log("USERNAME IS BLANK");
    }
    else {
         console.log("USERNAME IS VALID");
         userErr = false; 
    }

    if (pass == "") {
        console.log("PASSWORD IS BLANK");
    }
    else {
        console.log("PASSWORD IS VALID");
        passErr = false;
    }

    if ((fNameErr || lNameErr || userErr || passErr) == true) {
        return false;

    }

    return true;
}

function checkContact(fName, lName, ph, mail) {

    var fNameErr = lNameErr = phErr = mailErr = true;

    if (fName == "") {
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("first name IS VALID");
        fNameErr = false;
    }

    if (lName == "") {
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST name IS VALID");
        lNameErr = false;
    }

    if (ph == "") {
        console.log("USERNAME IS BLANK");
    }
    else {
         console.log("USERNAME IS VALID");
         userErr = false; 
    }

    if (mail == "") {
        console.log("PASSWORD IS BLANK");
    }
    else {
        console.log("PASSWORD IS VALID");
        passErr = false;
    }

    if ((fNameErr || lNameErr || userErr || passErr) == true) {
        return false;

    }

    return true;
}
