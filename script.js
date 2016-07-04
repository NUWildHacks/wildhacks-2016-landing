function or(a, b) {
  return a || b;
}

var background = document.getElementById("background");
var background_clone = background.cloneNode(true);

var confetti_1 = document.getElementById("confetti-1");
var confetti_1_clone = confetti_1.cloneNode(true);

var confetti_2 = document.getElementById("confetti-2");
var confetti_2_clone = confetti_2.cloneNode(true);

var confetti_3 = document.getElementById("confetti-3");
var confetti_3_clone = confetti_3.cloneNode(true);

var confetti_4 = document.getElementById("confetti-4");
var confetti_4_clone = confetti_4.cloneNode(true);

var confettis = [confetti_1_clone, confetti_2_clone, confetti_3_clone, confetti_4_clone];
var colors = ["green", "blue", "yellow", "purple", "orange", "red"];

var w = window.innerWidth;
var h = window.innerHeight;
var window_center = {
  x: Math.floor(w/2),
  y: Math.floor(h/2)
}

var radians_to_degrees = 180/Math.PI;

var angle_noise = 25;
var position_noise_x = 20;
var position_noise_y = 20;

var screen_elements = [
  document.getElementById("presents").getBoundingClientRect(),
  document.getElementById("dummy").getBoundingClientRect(),
  document.getElementById("hackathon").getBoundingClientRect(),
  document.getElementById("mce-EMAIL").getBoundingClientRect(),
  document.getElementById("mc-embedded-subscribe").getBoundingClientRect(),
  document.getElementById("form-dummy").getBoundingClientRect()
]

function createBackground() {
  // insert here a way to clear the entire background

  for (var i = 0; i < 500; i++){
    var rand_confetti = Math.floor(Math.random() * 10) % confettis.length;

    var new_confetti = confettis[rand_confetti].cloneNode(true);
    new_confetti.id = "new-confetti";

    var rand_color = Math.floor(Math.random() * 10) % colors.length;
    new_confetti.className += " " + colors[rand_color];

    document.getElementById("background").appendChild(new_confetti);

    var rect = new_confetti.getBoundingClientRect();

    if ( screen_elements.map(
      function(a) {
        return !(
          ((a.top + a.height) < (rect.top)) ||
          (a.top > (rect.top + rect.height)) ||
          ((a.left + a.width) < rect.left) ||
          (a.left > (rect.left + rect.width))
        );
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

      var position_adjustment = Math.floor(Math.random() * 100) % position_noise_x - position_noise_x;

      if (rect.top % (rect.height * 2)) {
        // rect.left -= 1.5 * rect.width;
      }

      new_confetti.style.marginLeft = -position_adjustment + "px";
      position_adjustment = Math.floor(Math.random() * 100) % position_noise_y - position_noise_y;
      new_confetti.style.marginTop = position_adjustment + "px";

      var angle_adjustment = 0;
      var angle = Math.atan2(vector.y, vector.x) * radians_to_degrees + 270 + angle_adjustment;

      // var angle_adjustment = Math.floor(Math.random() * 100) % angle_noise - angle_noise;
      new_confetti.style.transform = "rotate(" + angle + "deg)";
    }

    new_confetti.removeAttribute("id")
  }
}

createBackground();

// window.addEventListener("resize", createBackground);
