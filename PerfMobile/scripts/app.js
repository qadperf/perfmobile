(function () {

    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    var app;

    // create an object to store the models for each view
    window.APP = {
        models: {
            home: {
                title: 'Home'
            },
            settings: {
                title: 'Settings'
            },
            contacts: {
                title: 'Contacts',
                ds: new kendo.data.DataSource({
                    data: [{
                        id: 1,
                        name: "Murali Ayyagari"
                    }, {
                        id: 2,
                        name: "Eddie O'Sullivan"
                    }, {
                        id: 3,
                        name: "David Hughes"
                    }, {
                        id: 4,
                        name: "Ray Kearney"
                    }]
                }),
                alert: function (e) {
                    alert(e.data.name);
                }
            },
            login: {
                title: 'Login',
                submit: function () {
                    if (!this.username) {
                        navigator.notification.alert("Username is required.");
                        return;
                    }

					/*
                    if (!this.password) {
                        navigator.notification.alert("Password is required.");
                        return;
                    } */
                    console.log(this.username);
                },
                logout: function (event) {
                    // Prevent going to the login page until the login call processes.
                    event.preventDefault();
                    el.Users.logout(function () {
                        this.loginView.set("username", "");
                        this.loginView.set("password", "");
                        window.location.href = "#login";
                    }, function () {
                        navigator.notification.alert("Unfortunately an error occurred logging out of your account.");
                    });
                },
				signInButton: function (e) {
					var username = document.getElementById("username").value;
					var password = document.getElementById("password").value;
					var servername = "plli03.qad.com";
					var tomcatPort = "40011";
					var webapp = "qad-central";
					var baseURL = "https://" + servername + ":" + tomcatPort + "/" + webapp;
					var apiName = "Login";
					var outputCSV = "";
					var requestType = "POST";
					var recordSize = "100";
					var requestURL;
					var browseId;

					// This section needs to be replaced by reading the APIs to run from a JSON file

					// Set up the JSON Header Information
					generateJSONResultHeader();
					// Login API
					requestURL = baseURL + "/j_spring_security_check?j_username=" + username + "&j_password=" + password;
					requestType = "POST";
					sendAPIRequest(requestURL, requestType, apiName, recordSize);

					// Sales 100 Records
					browseId = "mfg:so803";
					recordSize = "100";
					requestURL = baseURL + "/api/qracore/browses?browseId=" + browseId + "&page=1&pageSize=" + recordSize;
					apiName = "SalesOrder-100";
					requestType = "GET";
					sendAPIRequest(requestURL, requestType, apiName, recordSize);

					// Sales 10 Records
					browseId = "mfg:so803";
					recordSize = "10";
					requestURL = baseURL + "/api/qracore/browses?browseId=" + browseId + "&page=1&pageSize=" + recordSize;
					apiName = "SalesOrder-10";
					requestType = "GET";
					sendAPIRequest(requestURL, requestType, apiName, recordSize);

					// Item Browse 10 Records
					browseId = "mfg:gp340";
					recordSize = "10";
					requestURL = baseURL + "/api/qracore/browses?browseId=" + browseId + "&page=1&pageSize=" + recordSize;
					apiName = "ItemName-10";
					requestType = "GET";
					sendAPIRequest(requestURL, requestType, apiName, recordSize);

					// Item Browse 100 Records
					browseId = "mfg:gp340";
					recordSize = "100";
					requestURL = baseURL + "/api/qracore/browses?browseId=" + browseId + "&page=1&pageSize=" + recordSize;
					apiName = "ItemName-10";
					requestType = "GET";
					sendAPIRequest(requestURL, requestType, apiName, recordSize);

					// Item Count Browse
					requestURL = baseURL + "/api/qracore/browses/totalCount/?browseId=" + browseId;
					apiName = "ItemName-Count";
					requestType = "GET";
					sendAPIRequest(requestURL, requestType, apiName, recordSize);

					// Close the JSON
					generateJSONResultFooter();
				}
            }
        }
    };

    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {

        // hide the splash screen as soon as the app is ready. otherwise
        // Cordova will wait 5 very long seconds to do it for you.
        navigator.splashscreen.hide();

        app = new kendo.mobile.Application(document.body, {

            // you can change the default transition (slide, zoom or fade)
            transition: 'slide',

            // comment out the following line to get a UI which matches the look
            // and feel of the operating system
            skin: 'flat',

            // the application needs to know which view to load first
            initial: 'views/home.html'
        });

    }, false);

    function generateJSONResultHeader(){
		console.log('[');
		console.log('{');
		console.log('"test-info": {');
		console.log(' "ping": "171",');
		console.log('"location": "Limerick,Ireland",');
		console.log('"server": "PLLI03",');
		console.log(' "datetime": "11 Oct 2015 17:55:37"');
		console.log('},');
	}

	function generateJSONResultFooter(){
		console.log('}');
		console.log(']');
	}

    function sendAPIRequest(api_url,reqType, apiName, records){
		var outputCSV;
		var j = document.getElementById("test-results");
		j.innerHTML += "RUNNING: " + api_url;
		var xhttp = new XMLHttpRequest();
									xhttp.onreadystatechange = function () {
									if (xhttp.readyState === 4) {
										var endTime = +new Date();
										var timeDiff = endTime - currentTime;
										outputCSV = "API,ResponseTime(ms) <br>" + apiName + "," + timeDiff.toString();
										document.getElementById("test-results").innerHTML = outputCSV;
										console.log('"test-results": {');
										console.log('"api" : "' + apiName + '",');
										console.log('"duration": ' + timeDiff + ',' );
										console.log('"records" :' + records + ',');
										console.log('"size" : 0,');
										console.log('}');
									}
						}
							xhttp.open(reqType, api_url, true);
											xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
											xhttp.setRequestHeader("Accept-Language", "en-US,en;q=0.8");
											xhttp.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
											xhttp.setRequestHeader("Accept-Language", "en-US,en;q=0.8");
											xhttp.setRequestHeader("Cache-Control", "max-age=0");
											xhttp.setRequestHeader('Authorization','Basic bWZnQHFhZC5jb206');
											var currentTime = +new Date();
					xhttp.send();
	}

}());