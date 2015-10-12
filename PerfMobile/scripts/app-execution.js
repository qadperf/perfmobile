function signInButton(e) {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var servername = "plli03.qad.com";
    var tomcatPort = "40011";
    var webapp = "qad-central";
    var baseURL = "https://" + servername + ":" + tomcatPort + "/" + webapp;
    var apiName = "Login";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                var endTime = +new Date();
                var timeDiff = endTime - currentTime;
                var outputCSV = apiName + "," + timeDiff.toString();
                document.getElementById("test-results").innerHTML = outputCSV;
                console.log("something");
                console.log(xhttp.getAllResponseHeaders());
                console.log("something else more");
                // var headers = xhttp.getAllResponseHeaders();
                // alert(headers);
                //alert(apiName + ' Duration: ' + timeDiff.toString());
            }
        }
        // xhttp.open("POST", "https://plli03.qad.com:40011/qad-central/j_spring_security_check?j_username=mfg@qad.com&j_password=", true);
    xhttp.open("POST", baseURL + "/j_spring_security_check?j_username=" + username + "&j_password=" + password, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var currentTime = +new Date();
    xhttp.send();
}