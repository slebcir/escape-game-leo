/**
 * Smartphone Virtuel de Léo - Application SPA Logic (Instagram Fix & Pong Game)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialisation des icônes Lucide
  if (window.lucide) {
    lucide.createIcons();
  }

  // Éléments du DOM
  const homeScreen = document.getElementById('home-screen');
  const homeCarousel = document.getElementById('home-carousel');
  const dot1 = document.getElementById('dot-1');
  const dot2 = document.getElementById('dot-2');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  const appScreens = document.querySelectorAll('.app-screen');
  const appIcons = document.querySelectorAll('.app-icon');
  const appBackBtns = document.querySelectorAll('.app-back-btn');
  const homeIndicator = document.getElementById('home-indicator');

  // -------------------------------------------------------------
  // 1. CARROUSEL D'ACCUEIL - SWIPE GLOBAL
  // -------------------------------------------------------------
  let currentPage = 1;

  function goToPage(page) {
    currentPage = page;
    if (currentPage === 1) {
      homeCarousel.style.transform = 'translateX(0%)';
      dot1.className = 'w-2.5 h-2.5 rounded-full bg-white transition-all';
      dot2.className = 'w-2 h-2 rounded-full bg-white/40 transition-all';
    } else {
      homeCarousel.style.transform = 'translateX(-50%)';
      dot1.className = 'w-2 h-2 rounded-full bg-white/40 transition-all';
      dot2.className = 'w-2.5 h-2.5 rounded-full bg-white transition-all';
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goToPage(1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToPage(2));
  if (dot1) dot1.addEventListener('click', () => goToPage(1));
  if (dot2) dot2.addEventListener('click', () => goToPage(2));

  // GESTION DU SWIPE
  let touchStartX = 0;
  let touchStartY = 0;
  let isMouseDown = false;

  if (homeScreen) {
    homeScreen.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    homeScreen.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX > 0) goToPage(2);
        else goToPage(1);
      }
    }, { passive: true });

    homeScreen.addEventListener('mousedown', (e) => {
      if (e.target.closest('.app-icon')) return;
      isMouseDown = true;
      touchStartX = e.clientX;
    });

    homeScreen.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      const diffX = touchStartX - e.clientX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) goToPage(2);
        else goToPage(1);
      }
    });
  }

  // -------------------------------------------------------------
  // 2. GESTION NAVIGATION ET HIÉRARCHIE DES APPS
  // -------------------------------------------------------------
  const appSubState = {};

  function openApp(appName) {
    const targetApp = document.getElementById(`app-${appName}`);
    if (!targetApp) return;

    homeScreen.classList.add('hidden');
    homeScreen.classList.remove('flex');

    appScreens.forEach(screen => {
      screen.classList.add('hidden');
      screen.classList.remove('flex');
    });

    targetApp.classList.remove('hidden');
    targetApp.classList.add('flex');

    // Masquer le badge
    const icon = document.querySelector(`.app-icon[data-app="${appName}"]`);
    if (icon) {
      const badge = icon.querySelector('.app-badge');
      if (badge) badge.classList.add('hidden');
    }

    resetAppToRoot(appName);

    // Lancer Pong si c'est l'app Pong
    if (appName === 'pong') {
      startPongGame();
    } else {
      stopPongGame();
    }
  }

  function closeAllApps() {
    stopPongGame();
    appScreens.forEach(screen => {
      screen.classList.add('hidden');
      screen.classList.remove('flex');
    });
    homeScreen.classList.remove('hidden');
    homeScreen.classList.add('flex');
  }

  function resetAppToRoot(appName) {
    appSubState[appName] = 'root';
    updateBackBtnLabel(appName, 'Accueil');

    if (appName === 'chrome') {
      document.getElementById('chrome-home-view')?.classList.remove('hidden');
      document.getElementById('chrome-history-view')?.classList.add('hidden');
      document.getElementById('chrome-menu-dropdown')?.classList.add('hidden');
    } else if (appName === 'instagram') {
      document.getElementById('insta-story-modal')?.classList.add('hidden');
    } else if (appName === 'reddit') {
      document.getElementById('reddit-communities-view')?.classList.remove('hidden');
      document.getElementById('reddit-feed-view')?.classList.add('hidden');
    } else if (appName === 'whatsapp') {
      document.getElementById('wa-chat-list')?.classList.remove('hidden');
      document.getElementById('wa-chat-detail')?.classList.add('hidden');
    } else if (appName === 'messages') {
      document.getElementById('msg-chat-list')?.classList.remove('hidden');
      document.getElementById('msg-chat-detail')?.classList.add('hidden');
    } else if (appName === 'notes') {
      document.getElementById('notes-list-view')?.classList.remove('hidden');
      document.getElementById('note-detail-view')?.classList.add('hidden');
    } else if (appName === 'photos') {
      document.getElementById('photos-grid-view')?.classList.remove('hidden');
      document.getElementById('photos-modal-view')?.classList.add('hidden');
    }
  }

  function updateBackBtnLabel(appName, text) {
    const btn = document.querySelector(`.app-back-btn[data-app="${appName}"]`);
    if (btn) {
      const label = btn.querySelector('.back-text');
      if (label) label.textContent = text;
    }
  }

  appIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const appName = icon.getAttribute('data-app');
      openApp(appName);
    });
  });

  appBackBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const appName = btn.getAttribute('data-app');
      if (appSubState[appName] === 'subview') {
        resetAppToRoot(appName);
      } else {
        closeAllApps();
      }
    });
  });

  if (homeIndicator) {
    homeIndicator.addEventListener('click', closeAllApps);
  }

  // -------------------------------------------------------------
  // 3. CHROME : MENU 3 POINTS (⋮) -> HISTORIQUE
  // -------------------------------------------------------------
  const chromeMenuBtn = document.getElementById('chrome-menu-btn');
  const chromeMenuDropdown = document.getElementById('chrome-menu-dropdown');
  const chromeMenuHistoryItem = document.getElementById('chrome-menu-history-item');
  const chromeHomeView = document.getElementById('chrome-home-view');
  const chromeHistoryView = document.getElementById('chrome-history-view');

  if (chromeMenuBtn && chromeMenuDropdown) {
    chromeMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      chromeMenuDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      chromeMenuDropdown?.classList.add('hidden');
    });
  }

  if (chromeMenuHistoryItem) {
    chromeMenuHistoryItem.addEventListener('click', () => {
      chromeMenuDropdown?.classList.add('hidden');
      chromeHomeView?.classList.add('hidden');
      chromeHistoryView?.classList.remove('hidden');
      chromeHistoryView?.classList.add('flex');
      appSubState['chrome'] = 'subview';
      updateBackBtnLabel('chrome', 'Google');
    });
  }

  // -------------------------------------------------------------
  // 4. INSTAGRAM : STORIES CLIQUABLES & FEED
  // -------------------------------------------------------------
  const instaStoryItems = document.querySelectorAll('.insta-story-item');
  const instaStoryModal = document.getElementById('insta-story-modal');
  const instaStoryClose = document.getElementById('insta-story-close');

  instaStoryItems.forEach(item => {
    item.addEventListener('click', () => {
      const storyAuthor = item.getAttribute('data-story');
      if (storyAuthor === 'leo') {
        instaStoryModal?.classList.remove('hidden');
        instaStoryModal?.classList.add('flex');
        appSubState['instagram'] = 'subview';
        updateBackBtnLabel('instagram', 'Instagram');
      }
    });
  });

  if (instaStoryClose) {
    instaStoryClose.addEventListener('click', () => {
      resetAppToRoot('instagram');
    });
  }

  // -------------------------------------------------------------
  // 5. REDDIT : SUBREDDIT r/ZeroLégumesFr
  // -------------------------------------------------------------
  const redditCommItems = document.querySelectorAll('.reddit-comm-item');
  const redditCommunitiesView = document.getElementById('reddit-communities-view');
  const redditFeedView = document.getElementById('reddit-feed-view');
  const redditBackToComm = document.getElementById('reddit-back-to-comm');

  redditCommItems.forEach(item => {
    item.addEventListener('click', () => {
      const subName = item.getAttribute('data-sub');
      if (subName === 'zerolegumes') {
        redditCommunitiesView?.classList.add('hidden');
        redditFeedView?.classList.remove('hidden');
        redditFeedView?.classList.add('flex');
        appSubState['reddit'] = 'subview';
        updateBackBtnLabel('reddit', 'Communautés');
      }
    });
  });

  if (redditBackToComm) {
    redditBackToComm.addEventListener('click', () => resetAppToRoot('reddit'));
  }

  // -------------------------------------------------------------
  // 6. WHATSAPP / MESSAGES / NOTES / PHOTOS
  // -------------------------------------------------------------
  const waChatItems = document.querySelectorAll('.wa-chat-item');
  const waChatList = document.getElementById('wa-chat-list');
  const waChatDetail = document.getElementById('wa-chat-detail');
  const waBackToList = document.getElementById('wa-back-to-list');
  const waContactName = document.getElementById('wa-contact-name');
  const waMessagesContainer = document.getElementById('wa-messages-container');

  const waData = {
    lucas: {
      name: "Lucas (Lycée)", avatar: "LU", color: "bg-emerald-700",
      messages: [
        { time: "13:40", sender: "Lucas", text: "Wsh frérot t'es où ? T'as raté le cours de français", incoming: true },
        { time: "13:42", sender: "Léo", text: "Je sors de chez le dentiste gros, j'avais une rage de dent horrible toute la nuit 😭", incoming: false },
        { time: "13:43", sender: "Lucas", text: "Ah la galère... il t'a filé un truc ?", incoming: true },
        { time: "13:45", sender: "Léo", text: "Ouais mais l'ordonnance mettait trop de temps à la pharmacie. Du coup j'ai pris 2 Ibuprofène 400mg du placard de mon frère ce matin et 1 ce midi, ça soulage de fou !", incoming: false },
        { time: "13:46", sender: "Lucas", text: "Propre, vas-y à toute au foot cet aprem.", incoming: true }
      ]
    },
    nathan: {
      name: "Nathan", avatar: "NA", color: "bg-indigo-600",
      messages: [
        { time: "02:15", sender: "Léo", text: "Gros j'en peux plus, nuit blanche sur le nouveau jeu. On a commandé 2 pizzas à 2h du mat avec les gars 🍕💀", incoming: false },
        { time: "07:10", sender: "Nathan", text: "Abusé tu vas dormir en cours de SVT tout à l'heure.", incoming: true }
      ]
    }
  };

  waChatItems.forEach(item => {
    item.addEventListener('click', () => {
      const chatId = item.getAttribute('data-chat');
      const chat = waData[chatId];
      if (!chat) return;

      if (waContactName) waContactName.textContent = chat.name;
      if (waMessagesContainer) {
        waMessagesContainer.innerHTML = chat.messages.map(msg => `
          <div class="flex flex-col ${msg.incoming ? 'items-start max-w-[82%]' : 'items-end ml-auto max-w-[82%]' }">
            <div class="relative ${msg.incoming ? 'bg-[#202c33] text-slate-100' : 'bg-[#005c4b] text-white'} p-2.5 rounded-lg shadow-xs">
              <p class="leading-relaxed">${msg.text}</p>
              <span class="text-[9px] text-slate-400 block text-right mt-1">${msg.time}</span>
            </div>
          </div>
        `).join('');
      }

      waChatList?.classList.add('hidden');
      waChatDetail?.classList.remove('hidden');
      waChatDetail?.classList.add('flex');
      appSubState['whatsapp'] = 'subview';
      updateBackBtnLabel('whatsapp', 'Discussions');
    });
  });

  if (waBackToList) waBackToList.addEventListener('click', () => resetAppToRoot('whatsapp'));

  // SMS
  const msgChatItems = document.querySelectorAll('.msg-chat-item');
  const msgChatList = document.getElementById('msg-chat-list');
  const msgChatDetail = document.getElementById('msg-chat-detail');
  const msgBackToList = document.getElementById('msg-back-to-list');
  const msgMessagesContainer = document.getElementById('msg-messages-container');

  msgChatItems.forEach(item => {
    item.addEventListener('click', () => {
      if (msgMessagesContainer) {
        msgMessagesContainer.innerHTML = `
          <div class="flex flex-col items-start max-w-[80%]"><div class="bg-slate-200 text-slate-900 rounded-2xl p-2.5"><p class="text-xs">Coucou Léo, ton mal de tête ça va mieux ?</p></div><span class="text-[9px] text-slate-400 mt-1">12:10</span></div>
          <div class="flex flex-col items-end ml-auto max-w-[80%]"><div class="bg-blue-500 text-white rounded-2xl p-2.5"><p class="text-xs">Oui maman j'ai pris 1 comprimé de Doliprane 500mg après le repas comme tu m'as dit, ça va beaucoup mieux.</p></div><span class="text-[9px] text-slate-400 mt-1">12:15</span></div>
        `;
      }
      msgChatList?.classList.add('hidden');
      msgChatDetail?.classList.remove('hidden');
      msgChatDetail?.classList.add('flex');
      appSubState['messages'] = 'subview';
      updateBackBtnLabel('messages', 'SMS');
    });
  });

  if (msgBackToList) msgBackToList.addEventListener('click', () => resetAppToRoot('messages'));

  // NOTES
  const noteItems = document.querySelectorAll('.note-item');
  const notesListView = document.getElementById('notes-list-view');
  const noteDetailView = document.getElementById('note-detail-view');
  const noteBackToList = document.getElementById('note-back-to-list');
  const noteDetailTitle = document.getElementById('note-detail-title');
  const noteDetailDate = document.getElementById('note-detail-date');
  const noteDetailContent = document.getElementById('note-detail-content');

  const notesData = {
    'double-dose': {
      title: "Penses bêtes / Traitement", date: "Aujourd'hui, 07:32",
      content: `<p class="font-bold text-slate-900 mb-1">Hier - 23:45</p><p class="mb-3">Oublié de prendre le cachet de 20h... Trop saoulé.</p><p class="font-bold text-slate-900 mb-1">Ce matin - 07:30</p><p>Bon du coup j'ai pris 2 comprimés ce matin au réveil pour rattraper la dose d'hier avant d'aller en cours. Faut pas que je loupe mon traitement.</p>`
    },
    'oubli-gere': {
      title: "Rappel Mardi", date: "Mardi 07 Mai",
      content: `<p>Mince j'ai oublié ma prise de 20h...</p><p class="mt-2">Bon la pharmacienne m'a bien dit de JAMAIS doubler la dose le lendemain. Tant pis, je reprends ma dose normale ce soir à 20h sans rien changer.</p>`
    }
  };

  noteItems.forEach(item => {
    item.addEventListener('click', () => {
      const noteId = item.getAttribute('data-note');
      const note = notesData[noteId];
      if (!note) return;

      if (noteDetailTitle) noteDetailTitle.textContent = note.title;
      if (noteDetailDate) noteDetailDate.textContent = note.date;
      if (noteDetailContent) noteDetailContent.innerHTML = note.content;

      notesListView?.classList.add('hidden');
      noteDetailView?.classList.remove('hidden');
      noteDetailView?.classList.add('flex');
      appSubState['notes'] = 'subview';
      updateBackBtnLabel('notes', 'Notes');
    });
  });

  if (noteBackToList) noteBackToList.addEventListener('click', () => resetAppToRoot('notes'));

  // PHOTOS
  const photoThumbs = document.querySelectorAll('.photo-thumb');
  const photosGridView = document.getElementById('photos-grid-view');
  const photosModalView = document.getElementById('photos-modal-view');
  const photoCloseModal = document.getElementById('photo-close-modal');

  photoThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      photosGridView?.classList.add('hidden');
      photosModalView?.classList.remove('hidden');
      photosModalView?.classList.add('flex');
      appSubState['photos'] = 'subview';
      updateBackBtnLabel('photos', 'Galerie');
    });
  });

  if (photoCloseModal) photoCloseModal.addEventListener('click', () => resetAppToRoot('photos'));

  // -------------------------------------------------------------
  // 7. MINI-JEU PONG JOUABLE EN CANVAS HTML5
  // -------------------------------------------------------------
  const canvas = document.getElementById('pongCanvas');
  const pongStartBtn = document.getElementById('pong-start-btn');
  const pongScoreEl = document.getElementById('pong-score');

  let ctx = null;
  let pongAnimId = null;
  let isPongRunning = false;

  // Propriétés du jeu
  const gameWidth = 320;
  const gameHeight = 380;

  const paddleWidth = 70;
  const paddleHeight = 10;

  let playerX = (gameWidth - paddleWidth) / 2;
  let botX = (gameWidth - paddleWidth) / 2;

  let ballX = gameWidth / 2;
  let ballY = gameHeight / 2;
  let ballRadius = 6;
  let ballSpeedX = 3.5;
  let ballSpeedY = 3.5;

  let playerScore = 0;
  let botScore = 0;

  if (canvas) {
    canvas.width = gameWidth;
    canvas.height = gameHeight;
    ctx = canvas.getContext('2d');

    // Contrôles Souris & Tactile
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      playerX = Math.max(0, Math.min(gameWidth - paddleWidth, relativeX - paddleWidth / 2));
    });

    canvas.addEventListener('touchmove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.touches[0].clientX - rect.left;
      playerX = Math.max(0, Math.min(gameWidth - paddleWidth, relativeX - paddleWidth / 2));
    }, { passive: true });
  }

  function resetBall() {
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * (2.5 + Math.random() * 1.5);
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * (3.0 + Math.random() * 1.0);
  }

  function updatePongScore() {
    if (pongScoreEl) {
      pongScoreEl.textContent = `Joueur : ${playerScore} | Bot : ${botScore}`;
    }
  }

  function updatePong() {
    if (!isPongRunning) return;

    // Déplacement de la balle
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // IA Bot (suivi imparfait)
    const botCenter = botX + paddleWidth / 2;
    if (botCenter < ballX - 10) {
      botX += 2.8;
    } else if (botCenter > ballX + 10) {
      botX -= 2.8;
    }
    botX = Math.max(0, Math.min(gameWidth - paddleWidth, botX));

    // Rebonds murs gauche/droit
    if (ballX - ballRadius <= 0 || ballX + ballRadius >= gameWidth) {
      ballSpeedX = -ballSpeedX;
    }

    // Rebond Raquette Bot (Haut)
    if (ballY - ballRadius <= paddleHeight + 10) {
      if (ballX >= botX && ballX <= botX + paddleWidth) {
        ballSpeedY = Math.abs(ballSpeedY); // Rebond vers le bas
        ballSpeedX += (Math.random() - 0.5) * 0.8;
      }
    }

    // Rebond Raquette Joueur (Bas)
    if (ballY + ballRadius >= gameHeight - paddleHeight - 10) {
      if (ballX >= playerX && ballX <= playerX + paddleWidth) {
        ballSpeedY = -Math.abs(ballSpeedY); // Rebond vers le haut
        ballSpeedX += (Math.random() - 0.5) * 0.8;
      }
    }

    // Point Bot (si la balle dépasse le bas)
    if (ballY - ballRadius > gameHeight) {
      botScore++;
      updatePongScore();
      resetBall();
    }

    // Point Joueur (si la balle dépasse le haut)
    if (ballY + ballRadius < 0) {
      playerScore++;
      updatePongScore();
      resetBall();
    }

    drawPong();
    pongAnimId = requestAnimationFrame(updatePong);
  }

  function drawPong() {
    if (!ctx) return;

    // Effacer le canvas (fond sombre)
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    // Ligne centrale en pointillé
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(0, gameHeight / 2);
    ctx.lineTo(gameWidth, gameHeight / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Raquette Bot (Haut - Violet)
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(botX, 10, paddleWidth, paddleHeight);

    // Raquette Joueur (Bas - Vert Émeraude)
    ctx.fillStyle = '#10b981';
    ctx.fillRect(playerX, gameHeight - paddleHeight - 10, paddleWidth, paddleHeight);

    // Balle (Blanche lumineuse)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  function startPongGame() {
    if (!ctx) return;
    isPongRunning = true;
    if (pongAnimId) cancelAnimationFrame(pongAnimId);
    resetBall();
    updatePongScore();
    pongAnimId = requestAnimationFrame(updatePong);
  }

  function stopPongGame() {
    isPongRunning = false;
    if (pongAnimId) {
      cancelAnimationFrame(pongAnimId);
      pongAnimId = null;
    }
  }

  if (pongStartBtn) {
    pongStartBtn.addEventListener('click', () => {
      playerScore = 0;
      botScore = 0;
      startPongGame();
    });
  }
});
