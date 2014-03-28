(function () {
    "use strict";

    var list = new WinJS.Binding.List();
    var groupedItems = list.createGrouped(
        function groupKeySelector(item) { return item.group.key; },
        function groupDataSelector(item) { return item.group; }
    );

    // TODO: Replace the data with your real data.
    // You can add data from asynchronous sources whenever it becomes available.
    generateSampleData().forEach(function (item) {
        list.push(item);
    });

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

    function loadXMLDoc(filename) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", filename, false);
        xhttp.send();
        return xhttp.responseXML;
    }

    function addUrlCss(image) {
        image = "url(" + image + ")";
        return image;
    }

    function parseRSS(xmlDocs) {
        var results = [];
        var count = 0;

        xmlDocs.forEach(function (xmlDoc) {
            var xmlDoc = loadXMLDoc(xmlDoc);
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


                if (!image) {
                    image = feedImage;
                }
                // or, if you want the unresolved src, as it appears in the original HTML:
                //  var rawImgSrc = firstImage ? firstImage.getAttribute("src") : "";

                results.push({ group: displayGroups[0], title: title, articleImage:image, backgroundImage: addUrlCss(image), subtitle: pubdate, link: link, content: div.innerText });

            }
            ++count;
        });

        return results;
    }

    // Returns an array of sample data that can be added to the application's
    // data list. 
    function generateSampleData() {
        var items = parseRSS([/*'http://www.engadget.com/rss-hd.xml', "http://feeds.bbci.co.uk/sport/0/formula1/rss.xml?edition=uk", "http://feeds.feedburner.com/f1fanatic",*/ "http://feeds.feedburner.com/uk/gizmodo?format=xml"]);
        return items;
    }
})();
