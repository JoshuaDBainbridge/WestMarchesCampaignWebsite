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
let currentMapX = 0; 
let currentMapY = 0;

const a = 2 * Math.PI / 6;
const r = 50; 
const mapRows = 5;
const mapCols = 5; 
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
function drawHexagon(x, y) {
  ctx.beginPath();
  for (var i = 0; i < 6; i++) {
    ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
  }
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
}
function makeMap(mapStartX, mapStartY, rows, columns){
  ctx.lineWidth = 1;
  var holdStartX = mapStartX;
  var x = mapStartX;
  var y = mapStartY;
  for(var j = 0; j <= rows; j++){
    for (var i = 0; i <= columns; i++){
      drawHexagon(x, y);
      x+=(r + r*Math.sin((30*Math.PI)/180)); 
      drawHexagon(x, y-(r*Math.cos((30*Math.PI)/180)));
      drawHexagon(x, y+(r*Math.cos((30*Math.PI)/180)));
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
  }else{
    isPanning = true; 
    isPainting = false; 
    startX = e.clientX - currentMapX;
    startY = e.clientY - currentMapY;
  }
});

canvas.addEventListener('mouseup', e => {
  isPainting = false;
  isPanning = false;

  ctx.stroke();
  ctx.beginPath();
});

canvas.addEventListener('mousemove', move);

