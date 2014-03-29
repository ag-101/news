//// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
//// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
//// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//// PARTICULAR PURPOSE.
////
//// Copyright (c) Microsoft Corporation. All rights reserved

(function () {
    "use strict";
    var page = WinJS.UI.Pages.define("/pages/settings/subscriptions.html", {

        ready: function (element, options) {
            // Register the handlers for dismissal
            document.getElementById("defaultSettingsFlyout").addEventListener("keydown", handleKeys);
      

            display_feeds();
        },

        unload: function () {
            // Remove the handlers for dismissal
            document.getElementById("defaultSettingsFlyout").removeEventListener("keydown", handleKeys);
            document.getElementById("backButton").removeEventListener("click", handleBackButton);
        },
    });

    function handleKeys(evt) {
        // Handles Alt+Left and backspace key in the control and dismisses it
        if ((evt.altKey && evt.key === 'Left') || (evt.key === 'Backspace')) {
            WinJS.UI.SettingsFlyout.show();
        }
    };

    function display_feeds() {
        var feeds_html = "";
        feeds.forEach(function (feed, index) {
            feeds_html += "<div class='feed-group' id='feed-group_"+index+"'><button class='feed-remove' id='feed-remove_"+index+"'>&times</button> " + feed[0] + "</div>";
        });

        $('#subscriptions_list').html(feeds_html);
    }

    function feedRemove() {
        popup("click");
    }

    $('body').on('click', '#add_subscription', function () {
        var name = $('#add_name').val();
        var url = $('#add_url').val();
        feeds.push([name, url]);
        save_feeds(true);
        display_feeds();
    });

    $('body').on('click', '.feed-remove', function () {
        var id = $(this).prop('id').split('_');

        feeds.splice(id[1], 1);
        save_feeds(false);
        display_feeds();
    });
    
})();
