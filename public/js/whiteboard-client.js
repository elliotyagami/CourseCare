'use strict';

(function() {

  var socket = io();
  var canvas = document.getElementById('whiteboard');
  var context = canvas.getContext('2d');

  var drawing = false;

//   clearButton.addEventListener('click', clearWhiteBoard, false);
//   canvas.addEventListener('mousedown', onMouseDown, false);
//   canvas.addEventListener('mouseup', onMouseUp, false);
//   canvas.addEventListener('mouseout', onMouseUp, false);
//   canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);


  socket.on('drawing', onDrawingEvent);

  window.addEventListener('resize', onResize, false);
  onResize();


  function drawLine(x0, y0, x1, y1, color, emit){
      if(emit){
          x0 -= canvas.getBoundingClientRect().left;
          y0 -= canvas.getBoundingClientRect().top;
          x1 -= canvas.getBoundingClientRect().left;
          y1 -= canvas.getBoundingClientRect().top;
      }

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

    if (!emit) { return; }
    var w = canvas.width;
    var h = canvas.height;

  }

//   function onMouseDown(e){
//     drawing = true;
//     current.x = e.clientX;
//     current.y = e.clientY;
//   }

//   function onMouseUp(e){
//     if (!drawing) { return; }
//     drawing = false;
//     drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
//   }

//   function onMouseMove(e){
//     if (!drawing) { return; }
//     drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
//     current.x = e.clientX;
//     current.y = e.clientY;
//   }

//   function onColorUpdate(e){
//     current.color = e.target.className.split(' ')[1];
//   }

//   // limit the number of events per second
//   function throttle(callback, delay) {
//     var previousCall = new Date().getTime();
//     return function() {
//       var time = new Date().getTime();

//       if ((time - previousCall) >= delay) {
//         previousCall = time;
//         callback.apply(null, arguments);
//       }
//     };
//   }

  function onDrawingEvent(data){
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, false);
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth/2;
    canvas.height = window.innerHeight/2;
  }
  function clearWhiteBoard(emit){
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  socket.on('clear', function(){
    clearWhiteBoard()
  })

})();
