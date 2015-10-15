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

					latestResults = new FileSystemHelper();
					latestResults.readTextFromFile("latest-results.json",function(result){

					var parseResultsJSON = JSON.parse(result);

					$("#latest").kendoChart({
							theme: "Material",
							dataSource: {
								data: parseResultsJSON
							},
							valueAxis: {
								min: 0,
								title: {
									text: "Milliseconds"
								}
							},
							chartArea: {
								width: $(window).width(),
								height: $(window).height()-110,
							},
							title: {
								position: "top",
								text: "Latest Results"
							},
							legend: {
								position: "bottom"
							},
							seriesDefaults: {
								type: "bar",
								style: "normal"
							},
							series: [
								{
									field: "duration",
									name: "Duration"

								}
							],
							categoryAxis: {
									field: "api"
							},
							transitions: true
						});
                	},function(error){});


					// Read results file in local storage and process results if successfully read
					allResults = new FileSystemHelper();
					allResults.readTextFromFile("api-test-results.json",function(result){

						var newChart;
						var api = [];
						var parseResultsJSON = JSON.parse(result);

						// Get unique api names for filtering
						for (i = 0; i < parseResultsJSON.length; i++) {
							if (api.indexOf(parseResultsJSON[i].api) === -1) {
								api.push(parseResultsJSON[i].api);
							}
						}

						//Create div and graph for each api
						for (i = 0; i < api.length; i++) {
							newChart = document.createElement('div');
							newChart.setAttribute("id", api[i]);
							document.getElementById("charts").appendChild(newChart);
							drawPerfChart(api[i], parseResultsJSON);
						}

						function drawPerfChart(api, parseResultsJSON) {
							var id = "#" + api;
							$(id).kendoChart({
								theme: "Material",
								dataSource: {
									data: parseResultsJSON,
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
									height: $(window).height()-120
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
                	},function(error){});
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

					readConfigFile = new FileSystemHelper();
					// readConfigFile.readTextFromFile("application-configuration.json",function(result){var parseResultsJSON = JSON.parse(result);},function(error){});

					//$.when( $.ajax( "https://bs1.cdn.telerik.com/v1/InJzMMjAJq3F0qZ8/e826ec40-7260-11e5-a00b-c3dfcd47bf37" )).done(function(result) {
					readConfigFile.readTextFromFile("application-configuration.json",function(result){

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

					requestURL = baseURL + "/" + "resources/qad/webshell/style/img/homepage.png";
					pingTime = Math.floor(Math.random()*(230-160+1)+160);

					// getPing(requestURL,"GET");

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
					// Store the results
					//writeResultsFile("api-test-results.json", apiTestResults);
					updateResultsFile("api-test-results.json", apiTestResults);
					console.log("----create-item-----");
				// testCreateAPIEOS();
					},
										function(error){
											console.log("FileDoesNotExist");
											var initConfig = '{"serverinfo": {"username": "mfg@qad.com","password": "","server": "plli03.qad.com","tomcatport": "40011","tomcatwebapp": "qad-central"},';
											document.getElementById("test-results").innerHTML = "ERROR <BR> No Server or APIS configured <BR> Use Settings to Configure Application";

											initConfig = initConfig + '"apis": [';
											initConfig = initConfig + '{"type": "POST","name": "Login","api": "j_spring_security_check?j_username=mfg@qad.com&j_password="},{"type": "GET","name": "Menus","api": "api/webshell/menu"},';
											initConfig = initConfig + '{"type": "GET","name": "Sales-100","api": "api/qracore/browses?browseId=mfg:so803&page=1&pageSize=100"},';
											initConfig = initConfig + '{"type": "GET","name": "Sales-10","api": "api/qracore/browses?browseId=mfg:so803&page=1&pageSize=10"},';
											initConfig = initConfig + '{"type": "GET","name": "Item-100","api": "api/qracore/browses?browseId=mfg:gp340&page=1&pageSize=100"},';
											initConfig = initConfig + '{"type": "GET","name": "Item-10","api": "api/qracore/browses?browseId=mfg:gp340&page=1&pageSize=10"},';
											initConfig = initConfig + '{"type": "GET","name": "Item-Count","api": "api/qracore/browses/totalCount/?browseId=mfg:gp340"}';
											initConfig = initConfig + ']';
											console.log("--------------------------");
											console.log(initConfig);

										});
										// create and delete APIs
									   createAPI();
                                       deleteAPI();
				}
            }
        }
    };

    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {

        // hide the splash screen as soon as the app is ready. otherwise
        // Cordova will wait 5 very long seconds to do it for you.
        // navigator.splashscreen.hide();

        app = new kendo.mobile.Application(document.body, {

            // you can change the default transition (slide, zoom or fade)
            transition: 'slide',

            // comment out the following line to get a UI which matches the look
            // and feel of the operating system
            skin: 'flat',

            // the application needs to know which view to load first
            initial: 'views/runTest.html'
        });

	//reload charts when orientation changes
	window.addEventListener("orientationchange", function() {
		if($('#charts').length){
	    	APP.models.results.drawAllCharts();
		}
	});


    }, false);
    function writeResultsFile(filename, jsonResults){
		fileSystemHelper = new FileSystemHelper();
		fileSystemHelper.writeLine(filename, jsonResults, function(result){console.log("file created");},function(error){console.log("file create failed");} );
	}

	function updateResultsFile(filename, latestResults){
		var storeLatestResults = "latest-results.json";
		fileSystemHelper = new FileSystemHelper();
		fileSystemHelper.readTextFromFile(filename,
			function(result){
				console.log("old-results");
				console.log(result);
				console.log("latest results");
				console.log(latestResults);
				var parseResultsJSON = JSON.parse(result);

				// parseResultsJSON.push({ping : "170", location : "Limerick", server : "plli03new.qad.com", datetime : "now", api : "test", duration : "150", records : "0", size : "0"});
				var lastestJSONResults = JSON.parse(latestResults);
				// Now we need to merge the results
				for (i = 0; i < lastestJSONResults.length; i++) {
					parseResultsJSON.push({ping : lastestJSONResults[i].ping, location : lastestJSONResults[i].location, server : lastestJSONResults[i].server, datetime : lastestJSONResults[i].datetime, api : lastestJSONResults[i].api, duration : lastestJSONResults[i].duration, records : lastestJSONResults[i].records, size : lastestJSONResults[i].size});
				}

				console.log("-----MergedData------");
				var mergedResults = JSON.stringify(parseResultsJSON);
				console.log(mergedResults);

				// Write the latest results file
				fileSystemHelper.writeLine(filename, mergedResults, function(result){console.log("file created");},function(error){console.log("file create failed");} );
				fileSystemHelper.writeLine(storeLatestResults, latestResults, function(result){console.log("file created");app.navigate("views/results.html");},function(error){console.log("file create failed");} );

				// window.location.href = "views/results.html";
				//app.navigate("#results-screen");

			},
			function(error){
				console.log("read file failed");
				fileSystemHelper.writeLine(filename, latestResults, function(result){console.log("file created");},function(error){console.log("file create failed");} );
				fileSystemHelper.writeLine(storeLatestResults, latestResults, function(result){console.log("file created");app.navigate("views/results.html");},function(error){console.log("file create failed");} );
			}
		);
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
		$.when( $.ajax({method: reqType, async: false, url: api_url })).done(function(data, status, xhr) {
			var endTime = +new Date();
			var timeDiff = endTime - currentTime;
			outputCSV = "API,ResponseTime(ms) <br>" + apiName + "," + timeDiff.toString();
			updateResult = updateResult + '{' + '"ping" : "' + pingTime + '",' + '"location" : "' + location + '",' + '"server" : "' + servername + '",' + '"datetime" : "' + xhr.getResponseHeader("Date") + '",' + '"api" : "' + apiName + '",' + '"duration": ' + timeDiff + ',' + '"records" :' + records + ',' + '"size" : 0';
			console.log('{');
			console.log('"ping" : "' + pingTime + '",');
			console.log('"location" : "' + location + '",');
			console.log('"server" : "' + servername + '",');
			console.log('"datetime" : "' + dateTime + '",');
			console.log('"api" : "' + apiName + '",');
			console.log('"duration": ' + timeDiff + ',' );
			console.log('"records" :' + records + ',');
			console.log('"size" : 0');
			console.log(xhr.getAllResponseHeaders());
			console.log(xhr.getResponseHeader("Date"));
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

    function createAPI() {
                    var servername = "plli03.qad.com";
                    var tomcatPort = "40011";
                    var webapp = "qad-central";
                    var baseURL = "https://" + servername + ":" + tomcatPort + "/" + webapp;
                    var requestURL;

                    requestURL = baseURL + "/api/erp/items";
                    apiName = "CREATE ItemID-MYADEMO-03";
                    var jsonItem = {
                    "supplementaryMessages":[],
                    "items":[{
                    "lastModifiedDate":null,"model":"","sourceType":"","purchaseManufactureCode":"","domainCode":"10USA","commodityCode":"","productLine":"10","itemCode":"MYADEMO-03","siteCode":"10-100","unitOfMeasure":"EA","fiscalClass":"","dataOperation":"","concurrencyHash":"","itemType":"","lastModifiedUser":"","customDate1":null,"customDate2":null,"customDate3":null,"customDate4":null,"customDate5":null,"customDecimal0":0,"customNote":"","customDecimal1":0,"customDecimal2":0,"customDecimal3":0,"customDecimal4":0,"customInteger0":0,"customInteger1":0,"customInteger2":0,"customInteger3":0,"customInteger4":0,"customLong0":"","customLong1":"","customShort0":"","customShort1":"","customShort2":"","customShort3":"","customShort4":"","customShort5":"","customShort6":"","customShort7":"","customShort8":"","customShort9":"","customShort10":"","customShort11":"","customShort12":"","customShort13":"","customShort14":"","customShort15":"","customShort16":"","customShort17":"","customShort18":"","customShort19":"","taxClass":"","currentCostTotal":{"currentCostDetails":[{"isPrimary":true,"lowerLevelCost":0,"isAddOn":false,"costTotal":0,"thisLevelCost":0,"element":"Burden","lastModifiedDate":null,"category":"Burden","dataOperation":"C","concurrencyHash":"","lastModifiedUser":"","customDate1":null,"customDate2":null,"customDate3":null,"customDate4":null,"customDate5":null,"customDecimal0":0,"customNote":"","customDecimal1":0,"customDecimal2":0,"customDecimal3":0,"customDecimal4":0,"customInteger0":0,"customInteger1":0,"customInteger2":0,"customInteger3":0,"customInteger4":0,"customLong0":"","customLong1":"","customShort0":"","customShort1":"","customShort2":"","customShort3":"","customShort4":"","customShort5":"","customShort6":"","customShort7":"","customShort8":"","customShort9":"","customShort10":"","customShort11":"","customShort12":"","customShort13":"","customShort14":"","customShort15":"","customShort16":"","customShort17":"","customShort18":"","customShort19":"","sequence":0,"uri":"urn:be:com.qad.base.item.IItem:10USA..10-100.Current.Burden","QADC01":"","QADC02":"","QADT01":null,"QADD01":0},{"isPrimary":true,"lowerLevelCost":0,"isAddOn":false,"costTotal":0,"thisLevelCost":0,"element":"Labor","lastModifiedDate":null,"category":"Labor","dataOperation":"C","concurrencyHash":"","lastModifiedUser":"","customDate1":null,"customDate2":null,"customDate3":null,"customDate4":null,"customDate5":null,"customDecimal0":0,"customNote":"","customDecimal1":0,"customDecimal2":0,"customDecimal3":0,"customDecimal4":0,"customInteger0":0,"customInteger1":0,"customInteger2":0,"customInteger3":0,"customInteger4":0,"customLong0":"","customLong1":"","customShort0":"","customShort1":"","customShort2":"","customShort3":"","customShort4":"","customShort5":"","customShort6":"","customShort7":"","customShort8":"","customShort9":"","customShort10":"","customShort11":"","customShort12":"","customShort13":"","customShort14":"","customShort15":"","customShort16":"","customShort17":"","customShort18":"","customShort19":"","sequence":0,"uri":"urn:be:com.qad.base.item.IItem:10USA..10-100.Current.Labor","QADC01":"","QADC02":"","QADT01":null,"QADD01":0},{"isPrimary":true,"lowerLevelCost":0,"isAddOn":false,"costTotal":0,"thisLevelCost":0,"element":"Material","lastModifiedDate":null,"category":"Material","dataOperation":"C","concurrencyHash":"","lastModifiedUser":"","customDate1":null,"customDate2":null,"customDate3":null,"customDate4":null,"customDate5":null,"customDecimal0":0,"customNote":"","customDecimal1":0,"customDecimal2":0,"customDecimal3":0,"customDecimal4":0,"customInteger0":0,"customInteger1":0,"customInteger2":0,"customInteger3":0,"customInteger4":0,"customLong0":"","customLong1":"","customShort0":"","customShort1":"","customShort2":"","customShort3":"","customShort4":"","customShort5":"","customShort6":"","customShort7":"","customShort8":"","customShort9":"","customShort10":"","customShort11":"","customShort12":"","customShort13":"","customShort14":"","customShort15":"","customShort16":"","customShort17":"","customShort18":"","customShort19":"","sequence":0,"uri":"urn:be:com.qad.base.item.IItem:10USA..10-100.Current.Material","QADC01":"","QADC02":"","QADT01":null,"QADD01":0},{"isPrimary":true,"lowerLevelCost":0,"isAddOn":false,"costTotal":0,"thisLevelCost":0,"element":"Overhead","lastModifiedDate":null,"category":"Overhead","dataOperation":"C","concurrencyHash":"","lastModifiedUser":"","customDate1":null,"customDate2":null,"customDate3":null,"customDate4":null,"customDate5":null,"customDecimal0":0,"customNote":"","customDecimal1":0,"customDecimal2":0,"customDecimal3":0,"customDecimal4":0,"customInteger0":0,"customInteger1":0,"customInteger2":0,"customInteger3":0,"customInteger4":0,"customLong0":"","customLong1":"","customShort0":"","customShort1":"","customShort2":"","customShort3":"","customShort4":"","customShort5":"","customShort6":"","customShort7":"","customShort8":"","customShort9":"","customShort10":"","customShort11":"","customShort12":"","customShort13":"","customShort14":"","customShort15":"","customShort16":"","customShort17":"","customShort18":"","customShort19":"","sequence":0,"uri":"urn:be:com.qad.base.item.IItem:10USA..10-100.Current.Overhead","QADC01":"","QADC02":"","QADT01":null,"QADD01":0},{"isPrimary":true,"lowerLevelCost":0,"isAddOn":false,"costTotal":0,"thisLevelCost":0,"element":"Subcontr","lastModifiedDate":null,"category":"Subcontract","dataOperation":"C","concurrencyHash":"","lastModifiedUser":"","customDate1":null,"customDate2":null,"customDate3":null,"customDate4":null,"customDate5":null,"customDecimal0":0,"customNote":"","customDecimal1":0,"customDecimal2":0,"customDecimal3":0,"customDecimal4":0,"customInteger0":0,"customInteger1":0,"customInteger2":0,"customInteger3":0,"customInteger4":0,"customLong0":"","customLong1":"","customShort0":"","customShort1":"","customShort2":"","customShort3":"","customShort4":"","customShort5":"","customShort6":"","customShort7":"","customShort8":"","customShort9":"","customShort10":"","customShort11":"","customShort12":"","customShort13":"","customShort14":"","customShort15":"","customShort16":"","customShort17":"","customShort18":"","customShort19":"","sequence":0,"uri":"urn:be:com.qad.base.item.IItem:10USA..10-100.Current.Subcontr","QADC01":"","QADC02":"","QADT01":null,"QADD01":0}],"lowerLevelLabor":0,"thisLevelOverhead":0,"lowerLevelOverhead":0,"thisLevelBurden":0,"lowerLevelBurden":0,"thisLevelSubcontract":0,"lowerLevelSubcontract":0,"thisLevelTotal":0,"lowerLevelTotal":0,"costTotal":0,"costSetMethod":"AVG","costSet":"Current","dateUpdated":"2015-10-13T07:00:00.000Z","thisLevelMaterial":0,"lowerLevelMaterial":0,"thisLevelLabor":0,"lastModifiedDate":null,"siteCode":"10-100","dataOperation":"C","concurrencyHash":"","lastModifiedUser":"","customDate1":null,"customDate2":null,"customDate3":null,"customDate4":null,"customDate5":null,"customDecimal0":0,"customNote":"","customDecimal1":0,"customDecimal2":0,"customDecimal3":0,"customDecimal4":0,"customInteger0":0,"customInteger1":0,"customInteger2":0,"customInteger3":0,"customInteger4":0,"customLong0":"","customLong1":"","customShort0":"","customShort1":"","customShort2":"","customShort3":"","customShort4":"","customShort5":"","customShort6":"","customShort7":"","customShort8":"","customShort9":"","customShort10":"","customShort11":"","customShort12":"","customShort13":"","customShort14":"","customShort15":"","customShort16":"","customShort17":"","customShort18":"","customShort19":"","uri":"urn:be:com.qad.base.item.IItem:10USA..10-100.Current","QADC01":"","QADC02":"","QADT01":null,"QADD01":0},"description2":"","unitOfMeasureGroup":"","itemGroup":"","itemStatus":"ACTIVE","designGroup":"","drawing":"","drawingLocation":"","drawingSize":"","itemRevision":"","barcode":"","alternateBarcode":"","addedDate":"2015-10-13T07:00:00.000Z","serialControl":"N","serialControlLabel":"Never","lotSerialControl":"","locationType":"","isAutomaticLotNumbers":false,"lotGroup":"","articleNumber":"","averageInterval":90,"cycleCountInterval":120,"shelfLife":0,"isKeyItem":false,"isAllocateSingleLot":false,"isPOReceiptStatusActive":false,"isWOReceiptStatusActive":false,"memoOrderType":"","listPrice":0,"priceBreakCategory":"","isTaxable":true,"fiscalClassDescription":"","freightClass":"","tradeClass":"","shipWeight":0,"shipWeightUnitOfMeasure":"","netWeight":0,"netWeightUnitOfMeasure":"","volume":0,"volumeUnitOfMeasure":"","isMasterScheduled":true,"isPlanOrder":true,"timeFence":0,"isMRPRequired":true,"orderPolicy":"POQ","orderQuantity":0,"batchQuantity":1,"orderPeriod":7,"safetyStock":0,"safetyTime":0,"reorderPoint":0,"isIssuePolicy":true,"buyer":"","supplier":"","configurationType":"","isInspect":false,"inspectionLeadTime":0,"manufacturingLeadTime":0,"cumulativeLeadTime":0,"purchasingLeadTime":0,"isFamilyATP":false,"runSequence1":"","runSequence2":"","isPhantom":false,"minimumOrder":0,"maximumOrder":0,"orderMultiple":0,"isOperationBasedYield":false,"yieldPercentage":100,"runTime":0,"setupTime":0,"isAutoEMTProcessing":false,"networkCode":"","routingCode":"","replenishmentMethod":"Orders","configuratorGenericItemType":"","jointType":"","lowLevelRun":0,"lowLevelSetUp":0,"lowLevelCode":0,"lowLevelDRP":0,"shelfLifeOffset":0,"criticalDays":0,"warehouseItemType":"","replenishmentType":"","popularity":"","isSinglePutAwayTrans":false,"issueMethod":"","isPrintId":false,"opportunityCountThreshold":0,"sameDayWindow1":0,"sameDayWindow2":0,"sameDayWindow3":0,"sameDayWindow4":0,"sameDayWindow5":0,"sameDayWindow6":0,"sameDayWindow7":0,"sameDayWindow8":0,"daysFromExpire1":0,"daysFromExpire2":0,"daysFromExpire3":0,"daysFromExpire4":0,"daysFromExpire5":0,"daysFromExpire6":0,"daysFromExpire7":0,"daysFromExpire8":0,"isSelectiveInspection":false,"inspectionFrequency":0,"inspectionDays":0,"randomInspectionPercent":0,"sampleQuantity":0,"isInspectionReference":false,"samplePercent":0,"isInspectionDestructive":false,"warrantyCode":"","systemType":"",
                    "isInstalledBase":false,"isISBUnitQuantity":false,"coverage":"","supplierWarranty":false,"isFieldReplaceable":false,"isInstallationCall":false,"isRepairable":false,"preventMaintDays":0,"preventMaintBOM":"","preventMaintRoute":"","repairBOM":"","repairRoute":"","repairSupplier":"","installationBOM":"","installationRoute":"","usageCode":"","serviceGroup":"","serviceCategory":"","meanTimeBtwFailure":0,"meanTimeToRepair":0,"mfgMTBtwFailure":0,"mfgMTToRepair":0,"stdTimeToRepair":0,"classification":"","weeksAvgCov":0,"weeksMaxCov":0,"weeksMinCov":0,"itemID":0,"description":"MYADEMO-03 Description","location":"","uri":"urn:be:com.qad.base.item.IItem:10USA.","GLCostTotal":{"GLCostDetails":[{"isPrimary":true,"lowerLevelCost":0,"isAddOn":false,"costTotal":0,"thisLevelCost":0,"element":"Burden","lastModifiedDate":null,"category":"Burden","dataOperation":"C","concurrencyHash":"","lastModifiedUser":"","customDate1":null,"customDate2":null,"customDate3":null,"customDate4":null,"customDate5":null,"customDecimal0":0,"customNote":"","customDecimal1":0,"customDecimal2":0,"customDecimal3":0,"customDecimal4":0,"customInteger0":0,"customInteger1":0,"customInteger2":0,"customInteger3":0,"customInteger4":0,"customLong0":"","customLong1":"","customShort0":"","customShort1":"","customShort2":"","customShort3":"","customShort4":"","customShort5":"","customShort6":"","customShort7":"","customShort8":"","customShort9":"","customShort10":"","customShort11":"","customShort12":"","customShort13":"","customShort14":"","customShort15":"","customShort16":"","customShort17":"","customShort18":"","customShort19":"","sequence":0,"uri":"urn:be:com.qad.base.item.IItem:10USA..10-100.Standard.Burden","QADC01":"","QADC02":"","QADT01":null,"QADD01":0},{"isPrimary":true,"lowerLevelCost":0,"isAddOn":false,"costTotal":0,"thisLevelCost":0,"element":"Labor","lastModifiedDate":null,"category":"Labor","dataOperation":"C","concurrencyHash":"","lastModifiedUser":"","customDate1":null,"customDate2":null,"customDate3":null,"customDate4":null,"customDate5":null,"customDecimal0":0,"customNote":"","customDecimal1":0,"customDecimal2":0,"customDecimal3":0,"customDecimal4":0,"customInteger0":0,"customInteger1":0,"customInteger2":0,"customInteger3":0,"customInteger4":0,"customLong0":"","customLong1":"","customShort0":"","customShort1":"","customShort2":"","customShort3":"","customShort4":"","customShort5":"","customShort6":"","customShort7":"","customShort8":"","customShort9":"","customShort10":"","customShort11":"","customShort12":"","customShort13":"","customShort14":"","customShort15":"","customShort16":"","customShort17":"","customShort18":"","customShort19":"","sequence":0,"uri":"urn:be:com.qad.base.item.IItem:10USA..10-100.Standard.Labor","QADC01":"","QADC02":"","QADT01":null,"QADD01":0},{"isPrimary":true,"lowerLevelCost":0,"isAddOn":false,"costTotal":0,"thisLevelCost":0,"element":"Material","lastModifiedDate":null,"category":"Material","dataOperation":"C","concurrencyHash":"","lastModifiedUser":"","customDate1":null,"customDate2":null,"customDate3":null,"customDate4":null,"customDate5":null,"customDecimal0":0,"customNote":"","customDecimal1":0,"customDecimal2":0,"customDecimal3":0,"customDecimal4":0,"customInteger0":0,"customInteger1":0,"customInteger2":0,"customInteger3":0,"customInteger4":0,"customLong0":"","customLong1":"","customShort0":"","customShort1":"","customShort2":"","customShort3":"","customShort4":"","customShort5":"","customShort6":"","customShort7":"","customShort8":"","customShort9":"","customShort10":"","customShort11":"","customShort12":"","customShort13":"","customShort14":"","customShort15":"","customShort16":"","customShort17":"","customShort18":"","customShort19":"","sequence":0,"uri":"urn:be:com.qad.base.item.IItem:10USA..10-100.Standard.Material","QADC01":"","QADC02":"","QADT01":null,"QADD01":0},{"isPrimary":true,"lowerLevelCost":0,"isAddOn":false,"costTotal":0,"thisLevelCost":0,"element":"Overhead","lastModifiedDate":null,"category":"Overhead","dataOperation":"C","concurrencyHash":"","lastModifiedUser":"","customDate1":null,"customDate2":null,"customDate3":null,"customDate4":null,"customDate5":null,"customDecimal0":0,"customNote":"","customDecimal1":0,"customDecimal2":0,"customDecimal3":0,"customDecimal4":0,"customInteger0":0,"customInteger1":0,"customInteger2":0,"customInteger3":0,"customInteger4":0,"customLong0":"","customLong1":"","customShort0":"","customShort1":"","customShort2":"","customShort3":"","customShort4":"","customShort5":"","customShort6":"","customShort7":"","customShort8":"","customShort9":"","customShort10":"","customShort11":"","customShort12":"","customShort13":"","customShort14":"","customShort15":"","customShort16":"","customShort17":"","customShort18":"","customShort19":"","sequence":0,"uri":"urn:be:com.qad.base.item.IItem:10USA..10-100.Standard.Overhead","QADC01":"","QADC02":"","QADT01":null,"QADD01":0},{"isPrimary":true,"lowerLevelCost":0,"isAddOn":false,"costTotal":0,"thisLevelCost":0,"element":"Subcontr","lastModifiedDate":null,"category":"Subcontract","dataOperation":"C","concurrencyHash":"","lastModifiedUser":"","customDate1":null,"customDate2":null,"customDate3":null,"customDate4":null,"customDate5":null,"customDecimal0":0,"customNote":"","customDecimal1":0,"customDecimal2":0,"customDecimal3":0,"customDecimal4":0,"customInteger0":0,"customInteger1":0,"customInteger2":0,"customInteger3":0,"customInteger4":0,"customLong0":"","customLong1":"","customShort0":"","customShort1":"","customShort2":"","customShort3":"","customShort4":"","customShort5":"","customShort6":"","customShort7":"","customShort8":"","customShort9":"","customShort10":"","customShort11":"","customShort12":"","customShort13":"","customShort14":"","customShort15":"","customShort16":"","customShort17":"","customShort18":"","customShort19":"","sequence":0,"uri":"urn:be:com.qad.base.item.IItem:10USA..10-100.Standard.Subcontr","QADC01":"","QADC02":"","QADT01":null,"QADD01":0}],"lowerLevelLabor":0,"thisLevelOverhead":0,"lowerLevelOverhead":0,"thisLevelBurden":0,"lowerLevelBurden":0,"thisLevelSubcontract":0,"lowerLevelSubcontract":0,"thisLevelTotal":0,"lowerLevelTotal":0,"costTotal":0,"costSetMethod":"STD","costSet":"Standard","dateUpdated":"2015-10-13T07:00:00.000Z","thisLevelMaterial":0,"lowerLevelMaterial":0,"thisLevelLabor":0,"lastModifiedDate":null,"siteCode":"10-100","dataOperation":"C","concurrencyHash":"","lastModifiedUser":"","customDate1":null,"customDate2":null,"customDate3":null,"customDate4":null,"customDate5":null,"customDecimal0":0,"customNote":"","customDecimal1":0,"customDecimal2":0,"customDecimal3":0,"customDecimal4":0,"customInteger0":0,"customInteger1":0,"customInteger2":0,"customInteger3":0,"customInteger4":0,"customLong0":"","customLong1":"","customShort0":"","customShort1":"","customShort2":"","customShort3":"","customShort4":"","customShort5":"","customShort6":"","customShort7":"","customShort8":"","customShort9":"","customShort10":"","customShort11":"","customShort12":"","customShort13":"","customShort14":"","customShort15":"","customShort16":"","customShort17":"","customShort18":"","customShort19":"","uri":"urn:be:com.qad.base.item.IItem:10USA..10-100.Standard","GLCostSourceSite":"10-100","QADC01":"","QADC02":"","QADT01":null,"QADD01":0},"QADC01":"","QADC02":"","QADT01":null,"QADD01":0,"ABCClass":"A","POReceiptStatus":"","WOReceiptStatus":"","POSite":"10-100","ATPEnforcement":"NONE","ATPHorizon":0,"EMTType":"NON-EMT","BOMFormula":"","IDQuantity":0
                    }]
                    };
                    sendAPIPOSTJQuery(requestURL, apiName, jsonItem);
                    /*
                    requestURL = baseURL + "/api/erp/countries";
                    apiName = "Country-MYA";

                    var jsonCountry = {
                            "supplementaryMessages" : [ ],
                            "countrys" : [{
                                        "countryVatFormats" : [ ],
                                        "currencyID" : 44951,
                                        "isActive" : true,
                                        "countryCode" : "MYA",
                                        "commentIndex" : 0,
                                        "dataOperation" : "",
                                        "lastModifiedUser" : "mfg",
                                        "currencyCode" : "MAD",
                                        "countryType" : "",
                                        "isNAFTACountry" : false,
                                        "isDEACountry" : false,
                                        "isGATTCountry" : false,
                                        "fiscalCountryCode" : "",
                                        "intrastatCurrencyCode" : "",
                                        "countryDescription" : "MYA-TEST",
                                        "postalFormat" : "Before",
                                        "isEUCountry" : false,
                                        "alternateCode" : "MYA",
                                        "countryGroup" : "",
                                        "uri" : "urn:be:com.qad.base.address.ICountry:MYA",
                                        "QADD01" : 0
                                    }
                            ]

                        }

                        sendAPIPOSTJQuery(requestURL, apiName, jsonCountry); */

    }

    function deleteAPI() {
                    var servername = "plli03.qad.com";
                    var tomcatPort = "40011";
                    var webapp = "qad-central";
                    var baseURL = "https://" + servername + ":" + tomcatPort + "/" + webapp;
                    var requestURL;

                    requestURL = baseURL + "/api/erp/items?domainCode=10USA&itemCode=MYADEMO-03";
                    apiName = "DELETE-ItemID-MYADEMO-03";

                    sendAPIDELETEJQuery(requestURL, apiName);

    }

    function sendAPIPOSTJQuery(api_url, apiName, jsonString) {
        var currentTime = +new Date();
        var outputCSV;
        //console.log("jsonString: " + JSON.stringify(jsonString));
        document.getElementById("test-results").innerHTML = "TEST-CREATE: " + apiName;
        $.ajax
        ({
             type: "POST",
             //the url where you want to sent
             url: api_url,
             dataType: 'json',
             async: false,
             //json object to sent to the url
             data: JSON.stringify(jsonString),
             contentType: 'application/json;charset=UTF-8',
             complete: function(xhr, status) {
                 console.log("Status: " + status);
             },
             beforeSend: function(xhr) {
                 xhr.setRequestHeader("Accept-Language", "en-US,en;q=0.8");
                 xhr.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
                 xhr.setRequestHeader("Accept-Language", "en-US,en;q=0.8");
                 xhr.setRequestHeader("Cache-Control", "max-age=0");
                 xhr.setRequestHeader('Authorization', 'Basic bWZnQHFhZC5jb206');
             },
             success: function () {
                 var endTime = +new Date();
                 var timeDiff = endTime - currentTime;
                 outputCSV = "API,ResponseTime(ms) <br>" + apiName + "," + timeDiff.toString();
                 console.log('"test-results": {');
                 console.log('"api" : "' + apiName + '",');
                 console.log('"duration": ' + timeDiff + ',');
                 console.log('"records" : 0,');
                 console.log('"size" : 0,');
                 console.log('}');
                 document.getElementById("test-results").innerHTML = "CREATE API-Running-Complete" + outputCSV;

                 console.log(apiName + " " + "Create Done!");
             },
             error: function() {
                 console.log(apiName + " " + "Create Failed!");
             }
         });
    }

    function sendAPIDELETEJQuery(api_url, apiName) {
        var currentTime = +new Date();
        var outputCSV;
        document.getElementById("test-results").innerHTML = "TEST-DELETE: " + apiName;
        $.ajax
        ({
             type: "DELETE",
             //the url where you want to sent
             url: api_url,
             async: false,
             contentType: "",
             complete: function(xhr, status) {
                 console.log("Status: " + status);
             },
             beforeSend: function(xhr) {
                 xhr.setRequestHeader("Accept-Language", "en-US,en;q=0.8");
                 xhr.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
                 xhr.setRequestHeader("Accept-Language", "en-US,en;q=0.8");
                 xhr.setRequestHeader("Cache-Control", "max-age=0");
                 xhr.setRequestHeader('Authorization', 'Basic bWZnQHFhZC5jb206');
             },

             success: function () {
                 var endTime = +new Date();
                 var timeDiff = endTime - currentTime;
                 outputCSV = "API,ResponseTime(ms) <br>" + apiName + "," + timeDiff.toString();
                 console.log('"test-results": {');
                 console.log('"api" : "' + apiName + '",');
                 console.log('"duration": ' + timeDiff + ',');
                 console.log('"records" : 0,');
                 console.log('"size" : 0,');
                 console.log('}');
                 document.getElementById("test-results").innerHTML = "DELETE API-Running-Complete" + outputCSV;

                 console.log(apiName + " " + "Delete Done!");
             },
             error: function() {
                 console.log(apiName + " " + "Delete Failed!");
             }
         });
    }
}());