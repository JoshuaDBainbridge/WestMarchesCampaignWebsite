// When true, moving the mouse draws on the canvas
//https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
let isDrawing = false;
let x = 0;
let y = 0;
 

const myPics = document.getElementById('myPics');
const context = myPics.getContext('2d');

context.moveTo(260,0)
context.lineTo(260,360)
context.stroke();

// var c = document.getElementById("myPics");
// var ctx = c.getContext("2d");
// ctx.moveTo(0, 0);
// ctx.lineTo(560, 360);
// ctx.stroke();

// ctx.moveTo(100, 0);
// ctx.lineTo(100, 100);
// ctx.stroke();

// ctx.moveTo(0, 50);
// ctx.lineTo(100, 50);
// ctx.stroke();

// event.offsetX, event.offsetY gives the (x,y) offset from the edge of the canvas.

// Add the event listeners for mousedown, mousemove, and mouseup
myPics.addEventListener('mousedown', e => {
  x = e.offsetX;
  y = e.offsetY;
  isDrawing = true;
  console.log(x+" "+y)
});

myPics.addEventListener('mousemove', e => {
  if (isDrawing === true) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = e.offsetX;
    y = e.offsetY;
  }
});

window.addEventListener('mouseup', e => {
  if (isDrawing === true) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = 0;
    y = 0;
    isDrawing = false;
  }
});


function drawLine(context, x1, y1, x2, y2) {
  console.log("DRAW: x,y" + x1 +" "+y1+" offX offY "+x2+" "+y2);
  console.log("draw");
  context.beginPath();
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

