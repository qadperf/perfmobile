(function () {

    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    var app;
    var everlive = new Everlive("InJzMMjAJq3F0qZ8");

    // create an object to store the models for each view
    window.APP = {
        models: {
            home: {
                title: 'Home'
            },
            settings: {
                title: 'Settings'
            },
            results: {
                title: 'Results'

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
					// var username = document.getElementById("username").value;
					// var password = document.getElementById("password").value;
					var username = "mfg@qad.com";
					var password = "";
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
					var apiTestResults = "";
					var pingTime = "170";
					var location = "Limerick, Ireland";
					var dateTime = "14 Oct 2015 11:19:00";


					// This section needs to be replaced by reading the APIs to run from a JSON file

					// jQuery to Read the JSON File for the APIs
					var myResult;
					$.when( $.ajax( "https://bs3.cdn.telerik.com/v1/InJzMMjAJq3F0qZ8/afb35710-7259-11e5-81d6-bdefd425fbc7" )).done(function(result) {
						myResult = result;

					obj = JSON.parse(myResult);



					for (i = 0; i < obj.apis.length; i++) {
					    requestURL = baseURL + "/" + obj.apis[i].api;
					    requestType = obj.apis[i].type;
					    apiName = obj.apis[i].name;
					    //sendAPIRequest(requestURL, requestType, apiName, recordSize);
					    if(i == (obj.apis.length - 1)){
							apiTestResults = sendAPIRequestJQuery(requestURL, requestType, apiName, recordSize, "yes", servername, pingTime, location, dateTime, apiTestResults);
						}
						else {
							apiTestResults = sendAPIRequestJQuery(requestURL, requestType, apiName, recordSize, "no", servername, pingTime, location, dateTime, apiTestResults);
						}
					}

					// Set JSON Headers and Footers
					apiTestResults = "[" + apiTestResults + "]";
					console.log(apiTestResults);

					var parseResultsJSON = JSON.parse(apiTestResults);
					for (i = 0; i < parseResultsJSON.length; i++) {
						console.log("API: " + parseResultsJSON[i].api);
					}
					});
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
            initial: 'views/runTest.html'
        });

    }, false);

    function generateJSONResultHeader(){
		console.log('[');
	}

	function generateJSONResultFooter(){
		console.log(']');
	}

	function getJSONAPIFile(){
		alert('read-json-file');
		//$.get("https://bs2.cdn.telerik.com/v1/InJzMMjAJq3F0qZ8/b8347810-71af-11e5-a0f8-3f206d96dc1a").then(function(result) { console.log(result)});
		$.when($.get("https://bs2.cdn.telerik.com/v1/InJzMMjAJq3F0qZ8/b8347810-71af-11e5-a0f8-3f206d96dc1a")).then(function(result) { console.log(result)});
		alert('read-json-file-complete');
		//$.when($.get("https://bs2.cdn.telerik.com/v1/InJzMMjAJq3F0qZ8/b8347810-71af-11e5-a0f8-3f206d96dc1a"))).then(readJSONFile(result);

	}

	function readJSONFile(result){
		console.log(result);
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
							xhttp.open(reqType, api_url, false);
											xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
											xhttp.setRequestHeader("Accept-Language", "en-US,en;q=0.8");
											xhttp.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
											xhttp.setRequestHeader("Accept-Language", "en-US,en;q=0.8");
											xhttp.setRequestHeader("Cache-Control", "max-age=0");
											xhttp.setRequestHeader('Authorization','Basic bWZnQHFhZC5jb206');
											var currentTime = +new Date();
					xhttp.send();
	}

	function sendAPIRequestJQuery(api_url,reqType, apiName, records, finalAPI, servername, pingTime, location, dateTime, currentResults){

		//xhttp.setRequestHeader('Authorization','Basic bWZnQHFhZC5jb206');


		var currentTime = +new Date();
		var outputCSV;
		var updateResult = currentResults;
		document.getElementById("test-results").innerHTML = "TEST-RAY: " + apiName;
		$.when( $.ajax({method: reqType, async: false, url: api_url })).done(function(result) {
			var endTime = +new Date();
			var timeDiff = endTime - currentTime;
			outputCSV = "API,ResponseTime(ms) <br>" + apiName + "," + timeDiff.toString();
			updateResult = updateResult + '{' + '"ping" : "' + pingTime + '",' + '"location" : "' + location + '",' + '"server" : "' + servername + '",' + '"datetime" : "' + dateTime + '",' + '"api" : "' + apiName + '",' + '"duration": ' + timeDiff + ',' + '"records" :' + records + ',' + '"size" : 0';
			console.log('{');
			console.log('"ping" : "' + pingTime + '",');
			console.log('"location" : "' + location + '",');
			console.log('"server" : "' + servername + '",');
			console.log('"datetime" : "' + dateTime + '",');
			console.log('"api" : "' + apiName + '",');
			console.log('"duration": ' + timeDiff + ',' );
			console.log('"records" :' + records + ',');
			console.log('"size" : 0');
			if(finalAPI == "yes"){
				updateResult = updateResult + '}';
				console.log('}');
				}
			else{
				console.log('},');
				updateResult = updateResult + '},';
				}
			document.getElementById("test-results").innerHTML = "API-Running-Complete" + outputCSV;
			});
			return updateResult;
	}
}());