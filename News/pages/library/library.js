// TODO: Connect the Search Results Page to your in-app search.
// For an introduction to the Search Results Page template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232512
(function () {
    "use strict";

    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    WinJS.UI.Pages.define("/pages/library/library.html", {
        // This function is called to initialize the page.
        init: function (element, options) {

        },

        // This function is called whenever a user navigates to this page.
        ready: function (element, options) {
  
            display_library();
           
        }
    });

    function display_library() {
        sqlSelect('SELECT LibraryCategory.name as category, Library.name, Library.url FROM Library INNER JOIN LibraryCategory ON LibraryCategory.id = Library.library_category ORDER BY LibraryCategory.id, Library.name', populateLibrary)
    }

    function populateLibrary(library_options) {
        var library_html = "";
        var current_category = 0;

        library_options.forEach(function (item, index) {
            if (item[index].category != current_category) {
                current_category = item[index].category;
                library_html += '<h3>' + item[index].category + '</h3>';
            }

            library_html += '<button id="' + item[index].url + '"> ' + item[index].name + '</button>';
        });

        $('#library').html(library_html);
    }

    function add_subscription(name, url) {
        feeds.push([name, url]);
        save_feeds(false);
        refresh_available = true;
        WinJS.UI.SettingsFlyout.showSettings('subscriptions', "/pages/settings/subscriptions.html");
    }

    $('body').on('click', '#library button', function(){
        add_subscription($(this).text(), $(this).prop('id'));
    });

    $('body').on('click', '#add_subscription', function () {
        var name = $('#add_name').val();
        var url = $('#add_url').val();
        if (name && url) {
            add_subscription(name, url);
        }
    });
})();
