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
                        name: 'Bob'
                    }, {
                        id: 2,
                        name: 'Mary'
                    }, {
                        id: 3,
                        name: 'John'
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

					var xhttp = new XMLHttpRequest();
					xhttp.onreadystatechange = function () {
							if (xhttp.readyState == 4) {
								var endTime = +new Date();
								var timeDiff = endTime - currentTime;
								outputCSV = "API,ResponseTime(ms) <br>" + apiName + "," + timeDiff.toString();
								document.getElementById("test-results").innerHTML = outputCSV;
								console.log("AllResponseHeaders");
								console.log(xhttp.getAllResponseHeaders());
								console.log("Response Time");
								console.log(" -> " + outputCSV);
								runBrowseRequest(outputCSV);
								//alert(apiName + ' Duration: ' + timeDiff.toString());
							}
						}
						// xhttp.open("POST", "https://plli03.qad.com:40011/qad-central/j_spring_security_check?j_username=mfg@qad.com&j_password=", true);
					xhttp.open("POST", baseURL + "/j_spring_security_check?j_username=" + username + "&j_password=" + password, true);
					xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					xhttp.setRequestHeader("Accept-Language", "en-US,en;q=0.8");
					xhttp.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
					xhttp.setRequestHeader("Accept-Language", "en-US,en;q=0.8");
					xhttp.setRequestHeader("Cache-Control", "max-age=0");
					xhttp.setRequestHeader('Authorization','Basic bWZnQHFhZC5jb206');
					var currentTime = +new Date();
					xhttp.send();
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
	
	function runBrowseRequest(outputCSV) {
	var username = document.getElementById("username").value;
	    var password = document.getElementById("password").value;
	    var servername = "plli03.qad.com";
	    var tomcatPort = "40011";
	    var webapp = "qad-central";
	    var baseURL = "https://" + servername + ":" + tomcatPort + "/" + webapp;
	    var apiName = "sales-order-100";

	    var xhttp = new XMLHttpRequest();
	    xhttp.onreadystatechange = function () {
	            if (xhttp.readyState == 4) {
	                var endTime = +new Date();
	                var timeDiff = endTime - currentTime;
	                outputCSV = outputCSV + "<br> " + apiName + "," + timeDiff.toString();
	                document.getElementById("test-results").innerHTML = outputCSV;
	                console.log("AllResponseHeaders");
	                console.log(xhttp.getAllResponseHeaders());
	                console.log("Response Time");
	                console.log(" -> " + outputCSV);
	                //alert(apiName + ' Duration: ' + timeDiff.toString());
	            }
	        }
	        // xhttp.open("POST", "https://plli03.qad.com:40011/qad-central/j_spring_security_check?j_username=mfg@qad.com&j_password=", true);
	    xhttp.open("GET", baseURL + "/api/qracore/browses?browseId=mfg:so803&page=1&pageSize=100", true);
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