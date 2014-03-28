﻿(function () {
    "use strict";

    var list = new WinJS.Binding.List();
    var groupedItems = list.createGrouped(
        function groupKeySelector(item) { return item.group.key; },
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

    function remove_tags(input) {
        return input.replace(/<(?!\s*\/?\s*p\b)[^>]*>/gi, '');
    }

    function retrieve_items(xmlDoc, count) {
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

                    var link = xmlDoc.getElementsByTagName("link")[0].childNodes[0].nodeValue;

                    var displayGroups = [
                        { key: "group" + count, title: groupDescription, subtitle: link, backgroundImage: addUrlCss(feedImage), description: groupDescription }
                    ];

                    var items = xmlDoc.getElementsByTagName("item");

                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        var title = item.getElementsByTagName("title")[0].textContent;
                        var content = item.getElementsByTagName("description")[0].textContent;
                        var link = item.getElementsByTagName("link")[0].textContent;
                        var pubdate = item.getElementsByTagName("pubDate")[0].textContent;

                        var div = document.createElement('div');
                        div.id = "tempContent";
                        div.innerHTML = content;
                        var firstImage = div.getElementsByTagName('img')[0];

                        
                        $("#tempContent").remove();
                        var image = firstImage ? firstImage.src : "";

                        if (!image && item.getElementsByTagNameNS("*", "thumbnail")[0]) {
                            var images = item.getElementsByTagNameNS("*", "thumbnail");
                            image = images[images.length-1].getAttribute('url');
                        }

                        if (!image) {
                            image = feedImage;
                        }

                        list.push({ group: displayGroups[0], title: title, articleImage: image, backgroundImage: addUrlCss(image), subtitle: pubdate, link: link, content: remove_tags(div.innerHTML) });
                    }
                } else {
                    // error loading feed
                    return false
                }
            }
        };

        xhttp.open("GET", xmlDoc, true);
        try {
            xhttp.send();
        }
        catch (e) {
            xhttp.abort();
            return false;
        }
    }

    function loadFeeds(xmlDocs) {
        xmlDocs.forEach(function (xmlDoc, index) {
            retrieve_items(xmlDoc, index);
        });
    }

    loadFeeds(["/xml/engadget.xml", "/xml/bbcf1.xml"]);
})();
