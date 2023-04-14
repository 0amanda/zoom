// https://codepen.io/amir-s/pen/jzqZdG?editors=0010

let canvas, squares;
const controls = {
  view: {x: 0, y: 0, zoom: 1},
  viewPos: { prevX: null,  prevY: null,  isDragging: false },
}

function setup() {
	canvas = createCanvas(2550, 1080);
  canvas.mouseWheel(e => Controls.zoom(controls).worldZoom(e))
  squares = Square.create(10)
}

function draw() {
	background(50)
  translate(controls.view.x, controls.view.y);
  scale(controls.view.zoom)
  rect(500,500,350,300);
  squares.forEach(square => square.show());
}

window.mousePressed = e => Controls.move(controls).mousePressed(e)
window.mouseDragged = e => Controls.move(controls).mouseDragged(e);
window.mouseReleased = e => Controls.move(controls).mouseReleased(e)


class Controls {
  static move(controls) {
    function mousePressed(e) {
      controls.viewPos.isDragging = true;
      controls.viewPos.prevX = e.clientX;
      controls.viewPos.prevY = e.clientY;
    }

    function mouseDragged(e) {
      const {prevX, prevY, isDragging} = controls.viewPos;
      if(!isDragging) return;

      const pos = {x: e.clientX, y: e.clientY};
      const dx = pos.x - prevX;
      const dy = pos.y - prevY;

      if(prevX || prevY) {
        controls.view.x += dx;
        controls.view.y += dy;
        controls.viewPos.prevX = pos.x, controls.viewPos.prevY = pos.y
      }
    }

    function mouseReleased(e) {
      controls.viewPos.isDragging = false;
      controls.viewPos.prevX = null;
      controls.viewPos.prevY = null;
    }
 
    return {
      mousePressed, 
      mouseDragged, 
      mouseReleased
    }
  }

  static zoom(controls) {
    // function calcPos(x, y, zoom) {
    //   const newX = width - (width * zoom - x);
    //   const newY = height - (height * zoom - y);
    //   return {x: newX, y: newY}
    // }

    function worldZoom(e) {
      const {x, y, deltaY} = e;
      const direction = deltaY > 0 ? -1 : 1;
      const factor = 0.005;
      const zoom = 0.5 * direction * factor;

      const wx = (x-controls.view.x)/(width*controls.view.zoom);
      const wy = (y-controls.view.y)/(height*controls.view.zoom);
      
      controls.view.x -= wx*width*zoom;
      controls.view.y -= wy*height*zoom;
      controls.view.zoom += zoom;
    }

    return {worldZoom}
  }
}


class Square {
  constructor(x, y) {
    this.x = 500;
    this.y = 500;
  }
  
  show() {
    fill(150);
    noStroke();
    rect(this.x, this.y, 100, 100);
  }
  
  static create(count) {
   return Array.from(Array(count), () => {
     const x = (500,500);
      const y = (500,500);
     return new this(x, y);
 })
}
}