const CONVERSATIONS = [
  {
    id: 'organic',
    name: 'Organic Harvest Importers',
    avatar: 'assets/avatar-organic.png',
    avatarRound: false,
    headerAvatar: 'assets/avatar-organic-header.png',
    online: true,
    presence: 'Active now',
    unread: true,
    lastTime: '10:45 AM',
    product: { img: 'assets/product-avocado.png', label: 'Premium Grade Avocados (Hass)' },
    date: 'August 14, 2024',
    typing: true,
    replies: [
      'Deal. $4.50/kg for the 500kg batch — I will send the proforma invoice within the hour.',
      'Payment terms net 30 as usual, correct? I have locked the stock for you.',
      'Wonderful doing business with you again. The batch ships on Thursday.'
    ],
    messages: [
      { from: 'in', time: '09:12 AM', text: 'Hello! We received your inquiry for the 500kg Hass Avocados. Our standard rate is $5.20/kg for bulk orders over 300kg.' },
      { from: 'out', time: '09:45 AM', status: 'Read', text: "Hi there. We've been a regular customer for years. Could we look at $4.30/kg considering the market price drop this week?" },
      { from: 'in', time: '10:15 AM', text: 'I understand. However, shipping costs have increased. The best I can do for a single shipment is $4.80/kg.' },
      { from: 'out', time: '10:45 AM', text: "Let's meet in the middle. Can we settle on $4.50/kg for the 500kg batch? If so, I'll place the order immediately." }
    ]
  },
  {
    id: 'urban',
    name: 'Urban Grocers Inc.',
    avatar: 'assets/avatar-urban.png',
    avatarRound: true,
    headerAvatar: 'assets/avatar-urban.png',
    online: true,
    presence: 'Active now',
    unread: false,
    lastTime: 'Yesterday',
    product: null,
    date: 'August 13, 2024',
    typing: false,
    replies: [
      'Will do. The bill of lading follows as soon as customs releases the container.',
      'Noted. Our logistics team has booked the reefer for Friday morning.',
      'Confirmed. Tracking details will be shared in this thread.'
    ],
    messages: [
      { from: 'in', time: '03:40 PM', text: 'The quality inspection passed. Shipment #4471 clears customs tomorrow morning.' },
      { from: 'out', time: '04:02 PM', status: 'Read', text: 'Excellent news. Please send the bill of lading once it is available.' },
      { from: 'in', time: '04:15 PM', text: 'Will do. Expect the cold-chain report attached to it as well.' }
    ]
  },
  {
    id: 'elite',
    name: 'Elite Wood Crafts',
    avatar: 'assets/avatar-elite.png',
    avatarRound: false,
    headerAvatar: 'assets/avatar-elite.png',
    online: false,
    presence: 'Last seen Aug 12',
    unread: false,
    lastTime: 'Aug 12',
    product: null,
    date: 'August 12, 2024',
    typing: false,
    replies: [
      'Thank you! The new walnut order is already in production.',
      'Appreciated. We will include the care kit with the next crate.',
      'Noted on our side. Have a great week!'
    ],
    messages: [
      { from: 'in', time: '09:05 AM', text: 'Your invoice #8892 has been paid in full. Thank you for the handcrafted oak shelves.' },
      { from: 'out', time: '09:31 AM', status: 'Read', text: 'Payment received, thank you! It was a pleasure working with your workshop.' }
    ]
  }
];

const GENERIC_REPLY = 'Thanks for the update — noted on our side.';

let currentId = CONVERSATIONS[0].id;
let searchQuery = '';

const convList = document.getElementById('convList');
const messagesEl = document.getElementById('messages');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const convSearch = document.getElementById('convSearch');
const chatAvatar = document.getElementById('chatAvatar');
const chatName = document.getElementById('chatName');
const chatPresence = document.getElementById('chatPresence');
const productBar = document.getElementById('productBar');
const productImg = document.getElementById('productImg');
const productLabel = document.getElementById('productLabel');

const current = () => CONVERSATIONS.find(c => c.id === currentId);

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function lastPreview(conv) {
  const last = conv.messages[conv.messages.length - 1];
  return last ? last.text : '';
}

function renderSidebar() {
  const q = searchQuery.trim().toLowerCase();
  convList.innerHTML = CONVERSATIONS
    .filter(c => !q || c.name.toLowerCase().includes(q) || lastPreview(c).toLowerCase().includes(q))
    .map(c => `
      <li class="conv${c.id === currentId ? ' active' : ''}" data-id="${c.id}">
        <div class="conv-avatar${c.avatarRound ? ' round' : ''}">
          <img src="${c.avatar}" alt="">
          ${c.online ? '<span class="dot"></span>' : ''}
        </div>
        <div class="conv-body">
          <div class="conv-row">
            <span class="conv-name">${escapeHtml(c.name)}</span>
            <span class="conv-time">${escapeHtml(c.lastTime)}</span>
          </div>
          <div class="conv-preview">${escapeHtml(lastPreview(c))}</div>
        </div>
        ${c.unread ? '<span class="unread"></span>' : ''}
      </li>`)
    .join('');
}

function messageHtml(m) {
  const status = m.from === 'out' && m.status ? ` &middot; ${escapeHtml(m.status)}` : '';
  return `
    <div class="msg ${m.from}">
      <div class="bubble">${escapeHtml(m.text)}</div>
      <div class="meta">${escapeHtml(m.time)}${status}</div>
    </div>`;
}

function renderChat() {
  const conv = current();
  chatAvatar.src = conv.headerAvatar;
  chatName.textContent = conv.name;
  chatPresence.innerHTML = `<i></i>${escapeHtml(conv.presence)}`;
  chatPresence.classList.toggle('offline', !conv.online);

  if (conv.product) {
    productBar.classList.remove('hidden');
    productImg.src = conv.product.img;
    productLabel.textContent = conv.product.label;
  } else {
    productBar.classList.add('hidden');
  }

  messagesEl.innerHTML =
    `<div class="date-chip">${escapeHtml(conv.date)}</div>` +
    conv.messages.map(messageHtml).join('') +
    (conv.typing ? '<div class="typing"><span></span><span></span><span></span></div>' : '');

  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function openConversation(id) {
  if (id === currentId) return;
  currentId = id;
  current().unread = false;
  renderSidebar();
  renderChat();
}

function scheduleReply(conv) {
  setTimeout(() => {
    conv.typing = true;
    if (conv.id === currentId) renderChat();
  }, 800);

  setTimeout(() => {
    conv.typing = false;
    conv.messages.forEach(m => { if (m.from === 'out') m.status = 'Read'; });
    conv.messages.push({ from: 'in', time: nowTime(), text: conv.replies.shift() || GENERIC_REPLY });
    conv.lastTime = nowTime();
    if (conv.id !== currentId) conv.unread = true;
    renderSidebar();
    if (conv.id === currentId) renderChat();
  }, 2600);
}

function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;
  const conv = current();
  conv.messages.push({ from: 'out', time: nowTime(), text });
  conv.lastTime = nowTime();
  msgInput.value = '';
  renderSidebar();
  renderChat();
  scheduleReply(conv);
  msgInput.focus();
}

convList.addEventListener('click', e => {
  const item = e.target.closest('.conv');
  if (item) openConversation(item.dataset.id);
});

sendBtn.addEventListener('click', sendMessage);
msgInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

convSearch.addEventListener('input', () => {
  searchQuery = convSearch.value;
  renderSidebar();
});

document.querySelectorAll('.role-toggle button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.role-toggle button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

document.getElementById('composeBtn').addEventListener('click', () => {
  convSearch.focus();
});

renderSidebar();
renderChat();
