<script setup>
import { ref, onMounted } from 'vue'

const isOpen = ref(false)
const isMounted = ref(false)
const isFirstOpen = ref(true)

const toggleChatbot = () => {
  isOpen.value = !isOpen.value

  // Load chatbot resources only when opened for the first time
  if (isOpen.value && isFirstOpen.value) {
    isFirstOpen.value = false
  }
}

onMounted(() => {
  // Mark component as mounted
  isMounted.value = true

  // Load Dialogflow resources when component is mounted
  if (!document.getElementById('df-messenger-css')) {
    const dfStyle = document.createElement('link')
    dfStyle.id = 'df-messenger-css'
    dfStyle.rel = 'stylesheet'
    dfStyle.href =
      'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css'
    document.head.appendChild(dfStyle)
  }

  if (!document.getElementById('df-messenger-js')) {
    const dfScript = document.createElement('script')
    dfScript.id = 'df-messenger-js'
    dfScript.src =
      'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js'
    document.head.appendChild(dfScript)
  }
})
</script>

<template>
  <div class="chatbot-container">
    <!-- Chat Toggle Button -->
    <button
      @click="toggleChatbot"
      :class="['chat-toggle-btn', { active: isOpen }]"
      aria-label="Toggle chatbot"
    >
      <div class="btn-content">
        <svg
          v-if="!isOpen"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <span class="btn-text" v-if="!isOpen">Chat dengan Asisten</span>
      </div>
    </button>

    <!-- Chatbot Panel -->
    <div class="chatbot-panel" :class="{ open: isOpen }">
      <div v-if="isMounted && !isFirstOpen" class="chatbot-wrapper">
        <df-messenger
          project-id="bold-guide-460509-t6"
          agent-id="b044a8eb-c5bc-4ada-a860-b02d95cf2092"
          language-code="id"
          max-query-length="-1"
        >
          <df-messenger-chat chat-title="Asisten Kesehatan Jantung"> </df-messenger-chat>
        </df-messenger>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chatbot-container {
  position: fixed;
  z-index: 999;
}

.chat-toggle-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 24px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-toggle-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

.chat-toggle-btn.active {
  background: #dc2626;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  padding: 0;
  right: 360px;
  bottom: 10px;
}

.chat-toggle-btn.active:hover {
  box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-text {
  font-weight: 500;
  display: inline-block;
}

.chatbot-panel {
  position: fixed;
  top: 0;
  right: -380px;
  width: 350px;
  height: 100vh;
  background-color: white;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 999;
  display: flex;
  flex-direction: column;
}

.chatbot-panel.open {
  right: 0;
}

.chatbot-wrapper {
  height: 100%;
  width: 100%;
}

df-messenger {
  --df-messenger-font-color: #000;
  --df-messenger-font-family: 'Google Sans', sans-serif;
  --df-messenger-chat-background: #f3f6fc;
  --df-messenger-message-user-background: #d3e3fd;
  --df-messenger-message-bot-background: #fff;
  width: 100%;
  height: 100%;
}

/* Mobile responsive adjustments */
@media (max-width: 640px) {
  .chatbot-panel {
    width: 90vw;
    right: -90vw;
  }

  .chat-toggle-btn.active {
    right: calc(90vw + 10px);
  }

  .chat-toggle-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
