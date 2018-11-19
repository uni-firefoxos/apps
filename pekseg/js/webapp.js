"use strict";
(function () {
    var dial = document.querySelector("#dial");
    if (dial) {
        dial.onclick = function () {
            new MozActivity({
                name: "dial",
                data: {
                    number: "+06129739569"
                }
            });
        };
    }

    var sendSMS = document.querySelector("#send-sms");
    if (sendSMS) {
        sendSMS.onclick = function () {
            new MozActivity({
                name: "new", // Possible compose-sms in future versions
                data: {
                    type: "websms/sms",
                    number: "+06129739569"
                }
            });
        };
    }
})();
