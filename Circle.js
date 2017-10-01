function Circle(x, y, color) {
    this.x = x;
    this.y = y;
    this.r = 2;
    this.color = color;
    console.log(stampColorVectors[0][0]);
    this.colorVector = [color.levels[0], color.levels[1], color.levels[2]];
    this.brightness = brightness(this.color);

    this.growing = true;

    this.minDistArray = [];

    for (var i = 0; i < sampleArrayLength; i++) {
        var colorDistance = dist(color.levels[0], color.levels[1], color.levels[2], stampColorVectors[i][0], stampColorVectors[i][1], stampColorVectors[i][2]);
        this.minDistArray.push({ "imageID": i, "colorDistance": colorDistance });
    }


    for (var i = sampleArrayLength; i < stampColorVectors.length; i++) {
        for (var j = 0; j < sampleArrayLength; j++) {
            var trialDistance = dist(color.levels[0], color.levels[1], color.levels[2], stampColorVectors[i][0], stampColorVectors[i][1], stampColorVectors[i][2]);
            if (this.minDistArray[j].colorDistance > trialDistance) {
                this.minDistArray.splice(j, 1);
                this.minDistArray.push({ "imageID": i, "colorDistance": trialDistance });
            }
        }
    }

    this.imageID = this.minDistArray[floor(random(0, sampleArrayLength))].imageID;
    this.serial = stampIDs[this.imageID];
    this.image = stampStack[this.serial];

    if (keyIsDown(67)) {
        stampColorVectors.splice(this.imageID, 1);
        stampIDs.splice(this.imageID, 1);
    }




    this.rotation = random(2 * PI);
    this.heightScalar = max(1, this.image.height / this.image.width) * 1.1;
    this.widthScalar = max(1, this.image.width / this.image.height) * 1.1;


    this.grow = function() {
        if (this.growing) {
            this.r += height / 250;
        }
        if (this.r > height / 40) {
            this.growing = false;
        }
    }


    this.show = function() {

        if (mode === "Stamps") {
            push();
            translate(this.x, this.y);
            rotate(this.rotation);
            image(this.image, -this.r * this.widthScalar, -this.r * this.heightScalar, this.r * 2 * this.widthScalar, this.r * 2 * this.heightScalar);
            pop();

        }
        if (mode === "Circles") {
            noStroke();
            fill(this.color);
            ellipse(this.x, this.y, this.r * 2, this.r * 2);
        }


    }

    this.edges = function() {
        return (this.x + this.r >= width || this.x - this.r <= 0 || this.y + this.r >= height || this.y - this.r <= 0)
    }
}