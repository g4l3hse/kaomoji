let words = [];
let description, generateBtn, submitBtn, wordWall;

let leftEyes = ['^', '°', '•', '>', '¬', 'ʘ', 'ಠ', '.', 'ಢ', 'ᴗ','╹','´','˙','●','A', 'ㅇ', ';','T', '◕', '｡','①','ↀ','ꅈ', '*ﾟ', '•́', '⌣', 'ಥ', '◖', 'ݓ',  '⁰', 'O', '⊚', '◉', 'ರ', '≖','◯', '♥', ' ි', '⊘', 'x', 'ʘ̆', '๑', '✪', 'ಡ', 'ᓂ', '¤', '✖', '﹒︣', 'ຈ', '▀', '◑', '◔', 'σ', '╥', 'ᓀ', '⊗', 'ⓛ', '≗', 'ȏ', 'ㆁ', ' ͡༎ຶ', '･ิ', 'ºั', 'ᄒ', 'Θ'];
let rightEyes = ['^', '°', '•', '<', '¬', 'ʘ', 'ಠ', '.', 'ಢ', 'ᴗ','╹','´','˙','●', 'A', 'ㅇ', ';','T', '◕', '｡','①','ↀ','ꅈ', '*ﾟ', '•́', '⌣', 'ಥ', '◖', 'ݓ', '⁰', 'O', '⊚', '◉', 'ರ', '≖','◯', '♥', ' ි', '⊘', 'x', 'ʘ̆', '๑', '✪', 'ಡ', 'ᓂ', '¤', '✖', '﹒︣', 'ຈ', '▀', '◑', '◔', 'σ', '╥', 'ᓀ', '⊗', 'ⓛ', '≗', 'ȏ', 'ㆁ', ' ͡༎ຶ', '･ิ', 'ºั', 'ᄒ', 'Θ'];
let mouths = ['_', 'ω', 'o', 'A', 'n', 'v', 'u', 'm', '3', 'O', '△', '෴', '⊆', '오', 'ㅂ', '▃', 'ヮ', '⋃', '౪', 'Д', 'ᴥ', '-', 'ڡ', 'ʌ', 'ヘ', 'w', '∀', 'ε', '益', '﹏', '～', '‿', 'ㅅ', 'ゝ', 'ﻌ', '㉨', 'c', 'Ⱉ'];
let cheeks = ['.', ',', '=', '‡', '╬', '⑇', '✿', '”', ':', 'メ', '#', '˵', '*', '~', '＋', '҂', '≈', 'ﾐ'];
let leftHands = ['づ', 'ヽ', '＼', '╮', 'ᕦ', '<', 'ᕕ', 'ᕙ', '〜', 'ε', '୧', '٩',  '乁', '⋋', '٩', '└', '┌', '໒', 'ლ', '૮', 'ϵ'];
let rightHands = ['づ', 'ﾉ', '／', '╭', 'ᕤ', '>', '୨', 'ᕗ', '〜', 'з', 'ᓄ', 'و', 'ㄏ', '⋌', 'ง', '┘', '┐', '۷','ლ', 'ა', '϶'];
let leftBodies = ['|', '(', '/', '[', '{', '<', 'c', 'ʕ', '།', '༼', '⎦'];
let rightBodies = ['|', ')', '\\',']', '}', '>', 'ɔ', 'ʔ', '།', '༽', '⎣'];

let activated = ['°', 'ʘ', '╹', '´', '｡', '①','ↀ', '*ﾟ', '◯', '▀', 'ⓛ', 'ȏ', 'ㆁ', 'Θ', 'ω', 'o', 'O', '△', '㉨', 'c', '(', ')', '{', '}', '<', '>', '✿', '#', '＋', '＼', '／', 'ᕦ', 'ᕤ', 'ᕕ', 'ᕗ'];
let positive = ['^', '>', '<', 'A', '◕', '♥', ' ි', '✪', '◑', '◔', 'ºั', 'v', 'u', '౪', 'ڡ', '(', ')', '{', '}', '=', '*', 'ヽ', 'ﾉ', '٩', 'و', '└', '┘', '૮', 'ა'];
let negative = ['ಠ', '⊚', 'ರ', '●', '≖', '¤', '▃', 'ʌ', '∀', '益', 'Ⱉ', '/', '\\', '[', ']', '།', '༼', '༽', '⎦', '⎣', '‡', '╬', '#', '҂', '୧', 'ᓄ'];
let positiveActivated = [ '◉', 'ºั', '3', 'ꅈ', 'ㅂ', 'ᴥ', 'w', 'ε', 'ㅅ', 'ﻌ', '⑇', 'ﾐ', 'づ', 'з', 'ʕ', 'ʔ', 'c', 'ɔ', '~', '≈', 'ﾐ', '٩', 'ง'];
let negativeActivated = ['⊘', 'x', '¤', '✖', 'ㅇ', '•́', '◖', 'O', '⊗', '෴', 'ヮ', 'Д', '/', '\\', '[', ']', '།', '༼', '༽', '⎦', '⎣', '‡', '╬', '҂', '⋋', '⋌', 'ϵ', '϶'];
let positiveDeactivated = ['•', '¬', '.', 'ᴗ', '⌣', '๑', 'ᓂ', 'σ', 'ᓀ', '･ิ', 'ᄒ', '오', '⋃', '‿', 'ゝ', '|', '{', '}', 'c', 'ɔ', '.', ',', '”', ':', '˵', '〜', '乁', 'ㄏ', '໒', '۷', 'ლ', 'ლ'];
let negativeDeactivated = ['ಢ', 'T', 'ಥ', 'ݓ', 'ʘ̆', '╥', ' ͡༎ຶ', ';', '﹒︣', 'ຈ', '≗', '_', 'n', 'm', '⊆', '-', 'ヘ', '﹏', '～', '|', '[', ']', '།', '༼', '༽', '⎦','⎣', 'メ', '╮', '╭', '┌', '┐'];

