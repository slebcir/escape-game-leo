```markdown
# Spécifications Techniques et Ergonomiques de l'UI (Smartphone Virtuel)

Ce document définit les directives visuelles, l'architecture des composants et les règles d'intégration pour l'interface web de l'Escape Game.

---

## 1. Stack Technique & Bibliothèques

* **Markup & Structure :** HTML5 sémantique.
* **Styling :** Tailwind CSS (version 3+ via CDN ou Vite build).
* **Icônes :** Lucide Icons (script CDN ou package `lucide-react` / `lucide`).
* **JavaScript :** Vanilla JS (SPA via manipulation du DOM) ou React / Vue.

---

## 2. Layout & Responsive Container (Format Smartphone)

L'application doit s'adapter à l'écran de l'utilisateur :

```text
+-------------------------------------------------------------+
| ECOUTER / NAVIGATEUR DESKTOP                               |
|                                                             |
|           +----------------------------------+              |
|           | BARRE DE STATUT (14:32 | 4G | 24%)|              |
|           +----------------------------------+              |
|           |                                  |              |
|           |       ÉCRAN MOBILE VIRTUEL       |              |
|           |           (max-w-md)             |              |
|           |                                  |              |
|           +----------------------------------+              |
|           | HOME INDICATOR (Barre de bas)    |              |
|           +----------------------------------+              |
|                                                             |
+-------------------------------------------------------------+

```

### Directives CSS du conteneur principal :

1. **Sur Ordinateur / Tablette (Écran large) :**
* Le téléphone est centré horizontalement (`mx-auto`).
* Largeur maximale fixée à `max-w-md` (environ `380px` à `420px`).
* Bords arrondis (`rounded-[40px]`), ombre portée immersive (`shadow-2xl`), contour noir simulant le châssis d'un iPhone (`border-[8px] border-slate-900`).
* Hauteur fixée à `h-[840px]` ou `h-[90vh]`.


2. **Sur Smartphone Réel (Écran mobile) :**
* Le conteneur prend **100 % de la largeur et de la hauteur** de l'écran (`w-full h-screen rounded-none border-none`).



---

## 3. Composants Communs de l'OS Virtuel

### A. Barre de Statut Supérieure (Status Bar)

* **Position :** Fixe en haut du téléphone (`sticky top-0 z-50`).
* **Hauteur :** `h-8` (32px).
* **Couleur :** Texte blanc sur l'écran d'accueil, texte sombre/adapté selon l'application ouverte.
* **Éléments (de gauche à droite) :**
* `14:32` (Heure actuelle fixe).
* En haut à droite : Icône Réseau 4G/5G, Icône Wi-Fi, Icône Batterie avec jauge à **24 %** (couleur rouge/orange).



### B. Barre de Navigation Inférieure (Home Indicator)

* **Position :** Fixe tout en bas du téléphone (`sticky bottom-0 z-50`).
* **Élément :** Une fine barre horizontale centrée (`w-32 h-1 bg-slate-400 rounded-full my-2 mx-auto cursor-pointer`).
* **Action :** Un clic sur cette barre ferme l'application active et renvoie à l'Écran d'Accueil.

---

## 4. Spécifications des Vues / Écrans

### View 01 : Écran d'Accueil (Home Screen)

* **Arrière-plan :** Image de fond d'écran d'ado (`wallpaper.jpg` ou dégradé sombre/néon).
* **Grille d'icônes :** Grille de 4 colonnes (`grid grid-cols-4 gap-4 p-6`).
* **Composant Icône App :**
* Carré aux bords très arrondis (`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg`).
* Libellé sous l'icône en petit texte blanc avec ombre portée (`text-xs text-white drop-shadow`).
* **Badge de notification :** Si l'application contient un indice non lu, afficher un rond rouge en haut à droite de l'icône (`absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold`).



#### Icônes à afficher dans la grille :

1. **Messages** (Vert / Icône Bulle) - *Badge: 1*
2. **WhatsApp** (Vert Phospho / Icône Téléphone/Message) - *Badge: 3*
3. **Instagram** (Dégradé Rose/Violet / Icône Appareil Photo)
4. **Chrome/Safari** (Bleu/Rouge / Icône Boussole ou Loupe)
5. **Reddit** (Orange / Icône Robot ou Message)
6. **Notes** (Jaune/Blanc / Icône Papier/Crayon)
7. **Photos** (Blanc/Multicolore / Icône Image)
8. **Strava** (Orange / Icône Activité/Course)

---

### View 02 : Modèle d'Application Ouverte (App Layout Generic)

Toutes les applications ouvertes partagent cette structure DOM :

```html
<div id="app-view-name" class="app-screen hidden flex-col h-full bg-white text-slate-900">
  <!-- Header spécifique de l'app -->
  <div class="app-header flex items-center justify-between p-4 border-b bg-slate-50">
    <button class="back-btn text-blue-600 font-medium flex items-center gap-1">
      <i data-lucide="chevron-left"></i> Retour
    </button>
    <h1 class="font-bold text-base">Nom de l'App</h1>
    <div class="w-8"></div> <!-- Spacer pour équilibrer le titre -->
  </div>
  
  <!-- Zone de contenu scrollable -->
  <div class="app-content flex-1 overflow-y-auto p-4">
    <!-- Contenu de l'application -->
  </div>
