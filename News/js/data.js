(function () {
    "use strict";

    var list = new WinJS.Binding.List();
    var displayGroups = [];

  //  feeds.push(['bbc f1 video', '/xml/bbcf1video.xml']);
   // feeds.push(['engadget', "/xml/engadget.xml"]);
    // feeds.push(['bbc f1', "/xml/bbcf1.xml"]);


    $(document).ready(function () {
        $('body').on('click', '.refresh_feeds', function () {
            $('.manual_refresh').addClass('hidden');
            $('.back-button').click();
            var appBar = document.getElementById("appbar").winControl;
            appBar.hide();

            setTimeout(function () {
                list.splice(0, list.length);
                feeds = [];
                displayGroups = [];
                loadFeeds();
            }, 1);


        });
    });

    var groupedItems = list.createGrouped(
        function groupKeySelector(item) { if (item.group) { return item.group.key; } else { return false; } },
        function groupDataSelector(item) { return item.group; }
    );

    WinJS.Namespace.define("Data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemReference: getItemReference,
        getItemsFromGroup: getItemsFromGroup,
        resolveGroupReference: resolveGroupReference,
        resolveItemReference: resolveItemReference
    });

    // Get a reference for an item, using the group key and item title as a
    // unique reference to the item that can be easily serialized.
    function getItemReference(item) {
        return [item.group.key, item.title];
    }

    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.key === group.key; });
    }

    // Get the unique group corresponding to the provided group key.
    function resolveGroupReference(key) {
        return groupedItems.groups.getItemFromKey(key).data;
    }

    // Get a unique item from the provided string array, which should contain a
    // group key and an item title.
    function resolveItemReference(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.group.key === reference[0] && item.title === reference[1]) {
                return item;
            }
        }
    }

    function addUrlCss(image) {
        image = "url(" + image + ")";
        return image;
    }

    function retrieve_items(feed, count) {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4) {
                if (xhttp.status == 200 && xhttp.responseXML) {
                    var xmlDoc = xhttp.responseXML;

                    var groupDescription = xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;

                    var feedImage = "";
                    if (xmlDoc.getElementsByTagName("url").length) {
                        feedImage = xmlDoc.getElementsByTagName("url")[0].childNodes[0].nodeValue;
                    }

                    

                    displayGroups.push({ key: "group" + count, title: feed[0], subtitle: groupDescription, backgroundImage: addUrlCss(feedImage), description: groupDescription });

                    var items = xmlDoc.getElementsByTagName("item");

                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        var title = item.getElementsByTagName("title")[0].textContent;
                        var content = $.parseHTML(toStaticHTML(item.getElementsByTagName("description")[0].textContent));
                        var link = item.getElementsByTagName("link")[0].textContent;
                        var pubdate = item.getElementsByTagName("pubDate")[0].textContent;

                        pubdate = new Date(pubdate);

                        var months = Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
                        pubdate = pubdate.getDate() + " " + months[pubdate.getMonth()] + " " + pubdate.getFullYear()+", "+pubdate.getHours()+":"+pubdate.getMinutes();


                        var firstImage = $(content).find('img')[0];

                        var image = firstImage ? firstImage.src : "";

                        if (!image && item.getElementsByTagNameNS("*", "thumbnail")[0]) {
                            var images = item.getElementsByTagNameNS("*", "thumbnail");
                            image = images[images.length-1].getAttribute('url');
                        }

                        if (!image) {
                            image = feedImage;
                        }

                        $(content).find('*').not('p, a, br, span').contents().unwrap();
                        $(content).find('*').not('p, a, br, span').remove();

                        var parsed_content = "";
                        $(content).each(function () {
                            if ($(this).html() != undefined) {
                                parsed_content += "<p>" + toStaticHTML($(this).html()) + "</p>";
                            } else {
                                parsed_content += "<p>" + $(this).text() + "</p>";
                            }
                        });
         
                        list.push({ group: displayGroups[count], title: title, articleImage: image, backgroundImage: addUrlCss(image), subtitle: pubdate, link: link, content: parsed_content });
                    }
                } else {
                    popup("It was not possible to load this feed.  It has now been removed from your library.", feed[0]);
                    var position = feeds.indexOf(count);
                    feeds.splice(position, 1);
                    save_feeds(false);
                    return false
                }
            }
        };

        xhttp.open("GET", feed[1], true);
        try {
            xhttp.send();
        }
        catch (e) {
            xhttp.abort();
            return false;
        }
    }

    function loadFeeds() {
        if (appData.values["feeds"]) {
            feeds = JSON.parse(appData.values["feeds"]);
        }
        if (typeof feeds === 'string' || feeds == undefined || feeds.length == 0) {
            popup("Swipe up from the bottom of the screen or right click to manage your subscriptions.","No feeds");
        } else{
            feeds.forEach(function (feed, index) {
                if (feed[1] && feed[0]) {
                    retrieve_items(feed, index);
                }
            });
        }
    }

    loadFeeds();
})();
