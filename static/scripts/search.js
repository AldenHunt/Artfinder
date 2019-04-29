/* Renders list of search results by object */

function searchResults(){
    var objdata = JSON.parse(searchedObjects);
    for (item in objdata) {
        var element = document.createElement("div");
        element.className = "row"
        var buttonMap = document.createElement("a");
        var buttonObject = document.createElement("a");
        buttonMap.className = "btn btn-primary"
        buttonObject.className = "btn btn-primary"
        var link = objdata[item]["objectid"]
        link = "objects/" + link
        buttonMap.href = "map"
        buttonObject.href = link
        buttonMap.innerHTML = "See on the map"
        buttonObject.innerHTML = "More information"

        var list = document.getElementById("searchList")
        var number = Number(item) + 1;
        element.id = "listItem" + number
        list.append(element)
        list.appendChild(buttonMap)
        list.appendChild(buttonObject)
        var title = objdata[item]["title"];
        var creators = objdata[item]["creators"];
        
        var imgURI = objdata[item]["image"];
        var info = "<b>" + number + ". " + "</b>" + title + "</br>" + creators + "</br>";
        var elementName = "#listItem" + number
        $(elementName).append(info);

    }
}
searchResults();