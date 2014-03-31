// For an introduction to the Split template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=232447


var dbPath = Windows.Storage.ApplicationData.current.localFolder.path + '\\db.sqlite';
/*

var db = SQLite3JS.openAsync(dbPath)
.then(function (db) {
   return db.runAsync('SELECT * FROM Item')
  // .then(function () {
       // return db.runAsync('INSERT INTO Item (name, price, id) VALUES (?, ?, ?)', ['Mango', 4.6, 123]);
  //  })
    .then(function () {
        return db.eachAsync('SELECT * FROM Item', function (row) {
            popup('Get a ' + row.name + ' for $' + row.price);
        });
    })
    .then(function () {
        db.close();
    });
});*/

function sqlQuery(query, callback) {
    SQLite3JS.openAsync(dbPath).then(function (db2) {
        db2.runAsync(query).then(function(){
            db2.close();
            if (callback) {
                callback();
            }
        });
    });
}

function sqlSelect(query, callback) {
    var results = [];
    SQLite3JS.openAsync(dbPath).then(function (db) {
        var index = 0;
        db.eachAsync(query, function (row) {
            var rowResults = {};
            rowResults[index] = row;
            results.push(rowResults);
            ++index;
        }).then(function(){
            db.close();
            callback(results);
        });
    });
}

function selectAfter() {
    sqlSelect('SELECT * FROM Library', handleResults);
};

function handleResults(rows) {
    rows.forEach(function (value, index) {
        console.dir(value[index].name);
    });
}


var feeds = [];
var refresh_available = false;
var appData = Windows.Storage.ApplicationData.current.roamingSettings;
function popup(message_heading, message_body) {
    if (message_heading == undefined) {
        message_heading = "Empty message";
    }
    if (message_body == undefined) {
        message_body = "";
    }
    var msg = new Windows.UI.Popups.MessageDialog(message_heading, message_body).showAsync();
}

function hideAppBar() {
    var appBar = document.getElementById("appbar").winControl;
    appBar.hide();
}

function save_feeds(refresh) {
    appData.values["feeds"] = JSON.stringify(feeds);
    if (refresh) {
        $('.refresh_feeds').click();
    } else {
        $('.manual_refresh').removeClass('hidden');
    }
}

(function () {
    "use strict";

    var activation = Windows.ApplicationModel.Activation;
    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;




    $(document).ready(function () {
        $('body').on('click', '.sidebar_button', function () {
            var type = $(this).prop('id').split('_');
            WinJS.UI.SettingsFlyout.showSettings(type[1], "/pages/settings/"+type[1]+".html");
        });

        $('body').on('click', '.library_link', function () {
            hideAppBar();
            WinJS.Navigation.navigate("/pages/library/library.html");
        });

        WinJS.Application.onsettings = function (e) {
            e.detail.applicationcommands = {
                "preferences": { title: "Preferences", href: "/pages/settings/preferences.html" },
                "subscriptions": { title: "Subscriptions", href: "/pages/settings/subscriptions.html" }
            };
            WinJS.UI.SettingsFlyout.populateSettings(e);
        };
        // Make sure the following is called after the DOM has initialized. Typically this would be part of app initialization
        WinJS.Application.start();
    });

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            nav.history = app.sessionState.history || {};
            nav.history.current.initialPlaceholder = true;

            // Optimize the load of the application and while the splash screen is shown, execute high priority scheduled work.
            ui.disableAnimations();
            var p = ui.processAll().then(function () {
                return nav.navigate(nav.location || Application.navigator.home, nav.state);
            }).then(function () {
                return sched.requestDrain(sched.Priority.aboveNormal + 1);
            }).then(function () {
                ui.enableAnimations();
            });

            args.setPromise(p);
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.start();
})();
