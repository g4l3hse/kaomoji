let cols, rows;
let w = 35;
let wValues = [35, 30, 25, 20];
let wIndex = 0;
let grid = [];
let stack = [];

let player;
let playerSize;
let defaultSpeed = 5;
let speed = defaultSpeed;
let slowSpeed = 2;
let jumpEnabled = false;
let reverseControls = false;
let bounceEnabled = false;
let autoMoveDirection = { x: 0, y: 0 };
let autoMoveTimer = 0;
let surpriseTimer = 0;
let surpriseActive = false;
let surpriseDuration = 30;
let surpriseSpeed = defaultSpeed * 3;

let firstCell, lastCell;

let timer = 10;
let interval = 10000;

let kaomojiIndex = 0;
let kaomojis = [
  "(´｡• ω •｡)",
  "(*≧ω≦*)",
  "(｡•́︿•̀｡)",
  "(凸ಠ益ಠ)凸",
  "(っ˘̩╭╮˘̩)っ",
  "w(°ｏ°)w",
];

function updatePlayerSize(w) {
  if (w === 35) return w * 0.4;
  if (w === 30) return w * 0.35;
  if (w === 25) return w * 0.3;
  if (w === 20) return w * 0.3;
  return w * 0.5;
}

function sketch(p) {
  p.setup = function () {
    p.createCanvas(750, 750);

    playerSize = updatePlayerSize(w);
    cols = Math.floor(p.width / w);
    rows = Math.floor(p.height / w);

    player = {
      x: w / 2 + 5,
      y: w / 2,
      col: 0,
      row: 0,
    };

    generateMaze();

    document.getElementById("toggle-w").addEventListener("click", () => {
      wIndex = (wIndex + 1) % wValues.length;
      w = wValues[wIndex];
      playerSize = updatePlayerSize(w);
      cols = Math.floor(p.width / w);
      rows = Math.floor(p.height / w);
      player.x = w / 2 + 5;
      player.y = w / 2;
      player.col = 0;
      player.row = 0;
      generateMaze();
    });

    const buttons = document.querySelectorAll(".kaomoji-btn");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        kaomojiIndex = parseInt(button.getAttribute("data-index"));
        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        surpriseTimer = 0;
        surpriseActive = false;
        surpriseDuration = 30;
        updatePlayerProperties();
      });
    });
    buttons[0].classList.add("active");

    setInterval(() => {
      generateMaze();
    }, interval);

    p.windowResized = function () {
      let newSize = Math.min(window.innerWidth * 0.8, window.innerHeight - 200, 750);
      p.resizeCanvas(newSize, newSize);

      cols = Math.floor(p.width / w);
      rows = Math.floor(p.height / w);

      player.x = w / 2 + 5;
      player.y = w / 2;
      player.col = 0;
      player.row = 0;

      generateMaze();
    };
  };

  p.draw = function () {
    p.background(255);
    drawMaze();
    updatePlayerProperties();
    handlePlayerMovement();

    p.noStroke();
    p.fill("#ffb800");
    p.rect(firstCell.i * w, firstCell.j * w, w, w);
    p.rect(lastCell.i * w, lastCell.j * w, w, w);

    drawPlayer();
  };

  function drawMaze() {
    for (let i = 0; i < grid.length; i++) {
      grid[i].show();
    }
  }

  let moveX = 0, moveY = 0;

  function drawPlayer() {
    p.push();
    p.translate(player.x, player.y);
    if (kaomojis[kaomojiIndex] === "w(°ｏ°)w" && surpriseActive) {
      let pulse = p.sin(p.frameCount * 0.2) * 0.3 + 1.5;
      p.textSize(playerSize * pulse);
      p.rotate(p.sin(p.frameCount * 0.1) * 0.2);
    } else {
      p.textSize(playerSize);
      if (!bounceEnabled && !surpriseActive) {
        if (moveX > 0) p.rotate(0);
        else if (moveX < 0) p.rotate(p.PI);
        else if (moveY > 0) p.rotate(p.PI / 2);
        else if (moveY < 0) p.rotate(-p.PI / 2);
      }
    }
    let kaomojiWidth = playerSize * 5;
    let kaomojiHeight = playerSize * 2;
    p.noStroke();
    p.fill("black");
    p.rectMode(p.CENTER);
    p.rect(0, 0, kaomojiWidth, kaomojiHeight, 10);
    p.textAlign(p.CENTER, p.CENTER);
    p.stroke("black");
    p.strokeWeight(2);
    p.fill("white");
    p.text(kaomojis[kaomojiIndex], 0, 0);
    p.pop();
  }

  function handlePlayerMovement() {
    let newX = player.x;
    let newY = player.y;
    moveX = 0;
    moveY = 0;

    if (bounceEnabled) {
      autoMoveTimer++;
      if (autoMoveTimer > 30) {
        let directions = [
          { x: speed, y: 0 },
          { x: -speed, y: 0 },
          { x: 0, y: speed },
          { x: 0, y: -speed },
        ];
        autoMoveDirection = p.random(directions);
        autoMoveTimer = 0;
      }
      moveX = autoMoveDirection.x;
      moveY = autoMoveDirection.y;
    } else {
      if (reverseControls) {
        if (p.keyIsDown(p.LEFT_ARROW) || p.keyIsDown(65)) moveX += speed;
        if (p.keyIsDown(p.RIGHT_ARROW) || p.keyIsDown(68)) moveX -= speed;
        if (p.keyIsDown(p.UP_ARROW) || p.keyIsDown(87)) moveY += speed;
        if (p.keyIsDown(p.DOWN_ARROW) || p.keyIsDown(83)) moveY -= speed;
      } else {
        if (p.keyIsDown(p.LEFT_ARROW) || p.keyIsDown(65)) moveX -= speed;
        if (p.keyIsDown(p.RIGHT_ARROW) || p.keyIsDown(68)) moveX += speed;
        if (p.keyIsDown(p.UP_ARROW) || p.keyIsDown(87)) moveY -= speed;
        if (p.keyIsDown(p.DOWN_ARROW) || p.keyIsDown(83)) moveY += speed;
      }
    }

    if (kaomojis[kaomojiIndex] === "w(°ｏ°)w") {
      surpriseTimer++;
      if (surpriseTimer > 180 && !surpriseActive) {
        surpriseActive = true;
        surpriseTimer = 0;
      }
      if (surpriseActive && (moveX !== 0 || moveY !== 0)) {
        moveX = moveX > 0 ? surpriseSpeed : moveX < 0 ? -surpriseSpeed : 0;
        moveY = moveY > 0 ? surpriseSpeed : moveY < 0 ? -surpriseSpeed : 0;
        surpriseDuration--;
        if (surpriseDuration <= 0) {
          let randomCell = p.floor(p.random(grid.length));
          player.x = grid[randomCell].i * w + w / 2 + 5;
          player.y = grid[randomCell].j * w + w / 2;
          player.col = grid[randomCell].i;
          player.row = grid[randomCell].j;
          surpriseActive = false;
          surpriseDuration = 30;
        }
      }
    }

    newX += moveX;
    newY += moveY;

    let currentCell = grid[player.col + player.row * cols];
    let collision = checkCollision(newX, newY, currentCell);

    if (jumpEnabled || !collision) {
      player.x = newX;
      player.y = newY;
    } else if (bounceEnabled) {
      if (collision) {
        if (moveX > 0) autoMoveDirection = { x: -speed, y: 0 };
        else if (moveX < 0) autoMoveDirection = { x: speed, y: 0 };
        if (moveY > 0) autoMoveDirection = { x: 0, y: -speed };
        else if (moveY < 0) autoMoveDirection = { x: 0, y: speed };
      }
      player.x += autoMoveDirection.x;
      player.y += autoMoveDirection.y;
    } else {
      if (!collision) {
        player.x = newX;
        player.y = newY;
      }
    }

    let newCol = p.floor(player.x / w);
    let newRow = p.floor(player.y / w);

    player.col = p.constrain(newCol, 0, cols - 1);
    player.row = p.constrain(newRow, 0, rows - 1);

    if (player.col === lastCell.i && player.row === lastCell.j) {
      showPopup();
    }
  }

  function checkCollision(newX, newY, cell) {
    let halfPlayer = playerSize / 2;
    let collided = false;

    let topWall = cell.j * w;
    let rightWall = (cell.i + 1) * w;
    let bottomWall = (cell.j + 1) * w;
    let leftWall = cell.i * w;

    if (cell.walls[0] && newY - halfPlayer < topWall) {
      collided = true;
      if (bounceEnabled) player.y = topWall + halfPlayer;
    }
    if (cell.walls[1] && newX + halfPlayer > rightWall) {
      collided = true;
      if (bounceEnabled) player.x = rightWall - halfPlayer;
    }
    if (cell.walls[2] && newY + halfPlayer > bottomWall) {
      collided = true;
      if (bounceEnabled) player.y = bottomWall - halfPlayer;
    }
    if (cell.walls[3] && newX - halfPlayer < leftWall) {
      collided = true;
      if (bounceEnabled) player.x = leftWall + halfPlayer;
    }

    return collided;
  }

  function generateMaze() {
    grid = [];
    stack = [];

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        let cell = new Cell(i, j);
        grid.push(cell);
      }
    }

    let current = grid[0];
    stack.push(current);

    while (stack.length > 0) {
      current.visited = true;
      let next = current.checkNeighbors();
      if (next) {
        next.visited = true;
        stack.push(current);
        removeWalls(current, next);
        current = next;
      } else {
        current = stack.pop();
      }
    }

    let playerCell = grid[player.col + player.row * cols];
    playerCell.visited = true;

    firstCell = grid[0];
    lastCell = grid[grid.length - 1];
  }

  function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;

    this.checkNeighbors = function () {
      let neighbors = [];
      let top = j > 0 ? grid[i + (j - 1) * cols] : undefined;
      let right = i < cols - 1 ? grid[i + 1 + j * cols] : undefined;
      let bottom = j < rows - 1 ? grid[i + (j + 1) * cols] : undefined;
      let left = i > 0 ? grid[i - 1 + j * cols] : undefined;

      if (top && !top.visited) neighbors.push(top);
      if (right && !right.visited) neighbors.push(right);
      if (bottom && !bottom.visited) neighbors.push(bottom);
      if (left && !left.visited) neighbors.push(left);

      if (neighbors.length > 0) {
        let r = p.floor(p.random(neighbors.length));
        return neighbors[r];
      }
      return undefined;
    };

    this.show = function () {
      let x = this.i * w;
      let y = this.j * w;

      p.noStroke();
      p.fill(255);
      p.rect(x, y, w, w);

      p.stroke("black");
      p.strokeWeight(2);
      if (this.walls[0]) p.line(x, y, x + w, y);
      if (this.walls[1]) p.line(x + w, y, x + w, y + w);
      if (this.walls[2]) p.line(x + w, y + w, x, y + w);
      if (this.walls[3]) p.line(x, y + w, x, y);
    };
  }

  function removeWalls(a, b) {
    let x = a.i - b.i;
    if (x === 1) {
      a.walls[3] = false;
      b.walls[1] = false;
    } else if (x === -1) {
      a.walls[1] = false;
      b.walls[3] = false;
    }
    let y = a.j - b.j;
    if (y === 1) {
      a.walls[0] = false;
      b.walls[2] = false;
    } else if (y === -1) {
      a.walls[2] = false;
      b.walls[0] = false;
    }
  }

  function showPopup() {
    document.getElementById("popup").style.display = "block";
  }

  window.closePopup = function () {
    document.getElementById("popup").style.display = "none";
    resetGame();
  };

  function resetGame() {
    player.x = w / 2 + 5;
    player.y = w / 2;
    player.col = 0;
    player.row = 0;
    generateMaze();
  }

  function updatePlayerProperties() {
    speed = defaultSpeed;
    jumpEnabled = false;
    reverseControls = false;
    bounceEnabled = false;

    switch (kaomojis[kaomojiIndex]) {
      case "(*≧ω≦*)":
        jumpEnabled = true;
        break;
      case "(｡•́︿•̀｡)":
        speed = slowSpeed;
        break;
      case "(凸ಠ益ಠ)凸":
        bounceEnabled = true;
        break;
      case "(っ˘̩╭╮˘̩)っ":
        reverseControls = true;
        break;
      case "w(°ｏ°)w":
        break;
      case "(´｡• ω •｡)":
      default:
        break;
    }
  }
}

new p5(sketch, "sketch-holder");