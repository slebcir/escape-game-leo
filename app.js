/**
 * Smartphone de Léo - Application SPA Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialisation des icônes Lucide
  if (window.lucide) {
    lucide.createIcons();
  }

  // Éléments du DOM
  const homeScreen = document.getElementById('home-screen');
  const appScreens = document.querySelectorAll('.app-screen');
  const appIcons = document.querySelectorAll('.app-icon');
  const backHomeButtons = document.querySelectorAll('.back-home-btn');
  const homeIndicator = document.getElementById('home-indicator');

  // -------------------------------------------------------------
  // 1. NAVIGATION PRINCIPALE (ÉCRAN D'ACCUEIL <-> APPLICATIONS)
  // -------------------------------------------------------------

  function openApp(appName) {
    const targetApp = document.getElementById(`app-${appName}`);
    if (!targetApp) return;

    // Masquer l'écran d'accueil
    homeScreen.classList.add('hidden');
    homeScreen.classList.remove('flex');

    // Masquer toutes les autres apps au cas où
    appScreens.forEach(screen => {
      screen.classList.add('hidden');
      screen.classList.remove('flex');
    });

    // Afficher l'app ciblée
    targetApp.classList.remove('hidden');
    targetApp.classList.add('flex');

    // Masquer le badge de notification de l'app si cliquée
    const clickedIcon = document.querySelector(`.app-icon[data-app="${appName}"]`);
    if (clickedIcon) {
      const badge = clickedIcon.querySelector('.app-badge');
      if (badge) {
        badge.classList.add('hidden');
      }
    }

    // Réinitialiser les sous-vues éventuelles
    resetInnerAppViews(appName);
  }

  function closeAllApps() {
    // Masquer toutes les apps
    appScreens.forEach(screen => {
      screen.classList.add('hidden');
      screen.classList.remove('flex');
    });

    // Réafficher l'écran d'accueil
    homeScreen.classList.remove('hidden');
    homeScreen.classList.add('flex');
  }

  // Événements sur les icônes d'apps
  appIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const appName = icon.getAttribute('data-app');
      openApp(appName);
    });
  });

  // Événements sur les boutons de retour à l'accueil
  backHomeButtons.forEach(btn => {
    btn.addEventListener('click', closeAllApps);
  });

  // Événement sur la barre d'accueil en bas (Home Indicator)
  if (homeIndicator) {
    homeIndicator.addEventListener('click', closeAllApps);
  }

  function resetInnerAppViews(appName) {
    if (appName === 'whatsapp') {
      document.getElementById('wa-chat-list')?.classList.remove('hidden');
      document.getElementById('wa-chat-detail')?.classList.add('hidden');
      document.getElementById('wa-chat-detail')?.classList.remove('flex');
    } else if (appName === 'messages') {
      document.getElementById('msg-chat-list')?.classList.remove('hidden');
      document.getElementById('msg-chat-detail')?.classList.add('hidden');
      document.getElementById('msg-chat-detail')?.classList.remove('flex');
    } else if (appName === 'notes') {
      document.getElementById('notes-list-view')?.classList.remove('hidden');
      document.getElementById('note-detail-view')?.classList.add('hidden');
      document.getElementById('note-detail-view')?.classList.remove('flex');
    }
  }

  // -------------------------------------------------------------
  // 2. WHATSAPP - NAVIGATION INTERNE ET DONNÉES DES CHATS
  // -------------------------------------------------------------

  const waChatItems = document.querySelectorAll('.wa-chat-item');
  const waChatList = document.getElementById('wa-chat-list');
  const waChatDetail = document.getElementById('wa-chat-detail');
  const waBackToList = document.getElementById('wa-back-to-list');
  const waContactName = document.getElementById('wa-contact-name');
  const waContactAvatar = document.getElementById('wa-contact-avatar');
  const waMessagesContainer = document.getElementById('wa-messages-container');

  const waData = {
    lucas: {
      name: "Lucas (Lycée)",
      avatar: "LU",
      color: "bg-emerald-700",
      messages: [
        { time: "13:40", sender: "Lucas", text: "Wsh frérot t'es où ? T'as raté le cours de français", incoming: true },
        { time: "13:42", sender: "Léo", text: "Je sors de chez le dentiste gros, j'avais une rage de dent horrible toute la nuit 😭", incoming: false },
        { time: "13:43", sender: "Lucas", text: "Ah la galère... il t'a filé un truc ?", incoming: true },
        { time: "13:45", sender: "Léo", text: "Ouais mais l'ordonnance mettait trop de temps à la pharmacie. Du coup j'ai pris 2 Ibuprofène 400mg du placard de mon frère ce matin et 1 ce midi, ça soulage de fou !", incoming: false },
        { time: "13:46", sender: "Lucas", text: "Propre, vas-y à toute au foot cet aprem.", incoming: true }
      ]
    },
    nathan: {
      name: "Nathan",
      avatar: "NA",
      color: "bg-indigo-600",
      messages: [
        { time: "02:15", sender: "Léo", text: "Gros j'en peux plus, nuit blanche sur le nouveau jeu. On a commandé 2 pizzas à 2h du mat avec les gars 🍕💀", incoming: false },
        { time: "07:10", sender: "Nathan", text: "Abusé tu vas dormir en cours de SVT tout à l'heure.", incoming: true }
      ]
    },
    histoire: {
      name: "Exposé Histoire 📜",
      avatar: "HIST",
      color: "bg-amber-600",
      messages: [
        { time: "12:30", sender: "Sarah", text: "Vous avez fait la partie 2 sur la Révolution ?", incoming: true },
        { time: "12:40", sender: "Tom", text: "Moi j'ai fini la partie 1. Léo tu t'occupes de la conclusion ?", incoming: true },
        { time: "12:45", sender: "Léo", text: "Ouais pas de souci je gère ça ce soir !", incoming: false }
      ]
    },
    maxime: {
      name: "Maxime",
      avatar: "MA",
      color: "bg-slate-700",
      messages: [
        { time: "11:15", sender: "Maxime", text: "Chaud pour du Call of ce soir à 21h ?", incoming: true },
        { time: "11:20", sender: "Léo", text: "Carrément, je me co après le repas.", incoming: false }
      ]
    }
  };

  waChatItems.forEach(item => {
    item.addEventListener('click', () => {
      const chatId = item.getAttribute('data-chat');
      const chat = waData[chatId];
      if (!chat) return;

      waContactName.textContent = chat.name;
      waContactAvatar.textContent = chat.avatar;
      waContactAvatar.className = `w-8 h-8 rounded-full ${chat.color} flex items-center justify-center text-xs font-bold text-white`;

      // Generer messages HTML
      waMessagesContainer.innerHTML = chat.messages.map(msg => {
        if (msg.incoming) {
          return `
            <div class="flex flex-col items-start max-w-[82%]">
              <div class="relative bg-[#202c33] text-slate-100 rounded-lg rounded-tl-none p-2.5 shadow-sm">
                ${chat.name.includes('Exposé') ? `<span class="text-[10px] font-bold text-emerald-400 block mb-0.5">${msg.sender}</span>` : ''}
                <p class="leading-relaxed">${msg.text}</p>
                <span class="text-[9px] text-slate-400 block text-right mt-1">${msg.time}</span>
              </div>
            </div>
          `;
        } else {
          return `
            <div class="flex flex-col items-end ml-auto max-w-[82%]">
              <div class="relative bg-[#005c4b] text-white rounded-lg rounded-tr-none p-2.5 shadow-sm">
                <p class="leading-relaxed">${msg.text}</p>
                <div class="flex items-center justify-end gap-1 mt-1">
                  <span class="text-[9px] text-emerald-200">${msg.time}</span>
                  <i data-lucide="check-check" class="w-3 h-3 text-emerald-300"></i>
                </div>
              </div>
            </div>
          `;
        }
      }).join('');

      if (window.lucide) lucide.createIcons();

      waChatList.classList.add('hidden');
      waChatDetail.classList.remove('hidden');
      waChatDetail.classList.add('flex');
    });
  });

  if (waBackToList) {
    waBackToList.addEventListener('click', () => {
      waChatDetail.classList.add('hidden');
      waChatDetail.classList.remove('flex');
      waChatList.classList.remove('hidden');
    });
  }

  // -------------------------------------------------------------
  // 3. MESSAGES (SMS) - NAVIGATION INTERNE ET DONNÉES
  // -------------------------------------------------------------

  const msgChatItems = document.querySelectorAll('.msg-chat-item');
  const msgChatList = document.getElementById('msg-chat-list');
  const msgChatDetail = document.getElementById('msg-chat-detail');
  const msgBackToList = document.getElementById('msg-back-to-list');
  const msgContactName = document.getElementById('msg-contact-name');
  const msgMessagesContainer = document.getElementById('msg-messages-container');

  const msgData = {
    maman: {
      name: "Maman ❤️",
      messages: [
        { time: "12:10", sender: "Maman", text: "Coucou Léo, ton mal de tête ça va mieux ?", incoming: true },
        { time: "12:15", sender: "Léo", text: "Oui maman j'ai pris 1 comprimé de Doliprane 500mg après le repas comme tu m'as dit, ça va beaucoup mieux.", incoming: false },
        { time: "12:20", sender: "Maman", text: "Super. Pense à prendre du pain en rentrant s'il te plaît !", incoming: true },
        { time: "12:22", sender: "Léo", text: "Ça marche je passe à la boulangerie.", incoming: false }
      ]
    },
    boulangerie: {
      name: "Boulangerie L'Épi",
      messages: [
        { time: "Hier", sender: "Boulangerie", text: "Votre baguette tradition et vos viennoiseries vous attendent.", incoming: true }
      ]
    }
  };

  msgChatItems.forEach(item => {
    item.addEventListener('click', () => {
      const chatId = item.getAttribute('data-chat');
      const chat = msgData[chatId];
      if (!chat) return;

      msgContactName.textContent = chat.name;

      msgMessagesContainer.innerHTML = chat.messages.map(msg => {
        if (msg.incoming) {
          return `
            <div class="flex flex-col items-start max-w-[80%]">
              <div class="bg-slate-200 text-slate-900 rounded-2xl rounded-tl-sm px-3.5 py-2 shadow-xs">
                <p class="leading-relaxed text-xs">${msg.text}</p>
              </div>
              <span class="text-[9px] text-slate-400 mt-1 ml-1">${msg.time}</span>
            </div>
          `;
        } else {
          return `
            <div class="flex flex-col items-end ml-auto max-w-[80%]">
              <div class="bg-blue-500 text-white rounded-2xl rounded-tr-sm px-3.5 py-2 shadow-xs">
                <p class="leading-relaxed text-xs">${msg.text}</p>
              </div>
              <span class="text-[9px] text-slate-400 mt-1 mr-1">${msg.time}</span>
            </div>
          `;
        }
      }).join('');

      msgChatList.classList.add('hidden');
      msgChatDetail.classList.remove('hidden');
      msgChatDetail.classList.add('flex');
    });
  });

  if (msgBackToList) {
    msgBackToList.addEventListener('click', () => {
      msgChatDetail.classList.add('hidden');
      msgChatDetail.classList.remove('flex');
      msgChatList.classList.remove('hidden');
    });
  }

  // -------------------------------------------------------------
  // 4. NOTES - NAVIGATION INTERNE ET DÉTAILS
  // -------------------------------------------------------------

  const noteItems = document.querySelectorAll('.note-item');
  const notesListView = document.getElementById('notes-list-view');
  const noteDetailView = document.getElementById('note-detail-view');
  const noteBackToList = document.getElementById('note-back-to-list');
  const noteDetailTitle = document.getElementById('note-detail-title');
  const noteDetailDate = document.getElementById('note-detail-date');
  const noteDetailContent = document.getElementById('note-detail-content');

  const notesData = {
    'double-dose': {
      title: "Penses bêtes / Santé",
      date: "Aujourd'hui, 07:32",
      content: `
        <p class="font-bold text-slate-900 border-b border-amber-200 pb-1 mb-2">Hier - 23:45</p>
        <p class="mb-4">Oublié de prendre le cachet de 20h... Trop saoulé.</p>
        <p class="font-bold text-slate-900 border-b border-amber-200 pb-1 mb-2">Ce matin - 07:30</p>
        <p>Bon du coup j'ai pris 2 comprimés ce matin au réveil pour rattraper la dose d'hier avant d'aller en cours. Faut pas que je loupe mon traitement.</p>
      `
    },
    'oubli-gere': {
      title: "Note Mardi",
      date: "Mardi 07 Mai",
      content: `
        <p>Mince j'ai oublié ma prise de 20h...</p>
        <p class="mt-2">Bon la pharmacienne m'a bien dit de JAMAIS doubler la dose le lendemain. Tant pis, je reprends ma dose normale ce soir à 20h sans rien changer.</p>
      `
    },
    'svt': {
      title: "Matériel SVT",
      date: "02 Mai",
      content: `<p>• Cahier TP SVT<br>• Blouse<br>• Calculatrice<br>• Règle graduée</p>`
    },
    'wifi': {
      title: "Code Wifi",
      date: "20 Avril",
      content: `<p class="text-sm font-bold text-blue-600">Freebox_88A21B_Lucas</p>`
    }
  };

  noteItems.forEach(item => {
    item.addEventListener('click', () => {
      const noteId = item.getAttribute('data-note');
      const note = notesData[noteId];
      if (!note) return;

      noteDetailTitle.textContent = note.title;
      noteDetailDate.textContent = note.date;
      noteDetailContent.innerHTML = note.content;

      notesListView.classList.add('hidden');
      noteDetailView.classList.remove('hidden');
      noteDetailView.classList.add('flex');
    });
  });

  if (noteBackToList) {
    noteBackToList.addEventListener('click', () => {
      noteDetailView.classList.add('hidden');
      noteDetailView.classList.remove('flex');
      notesListView.classList.remove('hidden');
    });
  }

  // -------------------------------------------------------------
  // 5. HORLOGE TEMPS RÉEL EN HAUT
  // -------------------------------------------------------------
  function updateTime() {
    const statusTime = document.getElementById('status-time');
    if (!statusTime) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    // Keeping scenario default 14:32 or dynamic fallback
    statusTime.textContent = "14:32"; 
  }
  updateTime();
});
