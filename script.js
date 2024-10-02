let move_speed = 3;
let gravity = 0.5;
let bird = document.querySelector(".bird");
let img = document.getElementById("bird-1");
let sound_point = new Audio("sounds effect/point.mp3");
let sound_die = new Audio("sounds effect/die.mp3");

let background = document.querySelector(".background").getBoundingClientRect();
let score_val = document.querySelector(".score_val");
let message = document.querySelector(".message");
let score_title = document.querySelector(".score_title");

let game_state = "Start";
img.style.display = "none";
message.classList.add("messageStyle");

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && game_state !== "Play") {
    resetGame();
    play();
  }
});

let bird_dy = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === " ") {
    img.src = "images/Bird-2.png"; // Change to flapping bird image
    bird_dy = -7.6;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp" || e.key === " ") {
    img.src = "images/Bird.png"; // Change back to original bird image
  }
});

function resetGame() {
  document.querySelectorAll(".pipe_sprite").forEach((e) => {
    e.remove();
  });
  img.style.display = "block";
  bird.style.top = "40vh";
  game_state = "Play";
  score_val.innerHTML = "0";
  score_title.innerHTML = "Score: ";
  message.innerHTML = "";
  message.classList.remove("messageStyle");
}

function play() {
  function move() {
    if (game_state !== "Play") return;

    let pipe_sprites = document.querySelectorAll(".pipe_sprite");
    pipe_sprites.forEach((pipe) => {
      let pipe_props = pipe.getBoundingClientRect();
      let bird_props = bird.getBoundingClientRect();

      if (pipe_props.right <= 0) {
        pipe.remove();
      } else {
        if (checkCollision(bird_props, pipe_props)) {
          endGame();
          return;
        }

        if (pipe_props.right < bird_props.left && pipe.increase_score === "1") {
          score_val.innerHTML = parseInt(score_val.innerHTML) + 1;
          sound_point.play();
          pipe.increase_score = "0"; // Prevent multiple score increases
        }

        pipe.style.left = pipe_props.left - move_speed + "px";
      }
    });
    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);
  applyGravity();
  createPipes();
}

function checkCollision(bird_props, pipe_props) {
  return (
    bird_props.left < pipe_props.left + pipe_props.width &&
    bird_props.left + bird_props.width > pipe_props.left &&
    bird_props.top < pipe_props.top + pipe_props.height &&
    bird_props.top + bird_props.height > pipe_props.top
  );
}

function endGame() {
  game_state = "End";
  message.innerHTML = "Game Over<br>Press Enter To Restart";
  message.classList.add("messageStyle");
  img.style.display = "none";
  sound_die.play();
}

function applyGravity() {
  if (game_state !== "Play") return;

  bird_dy += gravity;
  bird.style.top = bird.offsetTop + bird_dy + "px";

  let bird_props = bird.getBoundingClientRect();
  if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
    endGame();
  }

  requestAnimationFrame(applyGravity);
}

let pipe_separation = 0;
let pipe_gap = 35;

function createPipes() {
  if (game_state !== "Play") return;

  if (pipe_separation > 115) {
    pipe_separation = 0;

    let pipe_posi = Math.floor(Math.random() * 43) + 8;

    let pipe_sprite_inv = document.createElement("div");
    pipe_sprite_inv.className = "pipe_sprite";
    pipe_sprite_inv.style.top = pipe_posi - 70 + "vh";
    pipe_sprite_inv.style.left = "100vw";

    document.body.appendChild(pipe_sprite_inv);

    let pipe_sprite = document.createElement("div");
    pipe_sprite.className = "pipe_sprite";
    pipe_sprite.style.top = pipe_posi + pipe_gap + "vh";
    pipe_sprite.style.left = "100vw";
    pipe_sprite.increase_score = "1";

    document.body.appendChild(pipe_sprite);
  }
  pipe_separation++;
  requestAnimationFrame(createPipes);
}
