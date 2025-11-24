// ====== GLOBALER SPIELZUSTAND ======

const state = {
  players: [],          // { name, drunk, given, turns }
  direction: 1,         // +1 oder -1
  activePlayerIndex: 0,
  deck: [],             // gemischte Karten
  discardPile: [],
  currentCard: null,
  isCardRevealed: false,
  rouletteProgress: 0,  // 0–100
  kingIndex: null,
  buddies: {},          // {playerIndex: buddyIndex}
  drinkEvents: [],      // {playerIndex, drunk, given, playerTurnAtEvent}
  currentTargetIndex: null, // NEU: aktueller „Zielspieler“ der Karte (King-Funktion)
};

// ====== DOM REFERENZEN ======

const viewAge = document.getElementById("view-age");
const viewSetup = document.getElementById("view-setup");
const viewGame = document.getElementById("view-game");
const viewSummary = document.getElementById("view-summary");

const playerInputsContainer = document.getElementById("player-inputs");
const playerForm = document.getElementById("player-form");
const currentPlayerNameEl = document.getElementById("current-player-name");
const rouletteFill = document.getElementById("roulette-fill");
const gameCardEl = document.getElementById("game-card");
const cardTitleEl = document.getElementById("card-title");
const cardTextEl = document.getElementById("card-text");
const cardIconEl = document.getElementById("card-icon");
const cardFooterEl = document.getElementById("card-footer");

const statsListEl = document.getElementById("stats-list");

const modal = document.getElementById("modal");
const modalTitleEl = document.getElementById("modal-title");
const modalBodyEl = document.getElementById("modal-body");
const modalActionsEl = document.getElementById("modal-actions");

const legalModal = document.getElementById("legal-modal");
const legalTitleEl = document.getElementById("legal-title");
const legalBodyEl = document.getElementById("legal-body");

// ====== HELFER ======

function switchView(targetId) {
  [viewAge, viewSetup, viewGame, viewSummary].forEach((v) => {
    v.classList.toggle("active", v.id === targetId);
  });
  closeModal();
  closeLegalModal();
}

function initYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

function showModal(title, bodyHtml, actions = []) {
  modalTitleEl.textContent = title;
  modalBodyEl.innerHTML = bodyHtml;
  modalActionsEl.innerHTML = "";
  actions.forEach((action) => {
    const btn = document.createElement("button");
    btn.textContent = action.label;
    btn.className = action.className || "btn-primary";
    btn.addEventListener("click", action.onClick);
    modalActionsEl.appendChild(btn);
  });
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  modalTitleEl.textContent = "";
  modalBodyEl.innerHTML = "";
  modalActionsEl.innerHTML = "";
}

function showLegalModal(title, bodyHtml) {
  legalTitleEl.textContent = title;
  legalBodyEl.innerHTML = bodyHtml;
  legalModal.classList.remove("hidden");
}

function closeLegalModal() {
  legalModal.classList.add("hidden");
  legalTitleEl.textContent = "";
  legalBodyEl.innerHTML = "";
}

// Fisher-Yates Shuffle
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Zufallswert für Roulette-Aufladung
function randomRouletteIncrement() {
  return 10 + Math.floor(Math.random() * 21); // 10–30
}

// ====== KARTEN-DECK ======

