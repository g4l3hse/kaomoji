let faceapi;
let detections = [];

let emotions = [];
let emotionsByGroup = {
  neutral: [],
  happy: [],
  sad: [],
  angry: [],
  fearful: [],
  disgusted: [],
  surprised: []
};

let video;
let canvas;

let kaomoji = "";
let lastEmotion = null;
let generatedText = "Ожидание эмоции...";
let generatedWord = "";

const apiKey = "w2kIlbdZLOIRBLMpEwSiaNeZqku5EZsr";
const apiUrl = "https://api.mistral.ai/v1/chat/completions";

let isPaused = false;

let beginningGroups = {
  "happy": ["hygge", "koino", "wald", "gigil", "gezellig", "kvell", "meraki", "aga", "mana", "yuán"],
  "angry": ["gigil", "anjir"],
  "neutral": ["res", "duende", "jaksaa", "rim", "arbejds", "voor", "goya", "iktsu", "aidos", "balik", "curl"],
  "surprised": ["jiji", "sisu", "anake", "aspaldi", "kilig", "ya'", "naz", "commuovere", "eu", "ailyak", "wabi", "oodal", "firg", "boke", "wú", "yutta-"],
  "disgusted": ["dépayse", "torschluss", "lít", "mamihlapi"],
  "sad": ["mágoa", "lebens", "welt", "sielvartas", "onsra", "toska", "saudade", "viitsima", "ilunga", "vedri", "nauuy", "hir", "dor"]
};

let endGroups = {
  "happy": ["hygge", "yokan", "einsamkeit", "gigil", "heid", "kvell", "meraki", "pe", "akitanga", "bèi"],
  "angry": ["gigil", "anjir"],
  "neutral": ["feber", "duende", "jaksaa", "jhim", "glæde", "pret", "goya", "arpok", "aidos", "was", "glaff"],
  "surprised": ["visha", "sisu", "anake", "ko", "kilig", "aburnee", "naz", "commuovere", "daimonia", "ailyak", "sabi", "oodal", "un", "natapai", "tto", "wéi", "hey"],
  "disgusted": ["ment", "panik", "ost"],
  "sad": ["mágoa", "müde", "schmertz", "sielvartas", "onsra", "toska", "saudade", "viitsima", "ilunga", "ti", "jai", "aeth", "dor"]
};

let leftEyes = ['^', '°', '•', '>', '¬', 'ʘ', 'ಠ', '.', 'ಢ', 'ᴗ','╹','´','˙','●', '^','A', 'ㅇ', ';','T', '◕', '｡','①','ↀ','ꅈ', '*ﾟ', '•́', '⌣', 'ಥ', '◖', 'ݓ',  '⁰', 'O', '⊚', '◉', 'ರ', '≖','◯', '♥', ' ි', '⊘', 'x', '¬', 'ʘ̆', 'ʘ̆', '๑', '✪', 'ಡ', 'ᓂ', '¤', '✖', '﹒︣', 'ຈ', '▀', '◑', '◔', 'σ', '╥', 'ᓀ', '⊗', 'ⓛ', '≗', 'ȏ', 'ㆁ', ' ͡༎ຶ', '･ิ', 'ºั', 'ᄒ'];
let rightEyes = [...leftEyes];
let mouths = ['_', 'ω', 'o', 'A', 'n', 'v', 'u', 'm', '3', 'O', '△', '෴', '⊆', '오', 'ㅂ', '▃', 'ヮ', '⋃', '౪', 'Д', 'ᴥ', '-', 'ڡ', 'ʌ', 'ヘ', 'o', 'w', '∀', 'ε', '益', '﹏', '～', '‿', 'ㅅ', 'ゝ', 'ﻌ', '㉨', 'c', 'Ⱉ'];
let cheeks = ['.', ',', '=', '‡', '╬', '⑇', '✿', '”', ':', 'メ', '#', '˵', '*', '~', '＋', '҂', '≈', 'ﾐ'];
let leftHands = ['づ', 'ヽ', '＼', '╮', 'ᕦ', '<', 'ᕕ', 'ᕙ', '〜', 'ε', '୧', '٩',  '乁', '⋋', '٩', '└', '┌', '໒', 'ლ', '૮', 'ϵ'];
let rightHands = [...leftHands];
let leftBodies = ['|', '(', '/', '[', '{', '<', 'ʕ', '།', '༼'];
let rightBodies = ['|', ')', '\\', ']', '}', '>', 'ʔ', '༽', '།'];

function preload() {
  loadJSON("emotions.json", (data) => {
    emotions = data;
    emotions.forEach(emotion => {
      if (emotionsByGroup[emotion.emotion]) {
        emotionsByGroup[emotion.emotion].push(emotion);
      }
    });
    console.log("Emotions loaded:", emotions);
    console.log("Emotions by group:", emotionsByGroup);
  }, (error) => {
    console.error("Failed to load emotions.json:", error);
    // Fallback data if JSON fails to load
    emotions = [
      { "name": "hygge", "description": "A cozy, warm atmosphere filled with small joys like candles, baking, and family time.", "emotion": "happy" },
      { "name": "dépaysement", "description": "A feeling of disorientation in a foreign place, bringing new perspectives or homesickness.", "emotion": "sad" }
    ];
    emotions.forEach(emotion => {
      if (emotionsByGroup[emotion.emotion]) {
        emotionsByGroup[emotion.emotion].push(emotion);
      }
    });
  });
}

