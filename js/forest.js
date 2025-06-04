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
let moveSpeed = 10;

const symbolTexts = {
    "٩۶": "Arabic notation for the number 96, which looks like fists. In binary code, the number 96 is on the list of evil numbers",
    "ಡ": "A letter of the Kannada alphabet that looks like a sad eye",
    "益": "A character meaning 'more than'. Used as a face to show a strong emotion of displeasure",
    "ヘ": "The hiragana character for 'HE'. Shows a snorting or displeased mouth",
    "o": "A universal symbol of a circle, resembling an eye, a mouth, a nose, and a fist",
    "๑": "The number 1 in Thai is visually similar to blush.",
    "ಠ": "A letter of the Kannada alphabet that looks like a confused judging eye",
    "∀": "A symbol that resembles an open mouth in surprise, signifying unity. Used to represent a mouth or eyes",
    "ヮ": "A katakana symbol representing the universal sound 'WA', which combines the meanings of surprise, fear, delight and several others. Often depicts a mouth",
    "=": "A symbol of equality depicted with closed eyes",
    "≧": "A mathematical symbol that looks like a wrinkled, closed eye",
    "Θ": "In ancient Greek it sounded like an aspirated sound, but is now used to represent an open, surprised mouth"
};

function setupMarchingSquares() {
    cols = width / rez;
    rows = floor((height * 0.5) / rez);
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
  let canvas = createCanvas(windowWidth, windowHeight);
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

  for (let i = 0; i < treeConfigs.length; i++) {
    let x = 300 + i * 700;
    let config = treeConfigs[i];
    let popupText = symbolTexts[config.baseSymbols[0]] || "Тайное дерево с неизвестными свойствами";
    trees.push(new Tree(x, height * 0.7, random(80, 130), config.symbols, config.baseSymbols, popupText));
}

for (let x = 200 + treeConfigs.length * 700; x < 10000; x += 700) {
    let config = treeConfigs[floor(random(treeConfigs.length))];
    let popupText = symbolTexts[config.baseSymbols[0]] || "Тайное дерево с неизвестными свойствами";
    trees.push(new Tree(x, height * 0.7, random(80, 130), config.symbols, config.baseSymbols, popupText));
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
  strokeWeight(2);
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
    let scaleFactor = windowWidth <= 768 ? 0.8 : windowWidth <= 1024 ? 0.9 : 1;
    const maxWidth = 350 * scaleFactor; // 280px mobile, 315px tablet, 350px desktop
    const padding = 20 * scaleFactor; // 16px mobile, 18px tablet, 20px desktop
    const baseHeight = 40 * scaleFactor; // 32px mobile, 36px tablet, 40px desktop
    const baseWidth = this.baseSymbols.length * 30 * scaleFactor + 30 * scaleFactor;
    let fontSize = 24 * scaleFactor; // 19.2px mobile, 21.6px tablet, 24px desktop
    const offsetY = 200 * scaleFactor; // 160px mobile, 180px tablet, 200px desktop

    translate(screenX, lineY - this.len - offsetY);

    textSize(fontSize);
    let textWidthCurrent = textWidth(this.popupText);

    while (textWidthCurrent > maxWidth - 2 * padding && fontSize > 14 * scaleFactor) {
      fontSize -= 1;
      textSize(fontSize);
      textWidthCurrent = textWidth(this.popupText);
    }

    let lines = [];
    let currentLine = "";
    let words = this.popupText.split(' ');

    for (let word of words) {
      let testLine = currentLine ? currentLine + ' ' + word : word;
      if (textWidth(testLine) <= maxWidth - 2 * padding) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);

    const lineHeight = fontSize * 1.5;
    const popupHeight = lines.length * lineHeight + 1.5 * padding;
    const popupWidth = Math.min(
      Math.max(...lines.map(line => textWidth(line))) + 2 * padding,
      maxWidth
    );

    fill(0);
    noStroke();
    rectMode(CORNER);
    rect(-popupWidth / 2, -popupHeight, popupWidth, popupHeight, 30 * scaleFactor);
    rect(popupWidth / 2 - baseWidth, -popupHeight - baseHeight, baseWidth, baseHeight, 30 * scaleFactor);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(fontSize);

    for (let i = 0; i < lines.length; i++) {
      text(
        lines[i],
        0,
        -popupHeight + padding + i * lineHeight + fontSize / 2
      );
    }

    textSize(30 * scaleFactor);
    text(
      this.baseSymbols.join(""),
      popupWidth / 2 - baseWidth / 2,
      -popupHeight - baseHeight / 2
    );

    pop();
  }
}