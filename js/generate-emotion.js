let emotions = [];
let emotionsByGroup = {
  neutral: [],
  happy: [],
  sad: [],
  angry: [],
  fearful: [],
  surprised: []
};

const apiKey = "w2kIlbdZLOIRBLMpEwSiaNeZqku5EZsr";
const apiUrl = "https://api.mistral.ai/v1/chat/completions";


const groupToCategory = {
  positive: 'happy',
  negative: 'sad',
  positiveActivated: 'surprised',
  negativeActivated: 'angry',
  positiveDeactivated: 'fearful',
  negativeDeactivated: 'disgusted',
  activated: 'neutral'
};

const wordToGroup = {
  // positive
  hygge: 'positive',
  koino: 'positive',
  wald: 'positive',
  gigil: 'positive', // также в negative, но приоритет positive
  gezellig: 'positive',
  kvell: 'positive',
  meraki: 'positive',
  aga: 'positive',
  mana: 'positive',
  'yuán': 'positive',
  // negative
  anjir: 'negative',
  // activated
  res: 'activated',
  duende: 'activated',
  jaksaa: 'activated',
  rim: 'activated',
  arbejds: 'activated',
  voor: 'activated',
  goya: 'activated',
  iktsu: 'activated',
  aidos: 'activated',
  balik: 'activated',
  curl: 'activated',
  // positiveActivated
  jiji: 'positiveActivated',
  sisu: 'positiveActivated',
  anake: 'positiveActivated',
  aspaldi: 'positiveActivated',
  kilig: 'positiveActivated',
  "ya'": 'positiveActivated',
  naz: 'positiveActivated',
  // positiveDeactivated
  commuovere: 'positiveDeactivated',
  eu: 'positiveDeactivated',
  ailyak: 'positiveDeactivated',
  wabi: 'positiveDeactivated',
  oodal: 'positiveDeactivated',
  firg: 'positiveDeactivated',
  boke: 'positiveDeactivated',
  wú: 'positiveDeactivated',
  'yutta-': 'positiveDeactivated',
  // negativeActivated
  dépaysé: 'negativeActivated',
  torschluss: 'negativeActivated',
  lít: 'negativeActivated',
  mamihlapi: 'negativeActivated',
  // negativeDeactivated
  mágoa: 'negativeDeactivated',
  lebens: 'negativeDeactivated',
  welt: 'negativeDeactivated',
  sielvartas: 'negativeDeactivated',
  onsra: 'negativeDeactivated',
  toska: 'negativeDeactivated',
  saudade: 'negativeDeactivated',
  viitsima: 'negativeDeactivated',
  ilunga: 'negativeDeactivated',
  vedri: 'negativeDeactivated',
  nauuy: 'negativeDeactivated',
  hir: 'negativeDeactivated',
  dor: 'negativeDeactivated'
};


let isEmotionsLoaded = false;

function loadEmotions() {
  return fetch("emotions.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load emotions.json: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      emotions = data;
      emotions.forEach(emotion => {
        if (emotionsByGroup[emotion.emotion]) {
          emotionsByGroup[emotion.emotion].push(emotion);
        }
      });
      isEmotionsLoaded = true;
      console.log("Emotions loaded:", emotions);
      console.log("Emotions by group:", emotionsByGroup);
    })
    .catch(error => {
      console.error("Failed to load emotions.json:", error);
      isEmotionsLoaded = false;
    });
}

async function generateEmotionText(detectedEmotion) {
  let generatedText = "Генерация текста...";

  if (!isEmotionsLoaded) {
    await loadEmotions();
  }

  let group = null;
  let beginningWord = detectedEmotion.match(/^[a-zA-Z]+/)[0];
  group = wordToGroup[beginningWord];
  let mappedEmotion = group ? groupToCategory[group] : 'happy';
  console.log("Detected emotion:", detectedEmotion, "Group:", group, "Mapped to:", mappedEmotion);

  if (!emotionsByGroup[mappedEmotion] || emotionsByGroup[mappedEmotion].length < 2) {
    console.warn(`Not enough emotions in group ${mappedEmotion} (${emotionsByGroup[mappedEmotion]?.length || 0} entries). Falling back to 'happy'.`);
    mappedEmotion = 'happy';
  }

  if (emotionsByGroup[mappedEmotion].length < 2) {
    console.error(`Fallback emotion 'happy' has insufficient entries:`, emotionsByGroup[mappedEmotion]);
    generatedText = `Ошибка: недостаточно данных для генерации описания.`;
    return generatedText;
  }

  let emotion1 = emotionsByGroup[mappedEmotion][Math.floor(Math.random() * emotionsByGroup[mappedEmotion].length)];
  let emotion2 = emotionsByGroup[mappedEmotion][Math.floor(Math.random() * emotionsByGroup[mappedEmotion].length)];
  while (emotion2 === emotion1 && emotionsByGroup[mappedEmotion].length > 1) {
    emotion2 = emotionsByGroup[mappedEmotion][Math.floor(Math.random() * emotionsByGroup[mappedEmotion].length)];
  }

  console.log("Selected emotions:", emotion1.name, emotion2.name);

  const promptText = `Combine these two emotions into a concise description (max 30 words):
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
      max_tokens: 50,
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
      return generatedText;
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

  return generatedText;
}

loadEmotions();