/**
 * Hiking AI Agent - script.js
 * Verzija sa Netlify Functions (bez CORS problema)
 */

const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const newChatBtn = document.getElementById('new-chat-btn');

// Prikaz poruke u chatu
function appendMessage(role, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(role === 'user' ? 'user-message' : 'ai-message');
    messageDiv.innerText = text;
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Poziv Netlify funkcije (backend → Hugging Face)
async function getAIResponse(userText) {
    try {
        const response = await fetch("/.netlify/functions/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userText })
        });

        if (!response.ok) {
            return "Server trenutno ne radi kako treba. Pokušaj ponovo.";
        }

        const data = await response.json();

        if (!data || !data.reply) {
            return "AI vodič trenutno nema odgovor, pokušaj ponovo.";
        }

        return data.reply;

    } catch (error) {
        console.error("Greška:", error);
        return "Nažalost, veza sa serverom je u prekidu.";
    }
}

// Klik na "Send"
sendBtn.addEventListener('click', async () => {
    const text = userInput.value.trim();

    if (text !== "") {
        appendMessage('user', text);
        userInput.value = "";

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai-message';
        loadingDiv.innerText = "Razmišljam...";
        chatWindow.appendChild(loadingDiv);

        const aiResponse = await getAIResponse(text);

        chatWindow.removeChild(loadingDiv);
        appendMessage('ai', aiResponse);
    }
});

// Enter za slanje
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

// Clear chat
clearBtn.addEventListener('click', () => {
    chatWindow.innerHTML = "";
});

// Novi chat
newChatBtn.addEventListener('click', () => {
    chatWindow.innerHTML = "";
    appendMessage('ai', "Započeli smo novi razgovor. Spreman sam za tvoja planinarska pitanja!");
});
