var confetti_rect, W, H, window_center, PAD, screen_elements, COLS, ROWS, TOTAL_CONFETTI, rect;

var background = document.getElementById("background");
var background_rect = background.getBoundingClientRect();
var background_clone = background.cloneNode(true);
var confetti_1_clone = document.getElementById("confetti-1").cloneNode(true);
var confetti_2_clone = document.getElementById("confetti-2").cloneNode(true);
var confetti_3_clone = document.getElementById("confetti-3").cloneNode(true);
var confetti_4_clone = document.getElementById("confetti-4").cloneNode(true);
var CONFETTI_CLONES = [confetti_1_clone, confetti_2_clone, confetti_3_clone, confetti_4_clone];
var COLORS = ["green", "blue", "yellow", "purple", "orange", "red"];

var RAD_TO_DEG = 180/Math.PI;

var ANGLE_NOISE = 25;
var POSITION_NOISE_X = 15;
var POSITION_NOISE_Y = 20;

setup();
createBackground();

function or(a, b) {
  return a || b;
};

function randIntLessThan(b) {
  return Math.floor((Math.random() * b));
}

function removeChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function setup() {
  confetti_rect = getConfettiSize();

  W = window.innerWidth;
  H = window.innerHeight;
  window_center = {
    x: Math.floor(W/2),
    y: Math.floor(H/2)
  };

  PAD = .055 * H;

  screen_elements = [
    getCollisionArea(document.getElementById("presents").getBoundingClientRect(), PAD),
    getCollisionArea(document.getElementById("dummy").getBoundingClientRect(), PAD),
    getCollisionArea(document.getElementById("hackathon").getBoundingClientRect(), PAD),
    getCollisionArea(document.getElementById("mce-EMAIL").getBoundingClientRect(), PAD),
    getCollisionArea(document.getElementById("mc-embedded-subscribe").getBoundingClientRect(), PAD)
  ];

  confetti_rect = getConfettiSize();
  COLS = Math.ceil(background_rect.width / confetti_rect.width);
  ROWS = Math.ceil(background_rect.height / confetti_rect.height);
  background.style.width = COLS * confetti_rect.width;

  TOTAL_CONFETTI = COLS * ROWS;
}

function getCollisionArea(box, PAD) {
  var collision_area = {
    top: box.top - PAD,
    left: box.left - PAD,
    height: box.height + (PAD * 2),
    width: box.width + (PAD * 2)
  };

  return collision_area;
}

function getConfettiSize() {
  var dummy = CONFETTI_CLONES[0].cloneNode(true);
  dummy.id = "";
  background.appendChild(dummy);
  var dummy_rect = dummy.getBoundingClientRect();
  background.removeChild(dummy);
  return dummy_rect;
}

function calcAngle(vector) {
  return angle = Math.atan2(vector.y, vector.x) * RAD_TO_DEG;
}

function resetBackground(center) {
  removeChildren(background);
  setup();
  createBackground();
}

function collide(a, b) {
  if (!b) b = rect;

  return !(
    ((a.top + a.height) < (rect.top)) ||
    (a.top > (rect.top + rect.height)) ||
    ((a.left + a.width) < rect.left) ||
    (a.left > (rect.left + rect.width))
  );
}

