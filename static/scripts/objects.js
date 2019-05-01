function createMedia() {
    // parse out the JSON data
    var objdata = JSON.parse(objimg);
    var images = objdata['image'].split(',');

    // create a carousel if multiple images are available
    if (images.length > 1) {
        // create a carousel frame element
        var carousel = strToDOMElement(carouselFrame());

        // add each image into the frame
        for (var i = 0; i < images.length; i++) {
            // add a slide indicator
            var indicator = strToDOMElement("<li data-target='#carouselExampleIndicators' data-slide-to='"+i+"'></li>");
            if (i == 0) { indicator.className = "active"; }
            carousel.getElementsByClassName("carousel-indicators")[0].appendChild(indicator);
            // add the image
            var image = strToDOMElement(`<div class="carousel-item">
                <img class="d-block w-100" src="" alt="">
            </div>`);
            image.getElementsByTagName("img")[0].setAttribute("src", images[i]+"/full/full/0/default.jpg");
            image.getElementsByTagName("img")[0].setAttribute("alt", "slide "+i);
            if (i==0) { image.classList.add("active"); }
            carousel.getElementsByClassName("carousel-inner")[0].appendChild(image);
        }

        // remove pic and add carousel to DOM
        var media = document.getElementById("media");
        while (media.firstChild) {
            // remove carousel nonsense
            media.removeChild(media.firstChild);
        }
        media.appendChild(carousel);
    }
}

// contain all the text for the carousel frame
var carouselFrame = function() {
    return `<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
    <ol class="carousel-indicators" id="indicators">
    </ol>
    <div class="carousel-inner" id="pics">
    </div>
    <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
    </a>
</div>`;
}

// helper function converts interior string to DOM element
// taken from here: http://krasimirtsonev.com/blog/article/Convert-HTML-string-to-DOM-element
var strToDOMElement = function(html) {
    var frame = document.createElement('iframe');
    frame.style.display = 'none';
    document.body.appendChild(frame);             
    frame.contentDocument.open();
    frame.contentDocument.write(html);
    frame.contentDocument.close();
    var el = frame.contentDocument.body.firstChild;
    document.body.removeChild(frame);
    return el;
}

createMedia();