const ALL_CARDS = [
  // --- TRINK! ---

  {
    id: "trink_1x_1copy",
    title: "Trink!",
    type: "simple_drink",
    copies: 1,
    text: "DU HATTEST DOCH DURST, TRINK 1 SCHLUCK.",
    config: { drink: 1 },
  },
  {
    id: "trink_2x_2copies",
    title: "Trink!",
    type: "simple_drink",
    copies: 2,
    text: "NICHT LANG SCHNACKEN, KOPF IN DEN NACKEN! TRINK 2.",
    config: { drink: 2 },
  },
  {
    id: "trink_3x_3copies",
    title: "Trink!",
    type: "simple_drink",
    copies: 3,
    text: "HAU WECH DIE SCHEISSE! TRINK 3.",
    config: { drink: 3 },
  },
  {
    id: "trink_5x_1copy",
    title: "Trink!",
    type: "simple_drink",
    copies: 1,
    text: "DEIN GLAS SIEHT SO VOLL AUS, PACK MAL BISSCHEN LUFT REIN! Trink 5.",
    config: { drink: 5 },
  },

  // --- VERTEIL! ---

  {
    id: "verteil_2x_3copies",
    title: "Verteil!",
    type: "simple_give",
    copies: 3,
    text: "IN DIESEM SINNE, VERTEIL 2!",
    config: { give: 2 },
  },
  {
    id: "verteil_3x_2copies",
    title: "Verteil!",
    type: "simple_give",
    copies: 2,
    text: "MANCHMAL MUSS MAN AUCH TRINKEN, WENN MAN KEINEN DURST HAT. WER KRIEGT 3?",
    config: { give: 3 },
  },

  // --- REGEL ---

  {
    id: "regel_4copies",
    title: "Regel",
    type: "rule",
    copies: 4,
    text: `STELLE EINE BELIEBIGE REGEL AUF.
Diese gilt bis zum Spielende oder bis jemand mit einer neuen Regelkarte entscheidet, deine aufzuheben.

Ein Klassiker ist: „Vor jedem Schluck muss man ‚Danke‘ sagen.“

Hält sich jemand nicht an die Regel, bekommt die Person einen Strafschluck – also achtet gut auf eure Mitspieler!`,
    config: {},
  },

  // --- WASSERFALL ---

  {
    id: "wasserfall_3copies",
    title: "Wasserfall",
    type: "waterfall",
    copies: 3,
    text: `HOCH DIE GLÄSSER! – ES GEHT IM UHRZEIGERSINN.
Ihr dürft erst aufhören zu trinken, wenn die Person rechts von euch aufhört.`,
    config: {
      baseDrink: 1,
    },
  },

  // --- WAS IST DEIN PREIS? ---

  // Auktion (3 verteilen) – Inhalt von dir ergänzen
  {
    id: "preis_auktion_gewinner_verteilt3",
    title: "Was ist dein Preis?",
    type: "price",
    copies: 1,
    text: `FÜR WIEVIEL WÜRDEST DU EINEM MANN VOR DER GANZEN GRUPPE EINEN BLOWJOB GEBEN?

Komm uns nicht mit „Niemals“ für 100 Millionen Euro, wäre dein Mund schon offen. 

Der Zieher der Karte startet eine Auktion. 
Alle heben die Hand; der Preis wird nach Belieben des Auktionators von 100 Millionen Euro nach unten gesenkt. 
Wer als Letztes seine Hand oben hat, darf 3 Schlücke verteilen. 
Aber sag mal… war es das wirklich wert?`,
    config: {
      winnerGives: 3,
      mode: "auction",
    },
  },

  // Restliche Fragen – alle 2 verteilen, Text trägst du ein
  {
    id: "preis_frage_1",
    title: "Was ist dein Preis?",
    type: "price",
    copies: 1,
    text: `FÜR WIEVIEL WÜRDEST DU DEN REST DEINES LEBENS DIE AfD WÄHLEN? 

Komm uns nicht mit „Niemals“, du machst es wahrscheinlich sogar umsonst. 

Der Zieher der Karte startet eine Auktion. 
Alle heben die Hand; der Preis wird nach Belieben des Auktionators von 100 Millionen Euro nach unten gesenkt. 
Wer als Letztes seine Hand oben hat, darf 2 Schlücke verteilen. 
Aber sag mal… war es das wirklich wert?`,
    config: {
      winnerGives: 2,
      mode: "question",
    },
  },
  {
    id: "preis_frage_2",
    title: "Was ist dein Preis?",
    type: "price",
    copies: 1,
    text: `FÜR WIEVIEL WÜRDEST DU EINEN MONAT LANG JEDEN MORGEN EIN GLAS DEINES EIGENEN URINS TRINKEN? 

Komm uns nicht mit „Niemals“ für 100 Mio. würdest du damit gurgeln. 

Der Zieher der Karte startet eine Auktion. 
Alle heben die Hand; der Preis wird nach Belieben des Auktionators von 100 Millionen Euro nach unten gesenkt. 
Wer als Letztes seine Hand oben hat, darf 2 Schlücke verteilen. 
Aber sag mal… war es das wirklich wert?`,
    config: {
      winnerGives: 2,
      mode: "question",
    },
  },
  {
    id: "preis_frage_3",
    title: "Was ist dein Preis?",
    type: "price",
    copies: 1,
    text: `FÜR WIEVIEL WÜRDEST DU FÜNF JAHRE IN INDIEN LEBEN? 
Das Geld bekommst du erst nach den Fünf Jahren. 

Komm uns nicht mit „Niemals“, du machst es wahrscheinlich sogar umsonst. 

Der Zieher der Karte startet eine Auktion. 
Alle heben die Hand; der Preis wird nach Belieben des Auktionators von 100 Millionen Euro nach unten gesenkt. 
Wer als Letztes seine Hand oben hat, darf 2 Schlücke verteilen. 
Aber sag mal… war es das wirklich wert?`,
    config: {
      winnerGives: 2,
      mode: "question",
    },
  },
  {
    id: "preis_frage_4",
    title: "Was ist dein Preis?",
    type: "price",
    copies: 1,
    text: `FÜR WIEVIEL WÜRDEST DU DEINEN BESTEN FREUND ÖFFENTLICH ALS PÄDOPHILEN HINSTELLEN? 

Komm uns nicht mit „Niemals“ für 100 Mio. Photoshopst du belastende Bilder! 
Der Zieher der Karte startet eine Auktion. 
Alle heben die Hand; der Preis wird nach Belieben des Auktionators von 100 Millionen Euro nach unten gesenkt. 
Wer als Letztes seine Hand oben hat, darf 2 Schlücke verteilen. 
Aber sag mal… war es das wirklich wert?`,
    config: {
      winnerGives: 2,
      mode: "question",
    },
  },
  {
    id: "preis_frage_5",
    title: "Was ist dein Preis?",
    type: "price",
    copies: 1,
    text: `FÜR WIEVIEL WÜRDEST DU IN EINEM PORNO MITSPIELEN, DER IN DEINER HEIMATSTADT VIRAL GEHT?

Komm uns nicht mit „Niemals“ für 100 Mio. lässt du alles mit dir machen. 

Der Zieher der Karte startet eine Auktion. 
Alle heben die Hand; der Preis wird nach Belieben des Auktionators von 100 Millionen Euro nach unten gesenkt. 
Wer als Letztes seine Hand oben hat, darf 2 Schlücke verteilen. 
Aber sag mal… war es das wirklich wert?`,
    config: {
      winnerGives: 2,
      mode: "question",
    },
  },
  {
    id: "preis_frage_6",
    title: "Was ist dein Preis?",
    type: "price",
    copies: 1,
    text: `FÜR WIEVIEL WÜRDEST DU AUF EIN OFFENES GRAB PINKELN, WÄHREND DIE ANGEHÖRIGEN DANEBEN STEHEN? 

Komm uns nicht mit „Niemals“ für 100 Mio. ist dir doch alles egal! 

Der Zieher der Karte startet eine Auktion. 
Alle heben die Hand; der Preis wird nach Belieben des Auktionators von 100 Millionen Euro nach unten gesenkt. 
Wer als Letztes seine Hand oben hat, darf 2 Schlücke verteilen. 
Aber sag mal… war es das wirklich wert?`,
    config: {
      winnerGives: 2,
      mode: "question",
    },
  },
  {
    id: "preis_frage_7",
    title: "Was ist dein Preis?",
    type: "price",
    copies: 1,
    text: `FÜR WIEVIEL WÜRDEST DU IN EINEM FERNSEHINTERVIEW BEHAUPTEN, DASS HITLER „INSPIRIEREND“ WAR? 

Komm uns nicht mit „Niemals“ für 100 Mio. ist dir doch alles egal! 

Der Zieher der Karte startet eine Auktion. 
Alle heben die Hand; der Preis wird nach Belieben des Auktionators von 100 Millionen Euro nach unten gesenkt. 
Wer als Letztes seine Hand oben hat, darf 2 Schlücke verteilen.
Aber sag mal… war es das wirklich wert?`,
    config: {
      winnerGives: 2,
      mode: "question",
    },
  },
  {
    id: "preis_frage_8",
    title: "Was ist dein Preis?",
    type: "price",
    copies: 1,
    text: `FÜR WIEVIEL WÜRDEST DU DEIN GANZES LEBEN LANG JEDEN TAG EIN KLEINES STÜCK KOT ESSEN? 
Du darfst es untermischen, aber essen musst du es trotzdem.

Komm uns nicht mit „Niemals“, du machst es wahrscheinlich sogar umsonst. 

Der Zieher der Karte startet eine Auktion. 
Alle heben die Hand; der Preis wird nach Belieben des Auktionators von 100 Millionen Euro nach unten gesenkt. 
Wer als Letztes seine Hand oben hat, darf 2 Schlücke verteilen. 
Aber sag mal… war es das wirklich wert?`,
    config: {
      winnerGives: 2,
      mode: "question",
    },
  },
  {
    id: "preis_frage_9",
    title: "Was ist dein Preis?",
    type: "price",
    copies: 1,
    text: `FÜR WIEVIEL WÜRDEST DU ALLE SOZIALEN KONTAKTE BLOCKIEREN UND EINFACH VERSCHWINDEN? 

Komm uns nicht mit „Niemals“, dir waren die Kontakte doch nie wichtig! 

Der Zieher der Karte startet eine Auktion. 
Alle heben die Hand; der Preis wird nach Belieben des Auktionators von 100 Millionen Euro nach unten gesenkt. 
Wer als Letztes seine Hand oben hat, darf 2 Schlücke verteilen. 
Aber sag mal… war es das wirklich wert?`,
    config: {
      winnerGives: 2,
      mode: "question",
    },
  },
  {
    id: "preis_frage_10",
    title: "Was ist dein Preis?",
    type: "price",
    copies: 1,
    text: `FÜR WIEVIEL WÜRDEST DU EIN JAHR LANG NUR NOCH REDEN, WÄHREND DU AUF DEM BODEN KNIETST? 

Komm uns nicht mit „Niemals“, du verbringst dein ganzes Leben doch auf Knien. 

Der Zieher der Karte startet eine Auktion. 
Alle heben die Hand; der Preis wird nach Belieben des Auktionators von 100 Millionen Euro nach unten gesenkt. 
Wer als Letztes seine Hand oben hat, darf 2 Schlücke verteilen. 
Aber sag mal… war es das wirklich wert?`,
    config: {
      winnerGives: 2,
      mode: "question",
    },
  },
  {
    id: "preis_frage_11",
    title: "Was ist dein Preis?",
    type: "price",
    copies: 1,
    text: `FÜR WIEVIEL WÜRDEST DU ALLE SECHS MONATE DEIN GESCHLECHT WECHSELN UND ES GLAUBWÜRDIG VERMITTELN? 
Keine Op, nur alle Anträge und Formalitäten beim Amt.

Komm uns nicht mit „Niemals“, du wechselst doch eh ständig deine Meinung. 

Der Zieher der Karte startet eine Auktion. 
Alle heben die Hand; der Preis wird nach Belieben des Auktionators von 100 Millionen Euro nach unten gesenkt. 
Wer als Letztes seine Hand oben hat, darf 2 Schlücke verteilen. 
Aber sag mal… war es das wirklich wert?`,
    config: {
      winnerGives: 2,
      mode: "question",
    },
  },
  {
    id: "preis_frage_12",
    title: "Was ist dein Preis?",
    type: "price",
    copies: 1,
    text: `FÜR WIEVIEL WÜRDEST DU DIR FÜR DREI JAHRE EIN HAKENKREUZ INS GESICHT TÄTOWIEREN LASSEN? 

Komm uns nicht mit „Niemals“, dein Gesicht sieht eh scheiße aus.

Der Zieher der Karte startet eine Auktion. 
Alle heben die Hand; der Preis wird nach Belieben des Auktionators von 100 Millionen Euro nach unten gesenkt. 
Wer als Letztes seine Hand oben hat, darf 2 Schlücke verteilen. 
Aber sag mal… war es das wirklich wert?`,
    config: {
      winnerGives: 2,
      mode: "question",
    },
  },
  {
    id: "preis_frage_13",
    title: "Was ist dein Preis?",
    type: "price",
    copies: 1,
    text: `FÜR WIEVIEL WÜRDEST DU EIN JAHR LANG MIT EINEM VIBRIERENDEN BUTTPLUG HERUMLAUFEN, DER TÄGLICH ACHT STUNDEN ÖFFENTLICH STEUERBAR IST? 

Komm uns nicht mit „Niemals“, du machst es wahrscheinlich sogar umsonst. 

Der Zieher der Karte startet eine Auktion. 
Alle heben die Hand; der Preis wird nach Belieben des Auktionators von 100 Millionen Euro nach unten gesenkt. 
Wer als Letztes seine Hand oben hat, darf 2 Schlücke verteilen. 
Aber sag mal… war es das wirklich wert?`,
    config: {
      winnerGives: 2,
      mode: "question",
    },
  },
  {
    id: "preis_frage_14",
    title: "Was ist dein Preis?",
    type: "price",
    copies: 1,
    text: `FÜR WIEVIEL WÜRDEST DU MIT DER FREUNDIN ODER DEM FREUND DEINES ENGSTEN FREUNDES/DEINER ENGSTEN FREUNDIN SCHLAFEN? 

Komm uns nicht mit „Niemals“, du Lustmolch!. 

Der Zieher der Karte startet eine Auktion. 
Alle heben die Hand; der Preis wird nach Belieben des Auktionators von 100 Millionen Euro nach unten gesenkt. 
Wer als Letztes seine Hand oben hat, darf 2 Schlücke verteilen. 
Aber sag mal… war es das wirklich wert?`,
    config: {
      winnerGives: 2,
      mode: "question",
    },
  },

  // --- VOTE-KARTEN ---

  {
    id: "vote_1",
    title: "Vote",
    type: "vote",
    copies: 1,
    text: `WER WÜRDE AM EHSTEN FÜR GELD SEINE FREUNDE VERRATEN?

Der Verräter trinkt 4!

Die Gruppe stimmt ab, wer trinken muss.`,
    config: {
      drinks: 4,
    },
  },
  {
    id: "vote_2",
    title: "Vote",
    type: "vote",
    copies: 1,
    text: `WER BRAUCHT AM DRINGENDSTEN MAL WIEDER SEX?

Die Wüste trinkt 3!

Die Gruppe stimmt ab, wer trinken muss.`,
    config: {
      drinks: 3,
    },
  },
  {
    id: "vote_3",
    title: "Vote",
    type: "vote",
    copies: 1,
    text: `WER HAT AM EHESTEN EINEN GEHEIMEN FETISCH?

Der Lustmolch trinkt 4!

Die Gruppe stimmt ab, wer trinken muss.`,
    config: {
      drinks: 4,
    },
  },
  {
    id: "vote_4",
    title: "Vote",
    type: "vote",
    copies: 1,
    text: `WER WÜRDE AM MEISTEN GELD MIT ONLYFANS VERDIENEN?

Der Pornostar trinkt 3!

Die Gruppe stimmt ab, wer trinken muss.`,
    config: {
      drinks: 3,
    },
  },
  {
    id: "vote_5",
    title: "Vote",
    type: "vote",
    copies: 1,
    text: `WER HAT DAS GRÖSSTE POTENZIAL, EIN DOPPELLEBEN ZU FÜHREN?

Der Lügner trinkt 4!

Die Gruppe stimmt ab, wer trinken muss.`,
    config: {
      drinks: 4,
    },
  },

  // --- VS-KARTEN ---

  {
    id: "vs_blinzeln",
    title: "VS",
    type: "vs",
    copies: 1,
    text: `Such dir einen Gegner!
Wer zuerst blinzelt, verliert.

Verlierer trinkt 3.
Gewinner verteilt 2.`,
    config: {
      loserDrinks: 3,
      winnerGives: 2,
      mode: "generic",
    },
  },
  {
    id: "vs_zahl_raten",
    title: "VS",
    type: "vs",
    copies: 1,
    text: `Wähle zwei Spieler und denke an eine Zahl von 1–10.
Wer näher dran ist, gewinnt. Bei Gleichstand verlieren beide.

Verlierer trinkt 3.
Gewinner verteilt 2.`,
    config: {
      loserDrinks: 3,
      winnerGives: 2,
      mode: "generic",
    },
  },
  {
    id: "vs_trinkduell",
    title: "VS",
    type: "vs",
    copies: 1,
    text: `Trinkduell! Such dir einen Gegner!
Zeigt der Runde eure Gläser, stellt einen 5-Sekunden-Timer und trinkt.
Die Gruppe entscheidet, wer gewonnen hat.

Gewinner verteilt 2.
Verlierer trinkt 3.`,
    config: {
      loserDrinks: 3,
      winnerGives: 2,
      mode: "generic",
    },
  },
  {
    id: "vs_ssp",
    title: "VS",
    type: "vs",
    copies: 1,
    text: `Schere, Stein, Papier!
Such dir einen Gegner! Best-of-3.

Gewinner verteilt 3.
Verlierer trinkt 5.`,
    config: {
      loserDrinks: 5,
      winnerGives: 3,
      mode: "generic",
    },
  },

  // --- RICHTUNGSWECHSEL ---

  {
    id: "richtung_trink2",
    title: "Richtungswechsel",
    type: "direction_change",
    copies: 1,
    text: "Für die Verwirrung trinkst du 2 Schlücke und die Spielrichtung dreht sich um.",
    config: {
      selfDrinks: 2,
      selfGives: 0,
    },
  },
  {
    id: "richtung_verteilen2",
    title: "Richtungswechsel",
    type: "direction_change",
    copies: 1,
    text: "Jetzt sind alle verwirrt, du darfst 2 Schlücke verteilen.",
    config: {
      selfDrinks: 0,
      selfGives: 2,
    },
  },

  // --- TRINKBUDDY ---

  {
    id: "buddy_trink",
    title: "Trinkbuddy",
    type: "buddy",
    copies: 2,
    text: `Wähle einen Trinkbuddy.
Immer wenn einer von euch trinken muss, trinkt der andere 1 Schluck mit.

Darauf erstmal 1 Schluck für euch.`,
    config: {
      initialDrink: 1,
      initialGive: 0,
    },
  },
  {
    id: "buddy_verteilen",
    title: "Trinkbuddy",
    type: "buddy",
    copies: 2,
    text: `Wähle einen Trinkbuddy.
Immer wenn einer von euch trinken muss, trinkt der andere 1 Schluck mit.

Darauf erstmal 1 Schluck zum Verteilen.`,
    config: {
      initialDrink: 0,
      initialGive: 1,
    },
  },

  // --- KATEGORIEN ---

  {
    id: "kategorie_3",
    title: "Kategorien",
    type: "category",
    copies: 2,
    text: `Kategorien-Spiel.
Wählt ein Thema (z.B. Automarken) und zählt im Kreis Dinge auf.

Wer nichts mehr sagen kann, trinkt 3 Schlücke.`,
    config: {
      loserDrinks: 3,
    },
  },
  {
    id: "kategorie_5",
    title: "Kategorien",
    type: "category",
    copies: 1,
    text: `Kategorien-Spiel.
Wählt ein Thema (z.B. Automarken) und zählt im Kreis Dinge auf.

Wer nichts mehr sagen kann, trinkt 5 Schlücke.`,
    config: {
      loserDrinks: 5,
    },
  },
  {
    id: "kategorie_4",
    title: "Kategorien",
    type: "category",
    copies: 1,
    text: `Kategorien-Spiel.
Wählt ein Thema (z.B. Automarken) und zählt im Kreis Dinge auf.

Wer nichts mehr sagen kann, trinkt 4 Schlücke.`,
    config: {
      loserDrinks: 4,
    },
  },

  // --- KING & KING KILLER ---

  {
    id: "king_1",
    title: "King",
    type: "king",
    copies: 4,
    text: `Der King bleibt im Amt, bis die nächste King-Karte oder eine King-Killer-Karte gezogen wird.
Er darf jede gezogene Karte an jemand anderen (oder sich selbst) geben.
Hierzu einfach auf den Namen klicken und einen anderen Spieler auswählen.
Jede Weitergabe kostet 1 Schluck.
Der King erhält hierfür das Handy.

Zudem darf niemand seine Fragen beantworten, wer es doch tut, trinkt.

Aber denk dran: Sei gut zu deinem Volk, bevor ein King-Killer über dich richtet.`,
    config: {},
  },
  {
    id: "king_killer_1",
    title: "King Killer",
    type: "king_killer",
    copies: 2,
    text: `Ups… King gekillt!
Du richtest über den alten King – wie viele Schlücke bekommt er: 2 oder 4?

Für deine Tat darfst du selbst 2 Schluck verteilen!`,
    config: {
      killerGives: 1,
    },
  },

  // --- ENTWEDER ODER (LIGHT) ---

  {
    id: "either_light_1",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber für den Rest deines Lebens jeden Handschlag verkacken oder nur noch bar zahlen können und dabei immer zu wenig geben mit den Worten: 'Passt so'?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },
  {
    id: "either_light_2",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber jeden Tag gegen ein Huhn kämpfen, das ein Messer hat, oder alle drei Jahre gegen einen Orang-Utan mit einem Schwert?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },
  {
    id: "either_light_3",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber 100.000 Euro auf dem Konto oder 100.000 Follower auf Instagram?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },
  {
    id: "either_light_4",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber immer frieren oder ständig das Gefühl haben, du müsstest pinkeln?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },
  {
    id: "either_light_5",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber wird eine Woche lang alles, was du tust, im Fernsehen gezeigt, oder alles, was du denkst, im Radio übertragen?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },
  {
    id: "either_light_6",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber nur noch flüstern oder nur noch schreien können?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },
  {
    id: "either_light_7",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber jedes Mal niesen, wenn du Hallo sagst, oder furzen, wenn du Tschüss sagst?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },
  {
    id: "either_light_8",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber nie wieder Musik hören oder nie wieder Filme schauen?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },
  {
    id: "either_light_9",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber würden deine Gedanken als Sprechblasen über deinem Kopf erscheinen oder deine Träume jede Nacht auf Instagram gepostet werden?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },
  {
    id: "either_light_10",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber bei jeder Party zu früh gehen müssen oder immer als Letzter bleiben?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },
  {
    id: "either_light_11",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber jedes Gespräch mit „Na, du?“ starten oder mit „Ciao Kakao“ beenden?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },
  {
    id: "either_light_12",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber immer mit einer Socke zu wenig unterwegs sein oder ständig ein Stück Popcorn zwischen den Zähnen haben?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },
  {
    id: "either_light_13",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber bei jedem Kuss niesen müssen oder beim Händeschütteln rülpsen?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },
  {
    id: "either_light_14",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber nie wieder Socken oder nie wieder Unterwäsche tragen?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },
  {
    id: "either_light_15",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber nur noch über Fax erreichbar sein oder nur noch über Snapchat-Videocall?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },
  {
    id: "either_light_16",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber dein Leben lang alle 10 Minuten gähnen oder alle 10 Minuten niesen?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },
  {
    id: "either_light_17",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber immer von Tauben verfolgt werden oder immer irgendwo einen Marienkäfer auf dir haben?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },
  {
    id: "either_light_18",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber alles doppelt sagen müssen oder alles zweimal hören müssen?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },
  {
    id: "either_light_19",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber jedes Mal beim Hinsetzen seufzen oder beim Aufstehen stöhnen?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },
  {
    id: "either_light_20",
    title: "Entweder oder? (Light)",
    type: "either_light",
    copies: 1,
    text: "Lieber nie wieder etwas Warmes essen oder nie wieder etwas Kaltes trinken?\n\nWenn du die \"Entweder oder?\" beantwortest, darfst du einen Schluck verteilen. Wenn du nicht antworten möchtest, trinkst du einen.",
    config: { baseSips: 1 },
  },

  // --- ENTWEDER ODER (DEEP) ---

  {
    id: "either_deep_1",
    title: "Entweder oder? (Deep)",
    type: "either_deep",
    copies: 1,
    text: `Lieber beim Orgasmus den Namen deines Vaters rufen oder den deiner Mutter?

Wenn du die Entweder oder? beantwortest, darfst du 2 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 2.`,
    config: { sips: 2 },
  },
  {
    id: "either_deep_2",
    title: "Entweder oder? (Deep)",
    type: "either_deep",
    copies: 1,
    text: `Too Far`,
    config: { sips: 2 },
  },
  {
    id: "either_deep_3",
    title: "Entweder oder? (Deep)",
    type: "either_deep",
    copies: 1,
    text: `Lieber einem Gorilla zeigen, wie du befriedigt werden willst, oder einen Gorilla selbst befriedigen?

Wenn du die Entweder oder? beantwortest, darfst du 2 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 2.`,
    config: { sips: 2 },
  },
  {
    id: "either_deep_4",
    title: "Entweder oder? (Deep)",
    type: "either_deep",
    copies: 1,
    text: `Lieber Sex mit einer Ziege und niemand weiß es, oder keinen Sex mit einer Ziege, aber alle glauben es?

Wenn du die Entweder oder? beantwortest, darfst du 2 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 2.`,
    config: { sips: 2 },
  },
  {
    id: "either_deep_5",
    title: "Entweder oder? (Deep)",
    type: "either_deep",
    copies: 1,
    text: `Lieber Sex mit dem Körper deines Partners und dem Verstand deiner Mutter oder mit dem Körper deiner Mutter und dem Verstand deines Partners?

Wenn du die Entweder oder? beantwortest, darfst du 2 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 2.`,
    config: { sips: 2 },
  },
  {
    id: "either_deep_6",
    title: "Entweder oder? (Deep)",
    type: "either_deep",
    copies: 1,
    text: `Lieber ein Stück Schokolade essen, das nach Kot schmeckt, oder ein Stück Kot, das nach Schokolade schmeckt?

Wenn du die Entweder oder? beantwortest, darfst du 2 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 2.`,
    config: { sips: 2 },
  },
  {
    id: "either_deep_7",
    title: "Entweder oder? (Deep)",
    type: "either_deep",
    copies: 1,
    text: `Lieber beim Sex gefilmt werden und es geht viral, oder du musst das Video selbst deiner Familie zeigen?

Wenn du die Entweder oder? beantwortest, darfst du 2 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 2.`,
    config: { sips: 2 },
  },
  {
    id: "either_deep_8",
    title: "Entweder oder? (Deep)",
    type: "either_deep",
    copies: 1,
    text: `Lieber eine Woche lang schmeckt alles, was du isst, nach Sperma, oder eine Woche lang sieht alles, was du isst, aus wie Sperma?

Wenn du die Entweder oder? beantwortest, darfst du 3 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 3.`,
    config: { sips: 3 },
  },
  {
    id: "either_deep_9",
    title: "Entweder oder? (Deep)",
    type: "either_deep",
    copies: 1,
    text: `Lieber jedes Mal, wenn du geil bist, hörst du eine Sirene, oder jedes Mal, wenn du kommst, ertönt ein Schiffshorn?

Wenn du die Entweder oder? beantwortest, darfst du 2 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 2.`,
    config: { sips: 2 },
  },
  {
    id: "either_deep_10",
    title: "Entweder oder? (Deep)",
    type: "either_deep",
    copies: 1,
    text: `Lieber du kannst nie wieder kommen, oder du kommst jedes Mal, wenn jemand „Kaffee“ sagt?

Wenn du die Entweder oder? beantwortest, darfst du 1 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 1.`,
    config: { sips: 1 },
  },
  {
    id: "either_deep_11",
    title: "Entweder oder? (Deep)",
    type: "either_deep",
    copies: 1,
    text: `Würdest du lieber den Schweiß oder die Spucke einer fremden Person trinken?

Wenn du die Entweder oder? beantwortest, darfst du 2 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 2.`,
    config: { sips: 2 },
  },
  {
    id: "either_deep_12",
    title: "Entweder oder? (Deep)",
    type: "either_deep",
    copies: 1,
    text: `Lieber Sperma in den Augen oder Urin im Mund?

Wenn du die Entweder oder? beantwortest, darfst du 2 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 2.`,
    config: { sips: 2 },
  },
  {
    id: "either_deep_13",
    title: "Entweder oder? (Deep)",
    type: "either_deep",
    copies: 1,
    text: `Lieber deine Eltern beim Sex filmen oder einen bestehenden Film deiner Eltern neu vertonen?

Wenn du die Entweder oder? beantwortest, darfst du 2 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 2.`,
    config: { sips: 2 },
  },
  {
    id: "either_deep_14",
    title: "Entweder oder? (Deep)",
    type: "either_deep",
    copies: 1,
    text: `Lieber einmal Sex mit einem toten Körper oder lebenslang keinen Sex mehr?

Wenn du die Entweder oder? beantwortest, darfst du 2 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 2.`,
    config: { sips: 2 },
  },
  {
    id: "either_deep_15",
    title: "Entweder oder? (Deep)",
    type: "either_deep",
    copies: 1,
    text: `Lieber erster bei 100 Menschen versus 1 Gorilla oder letzter bei Bonnie Blue?

Wenn du die Entweder oder? beantwortest, darfst du 2 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 2.`,
    config: { sips: 2 },
  },
  {
    id: "either_deep_16",
    title: "Entweder oder? (Deep)",
    type: "either_deep",
    copies: 1,
    text: `Lieber deinen Penis gegen eine Zunge eintauschen oder deine Zunge gegen einen Penis?

Wenn du die Entweder oder? beantwortest, darfst du 2 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 2.`,
    config: { sips: 2 },
  },
  {
    id: "either_deep_17",
    title: "Entweder oder? (Deep)",
    type: "either_deep",
    copies: 1,
    text: `Lieber dein Leben lang AfD wählen (du darfst nicht lügen, wenn dich jemand fragt), oder öffentlich für Inzest einstehen?

Wenn du die Entweder oder? beantwortest, darfst du 2 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 2.`,
    config: { sips: 3 },
  },

  // --- ENTWEDER ODER (TOO FAR) ---

  {
    id: "either_tf_1",
    title: "Entweder oder? (Too Far)",
    type: "either_too_far",
    copies: 1,
    text: `Lieber auf einem Schwanz sitzen und Kuchen essen oder auf einem Kuchen sitzen und Schwanz essen?
    
    Wenn du die Entweder oder? beantwortest, darfst du 3 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 3.`,
    config: { sips: 3 },
  },
  {
    id: "either_tf_2",
    title: "Entweder oder? (Too Far)",
    type: "either_too_far",
    copies: 1,
    text: `Lieber Sperma aus einem Kondom trinken oder Blut aus einem Tampon?
    
    Wenn du die Entweder oder? beantwortest, darfst du 4 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 4.`,
    config: { sips: 4 },
  },
  {
    id: "either_tf_3",
    title: "Entweder oder? (Too Far)",
    type: "either_too_far",
    copies: 1,
    text: `Lieber an einem Tag 100 Schwänze lutschen oder 100 Tage lang jeden Tag einen?
    
    Wenn du die Entweder oder? beantwortest, darfst du 3 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 3.`,
    config: { sips: 3 },
  },
  {
    id: "either_tf_4",
    title: "Entweder oder? (Too Far)",
    type: "either_too_far",
    copies: 1,
    text: `Lieber einen schlechten Handjob von deiner Oma bekommen oder einen guten?
    
    Wenn du die Entweder oder? beantwortest, darfst du 4 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 4.`,
    config: { sips: 4 },
  },
  {
    id: "either_tf_5",
    title: "Entweder oder? (Too Far)",
    type: "either_too_far",
    copies: 1,
    text: `Lieber mit deinen Eltern einen Ihrer selbstgedrehten Pornos schauen oder mit ihnen einen deiner selbstgedrehten?
    
    Wenn du die Entweder oder? beantwortest, darfst du 4 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 4.`,
    config: { sips: 4 },
  },
  {
    id: "either_tf_6",
    title: "Entweder oder? (Too Far)",
    type: "either_too_far",
    copies: 1,
    text: `Lieber die ersten 90 % eines Blowjobs oder die letzten 10 %?
    
    Wenn du die Entweder oder? beantwortest, darfst du 4 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 4.`,
    config: { sips: 4 },
  },
  {
    id: "either_tf_7",
    title: "Entweder oder? (Too Far)",
    type: "either_too_far",
    copies: 1,
    text: `Lieber dein Vater erwischt dich beim Sex oder du erwischst deinen Vater beim Sex?
    
    Wenn du die Entweder oder? beantwortest, darfst du 4 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 4.`,
    config: { sips: 4 },
  },
  {
    id: "either_tf_8",
    title: "Entweder oder? (Too Far)",
    type: "either_too_far",
    copies: 1,
    text: `Lieber 30 Sekunden ins Gesicht gepisst bekommen oder von deiner Partnerin mit dem Strapon genommen werden?
    
    Wenn du die Entweder oder? beantwortest, darfst du 4 Schlücke verteilen. Wenn du nicht antworten möchtest, trinkst du 4.`,
    config: { sips: 4 },
  },
];

