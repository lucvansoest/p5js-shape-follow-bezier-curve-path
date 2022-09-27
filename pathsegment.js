const T = Symbol("top")
const R = Symbol("right")
const B = Symbol("bottom")
const L = Symbol("left")
const connectors = [T, R, B, L];

class PathSegment {

    constructor(index, column, row, size, c1, c2) {
      this.index = index;
      this.column = column;
      this.row = row;
      this.size = size;
      this.connector1 = c1;
      this.connector2 = c2;
      this.points = [];
    }

    get x() {
      return this.column * this.size;
    }
    get y() {
      return this.row * this.size;
    }

    getConnectorPoint(connector) {

        let connectorPoint;

        switch(connector) {
            case T:
                connectorPoint = createVector(this.size / 2, 0);
                break;
            case R:
                connectorPoint = createVector(this.size, this.size / 2);
                break;
            case B:
                connectorPoint = createVector(this.size / 2, this.size);
                break;
            case L:
                connectorPoint = createVector(0, this.size / 2);
                break;
            default:
              // code block
        }

        return connectorPoint;
    }

    // Method
    draw() {

        let p1, p2, p3, p4;

        p1 = this.getConnectorPoint(this.connector1);
        p4 = this.getConnectorPoint(this.connector2);

        push();

        translate(this.x, this.y);  

        let maxPoints = 250;
      
        switch(this.connector1) {
            case T:
                switch(this.connector2) {
                    case R:
                        p3 = createVector(this.size * 0.75, this.size / 2);
                        p2 = createVector(this.size / 2, this.size * 0.25);
                        break;
                    case B:
                        p2 = createVector(this.size / 2, 0);
                        p3 = createVector(this.size / 2, this.size);
                        break;
                    case L:
                        p3 = createVector(this.size * 0.25, this.size / 2);
                        p2 = createVector(this.size / 2, this.size * 0.25);
                        break;
                }
                break;
            case R:
                switch(this.connector2) {
                    case T:
                        p2 = createVector(this.size * 0.75, this.size / 2);
                        p3 = createVector(this.size / 2, this.size * 0.25);
                        break;
                    case B:
                        p2 = createVector(this.size * 0.75, this.size / 2);
                        p3 = createVector(this.size / 2, this.size * 0.75);
                        break;
                    case L:
                        p2 = createVector(0, this.size / 2);
                        p3 = createVector(this.size, this.size / 2);
                        break;
                }
                break;
            case B:
                switch(this.connector2) {
                    case T:
                        p3 = createVector(this.size / 2, 0);
                        p2 = createVector(this.size / 2, this.size);
                        break;
                    case R:
                        p3 = createVector(this.size * 0.75, this.size / 2);
                        p2 = createVector(this.size / 2, this.size * 0.75);
                        break;
                    case L:
                        p3 = createVector(this.size * 0.25, this.size / 2);
                        p2 = createVector(this.size / 2, this.size * 0.75);
                        break;
                }
                break;
            case L:
                switch(this.connector2) {
                    case T:
                        p2 = createVector(this.size * 0.25, this.size / 2);
                        p3 = createVector(this.size / 2, this.size * 0.25);
                        break;
                    case R:
                        p3 = createVector(0, this.size / 2);
                        p2 = createVector(this.size, this.size / 2);
                        break;
                    case B:
                        p2 = createVector(this.size * 0.25, this.size / 2);
                        p3 = createVector(this.size / 2, this.size * 0.75);
                        break;
                }
                break;
        }

        // // draw debug graphics

        // stroke(255, 0, 0)
        // strokeWeight(1);

        // fill(255, 0, 0)

        // ellipse(p1.x, p1.y, 5, 5);
        // ellipse(p4.x, p4.y, 5, 5);

        // noFill();

        // // Draw bezier using bezier()
        // bezier(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);

        // fill(0, 255, 0)
        // ellipse(p2.x, p2.y, 5, 5);
        // fill(0, 0, 255)
        // ellipse(p3.x, p3.y, 5, 5);

        // //rect(0, 0, this.size, this.size);

        // stroke(0);
        // //text(this.row + ' ' + this.y, this.size / 2, this.size / 2);
        // text(this.index, this.size / 2, this.size / 2);

        // stroke(0)

        for (let i = 0; i <= maxPoints; i++) {
      
          let step = i / maxPoints;
        
          // Find the X and Y coordinate using the bezierPoint() function
          let pointX = bezierPoint(p1.x, p2.x, p3.x, p4.x, step);
          let pointY = bezierPoint(p1.y, p2.y, p3.y, p4.y, step);

          fill("red");
        
          // Display it on the sketch
          // ellipse(pointX, pointY, 8, 8);

          this.points.push(createVector(pointX + this.x, pointY + this.y));
      
        }
      
        pop();

        return this.points;
    }
  }
  