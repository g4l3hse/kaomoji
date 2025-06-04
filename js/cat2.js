let textMarchingSketch = function(p) {
    let cols, rows;
    let field = [];
    let rez = 5;
    let threshold = 0.5;
    let textCanvas;
    let noiseOffsets = [];
    let images = [];
    let currentImageIndex = 0;
    let frameCounter = 0;
    let framesPerImage = 4;

    p.preload = function() {
      images = [
        p.loadImage('img/2.3.png'),
        p.loadImage('img/2.4.png')
      ];
    };

    p.setup = function() {
      let canvas = p.createCanvas(400, 400);
      canvas.parent('sketch-wrapper');
      cols = p.floor(p.width / rez);
      rows = p.floor(p.height / rez);
      p.frameRate(3);

      textCanvas = p.createGraphics(p.width, p.height);
      updateTextCanvas();

      resetNoiseOffsets();
      generateField();
    };

    p.draw = function() {
      p.clear();
      frameCounter++;
      if (frameCounter >= framesPerImage) {
        frameCounter = 0;
        currentImageIndex = (currentImageIndex + 1) % images.length;
        resetNoiseOffsets();
      }
      updateTextCanvas();
      generateField();
      drawMarchingSquares();
    };

    function resetNoiseOffsets() {
      noiseOffsets = [];
      for (let i = 0; i < cols; i++) {
        noiseOffsets[i] = [];
        for (let j = 0; j < rows; j++) {
          noiseOffsets[i][j] = p.random(100);
        }
      }
    }

    function updateTextCanvas() {
      textCanvas.clear();
      textCanvas.imageMode(p.CENTER);
      let img = images[currentImageIndex];
      let scale = p.min(p.width / img.width, p.height / img.height);
      let imgWidth = img.width * scale;
      let imgHeight = img.height * scale;
      textCanvas.image(img, p.width / 2, p.height / 2, imgWidth, imgHeight);
    }

    function generateField() {
      for (let i = 0; i < cols; i++) {
        field[i] = field[i] || [];
        for (let j = 0; j < rows; j++) {
          let x = i * rez;
          let y = j * rez;
          let pixel = textCanvas.get(x, y);
          let alpha = pixel[3];
          let blackValue = (255 - pixel[0]) * (alpha / 255);
          field[i][j] = p.map(blackValue, 0, 255, 0, 1);
        }
      }
    }

    function drawMarchingSquares() {
      p.stroke(0);
      p.strokeWeight(2);
      p.noFill();
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
    }

    function getState(a, b, c, d) {
      let t = p.frameCount * 0.05;
      let weightA = 6 + p.sin(t) * 2;
      let weightB = 4 + p.sin(t + 1) * 1;
      let weightC = 2 + p.sin(t + 2) * 0.5;
      let weightD = 1 + p.sin(t + 3) * 0.3;
      return p.floor(a * weightA + b * weightB + c * weightC + d * weightD);
    }

    function drawLines(x, y, state, i, j) {
      let a = p.createVector(x + rez / 2, y);
      let b = p.createVector(x + rez, y + rez / 2);
      let c = p.createVector(x + rez / 2, y + rez);
      let d = p.createVector(x, y + rez / 2);

      let noiseVal = p.noise(noiseOffsets[i][j] + p.frameCount * 0.05);
      noiseOffsets[i][j] += 0.01;

      switch (state) {
        case 1: p.line(d.x, d.y, c.x, c.y); break;
        case 2: p.line(c.x, c.y, b.x, b.y); break;
        case 3: p.line(d.x, d.y, b.x, b.y); break;
        case 4: p.line(a.x, a.y, b.x, b.y); break;
        case 5: p.line(d.x, d.y, a.x, a.y); p.line(c.x, c.y, b.x, b.y); break;
        case 6: p.line(a.x, a.y, c.x, c.y); break;
        case 7: p.line(d.x, d.y, a.x, a.y); break;
        case 8: p.line(a.x, a.y, d.x, d.y); break;
        case 9: p.line(a.x, a.y, c.x, c.y); break;
        case 10: p.line(a.x, a.y, b.x, b.y); p.line(d.x, d.y, c.x, c.y); break;
        case 11: p.line(a.x, a.y, b.x, b.y); break;
        case 12: p.line(b.x, b.y, d.x, d.y); break;
        case 13: p.line(b.x, b.y, c.x, c.y); break;
        case 14: p.line(c.x, c.y, d.x, d.y); break;
      }

      if (state > 0 && state < 15 && noiseVal > 0.7) {
        p.fill(255, p.map(noiseVal, 0.7, 1, 0, 150));
        p.beginShape();
        p.vertex(a.x, a.y);
        p.vertex(b.x, b.y);
        p.vertex(c.x, c.y);
        p.vertex(d.x, d.y);
        p.endShape(p.CLOSE);
      }
    }
  };

  new p5(textMarchingSketch);