// Deck generieren
function buildDeck() {
  const deck = [];
  ALL_CARDS.forEach((card) => {
    for (let i = 0; i < card.copies; i++) {
      deck.push({ ...card });
    }
  });
  return shuffle(deck);
}

// ====== SPIELER-SETUP ======

function initPlayerInputs() {
  playerInputsContainer.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    addPlayerInputRow(i + 1);
  }
}

function addPlayerInputRow(index) {
  const row = document.createElement("div");
  row.className = "player-input-row";

  const label = document.createElement("span");
  label.textContent = index + ".";
  row.appendChild(label);

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Spielername";
  input.dataset.index = index;

  input.addEventListener("input", () => {
    const inputs = Array.from(
      playerInputsContainer.querySelectorAll("input")
    );
    const lastInput = inputs[inputs.length - 1];
    if (lastInput === input && input.value.trim() !== "") {
      addPlayerInputRow(inputs.length + 1);
    }
  });

  row.appendChild(input);
  playerInputsContainer.appendChild(row);
}

// ====== SPIEL STARTEN ======

function startGameFromSetup(event) {
  event.preventDefault();

  const names = Array.from(
    playerInputsContainer.querySelectorAll("input")
  )
    .map((input) => input.value.trim())
    .filter((n) => n.length > 0);

  if (names.length < 2) {
    showModal(
      "Zu wenige Spieler",
      "<p>Mindestens 2 Spieler werden benötigt.</p>",
      [{ label: "Alles klar", onClick: () => closeModal() }]
    );
    return;
  }

  state.players = names.map((name) => ({
    name,
    drunk: 0,
    given: 0,
    turns: 0,
  }));
  state.direction = 1;
  state.activePlayerIndex = 0;
  state.deck = buildDeck();
  state.discardPile = [];
  state.currentCard = null;
  state.isCardRevealed = false;
  state.rouletteProgress = 0;
  state.kingIndex = null;
  state.buddies = {};
  state.drinkEvents = [];
  state.currentTargetIndex = null;

  updateRouletteUI();
  updateCurrentPlayerUI();
  updateStatsUI();
  resetCardFlip();
  drawNextCard(); // erste Karte verdeckt

  switchView("view-game");
}

