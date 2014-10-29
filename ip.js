// Set variables
var serverIP_status, setPosition,
    url = window.location.host;

jQuery(document).ready(function ($) {
    'use strict';

    // Set position to left for these websites
    var noRight = [];
    noRight[0] = "www.facebook.com";
    noRight[1] = "www.google.com";

    //Check if on noRight array and set position accordingly
    if ($.inArray(url, noRight) >= 0) {
        setPosition = "left";
    } else {
        setPosition = "right";
    }

    chrome.extension.sendMessage({name: "getIP"}, function (response) {
        var finalIP = response.domainToIP;
        chrome.extension.sendMessage({name: "getOptions"}, function (response) {
            var serverIP_status = response.enableDisableIP;
            if (serverIP_status === "Disable" || typeof serverIP_status === 'undefined') {
                $("body").append('<div id="dev_tools_server_ip" class="fixed-' + setPosition + '">' + finalIP + '</div>');
            }
        });
    });

    //Switch alignment on mouse over
    $("#dev_tools_server_ip")
        .mouseover(function () {
            $(this)
                .toggleClass("fixed-right")
                .toggleClass("fixed-left");
        });

    loadOptions(); //To set default value on pop-up button

});

function loadOptions() {
    'use strict';
    chrome.extension.sendMessage({name: "getOptions"}, function (response) {
        var enableDisableIP = response.enableDisableIP;

        // set default as disabled
        if (typeof enableDisableIP === 'undefined') {
            chrome.extension.sendMessage({name: "setOptions", status: 'Disable'}, function (response) {
            });
        }
    });
}

// popup button clicked
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    var ip_switch = $("#dev_tools_server_ip_switch");

    chrome.extension.sendMessage({name: "getOptions"}, function (response) {
        ip_switch.val(response.enableDisableIP);
    });

    document.querySelector('input').addEventListener('click', function () {
        if (ip_switch.val() === "Disable") {
            // save to localstore
            chrome.extension.sendMessage({name: "setOptions", status: 'Enable'}, function (response) {});
            ip_switch.val('Enable');
        }
        else if (ip_switch.val() === "Enable") {
            // save to localstore
            chrome.extension.sendMessage({name: "setOptions", status: 'Disable'}, function (response) {});
            ip_switch.val('Disable');
        }
    });
});
