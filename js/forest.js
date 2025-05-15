let cols, rows;
let field = [];
let rez = 10;
let threshold = 0.5;
let noiseOffsets = [];
let characterX = 0;
let cameraX = 0;
let kaomoji = "(✿◕‿◕)";
let trees = [];
let branchCount = 5;
let minAngle = Math.PI / 6;
let maxAngle = Math.PI / 3;
let targetX = 0;
let easing = 0.05;
let maxWorldX = 10000 + 100;
let leftPressed = false;
let rightPressed = false;
let moveSpeed = 7;

const symbolTexts = {
    "٩۶": "Дерево радости и счастья",
    "ಡ": "Загадочное дерево мудрости",
    "益": "Дерево силы и энергии",
    "ヘ": "Дерево упорства и настойчивости",
    "o": "Дерево простоты и ясности",
    "๑": "Дерево любви и нежности",
    "ಠ": "Дерево удивления и изумления",
    "∀": "Дерево логики и разума",
    "ヮ": "Дерево веселья и смеха",
    "=": "Дерево баланса и гармонии",
    "≧": "Дерево амбиций и стремлений",
    "Θ": "Дерево знаний и мудрости"
};

function setupMarchingSquares() {
    cols = width / rez;
    rows = floor((height * 0.2) / rez);
    for (let i = 0; i < cols; i++) {
        noiseOffsets[i] = [];
        for (let j = 0; j < rows; j++) {
            noiseOffsets[i][j] = random(1000);
        }
    }
    generateField();
}

function generateField() {
    for (let i = 0; i < cols; i++) {
        field[i] = field[i] || [];
        for (let j = 0; j < rows; j++) {
            field[i][j] = noise(i * 0.1, j * 0.1, frameCount * 0.01);
        }
    }
}

function drawMarchingSquares() {
    push();
    translate(0, height * 0.8);
    stroke(0);
    strokeWeight(2);
    noFill();
    for (let i = 0; i < cols - 1; i++) {
        for (let j = 0; j < rows - 1; j++) {
            let x = i * rez;
            let y = j * rez;
            let state = getState(
                field[i][j] > threshold,
                field[i + 1][j] > threshold,
                field[i + 1][j + 1] > threshold,
                field[i][j + 1] > threshold
            );
            drawLines(x, y, state, i, j);
        }
    }
    pop();
}

function getState(a, b, c, d) {
  let t = frameCount * 0.05;
  let weightA = 6 + sin(t) * 2;
  let weightB = 4 + sin(t + 1) * 1;
  let weightC = 2 + sin(t + 2) * 0.5;
  let weightD = 1 + sin(t + 3) * 0.3;
  return floor(a * weightA + b * weightB + c * weightC + d * weightD);
}

function drawLines(x, y, state, i, j) {
  let a = createVector(x + rez / 2, y);
  let b = createVector(x + rez, y + rez / 2);
  let c = createVector(x + rez / 2, y + rez);
  let d = createVector(x, y + rez / 2);

  let noiseVal = noise(noiseOffsets[i][j] + frameCount * 0.05);
  noiseOffsets[i][j] += 0.01;

  switch (state) {
    case 1: line(d.x, d.y, c.x, c.y); break;
    case 2: line(c.x, c.y, b.x, b.y); break;
    case 3: line(d.x, d.y, b.x, b.y); break;
    case 4: line(a.x, a.y, b.x, b.y); break;
    case 5: line(d.x, d.y, a.x, a.y); line(c.x, c.y, b.x, b.y); break;
    case 6: line(a.x, a.y, c.x, c.y); break;
    case 7: line(d.x, d.y, a.x, a.y); break;
    case 8: line(a.x, a.y, d.x, d.y); break;
    case 9: line(a.x, a.y, c.x, c.y); break;
    case 10: line(a.x, a.y, b.x, b.y); line(d.x, d.y, c.x, c.y); break;
    case 11: line(a.x, a.y, b.x, b.y); break;
    case 12: line(b.x, b.y, d.x, d.y); break;
    case 13: line(b.x, b.y, c.x, c.y); break;
    case 14: line(c.x, c.y, d.x, d.y); break;
  }

  if (state > 0 && state < 15 && noiseVal > 0.7) {
    fill(139, 69, 19, map(noiseVal, 0.7, 1, 0, 150));
    beginShape();
    vertex(a.x, a.y);
    vertex(b.x, b.y);
    vertex(c.x, c.y);
    vertex(d.x, d.y);
    endShape(CLOSE);
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW || key === 'a' || key === 'A') {
      leftPressed = true;
  } else if (keyCode === RIGHT_ARROW || key === 'd' || key === 'D') {
      rightPressed = true;
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || key === 'a' || key === 'A') {
      leftPressed = false;
  } else if (keyCode === RIGHT_ARROW || key === 'd' || key === 'D') {
      rightPressed = false;
  }
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight - 80);
  canvas.parent('game-container');
  textSize(48);
  textAlign(CENTER, CENTER);
  setupMarchingSquares();
  document.body.style.overflowY = 'hidden';

  let treeConfigs = [
      { symbols: ["٩(◕‿", "•̀｡)۶", "٩(｡•́‿", "◕｡)۶"], baseSymbols: ["٩۶"] },
      { symbols: ["(„ಡω", "ಡ)", "(ಡ‸", "ಡ„)"], baseSymbols: ["ಡ"] },
      { symbols: ["٩(╬ʘ益", "Φ#)୨", "ʘ╬)۶", "୧(#Φ益"], baseSymbols: ["益"] },
      { symbols: ["ヾ(`ヘ", "￣)", "´)ﾉﾞ", "凸(￣ヘ"], baseSymbols: ["ヘ"] },
      { symbols: ["(o^▽", "<)o", "^o)", "o(>_"], baseSymbols: ["o"] },
      { symbols: ["(๑>◡", "´๑)۶", "<๑)", "٩(๑`^"], baseSymbols: ["๑"] },
      { symbols: ["ʕಠᴥ", "ಠლ)", "ಠʔ", "ლ(ಠ_"], baseSymbols: ["ಠ"] },
      { symbols: ["ヽ(o´", "┐(￣∀", "∀`)ﾉ", "￣)┌"], baseSymbols: ["∀"] },
      { symbols: ["｡ﾟ(Tヮ", "°☜)", "T)ﾟ｡", "☜(°ヮ"], baseSymbols: ["ヮ"] },
      { symbols: ["(=´x", "(=⩊=)", "`=)", "(=⩊"], baseSymbols: ["="] },
      { symbols: ["(*≧ω", "≦)", "≦*)", "(≧x"], baseSymbols: ["≧"] },
      { symbols: ["(◉Θ", "･´)", "◉)", "(`･Θ"], baseSymbols: ["Θ"] },
  ];

  for (let x = 200; x < 10000; x += 700) {
      let config = treeConfigs[floor(random(treeConfigs.length))];
      let popupText = symbolTexts[config.baseSymbols[0]] || "Тайное дерево с неизвестными свойствами";
      trees.push(new Tree(x, height * 0.7, random(50, 120), config.symbols, config.baseSymbols, popupText));
  }

  targetX = width / 2;
  characterX = targetX;
}