// ====== UI UPDATES ======

function updateCurrentPlayerUI() {
  if (!state.players || state.players.length === 0) {
    currentPlayerNameEl.textContent = "–";
    return;
  }

  const baseIndex = state.activePlayerIndex;
  const targetIndex =
    typeof state.currentTargetIndex === "number"
      ? state.currentTargetIndex
      : baseIndex;

  const targetPlayer = state.players[targetIndex];
  currentPlayerNameEl.textContent = targetPlayer ? targetPlayer.name : "–";
}

// Stats unter der Karte aktualisieren
function updateStatsUI() {
  if (!statsListEl) return;

  statsListEl.innerHTML = "";

  if (!state.players || state.players.length === 0) {
    const row = document.createElement("div");
    row.className = "stats-row";
    row.innerHTML = `<span class="stats-row-name">Noch keine Spieler</span>`;
    statsListEl.appendChild(row);
    return;
  }

  // Sortierung: wer am meisten getrunken hat zuerst
  const sorted = state.players
    .map((p, index) => ({ ...p, index }))
    .sort((a, b) => b.drunk - a.drunk);

  sorted.forEach((p) => {
    const row = document.createElement("div");
    row.className = "stats-row";

    const nameSpan = document.createElement("span");
    nameSpan.className = "stats-row-name";
    nameSpan.textContent = p.name;

    const valueSpan = document.createElement("span");
    valueSpan.className = "stats-row-value";
    valueSpan.textContent = `🍺 ${p.drunk} | 🎯 ${p.given}`;

    row.appendChild(nameSpan);
    row.appendChild(valueSpan);
    statsListEl.appendChild(row);
  });
}

