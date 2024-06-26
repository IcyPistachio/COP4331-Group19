const urlBase = 'http://contacthub.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

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
        	document.getElementById("signupResult").innerHTML = "Invalid not all boxes filled in.";
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
				//alert("User already exists");
               			document.getElementById("signupResult").innerHTML = "User already exists";
               			return;
          		}

            		if (this.status == 200) {
                		let jsonObject = JSON.parse(xhr.responseText);
                		userId = jsonObject.id;
				//alert("Registration Complete");
                		document.getElementById("signupResult").innerHTML = "Registration Complete";
                		firstName = jsonObject.firstName;
                		lastName = jsonObject.lastName;
                		saveCookie();
            		}
			document.getElementById("signupResult").innerHTML = "Registration Complete";
        	};

        	xhr.send(jsonPayload);
    	} catch (err) {
        	document.getElementById("signupResult").innerHTML = err.message;
    	}

	
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
	window.location.href = "http://contacthub.online/index.html";
}

function addContact()
{
	let firstName = document.getElementById("firstName").value;
    	let lastName = document.getElementById("lastName").value;
	let phone = document.getElementById("phone").value;
    	let email = document.getElementById("email").value;

	if (!checkContact(firstName, lastName, phone, email)) 
	{
        	//document.getElementById("contactAddResult").innerHTML = "Invalid information";
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
				alert("Contact Added");
				document.getElementById('firstName').value = '';
				document.getElementById('lastName').value = '';
				document.getElementById('phone').value = '';
				document.getElementById('email').value = '';
				//document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}	
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	

}

function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";
	let temp = "";
	let f = "";
	let l = "";
	let p = "";
	let e = "";
	let Id = 0;

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
                document.getElementById("contactSampleResult").innerHTML = "Firstname | Lastname | Phone Number | Email Address";
				let jsonObject = JSON.parse( xhr.responseText );
				

				for( let i=0; i<jsonObject.results.length; i++ )
				{
					f = jsonObject.results[i].FirstName;
					l = jsonObject.results[i].LastName;
					p = jsonObject.results[i].Phone;
					e = jsonObject.results[i].Email;
					temp = jsonObject.results[i].ID;
					Id = parseInt(temp);

					const tmp = [f, l, p, e, temp];
					
					// This is responsible for how the List of contacts look *****IMPORTANT****
					contactList += jsonObject.results[i].FirstName;
					contactList += "  |  ";
					contactList += jsonObject.results[i].LastName;
					contactList += "  |  ";
					contactList += jsonObject.results[i].Phone;
					contactList += "  |  ";
					contactList += jsonObject.results[i].Email;
								
	
					contactList += " " + "<button type='button' onclick=deleteContact(" + Id + ");> Delete</button>";

					contactList += " " + "<button type='button' onclick=updateContact(" + Id + ");> Edit</button>";
					

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

function deleteContact(num) {
		
	if (confirm("Are you sure?"))
	{
		ID = num;
		let tmp = {ID: ID, userId: userId};

		let jsonPayload = JSON.stringify(tmp);

		let url = urlBase + '/DeleteContact.' + extension;

		let xhr = new XMLHttpRequest();
        	xhr.open("POST", url, true);
        	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        	try 
		{
        		xhr.onreadystatechange = function () 
			{
                		if (this.readyState == 4 && this.status == 200) 
				{
                    			document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted";
                		}
        		};
            	xhr.send(jsonPayload);
        	} 
		catch (err) 
		{
            		document.getElementById("contactDeleteResult").innerHTML = err.message;
        	}
		searchContact();
		
 	}   
}

function updateContact(num) {
	let ID = num;
	let f = "";
	let l = "";
	let p = "";
	let e = "";
	f = prompt("Enter change for first name. (Leave blank and press OK to keep the same)", "");
	l = prompt("Enter change for last name. (Leave blank and press OK to keep the same)", "");
	p = prompt("Enter change for phone number. (Leave blank and press OK to keep the same)", "");
	e = prompt("Enter change for email address. (Leave blank and press OK to keep the same)", "");

	
	var regex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

        if (p != "" && regex.test(p) == false) {
            	alert("Phone number is invalid");
		return;
        }
        
	var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

	if (e != "" && regex.test(e) == false) {
            	alert("Email address is invalid");
		return;
        }


	if (f != "")
	{
		let tmp = {ID: ID, newFirst: f};

		let jsonPayload = JSON.stringify(tmp);

		let url = urlBase + '/UpdateFirstName.' + extension;

		let xhr = new XMLHttpRequest();
        	xhr.open("POST", url, true);
        	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        	try 
		{
        		xhr.onreadystatechange = function () 
			{
                		if (this.readyState == 4 && this.status == 200) 
				{
                    			//document.getElementById("contactDeleteResult").innerHTML = "Contact has been updated";
                		}
        		};
            	xhr.send(jsonPayload);
        	} 
		catch (err) 
		{
            		document.getElementById("contactDeleteResult").innerHTML = err.message;
        	}
	}

	if (l != "")
	{
		let tmp = {ID: ID, newLast: l};

		let jsonPayload = JSON.stringify(tmp);

		let url = urlBase + '/UpdateLastName.' + extension;

		let xhr = new XMLHttpRequest();
        	xhr.open("POST", url, true);
        	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        	try 
		{
        		xhr.onreadystatechange = function () 
			{
                		if (this.readyState == 4 && this.status == 200) 
				{
                    			//document.getElementById("contactDeleteResult").innerHTML = "Contact has been updated";
                		}
        		};
            	xhr.send(jsonPayload);
        	} 
		catch (err) 
		{
            		document.getElementById("contactDeleteResult").innerHTML = err.message;
        	}
	}

	if (p != "")
	{
		let tmp = {ID: ID, newPhone: p};

		let jsonPayload = JSON.stringify(tmp);

		let url = urlBase + '/UpdatePhone.' + extension;

		let xhr = new XMLHttpRequest();
        	xhr.open("POST", url, true);
        	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        	try 
		{
        		xhr.onreadystatechange = function () 
			{
                		if (this.readyState == 4 && this.status == 200) 
				{
                    			//document.getElementById("contactDeleteResult").innerHTML = "Contact has been updated";
                		}
        		};
            	xhr.send(jsonPayload);
        	} 
		catch (err) 
		{
            		document.getElementById("contactDeleteResult").innerHTML = err.message;
        	}
	}

	if (e != "")
	{
		let tmp = {ID: ID, newEmail: e};

		let jsonPayload = JSON.stringify(tmp);

		let url = urlBase + '/UpdateEmail.' + extension;

		let xhr = new XMLHttpRequest();
        	xhr.open("POST", url, true);
        	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        	try 
		{
        		xhr.onreadystatechange = function () 
			{
                		if (this.readyState == 4 && this.status == 200) 
				{
                    			//document.getElementById("contactDeleteResult").innerHTML = "Contact has been updated";
                		}
        		};
            	xhr.send(jsonPayload);
        	} 
		catch (err) 
		{
            		document.getElementById("contactDeleteResult").innerHTML = err.message;
        	}
	}


	alert("Contact has been updated!");
	searchContact();
}



function checkRegister(fName, lName, user, pass) {

    var fNameErr = lNameErr = userErr = passErr = true;

    if (fName == "") {
        console.log("First name is blank");
    }
    else {
        console.log("First name is valid");
        fNameErr = false;
    }

    if (lName == "") {
        console.log("Last name is blank");
    }
    else {
        console.log("LastT name is valid");
        lNameErr = false;
    }

    if (user == "") {
        console.log("Username is blank");
    }
    else {
         console.log("Username is valid");
         userErr = false; 
    }

    if (pass == "") {
        console.log("Password is blank");
    }
    else {
        console.log("Password is valid");
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
        alert("First Name box empty");
    }
    else {
        console.log("First name is Valid");
        fNameErr = false;
    }

    if (lName == "") {
        alert("Last Name box empty");
    }
    else {
        console.log("Last name is Valid");
        lNameErr = false;
    }



    if (ph == "") {
        alert("Phone Number box empty");
    }
    else {
        var regex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

        if (regex.test(ph) == false) {
            alert("Phone number is invalid");
        }
        else {
            console.log("Phone number is valid");
            phErr = false;
        }
    }



    if (mail == "") {
        alert("Email address box is empty");
    }
    else {
        var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

        if (regex.test(mail) == false) {
            alert("Email Invalid");
        }
        else {
            console.log("Email is valid");
            mailErr = false;
        }
    }


    if ((fNameErr || lNameErr || phErr || mailErr) == true) {
        return false;

    }

    return true;

}
