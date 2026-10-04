/**
 * Smartphone Virtuel de Léo - Application SPA Logic (Refonte Scénario & Nouveaux Indices)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialisation sécurisée des icônes Lucide (avec fallback si chargement différé)
  function initIcons() {
    if (window.lucide && typeof lucide.createIcons === 'function') {
      try {
        lucide.createIcons();
      } catch (err) {
        console.warn('Lucide icons init warning:', err);
      }
    }
  }
  initIcons();
  window.addEventListener('load', initIcons);

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
  // 1. CENTRE DE NOTIFICATIONS DÉROULANT
  // -------------------------------------------------------------
  const statusBar = document.getElementById('status-bar');
  const notifCenter = document.getElementById('notification-center');
  const notifCenterClose = document.getElementById('notif-center-close');
  const notifCenterHandle = document.getElementById('notif-center-handle');
  const notifItems = document.querySelectorAll('.notif-item');

  function openNotifCenter() {
    if (notifCenter) {
      notifCenter.classList.remove('hidden');
      notifCenter.classList.add('flex');
    }
  }

  function closeNotifCenter() {
    if (notifCenter) {
      notifCenter.classList.add('hidden');
      notifCenter.classList.remove('flex');
    }
  }

  if (statusBar) statusBar.addEventListener('click', openNotifCenter);
  if (notifCenterClose) notifCenterClose.addEventListener('click', closeNotifCenter);
  if (notifCenterHandle) notifCenterHandle.addEventListener('click', closeNotifCenter);

  notifItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetApp = item.getAttribute('data-openapp');
      closeNotifCenter();
      if (targetApp) {
        openApp(targetApp);
      }
    });
  });

  // -------------------------------------------------------------
  // 2. CARROUSEL D'ACCUEIL - SWIPE GLOBAL SÉCURISÉ TACTILE / SOURIS
  // -------------------------------------------------------------
  let currentPage = 1;

  function goToPage(page) {
    currentPage = page;
    if (!homeCarousel) return;
    if (currentPage === 1) {
      homeCarousel.style.transform = 'translateX(0%)';
      if (dot1) dot1.className = 'w-2.5 h-2.5 rounded-full bg-white transition-all';
      if (dot2) dot2.className = 'w-2 h-2 rounded-full bg-white/40 transition-all';
    } else {
      homeCarousel.style.transform = 'translateX(-50%)';
      if (dot1) dot1.className = 'w-2 h-2 rounded-full bg-white/40 transition-all';
      if (dot2) dot2.className = 'w-2.5 h-2.5 rounded-full bg-white transition-all';
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goToPage(1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToPage(2));
  if (dot1) dot1.addEventListener('click', () => goToPage(1));
  if (dot2) dot2.addEventListener('click', () => goToPage(2));

  // Fonctions d'extraction sécurisée des coordonnées tactiles et souris
  function getPositionX(e) {
    if (e.type && e.type.includes('mouse')) return e.clientX;
    if (e.touches && e.touches[0]) return e.touches[0].clientX;
    if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].clientX;
    return 0;
  }

  function getPositionY(e) {
    if (e.type && e.type.includes('mouse')) return e.clientY;
    if (e.touches && e.touches[0]) return e.touches[0].clientY;
    if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].clientY;
    return 0;
  }

  // GESTION DU SWIPE SÉCURISÉE
  let touchStartX = 0;
  let touchStartY = 0;
  let isMouseDown = false;

  if (homeScreen) {
    homeScreen.addEventListener('touchstart', (e) => {
      touchStartX = getPositionX(e);
      touchStartY = getPositionY(e);
    }, { passive: true });

    homeScreen.addEventListener('touchend', (e) => {
      const touchEndX = getPositionX(e);
      const touchEndY = getPositionY(e);
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX > 0) goToPage(2);
        else goToPage(1);
      }
    }, { passive: true });

    homeScreen.addEventListener('mousedown', (e) => {
      if (e.target.closest && e.target.closest('.app-icon')) return;
      isMouseDown = true;
      touchStartX = getPositionX(e);
      touchStartY = getPositionY(e);
    });

    homeScreen.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      const diffX = touchStartX - getPositionX(e);
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) goToPage(2);
        else goToPage(1);
      }
    });
  }

  // -------------------------------------------------------------
  // 3. GESTION NAVIGATION ET HIÉRARCHIE DES APPS
  // -------------------------------------------------------------
  const appSubState = {};

  function openApp(appName) {
    closeNotifCenter();
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

    const icon = document.querySelector(`.app-icon[data-app="${appName}"]`);
    if (icon) {
      const badge = icon.querySelector('.app-badge');
      if (badge) badge.classList.add('hidden');
    }

    resetAppToRoot(appName);

    if (appName === 'pong') {
      startPongGame();
    } else {
      stopPongGame();
    }
  }

  function closeAllApps() {
    closeNotifCenter();
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

    if (appName === 'whatsapp') {
      document.getElementById('wa-chat-list')?.classList.remove('hidden');
      document.getElementById('wa-chat-detail')?.classList.add('hidden');
    } else if (appName === 'messages') {
      document.getElementById('msg-chat-list')?.classList.remove('hidden');
      document.getElementById('msg-chat-detail')?.classList.add('hidden');
    } else if (appName === 'photos') {
      document.getElementById('photos-modal-view')?.classList.add('hidden');
    } else if (appName === 'chrome') {
      const homeView = document.getElementById('chrome-home-view');
      const histView = document.getElementById('chrome-history-view');
      const menuDropdown = document.getElementById('chrome-menu-dropdown');
      if (homeView) homeView.classList.remove('hidden');
      if (histView) histView.classList.add('hidden');
      if (menuDropdown) menuDropdown.classList.add('hidden');
    } else if (appName === 'snapchat') {
      document.getElementById('snap-chat-list')?.classList.remove('hidden');
      document.getElementById('snap-chat-detail')?.classList.add('hidden');
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
  // 4. WHATSAPP : DISCUSSIONS (INDICE 02 🔴 - BOXE THAÏ)
  // -------------------------------------------------------------
  const waChatItems = document.querySelectorAll('.wa-chat-item');
  const waChatList = document.getElementById('wa-chat-list');
  const waChatDetail = document.getElementById('wa-chat-detail');
  const waBackToList = document.getElementById('wa-back-to-list');
  const waContactName = document.getElementById('wa-contact-name');
  const waMessagesContainer = document.getElementById('wa-messages-container');

  const waData = {
    sofiane: {
      name: "Sofiane (Boxe 🥊)",
      messages: [
        { time: "13:40", sender: "Sofiane", text: "Wsh Léo, la salle de Muay Thaï ouvre des créneaux sparring ce samedi après-midi. On se fait une session gants/frappe ensemble ? Ramène ton protège-dents !", incoming: true },
        { time: "13:45", sender: "Léo", text: "Carrément chaud ! J'ai trop envie de tester la boxe thaï, réserve ma place je viens direct.", incoming: false }
      ]
    },
    family: {
      name: "La Mif ❤️",
      messages: [
        { time: "12:15", sender: "Papa", text: "Léo, pense à sortir la poubelle jaune avant 19h stp.", incoming: true },
        { time: "12:18", sender: "Léo", text: "C'est bon c'est fait.", incoming: false },
        { time: "12:30", sender: "Maman", text: "N'oublie pas ton blouson demain matin, il gèle !", incoming: true }
      ]
    },
    lea: {
      name: "Léa (Classe 3ème B)",
      messages: [
        { time: "18:10", sender: "Léa", text: "T'as compris l'exo 3 de physique ? C'est trop dur la loi d'Ohm...", incoming: true },
        { time: "18:14", sender: "Léo", text: "Rien capté du tout, je vais recopier sur Thomas avant la sonnerie haha", incoming: false }
      ]
    },
    maxime: {
      name: "Maxime 🎮",
      messages: [
        { time: "20:45", sender: "Maxime", text: "T'es co ce soir ?", incoming: true },
        { time: "20:48", sender: "Léo", text: "Ouais vers 21h après le dîner, faut qu'on monte de rang !", incoming: false }
      ]
    },
    hugo: {
      name: "Hugo (Cousin 🍿)",
      messages: [
        { time: "11:15", sender: "Hugo", text: "Salut Léo ! J'ai pris les 2 places pour la séance de 17h30 samedi au ciné !", incoming: true, img: "assets/images/cinema.jpg" },
        { time: "11:18", sender: "Léo", text: "Super merci frérot ! C'est le film d'animation japonais ?", incoming: false },
        { time: "11:20", sender: "Hugo", text: "Ouais exactement ! On se retrouve direct devant à 17h15.", incoming: true }
      ]
    },
    arthur: {
      name: "Arthur (Collège)",
      messages: [
        { time: "09:40", sender: "Arthur", text: "Yo Léo, t'as un chargeur USB-C en rab pour ajd stp ? Mon tel est à 4%...", incoming: true },
        { time: "09:42", sender: "Léo", text: "Ouais t'inquiète j'en ai un dans mon sac de cours, je te le passe avant le français.", incoming: false },
        { time: "09:45", sender: "Arthur", text: "Trop cool merci mec !", incoming: true }
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
              <span class="text-[10px] font-bold text-emerald-400 block mb-0.5">${msg.sender}</span>
              ${msg.img ? `<div class="mb-2 rounded-lg overflow-hidden border border-slate-700/60 max-w-[200px]"><img src="${msg.img}" alt="Image" class="w-full h-28 object-cover" /></div>` : ''}
              <p class="leading-relaxed text-xs">${msg.text}</p>
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

  // -------------------------------------------------------------
  // 5. MESSAGES / SMS (INDICE 01 🔴 CUISINE & INDICE 03 🔴 PIERCING)
  // -------------------------------------------------------------
  const msgChatItems = document.querySelectorAll('.msg-chat-item');
  const msgChatList = document.getElementById('msg-chat-list');
  const msgChatDetail = document.getElementById('msg-chat-detail');
  const msgBackToList = document.getElementById('msg-back-to-list');
  const msgMessagesContainer = document.getElementById('msg-messages-container');
  const msgContactName = document.getElementById('msg-contact-name');

  const msgData = {
    mamie: {
      name: "Mamie 👵",
      messages: [
        { time: "14:02", sender: "Mamie", text: "Coucou mon grand ! Pour les frites maison de ce soir, commence par éplucher les pommes de terre et coupe les avec un couteau. Et pour la petite salade de fenouil, tu peux utiliser la mandoline. Fais bien attention à tes doigts 😘", incoming: true }
      ]
    },
    maman: {
      name: "Maman ❤️",
      messages: [
        { time: "12:10", sender: "Léo", text: "J'accompagne Thomas faire son 1er piercing a l'oreille, est ce que je peux aussi stp ?? Ya son père avec nous", incoming: false },
        { time: "12:15", sender: "Maman", text: "Certainement pas maintenant Léo ! On avait dit peut-être pour ton entrée au lycée, mais pas avant. On en reparle calmement ce soir à la maison.", incoming: true }
      ]
    },
    orange: {
      name: "Orange Info Conso",
      messages: [
        { time: "Hier", sender: "Orange", text: "Info Conso : Il vous reste 12,4 Go d'Internet sur votre forfait pour le mois en cours.", incoming: true }
      ]
    },
    vinted_livraison: {
      name: "Chronopost Relay",
      messages: [
        { time: "08 Mai", sender: "Chronopost", text: "Votre colis n°FR-883921 est disponible au Point Relais Épicerie Centrale.", incoming: true }
      ]
    }
  };

  msgChatItems.forEach(item => {
    item.addEventListener('click', () => {
      const chatId = item.getAttribute('data-chat');
      const chat = msgData[chatId];
      if (!chat) return;

      if (msgContactName) msgContactName.textContent = chat.name;
      if (msgMessagesContainer) {
        msgMessagesContainer.innerHTML = chat.messages.map(msg => `
          <div class="flex flex-col ${msg.incoming ? 'items-start max-w-[82%]' : 'items-end ml-auto max-w-[82%]' }">
            <div class="${msg.incoming ? 'bg-slate-200 text-slate-900' : 'bg-blue-500 text-white'} rounded-2xl p-2.5">
              <p class="text-xs leading-relaxed">${msg.text}</p>
            </div>
            <span class="text-[9px] text-slate-400 mt-1">${msg.time}</span>
          </div>
        `).join('');
      }

      msgChatList?.classList.add('hidden');
      msgChatDetail?.classList.remove('hidden');
      msgChatDetail?.classList.add('flex');
      appSubState['messages'] = 'subview';
      updateBackBtnLabel('messages', 'SMS');
    });
  });

  if (msgBackToList) msgBackToList.addEventListener('click', () => resetAppToRoot('messages'));

  // -------------------------------------------------------------
  // 6. GALERIE PHOTOS : VISUALISEUR D'IMAGE PLEIN ÉCRAN
  // -------------------------------------------------------------
  const photoCards = document.querySelectorAll('.photo-card');
  const photosModalView = document.getElementById('photos-modal-view');
  const photoModalImg = document.getElementById('photo-modal-img');
  const photoModalCaption = document.getElementById('photo-modal-caption');
  const photoCloseModal = document.getElementById('photo-close-modal');

  photoCards.forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-img');
      const caption = card.getAttribute('data-caption');
      if (photoModalImg) photoModalImg.src = imgSrc;
      if (photoModalCaption) photoModalCaption.textContent = caption || "Photo";

      photosModalView?.classList.remove('hidden');
      photosModalView?.classList.add('flex');
      appSubState['photos'] = 'subview';
      updateBackBtnLabel('photos', 'Galerie');
    });
  });

  if (photoCloseModal) {
    photoCloseModal.addEventListener('click', () => resetAppToRoot('photos'));
  }

  // -------------------------------------------------------------
  // 7. MINI-JEU PONG JOUABLE EN CANVAS HTML5
  // -------------------------------------------------------------
  const canvas = document.getElementById('pongCanvas');
  const pongStartBtn = document.getElementById('pong-start-btn');
  const pongScoreEl = document.getElementById('pong-score');

  let ctx = null;
  let pongAnimId = null;
  let isPongRunning = false;

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

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      playerX = Math.max(0, Math.min(gameWidth - paddleWidth, relativeX - paddleWidth / 2));
    });

    canvas.addEventListener('touchmove', (e) => {
      const touchX = getPositionX(e);
      if (!touchX) return;
      const rect = canvas.getBoundingClientRect();
      const relativeX = touchX - rect.left;
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

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    const botCenter = botX + paddleWidth / 2;
    if (botCenter < ballX - 10) {
      botX += 2.8;
    } else if (botCenter > ballX + 10) {
      botX -= 2.8;
    }
    botX = Math.max(0, Math.min(gameWidth - paddleWidth, botX));

    if (ballX - ballRadius <= 0 || ballX + ballRadius >= gameWidth) {
      ballSpeedX = -ballSpeedX;
    }

    if (ballY - ballRadius <= paddleHeight + 10) {
      if (ballX >= botX && ballX <= botX + paddleWidth) {
        ballSpeedY = Math.abs(ballSpeedY);
        ballSpeedX += (Math.random() - 0.5) * 0.8;
      }
    }

    if (ballY + ballRadius >= gameHeight - paddleHeight - 10) {
      if (ballX >= playerX && ballX <= playerX + paddleWidth) {
        ballSpeedY = -Math.abs(ballSpeedY);
        ballSpeedX += (Math.random() - 0.5) * 0.8;
      }
    }

    if (ballY - ballRadius > gameHeight) {
      botScore++;
      updatePongScore();
      resetBall();
    }

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

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(0, gameHeight / 2);
    ctx.lineTo(gameWidth, gameHeight / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#a855f7';
    ctx.fillRect(botX, 10, paddleWidth, paddleHeight);

    ctx.fillStyle = '#10b981';
    ctx.fillRect(playerX, gameHeight - paddleHeight - 10, paddleWidth, paddleHeight);

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

  // -------------------------------------------------------------
  // 8. CHROME : MENU 3 POINTS ET NAVIGATION HISTORIQUE (INDICE 04 🔴)
  // -------------------------------------------------------------
  const chromeMenuBtn = document.getElementById('chrome-menu-btn');
  const chromeMenuDropdown = document.getElementById('chrome-menu-dropdown');
  const chromeMenuHistoryItem = document.getElementById('chrome-menu-history-item');
  const chromeQuickHistoryBtn = document.getElementById('chrome-quick-history-btn');
  const chromeHistoryBackBtn = document.getElementById('chrome-history-back-btn');
  const chromeHomeView = document.getElementById('chrome-home-view');
  const chromeHistoryView = document.getElementById('chrome-history-view');

  function openChromeHistory() {
    if (chromeMenuDropdown) chromeMenuDropdown.classList.add('hidden');
    if (chromeHomeView) chromeHomeView.classList.add('hidden');
    if (chromeHistoryView) {
      chromeHistoryView.classList.remove('hidden');
      chromeHistoryView.classList.add('flex');
    }
    appSubState['chrome'] = 'subview';
    updateBackBtnLabel('chrome', 'Google');
  }

  function closeChromeHistory() {
    if (chromeHistoryView) {
      chromeHistoryView.classList.add('hidden');
      chromeHistoryView.classList.remove('flex');
    }
    if (chromeHomeView) chromeHomeView.classList.remove('hidden');
    if (chromeMenuDropdown) chromeMenuDropdown.classList.add('hidden');
    appSubState['chrome'] = 'root';
    updateBackBtnLabel('chrome', 'Accueil');
  }

  if (chromeMenuBtn) {
    chromeMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      chromeMenuDropdown?.classList.toggle('hidden');
    });
  }

  if (chromeMenuHistoryItem) {
    chromeMenuHistoryItem.addEventListener('click', openChromeHistory);
  }

  if (chromeQuickHistoryBtn) {
    chromeQuickHistoryBtn.addEventListener('click', openChromeHistory);
  }

  if (chromeHistoryBackBtn) {
    chromeHistoryBackBtn.addEventListener('click', closeChromeHistory);
  }

  document.addEventListener('click', (e) => {
    if (chromeMenuDropdown && !chromeMenuDropdown.classList.contains('hidden')) {
      if (!chromeMenuDropdown.contains(e.target) && !chromeMenuBtn.contains(e.target)) {
        chromeMenuDropdown.classList.add('hidden');
      }
    }
  });

  // -------------------------------------------------------------
  // 9. SNAPCHAT : DISCUSSIONS (INDICE 08 🔴 - PAINTBALL VS LASER GAME)
  // -------------------------------------------------------------
  const snapChatItems = document.querySelectorAll('.snap-chat-item');
  const snapChatList = document.getElementById('snap-chat-list');
  const snapChatDetail = document.getElementById('snap-chat-detail');
  const snapBackToList = document.getElementById('snap-back-to-list');
  const snapContactName = document.getElementById('snap-contact-name');
  const snapMessagesContainer = document.getElementById('snap-messages-container');

  const snapData = {
    classe3b: {
      name: "Classe 3ème B 🎉",
      messages: [
        { time: "14:10", sender: "Evan", text: "Les gars, vendredi pour fêter la fin de l'année on se fait tous un gros Laser Game ensemble ?", incoming: true, color: "text-cyan-400" },
        { time: "14:12", sender: "Léa", text: "Trop nul le laser game, venez on fait un Paintball plutôt dans les bois !", incoming: true, color: "text-pink-400" },
        { time: "14:15", sender: "Issa", text: "Ou alors un Five avec les profs de sport haha", incoming: true, color: "text-emerald-400" },
        { time: "14:18", sender: "Léo (@leo_lbr)", text: "Trop chaud pour le Paintball avec Léa !", incoming: false, highlight: true }
      ]
    },
    chloe: {
      name: "Chloé 🔥 (48)",
      messages: [
        { time: "13:02", sender: "Chloé", text: "N'oublie pas de m'envoyer un snap avant minuit pour pas perdre les flammes 🔥 (J+48) !", incoming: true, color: "text-rose-400" },
        { time: "13:05", sender: "Léo", text: "T'inquiète j'envoie un snap noir direct ! 🔥", incoming: false }
      ]
    },
    mathis: {
      name: "Mathis 😴",
      messages: [
        { time: "10:48", sender: "Mathis", text: "Regarde ce que j'ai dessiné sur ma feuille de brouillon pendant le cours de géo tellement je m'endors 😴", incoming: true, color: "text-blue-400" },
        { time: "10:50", sender: "Léo", text: "Haha t'es un fou, si le prof te capte t'es mort 😂", incoming: false },
        { time: "10:52", sender: "Mathis", text: "Il regarde même pas tkt il lit son diaporama haha", incoming: true, color: "text-blue-400" }
      ]
    }
  };

  snapChatItems.forEach(item => {
    item.addEventListener('click', () => {
      const chatId = item.getAttribute('data-chat');
      const chat = snapData[chatId];
      if (!chat) return;

      if (snapContactName) snapContactName.textContent = chat.name;
      if (snapMessagesContainer) {
        snapMessagesContainer.innerHTML = chat.messages.map(msg => `
          <div class="flex flex-col ${msg.incoming ? 'items-start max-w-[85%]' : 'items-end ml-auto max-w-[85%]' }">
            <div class="p-3 rounded-2xl ${
              msg.highlight 
                ? 'bg-yellow-500/25 border border-yellow-400/80 text-white shadow-md' 
                : msg.incoming 
                  ? 'bg-slate-800 text-slate-100' 
                  : 'bg-yellow-400 text-slate-950 font-medium'
            }">
              <span class="text-[10px] font-bold ${msg.color || (msg.incoming ? 'text-yellow-400' : 'text-slate-900')} block mb-0.5">${msg.sender}</span>
              <p class="leading-relaxed text-xs">${msg.text}</p>
              <span class="text-[9px] ${msg.incoming ? 'text-slate-400' : 'text-slate-700'} block text-right mt-1">${msg.time}</span>
            </div>
          </div>
        `).join('');
      }

      snapChatList?.classList.add('hidden');
      snapChatDetail?.classList.remove('hidden');
      snapChatDetail?.classList.add('flex');
      appSubState['snapchat'] = 'subview';
      updateBackBtnLabel('snapchat', 'Snaps');
    });
  });

  if (snapBackToList) snapBackToList.addEventListener('click', () => resetAppToRoot('snapchat'));

  // -------------------------------------------------------------
  // 10. DISCORD : NAVIGATION ENTRE SALONS
  // -------------------------------------------------------------
  const discordTabBtns = document.querySelectorAll('.discord-tab-btn');
  const discordViews = {
    manga: document.getElementById('discord-channel-manga'),
    entraide: document.getElementById('discord-channel-entraide'),
    gaming: document.getElementById('discord-channel-gaming')
  };

  discordTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetChannel = btn.getAttribute('data-channel');
      discordTabBtns.forEach(b => {
        b.classList.remove('active', 'bg-indigo-600', 'text-white');
        b.classList.add('bg-[#1e1f22]', 'text-slate-300');
        const hash = b.querySelector('span');
        if (hash) hash.className = 'text-slate-400';
      });

      btn.classList.add('active', 'bg-indigo-600', 'text-white');
      btn.classList.remove('bg-[#1e1f22]', 'text-slate-300');
      const hash = btn.querySelector('span');
      if (hash) hash.className = 'text-indigo-200';

      Object.keys(discordViews).forEach(ch => {
        if (discordViews[ch]) {
          if (ch === targetChannel) {
            discordViews[ch].classList.remove('hidden');
          } else {
            discordViews[ch].classList.add('hidden');
          }
        }
      });
    });
  });
});