// Karte UI

function resetCardFlip() {
  state.isCardRevealed = false;
  gameCardEl.classList.remove("flipped");
  cardTitleEl.textContent = "";
  cardTextEl.textContent = "";
  if (cardIconEl) cardIconEl.textContent = "";
  if (cardFooterEl) cardFooterEl.textContent = "";
}

function getIconForCard(card) {
  switch (card.type) {
    case "simple_drink":
      return "🍺";
    case "simple_give":
      return "🍻";
    case "price":
      return "💸";
    case "rule":
      return "📜";
    case "waterfall":
      return "💧";
    case "vote":
      return "🗳️";
    case "vs":
      return "⚔️";
    case "direction_change":
      return "🔁";
    case "buddy":
      return "🤝";
    case "category":
      return "🧠";
    case "king":
      return "👑";
    case "king_killer":
      return "💀";
    case "either_light":
      return "❓";
    case "either_deep":
      return "🔥";
    case "either_too_far":
      return "⚠️";
    default:
      return "✨";
  }
}

function getFooterTextForCard(card) {
  switch (card.type) {
    case "simple_drink": {
      const s = card.config?.drink || 0;
      return s ? `Trinkt: ${s} Schluck${s > 1 ? "e" : ""}` : "";
    }
    case "simple_give": {
      const s = card.config?.give || 0;
      return s ? `Verteilen: ${s} Schluck${s > 1 ? "e" : ""}` : "";
    }
    case "price": {
      const w = card.config?.winnerGives || 2;
      return `Gewinner verteilt: ${w}`;
    }
    case "waterfall": {
      const b = card.config?.baseDrink || 1;
      return `Du zählst als: +${b} Schluck`;
    }
    case "rule":
      return "Neue Regel aufstellen oder eine aufheben.";
    case "vote": {
      const d = card.config?.drinks || 0;
      return d ? `Wertung: ${d} verteilte Schlücke` : "";
    }
    case "vs": {
      const l = card.config?.loserDrinks || 0;
      const w = card.config?.winnerGives || 0;
      return `Verlierer trinkt: ${l} | Gewinner verteilt: ${w}`;
    }
    case "direction_change": {
      const d = card.config?.selfDrinks || 0;
      const g = card.config?.selfGives || 0;
      if (d && g) return `Du trinkst ${d} & verteilst ${g}`;
      if (d) return `Du trinkst: ${d}`;
      if (g) return `Du verteilst: ${g}`;
      return "";
    }
    case "buddy":
      return "Trinkbuddy aktiv – jeder Drink zählt +1 beim Buddy.";
    case "category": {
      const l = card.config?.loserDrinks || 0;
      return l ? `Verlierer trinkt: ${l}` : "";
    }
    case "king":
      return "Du bist King, bis eine King- oder King-Killer-Karte erscheint.";
    case "king_killer":
      return "Entmachtet den King – er trinkt, du verteilst.";
    case "either_light": {
      const b = card.config?.baseSips || 1;
      return `Basiswertung: ${b} verteilter Schluck`;
    }
    case "either_deep": {
      const s = card.config?.sips || 2;
      return `Wertung: ${s} Schlücke – Gruppe entscheidet, wer wie viel bekommt.`;
    }
    case "either_too_far": {
      const s = card.config?.sips || 3;
      return `Wertung: ${s} Schlücke – nur für harte Runden.`;
    }
    default:
      return "";
  }
}

