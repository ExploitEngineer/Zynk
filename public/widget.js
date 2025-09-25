(function () {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideDown {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(20px); opacity: 0; }
    }
    .chat-iframe {
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .chat-hidden {
      display: none !important;
    }
  `;
  document.head.appendChild(style);

  const button = document.createElement("button");
  button.innerText = "💬";
  button.title = "Chat with AI";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.zIndex = "99999";
  button.style.background = "#5E5E5E";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "50%";
  button.style.width = "60px";
  button.style.height = "60px";
  button.style.fontSize = "24px";
  button.style.cursor = "pointer";
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
  button.style.transition = "transform 0.2s ease, background 0.3s ease";
  button.onmouseenter = () => (button.style.transform = "scale(1.1)");
  button.onmouseleave = () => (button.style.transform = "scale(1)");
  document.body.appendChild(button);

  const iframe = document.createElement("iframe");
  iframe.src = "http://localhost:3000/widget-chat";
  iframe.className = "chat-iframe chat-hidden";
  iframe.style.position = "fixed";
  iframe.style.bottom = "90px";
  iframe.style.right = "20px";
  iframe.style.width = "500px";
  iframe.style.height = "800px";
  iframe.style.border = "none";
  iframe.style.borderRadius = "12px";
  iframe.style.boxShadow = "0px 8px 24px rgba(0,0,0,0.25)";
  iframe.style.zIndex = "99999";
  iframe.style.opacity = "0";
  iframe.style.transform = "translateY(20px)";
  iframe.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  document.body.appendChild(iframe);

  let isOpen = false;
  button.addEventListener("click", () => {
    if (!isOpen) {
      iframe.classList.remove("chat-hidden");
      setTimeout(() => {
        iframe.style.opacity = "1";
        iframe.style.transform = "translateY(0)";
      }, 10);
    } else {
      iframe.style.opacity = "0";
      iframe.style.transform = "translateY(20px)";
      setTimeout(() => {
        iframe.classList.add("chat-hidden");
      }, 300);
    }
    isOpen = !isOpen;
  });
})();