function draw() {
  background(255);
  generateField();
  drawMarchingSquares();

  if (leftPressed) {
      targetX -= moveSpeed;
  }
  if (rightPressed) {
      targetX += moveSpeed;
  }

  stroke(0);
  strokeWeight(4);
  let lineY = height * 0.8;
  line(0, lineY, width, lineY);

  characterX += (targetX - characterX) * easing;
  characterX = constrain(characterX, 0, maxWorldX);

  cameraX = characterX - width / 2;
  cameraX = constrain(cameraX, 0, maxWorldX - width);

  for (let tree of trees) {
      let screenX = tree.x - cameraX;
      if (screenX > -150 && screenX < width + 150) {
          tree.display(screenX, lineY, characterX);
      }
  }

  noStroke();
  fill(0);
  let screenX = characterX - cameraX;
  text(kaomoji, screenX, lineY - 25);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 80);
  setupMarchingSquares();
}

class Tree {
  constructor(x, y, len, symbols, baseSymbols, popupText) {
      this.x = x;
      this.y = y;
      this.len = len;
      this.symbols = symbols;
      this.baseSymbols = baseSymbols;
      this.popupText = popupText;
      this.symbolIndex = 0;
      this.time = 0;
      this.baseTextSize = 24;
      this.isNear = false;
      this.branchCount = 5;
      this.minAngle = Math.PI / 6;
      this.maxAngle = Math.PI / 3;
  }

  display(screenX, lineY, charX) {
      this.isNear = Math.abs(this.x - charX) < 50;
      push();
      translate(screenX, lineY);
      stroke(this.isNear ? "#FFB800" : 0);
      this.symbolIndex = 0;
      this.time += 0.008;
      this.drawBranch(this.len, this.branchCount);
      pop();

      if (this.isNear) {
          this.drawPopup(screenX, lineY);
      }
  }

  drawBranch(len, depth) {
      if (depth == 0) {
          push();
          translate(0, -len);
          fill(this.isNear ? "#FFB800" : 0);
          noStroke();
          let symbolSize = map(this.len, 50, 100, 10, 20);
          textSize(symbolSize);
          textAlign(CENTER, CENTER);
          text(this.symbols[this.symbolIndex % this.symbols.length], 0, 0);
          this.symbolIndex++;
          pop();
          return;
      }

      line(0, 0, 0, -len);
      translate(0, -len);

      let angleRange = this.isNear ? PI : (this.maxAngle - this.minAngle);
      let angle = sin(this.time) * angleRange;

      if (!this.isNear) {
          angle += (this.maxAngle + this.minAngle) / 2;
      }

      push();
      rotate(angle);
      this.drawBranch(len * 0.7, depth - 1);
      pop();

      push();
      rotate(-angle);
      this.drawBranch(len * 0.7, depth - 1);
      pop();
  }

  drawPopup(screenX, lineY) {
      push();
      translate(screenX, lineY - this.len - 250);
      textSize(18);
      let textW = textWidth(this.popupText) + 40;
      let rectW = Math.max(textW, 100);
      let rectH = 40;
      let baseWidth = this.baseSymbols.length * this.baseTextSize + 20;
      let baseHeight = this.baseTextSize + 10;

      fill(0);
      noStroke();
      rectMode(CORNER);
      rect(-rectW / 2, -rectH, rectW, rectH, 50);
      rect(rectW / 2 - baseWidth, -rectH - baseHeight, baseWidth, baseHeight, 50);

      fill(255);
      textAlign(CENTER, CENTER);
      text(this.popupText, 0, -rectH / 2);
      textSize(24);
      text(this.baseSymbols.join(""), rectW / 2 - baseWidth / 2, -rectH - baseHeight / 2);
      pop();
  }
}