function revealCardUI() {
  if (!state.currentCard) return;
  const card = state.currentCard;

  cardTitleEl.textContent = card.title || "";
  cardTextEl.textContent = card.text || "";

  if (cardIconEl) {
    cardIconEl.textContent = getIconForCard(card);
  }
  if (cardFooterEl) {
    cardFooterEl.textContent = getFooterTextForCard(card);
  }

  gameCardEl.classList.add("flipped");
  state.isCardRevealed = true;
}

// ====== KARTENLOGIK ======

function drawNextCard() {
  if (state.deck.length === 0) {
    endGameAndShowSummary(true);
    return;
  }
  const card = state.deck.shift();
  state.currentCard = card;
  state.discardPile.push(card);

  // Standard: Zielspieler ist der, der dran ist
  state.currentTargetIndex = state.activePlayerIndex;

  resetCardFlip();
  updateCurrentPlayerUI(); // damit oben direkt der aktuelle Zielspieler steht
}

// Wird aufgerufen, wenn NEXT gedrückt wird
function handleNextButton() {
  if (!state.currentCard) return;

  // Wenn Karte noch verdeckt → zuerst nur aufdecken
  if (!state.isCardRevealed) {
    revealCardUI();
    return;
  }

  // Karte ist aufgedeckt → Effekt auf den "Zielspieler" anwenden
  const targetIndex =
    typeof state.currentTargetIndex === "number"
      ? state.currentTargetIndex
      : state.activePlayerIndex;

  applyCardEffect(state.currentCard, targetIndex, () => {
    // Roulette aufladen (immer für den aktiven Spieler, nicht den Zielspieler)
    applyRouletteAdvance();

    // Nächster Spieler in Reihenfolge
    advanceToNextPlayer();

    // Neue Karte ziehen
    drawNextCard();
    updateCurrentPlayerUI();
  });
}

