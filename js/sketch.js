let mainSketch = function(p) {
    let cols, rows;
    let field = [];
    let rez = 12;
    let threshold = 0.5;
    let textCanvas;
    let noiseOffsets = [];
    let textState = 0;

    p.setup = function() {
      let canvas = p.createCanvas(p.windowWidth * 0.8 - 20, p.windowHeight * 0.7);
      canvas.parent('sketch-holder');
      cols = p.width / rez;
      rows = p.height / rez;
      p.frameRate(3);

      textCanvas = p.createGraphics(p.width, p.height);
      updateTextCanvas();

      for (let i = 0; i < cols; i++) {
        noiseOffsets[i] = [];
        for (let j = 0; j < rows; j++) {
          noiseOffsets[i][j] = p.random(1000);
        }
      }

      generateField();
    };

    p.draw = function() {
      p.background(255);
      updateTextCanvas();
      generateField();
      drawMarchingSquares();
    };

    function updateTextCanvas() {
      textCanvas.background(0);
      textCanvas.fill(255);
      textCanvas.textAlign(p.CENTER, p.CENTER);
      textCanvas.textSize(450);

      if (p.frameCount % 60 === 0) {
        textState = (textState + 1) % 2;
      }

      if (textState === 0) {
        textCanvas.text("顔八百", p.width / 2, p.height / 2 - 70);
      } else {
        textCanvas.text("顔八百", p.width / 2, p.height / 2 - 70);
      }
    }

    function generateField() {
      for (let i = 0; i < cols; i++) {
        field[i] = field[i] || [];
        for (let j = 0; j < rows; j++) {
          let x = i * rez;
          let y = j * rez;
          let pixelValue = textCanvas.get(x, y)[0];
          field[i][j] = p.map(pixelValue, 0, 255, 0, 1);
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

  new p5(mainSketch);