/* Renders list of search results by object */

function searchResults(){
    var objdata = JSON.parse(searchedObjects);
    for (item in objdata) {
        var element = document.createElement("div");
        element.className = "row"
        
        var buttonMap = document.createElement("a");
        var buttonObject = document.createElement("a");
        buttonMap.className = "btn btn-primary m-2 disabled"
        buttonObject.className = "btn btn-primary m-2"

        var dataCol = document.createElement("div");
        var picCol = document.createElement("div");
        dataCol.className = "col-md-6"
        picCol.className = "col-md-6"
        element.appendChild(dataCol);
        element.appendChild(picCol);
        
        var link = objdata[item]["objectid"]
        var lat = objdata[item]["lat"];
        var lng = objdata[item]["long"];
        var sepEntries = document.createElement("hr")
        console.log(lng);

        link = "objects/" + link
        buttonMap.href = "map?lat=" + lat + "&lng=" + lng + "&zoom=13"
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