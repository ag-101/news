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

        var library_options = [];
        library_options.push(['http://www.collegehumor.com/videos/rss', 'College Humor']);
        library_options.push(['http://feeds.ign.com/ign/all', 'IGN']);
        library_options.push(['http://www.jest.com/rss', 'Jest']);
        library_options.push(['http://newsthump.com/feed/', 'NewsThump']);
        library_options.push(['http://feeds.feedburner.com/thedailymash', 'The Daily Mash']);
        library_options.push(['http://feeds.theonion.com/theonion/daily', 'The Onion']);
        library_options.push(['http://www.vanityfair.com/feed/rss/everything.rss.xml', 'Vanity Fair']);

        library_options.push(['http://www.autosport.com/rss/allnews.xml', 'Autosport']);
        library_options.push(['http://newsrss.bbc.co.uk/rss/sportonline_uk_edition/motorsport/formula_one/rss.xml', 'BBC F1']);
        library_options.push(['http://www.f1fanatic.co.uk/feed/', 'F1 Fanatic']);
        library_options.push(['http://www.jamesallenonf1.com/feed/', 'James Allen on F1']);
        library_options.push(['http://www.pitpass.com/fes_php/fes_usr_sit_newsfeed.php', 'Pitpass']);
        library_options.push(['http://scarbsf1.wordpress.com/feed/', 'ScarbsF1']);
        library_options.push(['http://wtf1.co.uk/rss', 'WTF1']);

        library_options.push(['http://store.steampowered.com/feeds/news.xml', 'Steam Store']);
        library_options.push(['http://feeds.gawker.com/kotaku/full', 'Kotaku']);
        library_options.push(['http://www.escapistmagazine.com/rss/videos/list/1.xml', 'Escapist Magazine']);

        library_options.push(['http://animalsbeingdicks.com/rss', 'Animals Being Dicks']);
        library_options.push(['http://www.guardian.co.uk/profile/davidmitchell/rss', 'David Mitchell']);
        library_options.push(['http://feeds.feedburner.com/failblog', 'FAIL Blog']);
        library_options.push(['http://www.iwatchstuff.com/index.xml', 'I Watch Stuff']);
        library_options.push(['http://feeds.feedburner.com/passiveaggressivenotes?format=xml', 'Passive Aggressive Notes']);
        library_options.push(['http://feeds.feedburner.com/feedburner/ZdSV', 'The Chive']);
        library_options.push(['http://feeds.feedburner.com/oatmealfeed', 'The Oatmeal']);
        library_options.push(['http://feeds.feedburner.com/MthruF', 'MthruF']);

        library_options.push(['http://feeds.bbci.co.uk/news/rss.xml', 'BBC News']);
        library_options.push(['http://feeds.guardian.co.uk/theguardian/us-home/rss', 'The Guardian']);
        library_options.push(['http://www.iflscience.com/rss.xml', 'I Fucking Love Science']);
        library_options.push(['http://feeds.gawker.com/lifehacker/full', 'Lifehacker']);

        library_options.push(['http://www.engadget.com/rss-full.xml', 'Engadget']);
        library_options.push(['http://feeds.gawker.com/gawker/full', 'Gawker']);
        library_options.push(['http://feeds.feedburner.com/geekologie/iShm', 'Geekologie']);
        library_options.push(['http://gizmodo.com/rss', 'Gizmodo']);
        library_options.push(['http://feedproxy.google.com/TechCrunch', 'TechCrunch']);
        library_options.push(['http://www.theverge.com/rss/index.xml', 'The Verge']);


        library_options = library_options.sort(function (a, b) {
            return a[1] > b[1];
        });


        var library_html = "";
        library_options.forEach(function (item) {
            library_html += '<button id="' + item[0] + '"> ' + item[1] + '</button>';
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
