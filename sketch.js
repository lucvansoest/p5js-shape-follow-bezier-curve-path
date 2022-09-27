

let gridSize = 5;
let gridCellSize = 0;

let followPath = []

function setup() {

  angleMode(DEGREES);
  colorMode(HSB);

  createCanvas(400, 400);


  background(212, 72, 67);
  
  drawingContext.fillStyle = 'blue';

  gridCellSize = width / gridSize;

  followPath = buildPath(
    Math.floor(gridSize / 2), 
    Math.floor(gridSize / 2), 
    25, 
    gridCellSize);

  noLoop();
}

function draw() {


  for (let i = 0; i < followPath.length; i++) { 

    let points = followPath[i].draw();

    for (const point of points) {
      drawShape(point.x, point.y);
    }
    
  }


}

let maxAttempts = 250;

function buildPath(row, column, length, size) {

  let path = [];
  let i = 0;
  let attempt = 0;

  while (path.length < length && attempt < maxAttempts ) {

    attempt++;

    let c1;
    
    if (i == 0) {
      c1 = connectors[Math.floor(random(connectors.length))];
    } else {
      let prevC = path[i - 1].connector2;
      switch(prevC) {
        case T:
          c1 = B;
          break;
        case R:
          c1 = L;
          break;
        case B:
          c1 = T;
          break;
        case L:
          c1 = R;
          break;
        default:
          // code block
      }
    }

    let c2 = connectors.filter(item => item !== c1)[Math.floor(random(connectors.filter(item => item !== c1).length))];

    let newRow = row;
    let newColumn = column;

    switch(c2) {
      case T:
        newRow--;
        break;
      case R:
        newColumn++;
        break;
      case B:
        newRow++;
        break;
      case L:
        newColumn--;
        break;
      default:
        // code block
    }

    // check for overlap
    var test = path.filter(item => item.row == newRow && item.column == newColumn);

    if (test.length == 0 && !(newColumn < 0 || newColumn >= gridSize || newRow < 0 || newRow >= gridSize))
    {
      let pathSegment = new PathSegment(i, column, row, size, c1, c2);
      path.push(pathSegment);

      row = newRow;
      column = newColumn;

      i++;
    }
  }

  return path;
}

function drawShape(centerX, centerY) {

  let radius = gridCellSize;

  noStroke();

  let numberOfSteps = 12;

  push();
  translate(centerX, centerY);

  radialGradient(
    -radius / 2,  -radius / 2, 0,//Start pX, pY, start circle radius
    0, 0, radius,//End pX, pY, End circle radius
    color(60, 2, 99, 100), //Start color
    color(8, 75, 82, 100), //End color
  );

  ellipse(0, 0, radius);


  pop();

  // //initialize variables
  // let stepSize = 360 / numberOfSteps; //in radians equivalent of 360/6 in degrees

  // for (let step = 0; step <= numberOfSteps; step++) {

  //   let angle = step * stepSize;

  //   //convert polar coordinates to cartesian coordinates
  //   var x = centerX + radius * sin(angle);
  //   var y = centerY + radius * cos(angle);

  //   push();
  //   translate(x, y);

  //   radialGradient(
  //     0, 0, 0,//Start pX, pY, start circle radius
  //     0, 0, radius,//End pX, pY, End circle radius
  //     color(190, 100, 100, 100), //Start color
  //     color(310, 100, 100, 100), //End color
  //   );

  //   rotate(-angle);
  //   ellipse(0, 0, radius / 4, radius + 5);
  //   pop();

  // }

}

function radialGradient(sX, sY, sR, eX, eY, eR, colorS, colorE){

  let gradient = drawingContext.createRadialGradient(
    sX, sY, sR, eX, eY, eR
  );
  gradient.addColorStop(0, colorS);
  gradient.addColorStop(1, colorE);

  drawingContext.fillStyle = gradient;
}

function linearGradient(sX, sY, eX, eY, colorS, colorE){
  let gradient = drawingContext.createLinearGradient(
    sX, sY, eX, eY
  );
  gradient.addColorStop(0, colorS);
  gradient.addColorStop(1, colorE);
  drawingContext.fillStyle = gradient;
  // drawingContext.strokeStyle = gradient;
}

function shadow(){
  drawingContext.shadowOffsetX = 14;
  drawingContext.shadowOffsetY = 14;
  drawingContext.shadowBlur = 14;
  drawingContext.shadowColor = color(230, 30, 18, 100);
}
