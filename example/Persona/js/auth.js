
navigator.id.watch({
    loggedInUser: null,
    onlogin: function (assertion) {     
        
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://k-firefoxos.appspot.com/persona", true);
    var param = "assertion=" + assertion;
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Content-length", param.length);
    xhr.setRequestHeader("Connection", "close");
    xhr.send(param); // for verification by your backend

    xhr.onreadystatechange = function () {
                try{
                    data=JSON.parse(xhr.responseText);
                    if("okay"===data.status)
                        //sessionStorage.setItem("user",data.email);
			document.querySelector("h2").innerHTML=data.email;
                }
                catch(e){}
                
            };
    },
    onlogout: function () {}
});