function applyCardEffect(card, playerIndex, onDone) {
  const p = state.players[playerIndex];

  switch (card.type) {
    // --- Basis: einfache Trink- / Verteilkarten ---

    case "simple_drink": {
      const sips = card.config?.drink || 0;
      if (sips > 0) {
        addDrink(playerIndex, sips);
      }
      // Keine Modals – direkt weiter
      onDone();
      break;
    }

    case "simple_give": {
      const sips = card.config?.give || 0;
      if (sips > 0) {
        addGive(playerIndex, sips);
      }
      onDone();
      break;
    }

    // --- Regelkarte ---
    // Erklärung steht auf der Karte, ihr regelt das mündlich

    case "rule": {
      onDone();
      break;
    }

    // --- Wasserfall ---
    // Nur Wertung +1 o.ä., der Rest steht auf der Karte

    case "waterfall": {
      const base = card.config?.baseDrink || 1;
      if (base > 0) {
        addDrink(playerIndex, base); // zählt in den Stats
      }
      onDone();
      break;
    }

    // --- Was ist dein Preis? ---
    // Hier brauchen wir den Gewinner -> Modal bleibt

    case "price": {
      const winnerGives = card.config?.winnerGives || 2;
      const html = `
        <p>Wer hat die Auktion „gewonnen“?</p>
        <p>Die gewählte Person darf ${winnerGives} Schluck(e) verteilen.</p>
      `;
      showPlayerChoiceModal(
        "Was ist dein Preis?",
        html,
        (winnerIndex) => {
          addGive(winnerIndex, winnerGives);
          onDone();
        }
      );
      break;
    }

    // --- Vote-Karten ---
    // Nur Stats-Update, Abstimmung macht die Gruppe ohne Popup

    case "vote": {
      const drinks = card.config?.drinks || 0;
      if (drinks > 0) {
        // zählt als verteilte Schlücke für den Zieher
        addGive(playerIndex, drinks);
      }
      onDone();
      break;
    }

    // --- VS-Duelle ---
    // Gewinner + Verlierer müssen gewählt werden -> Modals bleiben

    case "vs": {
      const cfg = card.config || {};
      const loserDrinks = cfg.loserDrinks || 0;
      const winnerGives = cfg.winnerGives || 0;

      // 1) Gewinner wählen
      showPlayerChoiceModal(
        "VS – Gewinner wählen",
        `<p>Spielt das Duell wie auf der Karte beschrieben und wählt dann den Gewinner.</p>`,
        (winnerIndex) => {
          // 2) Verlierer wählen
          showPlayerChoiceModal(
            "VS – Verlierer wählen",
            `<p>Wer hat das Duell verloren?</p>`,
            (loserIndex) => {
              if (loserDrinks > 0) {
                addDrink(loserIndex, loserDrinks);
              }
              if (winnerGives > 0) {
                addGive(winnerIndex, winnerGives);
              }
              onDone();
            }
          );
        }
      );
      break;
    }

    // --- Richtungswechsel ---
    // Nur Richtung ändern + evtl. Stats, keine Erklärung nötig

    case "direction_change": {
      const selfDrinks = card.config?.selfDrinks || 0;
      const selfGives = card.config?.selfGives || 0;

      if (selfDrinks > 0) addDrink(playerIndex, selfDrinks);
      if (selfGives > 0) addGive(playerIndex, selfGives);

      // Richtung drehen: +1 -> -1 -> +1 ...
      state.direction = state.direction * -1;

      onDone();
      break;
    }

    // --- Trinkbuddy ---
    // Hier muss ein Buddy ausgewählt werden -> Modal bleibt

    case "buddy": {
      const cfg = card.config || {};
      const initialDrink = cfg.initialDrink || 0;
      const initialGive = cfg.initialGive || 0;

      showPlayerChoiceModal(
        "Trinkbuddy wählen",
        `<p>${p.name} wählt einen Trinkbuddy. Immer wenn einer von euch trinken muss, trinkt der andere 1 Schluck mit.</p>`,
        (buddyIndex) => {
          if (buddyIndex !== playerIndex) {
            state.buddies[playerIndex] = buddyIndex;
            state.buddies[buddyIndex] = playerIndex;
          }
          if (initialDrink > 0) addDrink(playerIndex, initialDrink);
          if (initialGive > 0) addGive(playerIndex, initialGive);
          onDone();
        }
      );
      break;
    }

    // --- Kategorien ---
    // Verlierer bestimmen -> Modal bleibt

    case "category": {
      const loserDrinks = card.config?.loserDrinks || 0;
      showPlayerChoiceModal(
        "Kategorien – Verlierer wählen",
        `<p>Ihr spielt das Kategorien-Spiel wie auf der Karte steht.</p>
         <p>Wer ist zuerst rausgeflogen?</p>`,
        (loserIndex) => {
          if (loserDrinks > 0) {
            addDrink(loserIndex, loserDrinks);
          }
          onDone();
        }
      );
      break;
    }

    // --- King ---
    // Nur Status setzen, Erklärung steht auf der Karte

    case "king": {
      state.kingIndex = playerIndex;
      onDone();
      break;
    }

    // --- King Killer ---
    // Hier brauchen wir die 2/4-Auswahl -> Modal bleibt

    case "king_killer": {
      const killerGives = card.config?.killerGives || 1;

      if (state.kingIndex == null) {
        // Kein King aktiv – einfach nichts Besonderes
        onDone();
        break;
      }

      const kingPlayer = state.players[state.kingIndex];

      showModal(
        "King Killer",
        `<p>${p.name} hat einen King Killer gezogen!</p>
         <p>Richte über den King ${kingPlayer.name}: Trinkt er 2 oder 4 Schlücke?</p>`,
        [
          {
            label: "2 Schlücke",
            onClick: () => {
              closeModal();
              addDrink(state.kingIndex, 2);
              if (killerGives > 0) addGive(playerIndex, killerGives);
              state.kingIndex = null;
              onDone();
            },
          },
          {
            label: "4 Schlücke",
            onClick: () => {
              closeModal();
              addDrink(state.kingIndex, 4);
              if (killerGives > 0) addGive(playerIndex, killerGives);
              state.kingIndex = null;
              onDone();
            },
          },
        ]
      );
      break;
    }

    // --- Entweder oder? (Light) ---
    // Nur Wertung / Statistik, alles andere steht auf der Karte

    case "either_light": {
      const base = card.config?.baseSips || 1;
      if (base > 0) {
        addGive(playerIndex, base);
      }
      onDone();
      break;
    }

    // --- Entweder oder? (Deep) ---

    case "either_deep": {
      const sips = card.config?.sips || 2;
      if (sips > 0) {
        addGive(playerIndex, sips);
      }
      onDone();
      break;
    }

    // --- Entweder oder? (Too Far) ---

    case "either_too_far": {
      const sips = card.config?.sips || 3;
      if (sips > 0) {
        addGive(playerIndex, sips);
      }
      onDone();
      break;
    }

    // --- Fallback ---

    default: {
      onDone();
    }
  }
}

// ====== ROULETTE ======

function applyRouletteAdvance() {
  const inc = randomRouletteIncrement();
  state.rouletteProgress += inc;
  if (state.rouletteProgress >= 100) {
    triggerRouletteEvent();
    state.rouletteProgress = 0;
  }
  updateRouletteUI();
}

function triggerRouletteEvent() {
  const playerIndex = state.activePlayerIndex;
  const player = state.players[playerIndex];
  const roll = Math.random();
  let msg;
  if (roll < 0.5) {
    const sips = 1 + Math.floor(Math.random() * 3); // 1-3
    addDrink(playerIndex, sips);
    msg = `${player.name} hat das Roulette voll gemacht und trinkt ${sips} Schluck${sips > 1 ? "e" : ""}.`;
  } else {
    addGive(playerIndex, 1);
    msg = `${player.name} hat Glück! Er darf 1 Schluck an jemanden verteilen.`;
  }
  showModal("Roulette!", `<p>${msg}</p>`, [
    { label: "Weiter", onClick: () => closeModal() },
  ]);
}

// ====== STATS / EVENTS ======

function addDrink(playerIndex, amount) {
  if (amount <= 0) return;
  const p = state.players[playerIndex];
  p.drunk += amount;
  state.drinkEvents.push({
    playerIndex,
    drunk: amount,
    given: 0,
    playerTurnAtEvent: p.turns,
  });

  // Buddy-Effekt (später nutzbar)
  const buddyIndex = state.buddies[playerIndex];
  if (typeof buddyIndex === "number") {
    const buddy = state.players[buddyIndex];
    if (buddy) {
      buddy.drunk += 1;
      state.drinkEvents.push({
        playerIndex: buddyIndex,
        drunk: 1,
        given: 0,
        playerTurnAtEvent: buddy.turns,
      });
    }
  }

  updateStatsUI();
}

function addGive(playerIndex, amount) {
  if (amount <= 0) return;
  const p = state.players[playerIndex];
  p.given += amount;
  state.drinkEvents.push({
    playerIndex,
    drunk: 0,
    given: amount,
    playerTurnAtEvent: p.turns,
  });

  updateStatsUI();
}

// ====== SPIELER-ROTATION ======

function advanceToNextPlayer() {
  const current = state.activePlayerIndex;
  state.players[current].turns += 1;

  const count = state.players.length;
  let next = current + state.direction;
  if (next < 0) next = count - 1;
  if (next >= count) next = 0;

  state.activePlayerIndex = next;
}

// ====== SIEGEREHRUNG ======

function endGameAndShowSummary(deckEmpty) {
  const turnsArray = state.players.map((p) => p.turns);
  const minTurns = Math.min(...turnsArray);

  let computedStats;

  if (minTurns > 0) {
    computedStats = state.players.map((p, index) => ({
      index,
      name: p.name,
      drunk: 0,
      given: 0,
      turns: p.turns,
    }));

    state.drinkEvents.forEach((ev) => {
      if (ev.playerTurnAtEvent <= minTurns) {
        const cs = computedStats[ev.playerIndex];
        cs.drunk += ev.drunk;
        cs.given += ev.given;
      }
    });

    document.getElementById("summary-note").innerHTML =
      "<em>Hinweis: Für die Wertung wurden nur vollständig gespielte Runden berücksichtigt. Aktionen aus der letzten angebrochenen Runde sind nicht in die Platzierung eingeflossen.</em>";
  } else {
    computedStats = state.players.map((p, index) => ({
      index,
      name: p.name,
      drunk: p.drunk,
      given: p.given,
      turns: p.turns,
    }));
    document.getElementById("summary-note").innerHTML =
      "<em>Hinweis: Ihr habt das Spiel beendet, bevor alle einmal an der Reihe waren. Die folgende Auswertung basiert auf allen bisherigen Aktionen und kann leicht unausgeglichen sein – selber schuld.</em>";
  }

  computedStats.sort((a, b) => b.drunk - a.drunk);

  renderPodium(computedStats);
  switchView("view-summary");
}

