/* Renders list of search results by object */

function searchResults(){
    var objdata = JSON.parse(searchedObjects);
    if (objdata.length == 0) {
        $("#searchList").append("No search hits. Please note that art is searchable only by creator, title, material, date, and description.")
    }
    for (item in objdata) {
        var element = document.createElement("div");
        element.className = "row"
        
        var buttonMap = document.createElement("a");
        var buttonObject = document.createElement("a");
        buttonMap.className = "btn btn-primary m-2"
        buttonObject.className = "btn btn-primary m-2"

        var dataCol = document.createElement("div");
        var picCol = document.createElement("div");
        dataCol.className = "col-md-6"
        picCol.className = "col-md-6"
        element.appendChild(dataCol);
        element.appendChild(picCol);
        
        var id = objdata[item]["objectid"]
        var sepEntries = document.createElement("hr")
    

        link = "objects/" + id
        buttonMap.href = "map?id=" + id;
        buttonObject.href = link
        buttonMap.innerHTML = "See on the map"
        buttonObject.innerHTML = "More information"

        var list = document.getElementById("searchList")
        var number = Number(item) + 1;
        dataCol.id = "data" + number
        picCol.id = "pic" + number
        element.id = "listItem" + number
        list.append(element)
        list.appendChild(buttonMap)
        list.appendChild(buttonObject)
        list.appendChild(sepEntries)
        var title = objdata[item]["title"];
        var creators = objdata[item]["creators"];
        
        var imgURI = objdata[item]["image"];
        var imgArray = imgURI.split(',');
        var imgLink = imgArray[0];
        var info = "<b>" + number + ".  " + "</b>" + title + "<br>" + creators + "<br>";
        var pic = "<img src=" + imgLink + "/full/,150/0/default.jpg>"
        var picName = "#pic" + number
        var elementName = "#data" + number
        $(picName).append(pic);
        $(elementName).append(info);

    }
}

searchResults();