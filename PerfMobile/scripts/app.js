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
                title: 'Results',
                drawAllCharts: function () {
                    var newChart;
					var testResults = '[{"api": "Create"},{"api": "Login"},{"api": "Login"}]';
                    var api = [];
                    var parseResultsJSON = JSON.parse(testResults);
                    for (i = 0; i < parseResultsJSON.length; i++) {
                        if (api.indexOf(parseResultsJSON[i].api) === -1) {
                            api.push(parseResultsJSON[i].api);
                        }
                    }
                    for (i = 0; i < api.length; i++) {
                        //console.log("API: " + api[i]);
                        newChart = document.createElement('div');
                        newChart.setAttribute("id", api[i]);
                        document.getElementById("charts").appendChild(newChart);
                        drawPerfChart(api[i], "data/perf-results.json");
                    }

                    function drawPerfChart(api, results) {
                        var id = "#" + api;
                        $(id).kendoChart({
                            theme: "Material",
                            renderAs: "svg",
                            dataSource: {
                                transport: {
                                    read: {
                                        url: results,
                                        dataType: "json"
                                    }
                                },
                                sort: {
                                    field: "datetime",
                                    dir: "asc"
                                },
                                filter: {
                                    "field": "api",
                                    "operator": "eq",
                                    "value": api
                                }
                            },
                            valueAxis: {
                                min: 0,
                                title: {
                                    text: "Milliseconds"
                                }
                            },
                            chartArea: {
                                width: $(window).width(),
                                height: $(window).height()
                            },
                            title: {
                                position: "top",
                                text: api
                            },
                            legend: {
                                position: "bottom"
                            },
                            seriesDefaults: {
                                type: "line",
                                style: "normal"
                            },
                            series: [
                                {
                                    field: "duration",
                                    name: "Duration"

                    },
                                {
                                    field: "ping",
                                    name: "Ping"
                    }
                ],
                            transitions: true
                        });
                    }
                }
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
                title: 'Run Test',
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
					//var username = "mfg@qad.com";
					//var password = "";
					//var servername = "plli03.qad.com";
					//var tomcatPort = "40011";
					//var webapp = "qad-central";
					//var baseURL = "https://" + servername + ":" + tomcatPort + "/" + webapp;
					// var apiName = "Login";


					// This section needs to be replaced by reading the APIs to run from a JSON file

					// jQuery to Read the JSON File for the APIs
					var myResult;
					$.when( $.ajax( "https://bs1.cdn.telerik.com/v1/InJzMMjAJq3F0qZ8/e826ec40-7260-11e5-a00b-c3dfcd47bf37" )).done(function(result) {

						myResult = result;

					obj = JSON.parse(myResult);

					// Read Connection Information
					var username = obj.serverinfo.username;
					var password = obj.serverinfo.password;
					var servername = obj.serverinfo.server;
					var tomcatPort = obj.serverinfo.tomcatport;
					var webapp = obj.serverinfo.tomcatwebapp;
					var baseURL = "https://" + servername + ":" + tomcatPort + "/" + webapp;
					var requestURL;

					// var outputCSV = "";
					var requestType = "POST";
					var recordSize = "100";
					var apiTestResults = "";
					var pingTime = "170";
					var location = "Limerick, Ireland";
					var dateTime = "14 Oct 2015 11:19:00";

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

	function loadInitialSettings(){

		if (window.localStorage.getItem("cards") === null) {
			localStorage.setItem("cards", AppData.getInitialSettings());
		}

		settingsViewModel.loadFromLocalStorage();
	}

	var AppData = function() {
		var initialSettings,
			settingCache;

		initialSettings =
		[
			{
			"serverinfo":
			{
				"username": "mfg@qad.com",
				"password": "",
				"server": "plli03.qad.com",
				"tomcatport": "40011",
				"tomcatwebapp": "qad-central"
			},
			"apis":
			[
				{
					"type": "POST",
					"name": "Login",
					"api": "qad-central/j_spring_security_check?j_username=mfg@qad.com&j_password="
				},
				{
					"type": "GET",
					"name": "Sales-100",
					"api": "api/qracore/browses?browseId=mfg:so803&page=1&pageSize=100"
				},
				{
					"type": "GET",
					"name": "Sales-10",
					"api": "api/qracore/browses?browseId=mfg:so803&page=1&pageSize=10"
				},
				{
					"type": "GET",
					"name": "Item-100",
					"api": "api/qracore/browses?browseId=mfg:gp340&page=1&pageSize=100"
				},
				{
					"type": "GET",
					"name": "Item-10",
					"api": "api/qracore/browses?browseId=mfg:gp340&page=1&pageSize=10"
				},
				{
					"type": "GET",
					"name": "Item-10",
					"api": "api/qracore/browses/totalCount/?browseId=mfg:gp340"
				}
				]
			}
		];

		settingCache = {
			load: function(route, options) {
				var path = route.path,
					verb = route.verb,
					dfd = new $.Deferred();

				console.log("GETTING", path, verb, options);

				//Return cached data if available (and fresh)
				if (verb === "GET" && settingCache.checkCache(path) === true) {
					//Return cached data
					dfd.resolve(settingCache.getCache(path));
				}
				else {
					//Get fresh data
					$.ajax({
						type: verb,
						url: path,
						data: options,
						dataType: "json"
					}).success(function (data, code, xhr) {
						settingCache.setCache(path, {
							data: data,
							expires: new Date(new Date().getTime() + (15 * 60000)) //+15min
						});
						dfd.resolve(data, code, xhr);
					}).error(function (e, r, m) {
						console.log("ERROR", e, r, m);
						dfd.reject(m);
					});
				}

				return dfd.promise();
			},

			checkCache: function(path) {
				var data,
				path = JSON.stringify(path);

				try {
					data = JSON.parse(localStorage.getItem(path));

					if (data === null || data.expires <= new Date().getTime()) {
						console.log("CACHE EMPTY", path);
						return false;
					}
				}
				catch (err) {
					console.log("CACHE CHECK ERROR", err);
					return false;
				}

				console.log("CACHE CHECK", true, path);
				return true;
			},

			setCache: function(path, data, expires) {
				var cache = {
					data: data,
					expires: expires
				},
				path = JSON.stringify(path);

				//TODO: Serialize JSON object to string
				localStorage.setItem(path, JSON.stringify(cache));

				console.log("CACHE SET", cache, new Date(expires), path);
			},

			getCache: function(path) {
				var path = JSON.stringify(path),
				cache = JSON.parse(localStorage.getItem(path));

				console.log("LOADING FROM CACHE", cache, path);

				//TODO: Deserialize JSON string
				return cache.data.data;
			}
		};

		return {
			getInitialSettings: function() {
				return JSON.stringify(initialSettings);
			}
		};
	}
}());