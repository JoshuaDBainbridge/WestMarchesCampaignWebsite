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
  constructor(isActive, x, y, r, ground, dir, id){
    this.active = isActive;
    this.xPos = x; 
    this.yPos = y; 
    this.tileR = r;
    this.terrain = ground; 
    this.gradDir = dir; 
    this.tileID = id;
  }
  setX(x){
    this.xPos = x;
  }
  setY(y){
    this.yPos = y; 
  }
  setTerrian(biom){
    this.terrain = biom;
  }
  showX(){
    console.log(this.xPos);
  }
  getTerrian(){
    return this.terrain;
  }
  showAll(){
    //console.log(this.xPos + " " + this.yPos + " " + this.active);
  }
}
// End Drawing Elements
const canvas = document.getElementById('drawing-board');
const ctx = canvas.getContext('2d');

const toolbar = document.getElementById('toolbar');
const zoomSlider = document.getElementById('mapZoom');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX - window.innerWidth*(0.1);
canvas.height = window.innerHeight - canvasOffsetY - window.innerHeight*(0.1);

const mapRows = 30;
const mapCols = 15;
const a = 2 * Math.PI / 6;
const defaultR = 50

const map = [];

let isPainting = false;
let isPanning = false;
let togglePaint = true;
let lineWidth = 5;
let startX;
let startY;

let mapDrawings = [];

let currentMapX = 0; 
let currentMapY = 0;
let mapScale = 1; 
let r = mapScale * defaultR;

// ------------------------------- Buttons 
toolbar.addEventListener('click', e => {
  if (e.target.id === 'togglePaint') {
    togglePaint = !(togglePaint);
  }
});
// ------------------------------- End Buttons
function init() {
  createMap();
  makeMap(currentMapX,currentMapY,mapRows,mapCols);
}
init();
// ------------------------------- Make Map
function createMap(){  
  var id = 0; 
  for(var j = 0; j < 2*mapRows; j++){
    var temp = [];
    for(var i = 0; i < mapCols; i++){
      if(j == 0 || j == 1|| j == 2|| i == 0 || i == mapCols-1 || j == 2*mapRows-1 || j == 2*mapRows-2 || j == 2*mapRows-3 ){ //i == 0 || i == mapCols-1 || j == 2*mapRows-1 || j == 2*mapRows-1 ){
        temp.push(new Tile(true, 0,0,r,"water",Math.floor(Math.random()*(4)),id)); 
      }else{
        temp.push(new Tile(true, 0,0,r,"empty",Math.floor(Math.random()*(4)),id)); 
      }
      id++; 
    }
    map.push(temp);
  }
}
function colorTile(biom, dir, x,y,r){
  switch(dir){
    case 0:
      var grd = ctx.createLinearGradient(x-r, y-r, x+r, y+r);
      break;
    case 1: 
      var grd = ctx.createLinearGradient(x-r, y+r, x+r, y-r);
      break; 
    case 2: 
      var grd = ctx.createLinearGradient(x+r, y-r, x-r, y+r);
      break;
    case 3: 
      var grd = ctx.createLinearGradient(x+r, y+r, x-r, y-r);
      break;
    default:
  } 
  var baseColour = " ";
  var lightColour = " ";
  switch(biom){
    case 'grass':
      baseColour = "#D19C4C";
      lightColour =  "#E7CBA2";
      break;
    case "water":
      baseColour = "#98AFC7";
      lightColour = "#527498";
      break;
    case "start":
      baseColour = "#D4AF37";
      lightColour = "#996515";
      break;
    case "select":
      baseColour = "#FFFF00";
      lightColour = "#FFFF00";
    default:
      baseColour = "#FF0000";
      lightColour =  "#FEFD06";
  }
  grd.addColorStop(0, baseColour);
  grd.addColorStop(1, lightColour);

  return grd; 
}
function drawHexagon(x, y, row, col, isSelected) {
  ctx.beginPath();
  for (var i = 0; i < 6; i++) {
    ctx.lineTo(x + r*Math.cos(a * i), y + r* Math.sin(a * i));
  }
  ctx.closePath();
  if (!map[row][col].active){
    // no fill no out line
  }else{
    if(map[row][col].terrain != "empty"){
      if(isSelected){
        ctx.fillStyle = colorTile("select", map[row][col].gradDir, x,y,r);
      }else{
        ctx.fillStyle = colorTile(map[row][col].terrain, map[row][col].gradDir, x,y,r);
      }
      ctx.fill(); 
      ctx.stroke();
    }else{
      ctx.stroke();
    }
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
      drawHexagon(x, y,(j*2)+1,i, false);
      //----
      map[(j*2)+1][i].setX(x);
      map[(j*2)+1][i].setY(y);
      map[(j*2)+1][i].showAll();
      //----
      x+=(r + r*Math.sin((30*Math.PI)/180)); 
      drawHexagon(x, y-(r*Math.cos((30*Math.PI)/180)),(j*2),i,false);
      //----
      map[(j*2)][i].setX(x);
      map[(j*2)][i].setY(y);
      //----
      x+=(r + r*Math.sin((30*Math.PI)/180)); 
    }
    x= holdStartX; 
    y += 2*(r*Math.cos((30*Math.PI)/180));
  }
}
// ------------------------------- Make Map End
// ------------------------------- Select
function select(mouseX, mouseY){
  console.log("searching");
  var diff = 1000; 
  var temp = 0; 
  var hexJ, hexI, tempX, tempY;
  for (var j = 0; j < 2*mapRows; j++){
    for(var i=0; i < mapCols; i++){
      tempX = map[j][i].getX - (mouseX - canvasOffsetX);
      tempY = map[j][i].getY - (mouseY - canvasOffsetY);
      console.log(tempX + " " + tempY);
      temp = Math.sqrt((tempX*tempX)+(tempY*tempY));

      if(diff < temp){
        diff = temp; 
        hexI = i; 
        hexJ = j;
      }
    }
  }
  drawHexagon(map[j][i].getX, map[j][i].getY, j,i,true);
}
// ------------------------------- Select End
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
// ------------------------------- Mouse Listeners End
// ------------------------------- Slider Listener 
zoomSlider.oninput = function() {
  console.log("THE SCALE IS " + this.value);
  switch(this.value){
    case '1':
      mapScale = 0.25;
    break; 
    case '2': 
      mapScale = 0.5;
    break; 
    case '3': 
      mapScale = 0.75;
    break; 
    case '4':
      mapScale = 1; 
    break; 
    case '5': 
      mapScale = 1;
    break; 
    case '6': 
      mapScale = 1;
    break; 
    case '7':
      mapScale = 2; 
    break; 
    case '8': 
      mapScale = 3;
    break; 
    case '9': 
      mapScale = 4;
    break; 
    case '10':
      mapScale = 5;
    break; 
    default:
      console.log("default");
      mapScale = 1;
  }
  r = mapScale * defaultR;
  ctx.clearRect(0,0, canvas.width, canvas.height);
  makeMap(currentMapX,currentMapY,mapRows,mapCols);
}
// ------------------------------- Slider Listener End
