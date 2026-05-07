const workerUrl = "https://carschatbojdid.issammalyh2.workers.dev";

const CHATBOT_LOGO = "https://i.postimg.cc/KvvrrjZC/Chat-GPT-Image-7-mai-2026-11-43-28.png";

const chatbotHTML = `
<div class="auto-chatbot-tooltip" id="autoTooltip">
  Can I assist you ? 👋
</div>

<div class="auto-chatbot-button" id="chatbotButton">
  <img
src="https://i.postimg.cc/KvvrrjZC/Chat-GPT-Image-7-mai-2026-11-43-28.png"
alt="chatbot-logo"
class="main-chatbot-logo">

<div class="auto-chatbot" id="autoChatbot">
  <div class="auto-chatbot-header">
    <img src="${CHATBOT_LOGO}" alt="chatbot-logo">
    <div>
      <h3>Auto Trouvez AI</h3>
      <p>Assistant intelligent • En ligne</p>
    </div>
    <div class="auto-chatbot-close" id="closeChatbot">×</div>
  </div>

  <div class="auto-chatbot-messages" id="chatMessages">
    <div class="auto-message bot-message">
      Bonjour 👋<br><br>
      Je suis l’assistant intelligent Auto Trouvez.<br>
      Comment puis-je vous aider aujourd’hui ?
    </div>
  </div>

  <div class="auto-chatbot-input">
    <input type="text" id="chatInput" placeholder="Écrivez votre message...">
    <button id="sendMessage">➤</button>
  </div>
</div>
`;

document.body.insertAdjacentHTML("beforeend", chatbotHTML);

const chatbot = document.getElementById("autoChatbot");
const button = document.getElementById("chatbotButton");
const closeBtn = document.getElementById("closeChatbot");
const sendBtn = document.getElementById("sendMessage");
const input = document.getElementById("chatInput");
const messages = document.getElementById("chatMessages");

let history = [];

button.addEventListener("click", () => {
  chatbot.style.display = "flex";

  const tooltip = document.getElementById("autoTooltip");
  if (tooltip) tooltip.style.display = "none";

  const badge = button.querySelector(".auto-chatbot-notification");
  if (badge) badge.style.display = "none";
});

closeBtn.addEventListener("click", () => {
  chatbot.style.display = "none";
});

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function addMessage(type, text) {
  const div = document.createElement("div");
  div.className = `auto-message ${type}-message`;
  div.innerHTML = escapeHTML(text).replace(/\n/g, "<br>");
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage("user", text);

  history.push({
    role: "user",
    content: text
  });

  input.value = "";

  const typing = addMessage("bot", "Typing...");

  try {
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text,
        history
      })
    });

    const data = await response.json();

    typing.remove();

    const reply = data.reply || data.error || "AI temporarily unavailable.";
    addMessage("bot", reply);

    history.push({
      role: "assistant",
      content: reply
    });

  } catch (error) {
    typing.remove();
    addMessage("bot", "Connection error ❌");
    console.log(error);
  }
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

setTimeout(() => {
  const tooltip = document.getElementById("autoTooltip");
  if (tooltip) tooltip.remove();
}, 7000);
