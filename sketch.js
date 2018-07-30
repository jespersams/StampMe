var circles;
var still;
var baseColorVectors = [];
var baseArray = [];
var stampArray = [];
var stampStack = [];
var stampColorVectors = [];
var sampleArrayLength;
var video;
var capture;
var photoSnapped;
var mode;
var uniqueStamps;
var stampSize;
var stampSpeed;
var stampVariance;
var webcamWidth;
var webcamHeight;


function preload() {
    loadJSON("./stampPrimaries.json", stampLoader);
    sampleArrayLength = 5;
    uniqueStamps = 5;
    stampSize = 10;
    mode = "Stamps";
    stampSpeed = 10;
    stampVariance = 5;
}


function stampLoader(element) {
    for (var i = 0; i < element.length; i++) {
        stampStack.push(loadImage("./stamps/" + element[i].id + ".jpg"));
        baseColorVectors.push(element[i].rgb);
        baseArray.push({ "stampID": i, "stampCounter": 0 });
    }
    stampColorVectors = JSON.parse(JSON.stringify(baseColorVectors));
    stampArray = JSON.parse(JSON.stringify(baseArray));
    console.log(stampColorVectors[0]);

}




function setup() {
    webcamWidth = 1280;
    webcamHeight = 720;

    photoSnapped = false;
    still = createGraphics(webcamWidth, webcamHeight);
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
    capture.size(webcamWidth, webcamHeight);
    capture.hide();

    video = createCapture(VIDEO);
    video.size(webcamWidth, webcamHeight);
    video.hide();
    frameRate(30);
}

function draw() {

    if (photoSnapped) {

        if (!(attempts > 1000 || stampColorVectors.length < sampleArrayLength + 1)) {
            push();
            translate(width / 2, height / 2);
            scale(1, 1);
            if (width > height * (webcamWidth / webcamHeight)) {
                image(still, -width / 2, -width * (webcamHeight / webcamWidth) / 2, width, width * (webcamHeight / webcamWidth));
            } else {
                image(still, -height * (webcamWidth / webcamHeight) / 2, -height / 2, height * (webcamWidth / webcamHeight), height);
            }
            pop();
            fill(255, 100);
            rect(0, 0, width, height);
        }


        var total = floor(stampSpeed);
        var count = 0;
        var attempts = 0;

        while (count < total) {
            var newC = newCircle();
            if (newC !== null) {
                circles.push(newC);
                count++;
            }
            attempts++;
            if (attempts > 1000 || stampColorVectors.length < sampleArrayLength + 1) {
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
        if (width > height * (webcamWidth / webcamHeight)) {
            image(capture, -width / 2, -width * (webcamHeight / webcamWidth) / 2, width, width * (webcamHeight / webcamWidth));
        } else {
            image(capture, -height * (webcamWidth / webcamHeight) / 2, -height / 2, height * (webcamWidth / webcamHeight), height);
        }
        pop();
    }
    textSize(20);
    strokeWeight(5);
    stroke(0);
    fill(255);
    textAlign(LEFT, BOTTOM);
    text("Unique: " + floor(uniqueStamps) + "\nSize: " + floor(stampSize) + "\nJitter: " + sampleArrayLength, 20, height - 20);
    text("Variance: " + floor(stampVariance) + "\nSpeed: " + floor(stampSpeed) + "\nMode: " + mode, 150, height - 20);
    textAlign(RIGHT, BOTTOM);
    text("Stamp My Selfie\nMade by: Ali Tabatabai\n& Jesper Sam Sørensen, 2017", width - 20, height - 20);




    keyEntry();
}

function newCircle() {
    var x = random(0, width);
    var y = random(0, height);

    var valid = true;
    for (var i = 0; i < circles.length; i++) {
        var circle = circles[i];
        var d = dist(x, y, circle.x, circle.y);
        if (d - height / 500 * floor(stampSize) < circle.r) {
            valid = false;
            break;
        }
    }
    if (valid) {
        var index = (int(map(x, 0, width, 0, still.width)) + int(map(y, 0, height, 0, still.height)) * still.width) * 4;
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
            still = video.get();
            still.loadPixels();
            photoSnapped = true;

        } else {
            saveCanvas("screendump", "jpg");
            photoSnapped = false;
            stampColorVectors = JSON.parse(JSON.stringify(baseColorVectors));
            stampArray = JSON.parse(JSON.stringify(baseArray));
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


    if (keyCode === 67) {
        if (mode === "Stamps") {
            mode = "Circles";
        } else if (mode === "Circles") { mode = "None"; } else if (mode === "None") { mode = "Stamps"; }
    }
    if (keyCode === 86) {
        if (mode === "Stamps") {
            mode = "None";
        } else if (mode === "Circles") { mode = "Stamps"; } else if (mode === "None") { mode = "Circles"; }
    }
}


function keyEntry() {
    if (keyIsDown(81)) {
        if (uniqueStamps > 1 + 1 / 3) {
            uniqueStamps -= 1 / 3;
        }
    }
    if (keyIsDown(87)) {
        if (uniqueStamps < 100) {
            uniqueStamps += 1 / 3;
        }
    }

    if (keyIsDown(65)) {
        if (stampSize > 1 + 1 / 3) {
            stampSize -= 1 / 3;
        }
    }
    if (keyIsDown(83)) {
        if (stampSize < 100) {
            stampSize += 1 / 3;
        }
    }

    if (keyIsDown(69)) {
        if (stampVariance > 1 + 1 / 3) {
            stampVariance -= 1 / 3;
        }
    }
    if (keyIsDown(82)) {
        if (stampVariance < 100) {
            stampVariance += 1 / 3;
        }
    }


    if (keyIsDown(68)) {
        if (stampSpeed > 1 + 1 / 3) {
            stampSpeed -= 1 / 3;
        }
    }
    if (keyIsDown(70)) {
        if (stampSpeed < 100) {
            stampSpeed += 1 / 3;
        }
    }
};