function setup() {
  canvas = createCanvas(300, 300);
  canvas.id("canvas");

  video = createCapture(VIDEO);
  video.id("video");
  video.size(300, 300);
  video.hide();

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5,
  };

  faceapi = ml5.faceApi(video, faceOptions, faceReady);

  let startButton = select("#start-button");
  startButton.mousePressed(() => {
    if (isPaused) {
      isPaused = false;
      faceapi.detect(gotFaces);
      startButton.html("again");
    }
  });
}

function faceReady() {
  if (!isPaused) {
    faceapi.detect(gotFaces);
  }
}

function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result;
  clear();

  drawBoxs(detections);
  drawLandmarks(detections);
  drawKaomojiAndEmotion();

  if (!isPaused && detections.length > 0) {
    processEmotion(detections[0].expressions);
  }

  if (!isPaused) {
    faceapi.detect(gotFaces);
  }
}

function drawBoxs(detections) {
  if (detections.length > 0) {
    for (let f = 0; f < detections.length; f++) {
      let { _x, _y, _width, _height } = detections[f].alignedRect._box;
      noStroke();
      noFill();
      rect(_x, _y, _width, _height);
    }
  }
}

function drawLandmarks(detections) {
  if (detections.length > 0) {
    for (let f = 0; f < detections.length; f++) {
      let points = detections[f].landmarks.positions;
      for (let i = 0; i < points.length; i++) {
        stroke("white");
        strokeWeight(5);
        point(points[i]._x, points[i]._y);
      }
    }
  }
}

function drawKaomojiAndEmotion() {
  document.getElementById("emotion-label").textContent = lastEmotion ? lastEmotion : "";
  document.getElementById("emotion-word").textContent = generatedWord;
  document.getElementById("kaomoji").textContent = kaomoji;
  document.getElementById("description-mirror").textContent = generatedText;

  let landmarksContainer = document.getElementById("landmarks-container-mirror");
  if (landmarksContainer) {
    landmarksContainer.innerHTML = "";
    landmarksContainer.appendChild(canvas.elt);
  }
}

function generateKaomoji() {
  let mouth = random(mouths);
  let cheek = random(cheeks);

  let bodyIndex = int(random(leftBodies.length));
  let leftBody = leftBodies[bodyIndex];
  let rightBody = rightBodies[bodyIndex];

  let eyeIndex = int(random(leftEyes.length));
  let leftEye = leftEyes[eyeIndex];
  let rightEye = rightEyes[eyeIndex];

  let handIndex = int(random(leftHands.length));
  let leftHand = leftHands[handIndex];
  let rightHand = rightHands[handIndex];

  return leftHand + leftBody + cheek + leftEye + mouth + rightEye + cheek + rightBody + rightHand;
}

function processEmotion(expressions) {
  let dominantEmotion = Object.keys(expressions).reduce((a, b) =>
    expressions[a] > expressions[b] ? a : b
  );

  if (dominantEmotion !== lastEmotion) {
    lastEmotion = dominantEmotion;
    kaomoji = generateKaomoji();

    if (beginningGroups[dominantEmotion] && endGroups[dominantEmotion]) {
      let beginningWord = random(beginningGroups[dominantEmotion]);
      let endWord = random(endGroups[dominantEmotion]);
      generatedWord = beginningWord + endWord;
    } else {
      generatedWord = "неизвестная эмоция";
    }

    generateEmotionText(dominantEmotion).then(() => {
      isPaused = true;
      let startButton = select("#start-button");
      startButton.html("again");
    });
  }
}

async function generateEmotionText(detectedEmotion) {
  generatedText = "Генерация текста...";

  if (!emotionsByGroup[detectedEmotion] || emotionsByGroup[detectedEmotion].length < 2) {
    console.error(`Not enough emotions in group ${detectedEmotion}:`, emotionsByGroup[detectedEmotion]);
    generatedText = `Ошибка: недостаточно слов для эмоции ${detectedEmotion}.`;
    return;
  }

  let emotion1 = random(emotionsByGroup[detectedEmotion]);
  let emotion2 = random(emotionsByGroup[detectedEmotion]);

  const promptText = `Combine these two emotions into a meaningful new description:
  1. ${emotion1.description}
  2. ${emotion2.description}
  Output only the combined description without any extra text.`;

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          content: promptText
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    })
  };

  try {
    console.log("Sending API request...");
    let response = await fetch(apiUrl, requestOptions);
    if (response.status === 429) {
      let retryAfter = response.headers.get("Retry-After") || "10";
      console.warn(`Rate limit exceeded. Retry-After: ${retryAfter} seconds`);
      generatedText = `Ошибка: слишком много запросов. Повторите через ${retryAfter} секунд.`;
      return;
    }
    if (!response.ok) {
      let errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText} - ${errorText}`);
    }

    let data = await response.json();
    console.log("API response:", data);

    if (data.choices && data.choices[0].message.content) {
      generatedText = data.choices[0].message.content.trim();
    } else {
      console.error("Unexpected response format:", data);
      generatedText = "Ошибка: неожиданный формат ответа.";
    }
  } catch (error) {
    console.error("Ошибка:", error);
    generatedText = `Ошибка при генерации: ${error.message}`;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(windowWidth, windowHeight);
}