let beginningGroups = {
  "positive": ["hygge", "koino", "wald", "gigil", "gezellig", "kvell", "meraki", "aga", "mana", "yuán"],
  "negative": ["gigil", "anjir"],
  "activated": ["res", "duende", "jaksaa", "rim", "arbejds", "voor", "goya", "iktsu", "aidos", "balik", "curl"],
  "positiveActivated": ["jiji", "sisu", "anake", "aspaldi", "kilig", "ya'", "naz"],
  "positiveDeactivated": ["commuovere", "eu", "ailyak", "wabi", "oodal", "firg", "boke", "wú", "yutta-"],
  "negativeActivated": ["dépayse", "torschluss", "lít", "mamihlapi"],
  "negativeDeactivated": ["mágoa", "lebens", "welt", "sielvartas", "onsra", "toska", "saudade", "viitsima", "ilunga", "vedri", "nauuy", "hir", "dor"]
};

let endGroups = {
  "positive": ["hygge", "yokan", "einsamkeit", "gigil", "heid", "kvell", "meraki", "pe", "akitanga", "bèi"],
  "negative": ["gigil", "anjir"],
  "activated": ["feber", "duende", "jaksaa", "jhim", "glæde", "pret", "goya", "arpok", "aidos", "was", "glaff"],
  "positiveActivated": ["visha", "sisu", "anake", "ko", "kilig", "aburnee", "naz"],
  "positiveDeactivated": ["commuovere", "daimonia", "ailyak", "sabi", "oodal", "un", "natapai", "tto", "wéi", "hey"],
  "negativeActivated": ["ment", "panik", "ost"],
  "negativeDeactivated": ["mágoa", "müde", "schmertz", "sielvartas", "onsra", "toska", "saudade", "viitsima", "ilunga", "ti", "jai", "aeth", "dor"]
};

function setup() {
  noCanvas();
  description = select('#description');
  generateBtn = select('#generate-btn');
  submitBtn = select('#submit-btn');
  wordWall = select('#word-wall');

  loadWords();

  generateBtn.mousePressed(generateKaomoji);
  submitBtn.mousePressed(addWord);

  window.clearWordWall = function(password) {
    if (password === 'hiii^^') {
      words = [];
      localStorage.removeItem('wordWall');
      let blocks = selectAll('.word-block');
      for (let block of blocks) {
        block.remove();
      }
      arrangeWords();
      console.log('Kaomoji wall cleared!');
    } else {
      console.log('Incorrect password!');
    }
  };
}

function loadWords() {
  let storedWords = localStorage.getItem('wordWall');
  if (storedWords) {
    words = JSON.parse(storedWords);
    for (let w of words) {
      createWordBlock(w.word, w.meaning, w.description);
    }
    arrangeWords();
  }
}

function saveWords() {
  localStorage.setItem('wordWall', JSON.stringify(words));
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

  let kaomoji = leftHand + leftBody + cheek + leftEye + mouth + rightEye + cheek + rightBody + rightHand;
  let emotion = generateEmotion(getDominantGroup(kaomoji));

  select('#kaomoji').html(kaomoji);
  select('#emotion-name').html(emotion);
  generateEmotionText(emotion).then(text => {
    console.log("Generated description:", text);
    select('#description').html(text);
  }).catch(error => {
    console.error("Description error:", error);
    select('#description').html(`Ошибка: ${error.message}`);
  });
}

