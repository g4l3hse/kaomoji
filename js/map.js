let cols, rows;
let field = [];
let scl = 7;
let noiseScale = 0.09;
let threshold = 0.5;
let noiseOffsets = [];
let textObjects = [];
let maxTextObjects = 50;
const levelsKaomoji = [
  ["( • ᴗ • )", "o(TヘTo)", "୧(#Φ益Φ#)୨"],
  ["٩(◕‿◕｡)۶", "( ╥ω╥ )", "(‡▼益▼)"],
  ["(´,,•ω•,,)♡", "(っ˘̩╭╮˘̩)っ", "٩(•́皿•̀)۶"],
  ["o(≧▽≦)o", "(ಥ﹏ಥ)", "ψ(▼へ▼メ)～→"]
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = ceil(windowWidth / scl);
  rows = ceil(windowHeight / scl);
  frameRate(12);

  for (let i = 0; i < cols; i++) {
    noiseOffsets[i] = [];
    for (let j = 0; j < rows; j++) {
      noiseOffsets[i][j] = random(1000);
    }
  }

  generateField();
}

function draw() {
  background(255);
  drawHerringboneDivider();
  generateField();
  drawMarchingSquares();
  manageTextObjects();
  drawTextObjects();
}

function drawHerringboneDivider() {
  stroke(0);
  strokeWeight(2);
  noFill();
  line(0, 1, windowWidth, 1);
}

function generateField() {
  for (let i = 0; i < cols; i++) {
    field[i] = field[i] || [];
    for (let j = 0; j < rows; j++) {
      let x = i * noiseScale;
      let y = j * noiseScale;
      field[i][j] = noise(x, y, frameCount * 0.01);
    }
  }
}

function drawMarchingSquares() {
  stroke(0);
  strokeWeight(1.5);
  noFill();
  for (let i = 0; i < cols - 1; i++) {
    for (let j = 0; j < rows - 1; j++) {
      let x = i * scl;
      let y = j * scl;
      let state = getState(
        field[i][j] > threshold,
        field[i + 1][j] > threshold,
        field[i + 1][j + 1] > threshold,
        field[i][j + 1] > threshold
      );
      drawLines(x, y, state, i, j);
    }
  }
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
  let a = createVector(x + scl / 2, y);
  let b = createVector(x + scl, y + scl / 2);
  let c = createVector(x + scl / 2, y + scl);
  let d = createVector(x, y + scl / 2);

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

  if (state > 0 && state < 15 && noiseVal > 0.75) {
    fill(0, map(noiseVal, 0.7, 1, 0, 150));
    beginShape();
    vertex(a.x, a.y);
    vertex(b.x, b.y);
    vertex(c.x, c.y);
    vertex(d.x, d.y);
    endShape(CLOSE);
  }
}

function manageTextObjects() {
  textObjects = textObjects.filter(textObj => {
    let i = floor(textObj.x / scl);
    let j = floor(textObj.y / scl);
    if (i < 0 || i >= cols || j < 0 || j >= rows) return false;

    let noiseVal = noise(noiseOffsets[i][j] + frameCount * 0.05);
    let state = getState(
      field[i][j] > threshold,
      i + 1 < cols ? field[i + 1][j] > threshold : false,
      i + 1 < cols && j + 1 < rows ? field[i + 1][j + 1] > threshold : false,
      j + 1 < rows ? field[i][j + 1] > threshold : false
    );
    let isFilled = state > 0 && state < 15 && noiseVal > 0.85;

    if (isFilled || state > 0) return false;

    textObj.move();
    return true;
  });

  for (let i = 0; i < textObjects.length; i++) {
    for (let j = i + 1; j < textObjects.length; j++) {
      let obj1 = textObjects[i];
      let obj2 = textObjects[j];
      let d = dist(obj1.x, obj1.y, obj2.x, obj2.y);
      if (
        d < 70 &&
        obj1.level === obj2.level &&
        obj1.index === obj2.index &&
        obj1.level < levelsKaomoji.length
      ) {
        textObjects.splice(j, 1);
        textObjects.splice(i, 1);
        let newX = (obj1.x + obj2.x) / 2;
        let newY = (obj1.y + obj2.y) / 2;
        let newObj = new TextObject(newX, newY, obj1.level + 1, obj1.index);
        newObj.startMergeAnimation();
        textObjects.push(newObj);
        i--;
        break;
      }
    }
  }

  while (textObjects.length < maxTextObjects) {
    let attempts = 0;
    const maxAttempts = 100;
    let placed = false;

    while (!placed && attempts < maxAttempts) {
      let x = random(windowWidth);
      let y = random(windowHeight);
      let i = floor(x / scl);
      let j = floor(y / scl);

      if (i >= 0 && i < cols - 1 && j >= 0 && j < rows - 1) {
        let noiseVal = noise(noiseOffsets[i][j] + frameCount * 0.05);
        let state = getState(
          field[i][j] > threshold,
          field[i + 1][j] > threshold,
          field[i + 1][j + 1] > threshold,
          field[i][j + 1] > threshold
        );
        let isFilled = state > 0 && state < 15 && noiseVal > 0.85;

        if (state === 0) {
          textObjects.push(new TextObject(x, y, 1, floor(random(levelsKaomoji[0].length))));
          placed = true;
        }
      }
      attempts++;
    }
  }
}

function drawTextObjects() {
  textSize(24);
  textAlign(CENTER, CENTER);
  textFont('Gill Sans');
  noStroke();
  textObjects.forEach(textObj => {
    let color = '#000';
    let size = 24;

    if (textObj.isMerging) {
      color = '#FFB800';
      size = 22 * (1 + 0.5 * sin((textObj.mergeTimer / textObj.mergeDuration) * PI));
      textObj.mergeTimer++;
      if (textObj.mergeTimer >= textObj.mergeDuration) {
        textObj.isMerging = false;
      }
    }

    fill(color);
    textSize(size);
    text(textObj.content, textObj.x, textObj.y);
  });
}

class TextObject {
  constructor(x, y, level, index) {
    this.x = x;
    this.y = y;
    this.level = level;
    this.index = index;
    this.content = levelsKaomoji[this.level - 1][this.index];
    this.speed = random(0.5, 1.5);
    this.isMerging = false;
    this.mergeTimer = 0;
    this.mergeDuration = 30;
  }

  startMergeAnimation() {
    this.isMerging = true;
    this.mergeTimer = 0;
  }

  move() {
    let angle = noise(this.x * 0.01, this.y * 0.01, frameCount * 0.01) * TWO_PI;
    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;
    this.x = constrain(this.x, 0, windowWidth);
    this.y = constrain(this.y, 0, windowHeight);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = ceil(windowWidth / scl);
  rows = ceil(windowHeight / scl);

  field = [];
  for (let i = 0; i < cols; i++) {
    field[i] = [];
  }

  noiseOffsets = [];
  for (let i = 0; i < cols; i++) {
    noiseOffsets[i] = [];
    for (let j = 0; j < rows; j++) {
      noiseOffsets[i][j] = random(1000);
    }
  }

  generateField();
}