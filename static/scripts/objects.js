var objdata = JSON.parse(objimg);
var images = objdata['image'].split(',');
for (item in images) {
    console.log(images[item]);
}
console.log(images.length);
