/* global HTMLElement */
(function() {
    'use strict';

    var backButton = document.getElementById("backButton");
    var scanButton = document.getElementById("scanButton");
    var cancelButton = document.getElementById("cancelButton");

    var arg = {
        resultFunction: function(result) {
            $("#scanned-barcode").html(result.format + ': ' + result.code);
            console.log(result.code);

            var mode = location.search.split('?')[1];
            if (mode === "add")
                 window.location.href = "add.html?code=" + result.code.split(',')[0] + "&name=" + result.code.split(',')[1];
            else
                if (mode === "find")
                     window.location.href = "find.html?code=" + result.code.split(',')[0] + "&name=" + result.code.split(',')[1];            
        },
        getDevicesError: function(error) {                  //callback funtion to get Devices error
            $("#scanned-barcode").html("getDevicesError:" + error);
            console.log(error);
        },
        getUserMediaError: function(error) {                //callback funtion to get usermedia error
            $("#scanned-barcode").html("getUserMediaError:" + error);
            console.log(error);
        },
        cameraError: function(error) {                      //callback funtion to camera error  
            var p, message = "camera-error:\n";
            for (p in error) {
                message += p + ": " + error[p] + "\n";
            }
            $("#scanned-barcode").html(message);
            console.log(message);
        }
    };

    backButton.addEventListener("click", function() {
        window.location.href = "index.html";                
    }, false);

    scanButton.addEventListener("click", function() {
        $("#scanned-barcode").html("");
        $("canvas").WebCodeCamJQuery(arg).data().plugin_WebCodeCamJQuery.play();
    }, false);

    cancelButton.addEventListener("click", function() {        
        window.location.href = "index.html";        
    }, false);

    scanButton.click();
    
}).call(window.Page = window.Page || {});