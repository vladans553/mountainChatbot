/**
 * Hiking AI Agent - script.js
 * Sigurna verzija za GitHub/Netlify
 */

// Ostavljamo prazno ili sa placeholderom. 
// Token NEĆE biti u kodu koji push-uješ na GitHub.
const HF_TOKEN = "TOKEN_PLACEHOLDER"; 

const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const newChatBtn = document.getElementById('new-chat-btn');

// Funkcija za prikaz poruka
function appendMessage(role, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(role === 'user' ? 'user-message' : 'ai-message');
    messageDiv.innerText = text;
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Funkcija za pozivanje Hugging Face API-ja
async function getAIResponse(userText) {
    // Provera da li je token zamenjen (za tvoj debug)
    if (HF_TOKEN === "TOKEN_PLACEHOLDER") {
        return "Sistem nije konfigurisan. (API ključ nedostaje)";
    }

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: `<s>[INST] Ti si stručni planinarski vodič. Odgovaraj isključivo na srpskom jeziku. Budi koristan, ljubazan i kratak. Korisnik pita: ${userText} [/INST]`,
                parameters: {
                    max_new_tokens: 500,
                    temperature: 0.7
                }
            })
        });

        const data = await response.json();

        // Provera da li se model učitava (Cold Start)
        if (data.error && data.error.includes("loading")) {
            return `Vodič se sprema za uspon... (Model se učitava). Pokušaj ponovo za oko ${Math.round(data.estimated_time || 20)} sekundi.`;
        }

        if (data && data[0] && data[0].generated_text) {
            const fullText = data[0].generated_text;
            return fullText.split('[/INST]').pop().trim();
        } else {
            return "Trenutno imam malu pauzu, pokušaj ponovo za trenutak.";
        }
    } catch (error) {
        console.error("Greška:", error);
        return "Nažalost, veza sa planinarskim domom je u prekidu.";
    }
}

// Logika za dugme Pošalji
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

// Enter taster
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

// Brisanje ekrana
clearBtn.addEventListener('click', () => {
    chatWindow.innerHTML = "";
});

// Novi čet
newChatBtn.addEventListener('click', () => {
    chatWindow.innerHTML = "";
    appendMessage('ai', "Započeli smo novi razgovor. Spreman sam za tvoja planinarska pitanja!");
});