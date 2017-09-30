var circles;
var img;
var baseStack = [];
var baseColorVectors = [];
var baseIDs = [];
var stampIDs = [];
var stampStack = [];
var stampColorVectors = [];
var newStack = [];
var capture;
var video;
var photoSnapped;
var still;


function preload() {
    loadJSON("./stampArray2.json", stampLoader);
    img = loadImage("assets/rainbow.jpg");
    still = img;
}


function stampLoader(element) {
    for (var i = 0; i < element.length; i++) {
        baseStack.push(loadImage("stamps/" + element[i].id + ".jpg"));
        baseColorVectors.push(element[i].rgb);
        baseIDs.push(i);
    }
    stampStack = baseStack;
    stampColorVectors = JSON.parse(JSON.stringify(baseColorVectors));
    stampIDs = JSON.parse(JSON.stringify(baseIDs));
    console.log(stampColorVectors[0]);
}




function setup() {
    photoSnapped = false;
    still = createGraphics(window.innerWidth, window.innerHeight);
    createCanvas(window.innerWidth, window.innerHeight);
    background(0);
    var density = displayDensity();
    pixelDensity(1);
    img.loadPixels();
    circles = [];
    lastFrame = false;

    console.log(img.width);
    console.log(img.height);
    console.log("pixels", img.pixels.length);
    console.log(density);

    capture = createCapture(VIDEO);
    capture.size(640, 480);
    capture.hide();

    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();
}

function draw() {

    if (photoSnapped) {

        if (circles.length < 100) {
            push();
            translate(width / 2, height / 2);
            scale(-1, 1);
            image(still, -width / 2, -height / 2, width, height);
            pop();
            fill(255, 100);
            rect(0, 0, width, height);
        }


        var total = 20;
        var count = 0;
        var attempts = 0;

        while (count < total) {
            var newC = newCircle();
            if (newC !== null) {
                circles.push(newC);
                count++;
            }
            attempts++;
            if (attempts > 1000 || stampColorVectors.length < 2) {
                break;
            }
        }

        for (var i = 0; i < circles.length; i++) {
            var circle = circles[i];


            if (circle.growing) {
                if (circle.edges()) {
                    circle.growing = false;
                } else {
                    for (var j = 0; j < circles.length; j++) {
                        var other = circles[j];
                        if (circle !== other) {
                            var d = dist(circle.x, circle.y, other.x, other.y);
                            var distance = circle.r + other.r;

                            if (d - 1 < distance) {
                                circle.growing = false;

                                break;
                            }
                        }
                    }
                }
            }

            circle.show();
            circle.grow();
        }
    } else {
        push();
        translate(width / 2, height / 2);
        scale(-1, 1);
        image(video, -width / 2, -height / 2, width, height);
        pop();
    }

}

function newCircle() {
    var x = random(0, width);
    var y = random(0, height);

    var valid = true;
    for (var i = 0; i < circles.length; i++) {
        var circle = circles[i];
        var d = dist(x, y, circle.x, circle.y);
        if (d - 2 < circle.r) {
            valid = false;
            break;
        }
    }
    if (valid) {
        var index = (int(map(x, 0, width, still.width, 0)) + int(map(y, 0, height, 0, still.height)) * still.width) * 4;
        var r = still.pixels[index];
        var g = still.pixels[index + 1];
        var b = still.pixels[index + 2];
        var c = color(r, g, b);
        return new Circle(x, y, color(c));
    } else {
        return null;
    }
}

function keyPressed() {
    if (keyCode === 32) {
        if (photoSnapped === false) {
            still = capture.get();
            still.loadPixels();
            photoSnapped = true;

        } else {
            saveCanvas("screendump", "jpg");
            photoSnapped = false;
            stampColorVectors = JSON.parse(JSON.stringify(baseColorVectors));
            stampIDs = JSON.parse(JSON.stringify(baseIDs));
            circles = [];
        }

    }
}