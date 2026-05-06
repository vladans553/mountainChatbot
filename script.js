// ELEMENTI
const chatWindow = document.getElementById("chat-window");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const clearBtn = document.getElementById("clear-btn");
const newChatBtn = document.getElementById("new-chat-btn");

// NAV LINKS (About / Privacy) - samo za sigurnost
document.getElementById("about-link")?.addEventListener("click", () => {
  // normalno otvara stranicu (default behavior)
});

document.getElementById("privacy-link")?.addEventListener("click", () => {
  // normalno otvara stranicu (default behavior)
});

// DODAJ PORUKU U CHAT
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className =
    type === "user" ? "message user-message" : "message ai-message";
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// POŠALJI PORUKU NA BACKEND
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  // loading indikator
  const loadingId = "loading-msg";
  const loading = document.createElement("div");
  loading.className = "message ai-message";
  loading.id = loadingId;
  loading.textContent = "Pišem odgovor...";
  chatWindow.appendChild(loading);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();

    document.getElementById(loadingId)?.remove();

    addMessage(data.reply || "Nema odgovora", "ai");
  } catch (error) {
    document.getElementById(loadingId)?.remove();
    addMessage("Greška u komunikaciji sa serverom.", "ai");
  }
}

// CLEAR CHAT
clearBtn.addEventListener("click", () => {
  chatWindow.innerHTML = `
    <div class="message ai-message">
      Zdravo! Ja sam tvoj vodič. Kako ti mogu pomoći danas?!
    </div>
  `;
});

// NEW CHAT (trenutno isto kao clear, ali može kasnije history)
newChatBtn.addEventListener("click", () => {
  chatWindow.innerHTML = "";
});

// SEND BUTTON
sendBtn.addEventListener("click", sendMessage);

// ENTER KEY
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
