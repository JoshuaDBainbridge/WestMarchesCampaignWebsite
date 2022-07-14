// Drawing Elements 
class Line {
  constructor() {
    this.xPoints = [];
    this.yPoints = [];
  }
  addPoint(x,y){
    this.xPoints.push(x);
    this.yPoints.push(y);
  }
  getX(num){
    return this.xPoints[num];
  }
  getY(num){
    return this.yPoints[num];
  }
  showX(){
    console.log(this.xPoints);
  }
}

class Tile {
  constructor(isActive, x, y, r, ground, dir){
    this.active = isActive;
    this.xPos = x; 
    this.yPos = y; 
    this.tileR = r;
    this.terrain = ground; 
    this.baseColour = " ";
    this.lightColour = " ";
    this.gradDir = dir;  
  }
  setTileColours(){
    switch(this.terrain){
      case 'grass':
        this.baseColour = "#D19C4C";
        this.lightColour =  "#E7CBA2";
        break;
      default:
        this.baseColour = "#FF0000";
        this.lightColour =  "#FFFFFF";
    }
  }
}
// End Drawing Elements
const canvas = document.getElementById('drawing-board');
const ctx = canvas.getContext('2d');

const toolbar = document.getElementById('toolbar');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX - window.innerWidth*(0.1);
canvas.height = window.innerHeight - canvasOffsetY - window.innerHeight*(0.1);

let isPainting = false;
let isPanning = false;
let togglePaint = true;
let lineWidth = 5;
let startX;
let startY;

let mapDrawings = [];

let currentMapX = 0; 
let currentMapY = 0;
const a = 2 * Math.PI / 6;
const r = 50; //should me 50
const mapRows = 3;
const mapCols = 3;

let colours = [[0,0,0],[0,1,0],[1,0,1],[0,0,0],[1,1,1],[0,0,0]];

// let pattern; 
// const img = new Image();
// img.src = 'grassTexture.jpg';
// img.onload = function() {
//   pattern = ctx.createPattern(img, 'repeat');
//   ctx.fillStyle = pattern;
//   ctx.fillRect(0, 0, 300, 300);
// };

// ------------------------------- Buttons 
toolbar.addEventListener('click', e => {
  if (e.target.id === 'togglePaint') {
    togglePaint = !(togglePaint);
  }
});
// ------------------------------- End Buttons
function init() {
  makeMap(currentMapX,currentMapY,mapRows,mapCols);
}
init();
// ------------------------------- Make Map
function drawHexagon(x, y, row, col) {
  ctx.beginPath();
  for (var i = 0; i < 6; i++) {
    ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
  }
  ctx.closePath();
  if (colours[row][col] == 0){
    // ctx.fillStyle = "#FF0000";
    // ctx.fill(); 
  }else if (colours[row][col] == 1){
    //ctx.fillStyle = "#D19C4C";
    var randomGrad = Math.floor(Math.random()*(4));
    console.log(randomGrad);
    if (randomGrad == 0){
      var grd = ctx.createLinearGradient(x-r, y-r, x+r, y+r);
    }else if (randomGrad ==1){
      var grd = ctx.createLinearGradient(x-r, y+r, x+r, y-r);
    }else if (randomGrad ==2){
      var grd = ctx.createLinearGradient(x+r, y-r, x-r, y+r);
    }else if (randomGrad ==3){
      var grd = ctx.createLinearGradient(x+r, y+r, x-r, y-r);
    }else{
      var grd = ctx.createLinearGradient(x-r, y-r, x+r, y+r);
    }
    grd.addColorStop(0, "#D19C4C");
    grd.addColorStop(1, "#E7CBA2");
    ctx.fillStyle = grd;
    ctx.fill(); 
    ctx.stroke();
  }
  ctx.beginPath();
}
function makeMap(mapStartX, mapStartY, rows, columns){
  ctx.lineWidth = 1;
  var holdStartX = mapStartX;
  var x = mapStartX;
  var y = mapStartY;
  for(var j = 0; j < rows; j++){
    for (var i = 0; i < columns; i++){
      drawHexagon(x, y,(j*2)+1,i);
      x+=(r + r*Math.sin((30*Math.PI)/180)); 
      drawHexagon(x, y-(r*Math.cos((30*Math.PI)/180)),(j*2),i);
      // drawHexagon(x, y+(r*Math.cos((30*Math.PI)/180)));
      x+=(r + r*Math.sin((30*Math.PI)/180)); 
    }
    x= holdStartX; 
    y += 2*(r*Math.cos((30*Math.PI)/180));
  }
}
// ------------------------------- Make Map End
// ------------------------------- Panning
function pan(mouseX, mouseY) {
  currentMapX = mouseX - startX;
  currentMapY = mouseY - startY;
  console.log(currentMapX + " , "+ currentMapY); 
  ctx.clearRect(0,0, canvas.width, canvas.height);
  makeMap(currentMapX,currentMapY,mapRows,mapCols);
}
// ------------------------------- Panning End
// ------------------------------- Painting
function draw(x,y){
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';

  ctx.lineTo(x - canvasOffsetX, y - canvasOffsetY);
  ctx.stroke();
  mapDrawings[mapDrawings.length-1].addPoint(x - canvasOffsetX, y - canvasOffsetY);
}
// ------------------------------- Painting End
// ------------------------------- Mouse Listeners 
const move = (e) => {
  if(isPanning){
    pan(e.clientX, e.clientY);
    return;
  }
  if(!isPainting) {
      return;
  }
  draw(e.clientX,e.clientY)
}

canvas.addEventListener('mousedown', (e) => {
  if(togglePaint){
    isPainting = true;
    isPanning = false; 
    startX = e.clientX;
    startY = e.clientY;
    let newLine = new Line();
    mapDrawings.push(newLine);
        
  }else{
    isPanning = true; 
    isPainting = false; 
    startX = e.clientX - currentMapX;
    startY = e.clientY - currentMapY;
  }
});

canvas.addEventListener('mouseup', e => {
  if(isPainting){
    mapDrawings[mapDrawings.length-1].showX();
  }
  isPainting = false;
  isPanning = false;

  ctx.stroke();
  ctx.beginPath();
});

canvas.addEventListener('mousemove', move);

