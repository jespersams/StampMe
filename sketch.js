var circles;
var still;
var baseColorVectors = [];
var baseIDs = [];
var stampIDs = [];
var stampStack = [];
var stampColorVectors = [];
var sampleArrayLength;
var capture;
var video;
var photoSnapped;
var mode;


function preload() {
    loadJSON("./stampArray.json", stampLoader);
    sampleArrayLength = 5;
    mode = "Stamps";
}


function stampLoader(element) {
    for (var i = 0; i < element.length; i++) {
        stampStack.push(loadImage("stamps/" + element[i].id + ".jpg"));
        baseColorVectors.push(element[i].rgb);
        baseIDs.push(i);
    }
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
    still.loadPixels();
    circles = [];
    lastFrame = false;

    console.log(still.width);
    console.log(still.height);
    console.log("pixels", still.pixels.length);
    console.log(density);

    capture = createCapture(VIDEO);
    capture.size(320, 240);
    capture.hide();

    video = createCapture(VIDEO);
    video.size(320, 240);
    video.hide();
}

function draw() {

    if (photoSnapped) {

        if (!(attempts > 100 || stampColorVectors.length < sampleArrayLength + 1)) {
            push();
            translate(width / 2, height / 2);
            scale(-1, 1);
            image(still, -width / 2, -height / 2, width, height);
            pop();
            fill(255, 100);
            rect(0, 0, width, height);
        }


        var total = 30;
        var count = 0;
        var attempts = 0;

        while (count < total) {
            var newC = newCircle();
            if (newC !== null) {
                circles.push(newC);
                count++;
            }
            attempts++;
            if (attempts > 100 || stampColorVectors.length < sampleArrayLength + 1) {
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
    textSize(20);
    strokeWeight(5);
    stroke(0);
    fill(255);
    text("Variance: " + sampleArrayLength + ", Unique: " + keyIsDown(67) + ", Mode: " + mode, 30, height - 30);
    text("Made by: Ali Tabatabai & Jesper Sam Sørensen, 2017", width - 510, height - 30);
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

    if (keyCode === 90) {
        if (sampleArrayLength > 1) {
            sampleArrayLength--;
        }
    }
    if (keyCode === 88) {
        if (sampleArrayLength < 10) {
            sampleArrayLength++;
        }
    }

    if (keyCode === 86) {
        if (mode === "Stamps") {
            mode = "Circles";
        } else if (mode === "Circles") { mode = "None"; } else if (mode === "None") { mode = "Stamps"; }
    }
}