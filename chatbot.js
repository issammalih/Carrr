const workerUrl = "PASTE_YOUR_WORKER_URL_HERE";

const chatbotHTML = `
<div class="auto-chatbot-tooltip" id="autoTooltip">
  Can I assist you ? 👋
</div>

<div class="auto-chatbot-button" id="chatbotButton">
  <img src="https://i.imgur.com/2sRQ8DZ.png" alt="logo">
  <div class="auto-chatbot-notification">1</div>
</div>

<div class="auto-chatbot" id="autoChatbot">

  <div class="auto-chatbot-header">
    <img src="https://i.imgur.com/2sRQ8DZ.png">

    <div>
      <h3>Auto Trouvez AI</h3>
      <p>Assistant intelligent • En ligne</p>
    </div>

    <div class="auto-chatbot-close" id="closeChatbot">
      ×
    </div>
  </div>

  <div class="auto-chatbot-messages" id="chatMessages">

    <div class="auto-message bot-message">
      Bonjour 👋<br><br>
      Je suis l’assistant intelligent Auto Trouvez.<br>
      Comment puis-je vous aider aujourd’hui ?
    </div>

  </div>

  <div class="auto-chatbot-input">

    <input
      type="text"
      id="chatInput"
      placeholder="Écrivez votre message..."
    >

    <button id="sendMessage">
      ➤
    </button>

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

  document.getElementById("autoTooltip").style.display = "none";

  button.querySelector(".auto-chatbot-notification").style.display = "none";
});

closeBtn.addEventListener("click", () => {
  chatbot.style.display = "none";
});

async function sendMessage() {

  const text = input.value.trim();

  if (!text) return;

  messages.innerHTML += `
    <div class="auto-message user-message">
      ${text}
    </div>
  `;

  history.push({
    role: "user",
    content: text
  });

  input.value = "";

  messages.innerHTML += `
    <div class="auto-message bot-message" id="typing">
      Typing...
    </div>
  `;

  messages.scrollTop = messages.scrollHeight;

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

    document.getElementById("typing").remove();

    messages.innerHTML += `
      <div class="auto-message bot-message">
        ${data.reply}
      </div>
    `;

    history.push({
      role: "assistant",
      content: data.reply
    });

    messages.scrollTop = messages.scrollHeight;

  } catch (error) {

    document.getElementById("typing").remove();

    messages.innerHTML += `
      <div class="auto-message bot-message">
        Server error ❌
      </div>
    `;
  }
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

setTimeout(() => {

  const tooltip = document.getElementById("autoTooltip");

  if (tooltip) {
    tooltip.remove();
  }

}, 7000);