function createBackground() {
  for (var i = 0; i < TOTAL_CONFETTI; i++){
    var new_confetti = CONFETTI_CLONES[randIntLessThan(CONFETTI_CLONES.length)].cloneNode(true);
    new_confetti.id = "new-confetti";

    new_confetti.className += " " + COLORS[randIntLessThan(COLORS.length)];

    background.appendChild(new_confetti);

    rect = new_confetti.getBoundingClientRect();

    if ( screen_elements.map(
      function(a) {
        return collide(a);
      }
    ).reduce(or) ) {
      var this_confetti = document.getElementById("new-confetti");
      this_confetti.removeChild(
        this_confetti.getElementsByTagName("svg")[0]
      );
    } else {
      var rect_center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      }

      var vector = {
        x: window_center.x - rect_center.x,
        y: window_center.y - rect_center.y
      }

      var position_adjustment = randIntLessThan(POSITION_NOISE_X) * 2 - POSITION_NOISE_X;

      new_confetti.style.marginLeft = position_adjustment + "px";
      position_adjustment = randIntLessThan(POSITION_NOISE_Y) * 2 - POSITION_NOISE_Y;
      // new_confetti.style.marginTop = position_adjustment + "px";

      var angle_adjustment = 0;
      var angle = calcAngle(vector);

      var angle_adjustment = randIntLessThan(ANGLE_NOISE) * 2 - ANGLE_NOISE;
      angle += angle_adjustment
      new_confetti.style.transform = "rotate(" + angle + "deg)";
    }

    new_confetti.removeAttribute("id");
  }
};

var confettis = document.getElementsByClassName("svg-wrap");
var up = "first";
var THETA = 10;

function wiggle() {
  for (var i = 0; i < confettis.length; i++) {
    var angle = parseFloat(confettis[i].style.transform.replace("rotate(", "").replace("deg)", ""));
    angle += (up ? THETA : -THETA)
    confettis[i].style.transform = "rotate(" + angle + "deg)";
  }
  if (typeof up == "string") THETA *= 2;
  up = !up;
}

function randomWiggle() {
  for (var i = 0; i < confettis.length; i++) {
    var angle = parseFloat(confettis[i].style.transform.replace("rotate(", "").replace("deg)", ""));
    angle += (Math.ceil(Math.random() - .5) ? THETA : -THETA)
    confettis[i].style.transform = "rotate(" + angle + "deg)";
  }
}

function track(center) {
  for (var i = 0; i < confettis.length; i++) {
    var this_confetti = confettis[i];

    var this_confetti_rect = this_confetti.getBoundingClientRect();

    var vector = {
      x: center.x - (this_confetti_rect.left + this_confetti_rect.width / 2),
      y: center.y - (this_confetti_rect.top + this_confetti_rect.height / 2)
    }

    confettis[i].style.transform = "rotate(" + calcAngle(vector) + "deg)";
  }
}

function sprinkle() {
  var svg = document.getElementsByClassName('svg-wrap');
  
  for (var i = 0; i < svg.length; i++) {
    svg[i].style.visibility = "hidden";
  }

  var p = Array.apply(null, {length: svg.length}).map(Number.call, Number);
  var animation = setInterval(function() {
    for (var i = 0; i < p.length; i++) {
      if (randIntLessThan(p.length/3) == 0) {
        svg[p[i]].style.visibility = "visible";
        p.splice(i, 1);
      }
    } 
    if (!p.length) {
      clearInterval(animation);
      setInterval(wiggle, 500);
    }
  }, 100);
}

function fadeIn() {
  var svg = document.getElementsByTagName('svg');
  var svg_wrap = document.getElementsByClassName('svg-wrap');
  
  for (var i = 0; i < svg_wrap.length; i++) {
    svg_wrap[i].style.visibility = "hidden";

    svg_wrap[i].addEventListener("click", function(e){
      e.target.style.visibility = "visible";
      console.log("mouse")
    });
  }
}

window.addEventListener("resize", function() {
  resetBackground();
});

var mouse_pos = window_center;
var new_mouse_pos = mouse_pos;

switch(randIntLessThan(6)) {
  case 5:
    setInterval(randomWiggle, 500);
    break;

  case 4:
    window.addEventListener("mousemove", function(e) {
      new_mouse_pos = {
        x: e.clientX,
        y: e.clientY        
      }

      track(new_mouse_pos);
    });
    break;

  case 3:
    window.addEventListener("keydown", function(e) {
      resetBackground();
    });
    break;

  case 2:
    setInterval(function() {
      resetBackground();
    }, 500);
    break;

  case 1:
    setInterval(wiggle, 500);
    break;

  default:
    sprinkle();
}

