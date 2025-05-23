const consoleDiv   = document.getElementById('console');
const galleryDiv   = document.getElementById('gallery');
const messageInput = document.getElementById('messageInput');
const nicknameInput= document.getElementById('nicknameInput');
const uploadBtn    = document.getElementById('uploadBtn');
const fileInput    = document.getElementById('fileInput');

function addLine(text){
  const line=document.createElement('div');
  const ding = document.createElement('audio');
  ding.src = 'static/ping.mp3';
  ding.currentTime=0;
  ding.play();
  line.textContent=text;
  consoleDiv.appendChild(line);
  consoleDiv.scrollTop=consoleDiv.scrollHeight;
}

function addImage(url){
  const img = new Image();
  img.src = url;
  galleryDiv.insertBefore(img, galleryDiv.children[0]);
}

// Get images on load
fetch('/images')
  .then(r => r.ok ? r.json() : [])
  .then(arr => Array.isArray(arr) && arr.forEach(addImage))
  .catch(()=>{});

// Backlog on load
fetch('/logs')
  .then(r=>r.ok?r.json():[])
  .then(lines=>Array.isArray(lines)&&lines.forEach(addLine))
  .catch(()=>{});

// Live updates
const socket = io();
socket.on('log', addLine);
socket.on('image', addImage);

// Send chat message
function sendMessage(){
  const msg = messageInput.value.trim();
  const nickname = nicknameInput.value ? nicknameInput.value.trim() : "Anon";
  if(!msg) return;
  fetch('/message',{
    method:'POST',
    headers:{'Content-Type':'text/plain'},
    body: `[${nickname}] ${msg}`
  });
  messageInput.value='';
}
messageInput.addEventListener('keydown',e=>{
  if(e.key==='Enter') sendMessage();
});

// Upload image flow
uploadBtn.addEventListener('click', ()=>fileInput.click());
fileInput.addEventListener('change', ()=>{
  const file = fileInput.files[0];
  if(!file) return;
  const fd = new FormData();
  fd.append('image', file);
  fetch('/upload-image',{method:'POST', body:fd});
  fileInput.value='';
});

function goAFK(){
  const nickname = nicknameInput.value ? nicknameInput.value.trim() : "Anon";

  fetch('/code/AFK',{
    method:'POST',
    headers:{'Content-Type':'text/plain'},
    body: `*${nickname} went AFK*`
  });
  fetch('/code/AFK',{method:'POST'})
}

function comeBack(){
  const nickname = nicknameInput.value ? nicknameInput.value.trim() : "Anon";

  fetch('/code/BACK',{
    method:'POST',
    headers:{'Content-Type':'text/plain'},
    body: `*${nickname} is back*`
  });
  fetch('/code/AFK',{method:'POST'})
}