function getDominantGroup(kaomoji) {
  let totalChars = 9;
  let counts = {
    activated: countCharacters(kaomoji, activated),
    positive: countCharacters(kaomoji, positive),
    negative: countCharacters(kaomoji, negative),
    positiveActivated: countCharacters(kaomoji, positiveActivated),
    negativeActivated: countCharacters(kaomoji, negativeActivated),
    positiveDeactivated: countCharacters(kaomoji, positiveDeactivated),
    negativeDeactivated: countCharacters(kaomoji, negativeDeactivated)
  };

  let percentages = {};
  for (let group in counts) {
    percentages[group] = (counts[group] / totalChars) * 100;
  }

  let dominantGroup = Object.keys(percentages).reduce((a, b) =>
    percentages[a] > percentages[b] ? a : b
  );

  return dominantGroup;
}

function countCharacters(kaomoji, group) {
  let count = 0;
  for (let char of kaomoji) {
    if (group.includes(char)) {
      count++;
    }
  }
  return count;
}

function generateEmotion(group) {
  let beginningWord = random(beginningGroups[group]);
  let endWord = random(endGroups[group]);
  return beginningWord + endWord;
}

function addWord() {
  let word = select('#kaomoji').html();
  let meaning = select('#emotion-name').html();
  let desc = description.html();

  if (word && meaning && desc) {
    createWordBlock(word, meaning, desc);
    words.push({ word: word, meaning: meaning, description: desc });
    saveWords();
    select('#kaomoji').html('');
    select('#emotion-name').html('');
    description.html('Description will appear here');
    arrangeWords();
  }
}

function createWordBlock(word, meaning, description) {
  let wordBlock = createDiv(word);
  wordBlock.class('word-block');
  wordBlock.parent(wordWall);
  wordBlock.attribute('data-meaning', meaning);
  wordBlock.attribute('data-description', description);
  wordBlock.attribute('data-kaomoji', word);
  wordBlock.mouseOver(() => {
    select('#kaomoji').html(word);
    select('#emotion-name').html(meaning);
    select('#description').html(description);
  });
  wordBlock.mouseOut(() => {
    select('#kaomoji').html('');
    select('#emotion-name').html('');
    select('#description').html('Description will appear here');
  });
  wordBlock.mousePressed(copyKaomoji);
}

function copyKaomoji() {
  let kaomoji = this.html();
  navigator.clipboard.writeText(kaomoji).then(() => {
    console.log('Kaomoji copied to clipboard: ' + kaomoji);
  }).catch(err => {
    console.error('Could not copy kaomoji: ', err);
  });
}

function arrangeWords() {
  let blocks = selectAll('.word-block');
  let containerWidth = windowWidth;
  let currentX = 20;
  let currentY = 150;
  let maxHeightInRow = 0;
  let rowWidths = [];
  let currentRow = [];

  for (let block of blocks) {
    let blockWidth = block.elt.offsetWidth;
    let blockHeight = block.elt.offsetHeight;

    if (currentX + blockWidth > containerWidth - 20) {
      rowWidths.push(currentX - 20);
      currentX = 20;
      currentY += maxHeightInRow;
      maxHeightInRow = 0;
      currentRow = [];
    }

    currentRow.push(block);
    block.position(currentX, currentY);
    currentX += blockWidth + 20;
    maxHeightInRow = Math.max(maxHeightInRow, blockHeight);
  }
  rowWidths.push(currentX - 20);

  let rowStartY = 150;
  let rowIndex = 0;
  currentX = 20;
  maxHeightInRow = 0;

  for (let block of blocks) {
    let blockWidth = block.elt.offsetWidth;
    let blockHeight = block.elt.offsetHeight;

    if (currentX + blockWidth > containerWidth - 20) {
      let rowWidth = rowWidths[rowIndex];
      let offsetX = (containerWidth - rowWidth) / 2;
      for (let b of currentRow) {
        let currentPosX = parseFloat(b.style('left'));
        b.position(currentPosX + offsetX - 20, rowStartY);
      }
      currentX = 20;
      rowStartY += maxHeightInRow + 10;
      maxHeightInRow = 0;
      currentRow = [];
      rowIndex++;
    }

    currentRow.push(block);
    block.position(currentX, rowStartY);
    currentX += blockWidth + 20;
    maxHeightInRow = Math.max(maxHeightInRow, blockHeight);
  }

  if (currentRow.length > 0) {
    let rowWidth = rowWidths[rowIndex];
    let offsetX = (containerWidth - rowWidth) / 2;
    for (let b of currentRow) {
      let currentPosX = parseFloat(b.style('left'));
      b.position(currentPosX + offsetX - 20, rowStartY);
    }
  }
}

function windowResized() {
  arrangeWords();
}