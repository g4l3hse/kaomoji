const chatMessages = document.getElementById('chat-messages');
const buttonContainer = document.getElementById('button-container');

let brain = [];
let catchall = [];
let currentTriggerSetIndex = 0;

async function loadResponses() {
    try {
        const response = await fetch('chat.json');
        const data = await response.json();
        brain = data.brain || [];
        catchall = data.catchall || ['Sorry, I didn’t get that. Feeling stupid today!'];
        updateButtons();
    } catch (error) {
        console.error('Error loading responses:', error);
        catchall = ['Oops, something went wrong!'];
        updateButtons();
    }
}

function updateButtons() {
    buttonContainer.innerHTML = '';
    const triggers = brain.length > 0 && currentTriggerSetIndex < brain.length
        ? brain[currentTriggerSetIndex].triggers
        : [];

    if (triggers.length === 0) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        messageDiv.textContent = catchall[Math.floor(Math.random() * catchall.length)];
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return;
    }

    triggers.forEach(trigger => {
        const button = document.createElement('button');
        button.className = 'trigger-btn';
        button.textContent = trigger;
        button.addEventListener('click', () => {
            document.querySelectorAll('.trigger-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            addMessage(trigger, true);
            const botResponse = getBotResponse(trigger);
            setTimeout(() => {
                addMessage(botResponse, false);
                updateButtons();
            }, 500);
        });
        buttonContainer.appendChild(button);
    });
}

function getBotResponse(userMessage) {
    const messageLower = userMessage.toLowerCase();

    for (let i = 0; i < brain.length; i++) {
        const entry = brain[i];
        for (const trigger of entry.triggers) {
            if (messageLower === trigger.toLowerCase()) {
                const randomIndex = Math.floor(Math.random() * entry.responses.length);
                currentTriggerSetIndex = (i + 1) % brain.length;
                return entry.responses[randomIndex];
            }
        }
    }
    currentTriggerSetIndex = 0;
    const randomIndex = Math.floor(Math.random() * catchall.length);
    return catchall[randomIndex];
}

function addMessage(content, isUser = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;

    if (!isUser && content.startsWith('img:')) {
        const imgUrl = content.replace('img:', '');
        const imgElement = document.createElement('img');
        imgElement.src = imgUrl;
        imgElement.style.maxWidth = '100%';
        imgElement.style.borderRadius = '10px';
        imgElement.alt = 'Kaomoji image';
        messageDiv.appendChild(imgElement);
    } else {
        messageDiv.textContent = content;
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

loadResponses();