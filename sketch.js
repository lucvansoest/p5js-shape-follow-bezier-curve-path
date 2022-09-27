

let gridSize = 1;
let gridMinSize = 7;
let gridMaxSize = 21;
let gridCellSize = 0;
let shapePoints = 1;
let pathLength = 200;
let allowCrossing = false;

let followPath = []
let shapeGradient;

let animationFrame = 0;

function setup() {

  colorMode(HSB);

  let backgroundColors = [
    color(256, 67, 100, 100),
    color(212, 72, 67, 100),
    color(60, 100, 100, 100),
    color(161, 97, 80, 100),
    color(328, 24, 98, 100),
    color(25, 9, 98, 100)
  ]

  let shapeGradients = [
    { steps: [ { position: 0, color: color(46, 0, 100, 100) }, { position: 1, color: color(46, 100, 0, 100)} ]},
    { steps: [ { position: 0, color: color(60, 2, 99, 100) }, { position: 1, color: color(8, 75, 82, 100)} ]},
    { steps: [ { position: 0, color: color(86, 25, 70, 100) }, { position: 1, color: color(184, 36, 55, 100)} ]},
    { steps: [ { position: 0, color: color(53, 27, 86, 100) }, { position: 1, color: color(46, 25, 40, 100)} ]},
    { steps: [ 
      { position: 0, color: color(203, 59, 74, 100) }, 
      { position: 0.1, color: color(135, 83, 48, 100) }, 
      { position: 0.2, color: color(20, 86, 73, 100) }, 
      { position: 0.3, color: color(203, 59, 74, 100) }, 
      { position: 0.4, color: color(135, 83, 48, 100) }, 
      { position: 0.5, color: color(335, 17, 79, 100) },  
      { position: 1, color: color(203, 59, 74, 100) } 
      ]},
  ]
  
  let canvasSize = 0;

  if (windowWidth < windowHeight) {
    canvasSize = windowWidth;
  }
  else {
    canvasSize = windowHeight;
  }

  gridSize = int(random(gridMinSize, gridMaxSize));
  shapePoints = int(random(Math.ceil(15)));
  pathLength = int(random(Math.ceil(pathLength / 4, pathLength)));
  allowCrossing = false; //Math.random() < 0.5;
  shapeGradientsIndex = int(random(shapeGradients.length));
  shapeGradient = shapeGradients[shapeGradientsIndex];

  pathLength *= gridSize / 2;

  console.log('gridSize: ' + gridSize);
  console.log('shapePoints: ' + shapePoints);
  console.log('pathLength: ' + pathLength);
  console.log('allowCrossing: ' + allowCrossing);
  console.log('shapeGradient: ' + shapeGradient);

  createCanvas(canvasSize, canvasSize);

  background(backgroundColors[int(random(backgroundColors.length))]);
  if (shapeGradientsIndex === 0) {
    background(0);
  }  

  gridCellSize = width / gridSize;

  followPath = buildPath(
    Math.floor(2, gridSize - 2), 
    Math.floor(2, gridSize - 2), 
    pathLength, 
    gridCellSize);

  noStroke();

}

function draw() {

  if (animationFrame < followPath.length) {

    let points = followPath[animationFrame].draw();

    for (const point of points) {
      drawShape(point.x, point.y);
    }  
    
    animationFrame++;
  }


}

let maxAttempts = 1000;

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

    if (attempt == maxAttempts / 2)
    {
      allowCrossing = true
    }

    // check for overlap
    if (!allowCrossing ) {
      testCrossing = path.filter(item => item.row == newRow && item.column == newColumn).length === 0;
    }

    if (testCrossing && !(newColumn < 1 || newColumn >= gridSize - 1 || newRow < 1 || newRow >= gridSize - 1))
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
    shapeGradient.steps
  );

  if (shapePoints < 5) {
    ellipse(0, 0, radius);
  } else {
    star(0, 0, radius, radius - radius / 2, shapePoints);
  }

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

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function radialGradient(sX, sY, sR, eX, eY, eR, steps){

  let gradient = drawingContext.createRadialGradient(
    sX, sY, sR, eX, eY, eR
  );

  for (let i = 0; i < steps.length; i++) {
    gradient.addColorStop(steps[i].position, steps[i].color);
  }

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
