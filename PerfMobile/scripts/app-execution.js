function signInButton(e) {
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
	    xhttp.open("GET", baseURL + "/api/qracore/browses?browseId=mfg:so803&page=1&pageSize=10", true);
	    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    xhttp.setRequestHeader("Accept-Language", "en-US,en;q=0.8");
	    xhttp.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
	    xhttp.setRequestHeader("Accept-Language", "en-US,en;q=0.8");
	    xhttp.setRequestHeader("Cache-Control", "max-age=0");
	    xhttp.setRequestHeader('Authorization','Basic bWZnQHFhZC5jb206');
	    var currentTime = +new Date();
    xhttp.send();
}