function renderPodium(stats) {
  const podiumEl = document.getElementById("summary-podium");
  podiumEl.innerHTML = "";

  const top3 = stats.slice(0, 3);

  const places = [2, 1, 3];
  places.forEach((place) => {
    const slot = document.createElement("div");
    slot.className = `podium-slot place-${place}`;
    const s = top3[place - 1];

    if (!s) {
      slot.innerHTML = `<div class="podium-rank">Platz ${place}</div><div class="podium-name">–</div>`;
    } else {
      slot.innerHTML = `
        <div class="podium-rank">Platz ${place}</div>
        <div class="podium-name">${s.name}</div>
        <div class="podium-stats">
          Getrunken: ${s.drunk}<br/>
          Verteilt: ${s.given}
        </div>
      `;
    }

    podiumEl.appendChild(slot);
  });
}

// ====== SPIELERWAHL-MODAL ======

function showPlayerChoiceModal(title, bodyHtml, onSelect) {
  modalTitleEl.textContent = title;
  modalBodyEl.innerHTML = bodyHtml;
  modalActionsEl.innerHTML = "";

  state.players.forEach((p, index) => {
    const btn = document.createElement("button");
    btn.className = "btn-primary";
    btn.textContent = p.name;
    btn.addEventListener("click", () => {
      closeModal();
      onSelect(index);
    });
    modalActionsEl.appendChild(btn);
  });

  modal.classList.remove("hidden");
}

// ====== LEGAL TEXTE ======

const IMPRESSUM_HTML = `
  <p><strong>Impressum</strong></p>
  <p>Angaben gemäß § 5 TMG:</p>
  <p>Jakob Peters<br/>
  Rödingsmarkt 14<br/>
  20459 Hamburg<br/>
  Deutschland</p>
  <p>E-Mail: <a href="mailto:nsfw.game@gmx.de">nsfw.game@gmx.de</a></p>
  <p>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:<br/>
  Jakob Peters, Anschrift wie oben.</p>
  <h3>Hinweis zum Angebot</h3>
  <p>Diese Webseite stellt ein humoristisches Online-Trinkspiel mit teils expliziten, nicht jugendfreien Inhalten dar. Die Nutzung erfolgt ausschließlich durch volljährige Personen (mindestens 18 Jahre).</p>
  <p>Es handelt sich nicht um medizinische, psychologische oder rechtliche Beratung. Der verantwortungsvolle Umgang mit Alkohol liegt allein bei den Nutzerinnen und Nutzern.</p>
`;

const DATENSCHUTZ_HTML = `
  <p><strong>Datenschutzerklärung (Kurzfassung)</strong></p>
  <p>Verantwortlich im Sinne der DSGVO:</p>
  <p>Jakob Peters<br/>
  Rödingsmarkt 14<br/>
  20459 Hamburg<br/>
  Deutschland<br/>
  E-Mail: <a href="mailto:nsfw.game@gmx.de">nsfw.game@gmx.de</a></p>
  <h3>Hosting / Zugriffsdaten</h3>
  <p>Diese Webseite wird über einen externen Dienst (z.&nbsp;B. GitHub Pages) bereitgestellt. Beim Aufruf der Seite werden automatisch technische Daten (IP-Adresse, Zeitpunkt, aufgerufene Seite, Browsertyp etc.) verarbeitet, um den Betrieb und die Sicherheit der Seite zu gewährleisten.</p>
  <h3>Spielnutzung</h3>
  <p>Spielernamen werden nur lokal in Ihrem Browser verarbeitet, um den Spielfluss zu ermöglichen. Es erfolgt keine Registrierung und keine serverseitige Speicherung.</p>
  <h3>Kontakt</h3>
  <p>Wenn Sie per E-Mail Kontakt aufnehmen, werden Ihre Angaben zur Bearbeitung der Anfrage verarbeitet.</p>
  <h3>Analyse / Cookies</h3>
  <p>In der aktuellen Version werden keine Analyse- oder Tracking-Cookies gesetzt. Bei künftigem Einsatz von Diensten wie Google AdSense oder Analytics wird diese Erklärung entsprechend angepasst.</p>
`;

// ====== EVENT LISTENERS / INIT ======

document.getElementById("btn-age-accept").addEventListener("click", () => {
  switchView("view-setup");
});

document.getElementById("btn-age-decline").addEventListener("click", () => {
  showModal(
    "Hinweis",
    "<p>Bitte verlasse diese Seite, wenn du unter 18 bist.</p>",
    [{ label: "Okay", onClick: () => closeModal() }]
  );
});

playerForm.addEventListener("submit", startGameFromSetup);

// 👑 King: Karten-Umlenkung durch Klick auf den angezeigten Spielernamen
currentPlayerNameEl.addEventListener("click", () => {
  // Nur wenn ein King aktiv ist
  if (state.kingIndex == null) return;

  // Nur wenn eine Karte aufgedeckt ist
  if (!state.currentCard || !state.isCardRevealed) return;

  const kingPlayer = state.players[state.kingIndex];

  showPlayerChoiceModal(
    "King verteilt die Karte",
    `<p>${kingPlayer.name} entscheidet, wer diese Karte abbekommt.</p>
     <p>Jedes Umlenken kostet den King 1 Schluck.</p>`,
    (targetIndex) => {
      // Nur zählen, wenn wirklich umverteilt wird
      if (
        typeof state.currentTargetIndex === "number" &&
        targetIndex !== state.currentTargetIndex
      ) {
        addDrink(state.kingIndex, 1); // King zahlt 1 Schluck für die Aktion
      }

      state.currentTargetIndex = targetIndex;
      updateCurrentPlayerUI();
    }
  );
});

gameCardEl.addEventListener("click", () => {
  if (!state.isCardRevealed) {
    revealCardUI();
  }
});

document.getElementById("btn-next").addEventListener("click", handleNextButton);

document.getElementById("btn-end-game").addEventListener("click", () => {
  endGameAndShowSummary(false);
});

document.getElementById("btn-new-game").addEventListener("click", () => {
  state.players.forEach((p) => {
    p.drunk = 0;
    p.given = 0;
    p.turns = 0;
  });
  state.direction = 1;
  state.activePlayerIndex = 0;
  state.deck = buildDeck();
  state.discardPile = [];
  state.currentCard = null;
  state.isCardRevealed = false;
  state.rouletteProgress = 0;
  state.kingIndex = null;
  state.buddies = {};
  state.drinkEvents = [];
  state.currentTargetIndex = null;

  updateRouletteUI();
  updateCurrentPlayerUI();
  updateStatsUI();
  resetCardFlip();
  drawNextCard();

  switchView("view-game");
});

document.getElementById("btn-back-to-setup").addEventListener("click", () => {
  switchView("view-setup");
});

document.getElementById("btn-imprint").addEventListener("click", () => {
  showLegalModal("Impressum", IMPRESSUM_HTML);
});

document.getElementById("btn-privacy").addEventListener("click", () => {
  showLegalModal("Datenschutz", DATENSCHUTZ_HTML);
});

document.getElementById("btn-close-legal").addEventListener("click", () => {
  closeLegalModal();
});

// Modal außenklick schließen
modal.addEventListener("click", (e) => {
  if (e.target === modal.querySelector(".modal-backdrop")) {
    closeModal();
  }
});

legalModal.addEventListener("click", (e) => {
  if (e.target === legalModal.querySelector(".modal-backdrop")) {
    closeLegalModal();
  }
});

// INIT
initYear();
initPlayerInputs();
updateRouletteUI();
updateCurrentPlayerUI();
updateStatsUI();
