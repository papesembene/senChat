import { getCurrentUser } from "../Services/auth.js";
// import { refreshMessages } from "./ChatUI.js";
const API_URL = import.meta.env.VITE_API_URL;


export let isRecording = false;
let mediaRecorder;
let audioChunks = [];
let currentConversation = null;
let recordingTimer;
let recordingSeconds = 0;

export async function startRecording(selectedConversation)
{
    currentConversation = selectedConversation;
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    {
        try
        {
            const stream = await navigator.mediaDevices.getUserMedia({audio:true})
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            mediaRecorder.ondataavailable = e=>{
                if(e.data.size>0) audioChunks.push(e.data);
            }
            mediaRecorder.onstop = async () => {
              const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
              await sendVoiceMessage(audioBlob, currentConversation);
            };
            mediaRecorder.start();
            isRecording = true;

            recordingSeconds = 0;
            recordingTimer = setInterval(() => {
              recordingSeconds++;
              const timerEl = document.getElementById('recording-timer');
              if (timerEl) timerEl.textContent = formatSeconds(recordingSeconds);
            }, 1000);
        }catch(err)
        {
            console.error("Error accessing microphone:", err);
        }

    
    }

}

export async function stopRecording()
{
    if(isRecording && mediaRecorder)
    {
        mediaRecorder.stop();
        isRecording = false;
        clearInterval(recordingTimer);
    }
}

export async function sendVoiceMessage(audioBlob, selectedConversation) 
{
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Audio = reader.result; 
    const currentUser = getCurrentUser();
    const message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      conversationId: selectedConversation.id,
      senderId: currentUser.id,
      type: 'audio',
      content: base64Audio,
      timestamp: new Date().toISOString(),
      status: 'envoye'
    };
    await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });

    await fetch(`${API_URL}/conversations/${selectedConversation.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lastMessage: '🎤 Message vocal',
        lastMessageType: 'audio',
        lastActivity: new Date().toISOString()
      })
    });
  };
  reader.readAsDataURL(audioBlob);
}
export function formatSeconds(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

onclick: async () => {
  await stopRecording();
  clearInterval(recordingTimer);
  recordingState = false;
  setInputMessage('');
  window.renderChatArea && window.renderChatArea();
}