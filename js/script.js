const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector("#send-btn");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "AIzaSyCg20Qbci80POYjv6OXWoW0WoO1wTruOWI";

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" 
        ? `<p></p>` 
        : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contents: [{ 
            role: "user", 
            parts: [{ text: userMessage }] 
          }] 
        }),
    };
      
    fetch(API_URL, requestOptions)
      .then(res => res.json())
      .then(data => {
        messageElement.textContent = data.candidates[0].content.parts[0].text;
      })
      .catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Ocurrió algún error, por favor intente de nuevo.";
        console.error("Error en fetch:", error);
      })
      .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    chatInput.value = "";
    adjustTextareaHeight(); // Ajustar altura después de enviar el mensaje

    setTimeout(() => {
        const incomingChatLi = createChatLi("Escribiendo...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

// Ajustar la altura del textarea dinámicamente
const adjustTextareaHeight = () => {
    chatInput.style.height = 'auto'; // Restablecer la altura
    chatInput.style.height = `${chatInput.scrollHeight}px`; // Ajustar a la altura del contenido
}

// Escuchar el evento click en el botón de enviar
sendChatBtn.addEventListener("click", handleChat);

chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

// Ajustar la altura del textarea en cada entrada
chatInput.addEventListener("input", adjustTextareaHeight);

// Enviar el mensaje al presionar Enter
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});