</div>

```

---

## 5. Spécifications Détallées par Application

### 1. WhatsApp / Messages

* **Vue Liste :** Liste des fils de discussion avec avatar, nom du contact, dernier message et heure.
* **Vue Chat Detail :** Bulle de message style WhatsApp (Vert clair à droite pour Léo, Blanc/Gris à gauche pour les contacts).
* **Indice clé :** Chat avec Lucas (Ibuprofène) + Chat avec Maman (Doliprane).

### 2. Notes

* **Vue Liste :** Grille/Liste de cartes de notes avec titre en gras, date et extrait de texte.
* **Vue Note Detail :** Zone de texte type bloc-notes sur fond jaune très clair.
* **Indice clé :** Note *Penses bêtes / Traitement* (Double dose prise le matin).

### 3. Instagram

* **Vue Feed :** Cartes de posts avec entête profil (`@leo_lbr`), photo principale, zone de boutons (like, comment, share), et section légende + commentaires.
* **Indice clé :** Photo du jus de pamplemousse avec la légende "Cure Detox".

### 4. Chrome / Safari (Navigateur)

* **Header :** Barre d'adresse URL factice (`google.fr/search...`).
* **Vue Historique :** Liste chronologique des recherches avec icône loupe, heure et libellé de la recherche.
* **Indice clé :** Recherches sur le "jeûne de 3 jours" et "coupe faim".

### 5. Reddit

* **Header :** Bandeau orange avec nom du subreddit `r/ZeroLégumesFr`.
* **Vue Post :** Post complet avec votes (Upvotes/Downvotes), nom d'utilisateur `u/Leo_Lbr` et zone de commentaires.
* **Indice clé :** Post prônant l'arrêt total des légumes verts.

### 6. Strava / Santé

* **Vue Carte Activité :** Carte orange/noire résumant le footing de 4 km avec temps, allure et carte factice.

---

## 6. Logique JavaScript de Navigation (SPA)

1. **Initialisation :** Masquer toutes les `.app-screen`. Seul `#home-screen` est visible (`flex`).
2. **Ouverture d'une app :**
* Au clic sur une icône `.app-icon[data-app="nom"]` :
* Ajouter la classe `hidden` à `#home-screen`.
* Enlever la classe `hidden` et ajouter `flex` à `#app-nom`.




3. **Fermeture / Retour :**
* Au clic sur `.back-btn` ou sur `.home-indicator` :
* Masquer l'application active.
* Réafficher `#home-screen`.





```

```