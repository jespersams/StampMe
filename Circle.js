function Circle(x, y, color) {
    this.x = x;
    this.y = y;
    this.r = 2;
    this.color = color;
    console.log(stampColorVectors[0][0]);
    this.colorVector = [color.levels[0], color.levels[1], color.levels[2]];
    this.brightness = brightness(this.color);

    this.growing = true;

    this.minDist = dist(color.levels[0], color.levels[1], color.levels[2], stampColorVectors[0][0], stampColorVectors[0][1], stampColorVectors[0][2]);
    console.log("start " + this.minDist);
    this.imageID = 0;



    for (var i = 1; i < stampColorVectors.length; i++) {
        if (this.minDist > dist(color.levels[0], color.levels[1], color.levels[2], stampColorVectors[i][0], stampColorVectors[i][1], stampColorVectors[i][2])) {
            this.minDist = dist(color.levels[0], color.levels[1], color.levels[2], stampColorVectors[i][0], stampColorVectors[i][1], stampColorVectors[i][2]);
            this.imageID = i;
        }

    }
    this.serial = stampIDs[this.imageID];
    this.image = stampStack[this.serial];
    stampColorVectors.splice(this.imageID, 1);
    stampIDs.splice(this.imageID, 1);
    this.rotation = random(2 * PI);
    this.heightScalar = max(1, this.image.height / this.image.width) * 1.1;
    this.widthScalar = max(1, this.image.width / this.image.height) * 1.1;

    this.grow = function() {
        if (this.growing) {
            this.r += 5;
        }
    }

    this.show = function() {
        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        image(this.image, -this.r * this.widthScalar, -this.r * this.heightScalar, this.r * 2 * this.widthScalar, this.r * 2 * this.heightScalar);


        // fill(this.color);
        // ellipse(0, 0, this.r * 2, this.r * 2);

        pop();




    }

    this.edges = function() {
        return (this.x + this.r >= width || this.x - this.r <= 0 || this.y + this.r >= height || this.y - this.r <= 0)
    }
}