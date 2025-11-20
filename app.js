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

// ====== KARTEN-DECK (PLATZHALTER!) ======
// HIER später deine echten Karten reinziehen (z.B. aus cards.json)
const ALL_CARDS = [
  {
    id: "drink_1",
    title: "Trink!",
    category: "basic",
    type: "simple_drink",
    copies: 1,
    text: "Trink 1 Schluck.",
    config: { drink: 1 },
  },
  {
    id: "drink_2",
    title: "Trink!",
    category: "basic",
    type: "simple_drink",
    copies: 2,
    text: "Trink 2 Schlücke.",
    config: { drink: 2 },
  },
  {
    id: "give_2",
    title: "Verteil!",
    category: "basic",
    type: "simple_give",
    copies: 2,
    text: "Verteile 2 Schlücke nach Belieben.",
    config: { give: 2, countAsGiveOnly: true },
  },
  {
    id: "price_example",
    title: "Was ist dein Preis?",
    category: "price",
    type: "price",
    copies: 1,
    text: "Für wie viel würdest du XYZ tun? Alle heben die Hand, der Zieher versteigert von 100 Mio. runter.",
    config: { winnerGives: 2, requiresWinner: true },
  },
  // TODO: hier später alle deine Karten variantenweise eintragen
];

// Deck generieren
function buildDeck() {
  const deck = [];
  ALL_CARDS.forEach((card) => {
    for (let i = 0; i < card.copies; i++) {
      deck.push({ ...card }); // flache Kopie
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

  updateRouletteUI();
  updateCurrentPlayerUI();
  resetCardFlip();
  drawNextCard(); // erste Karte verdeckt bereitstellen

  switchView("view-game");
}

// ====== UI UPDATES ======

function updateCurrentPlayerUI() {
  const player = state.players[state.activePlayerIndex];
  currentPlayerNameEl.textContent = player ? player.name : "–";
}

function updateRouletteUI() {
  const val = Math.max(0, Math.min(100, state.rouletteProgress));
  rouletteFill.style.width = val + "%";
}

// Karte UI

function resetCardFlip() {
  state.isCardRevealed = false;
  gameCardEl.classList.remove("flipped");
  cardTitleEl.textContent = "";
  cardTextEl.textContent = "";
}

function revealCardUI() {
  if (!state.currentCard) return;
  cardTitleEl.textContent = state.currentCard.title || "";
  cardTextEl.textContent = state.currentCard.text || "";
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
  resetCardFlip();
}

// Wird aufgerufen, wenn NEXT gedrückt wird
function handleNextButton() {
  if (!state.currentCard) return;

  // Wenn Karte noch verdeckt → zuerst nur aufdecken
  if (!state.isCardRevealed) {
    revealCardUI();
    return;
  }

  // Karte ist aufgedeckt → Effekt ausführen
  applyCardEffect(state.currentCard, state.activePlayerIndex, () => {
    // Roulette aufladen
    applyRouletteAdvance();

    // Nächster Spieler
    advanceToNextPlayer();

    // Neue Karte
    drawNextCard();
    updateCurrentPlayerUI();
  });
}

// Einfache Dispatcher-Logik basierend auf card.type
function applyCardEffect(card, playerIndex, onDone) {
  const p = state.players[playerIndex];

  switch (card.type) {
    case "simple_drink": {
      const sips = card.config?.drink || 0;
      if (sips > 0) {
        addDrink(playerIndex, sips);
        showModal(
          "Trinken",
          `<p>${p.name} trinkt ${sips} Schluck${sips > 1 ? "e" : ""}.</p>`,
          [{ label: "Okay", onClick: () => { closeModal(); onDone(); } }]
        );
      } else {
        onDone();
      }
      break;
    }
    case "simple_give": {
      const sips = card.config?.give || 0;
      if (sips > 0) {
        addGive(playerIndex, sips);
        showModal(
          "Verteilen",
          `<p>${p.name} darf ${sips} Schluck${sips > 1 ? "e" : ""} verteilen.</p>`,
          [{ label: "Nice", onClick: () => { closeModal(); onDone(); } }]
        );
      } else {
        onDone();
      }
      break;
    }
    case "price": {
      // Was ist dein Preis? – Auktion → Gewinner wählen → 2 verteilen
      const winnerGives = card.config?.winnerGives || 2;
      const bodyHtml = `<p>Wer hat die verrückteste / glaubwürdigste Antwort gegeben?</p><p>Wähle den Gewinner. Er darf ${winnerGives} Schluck(e) verteilen.</p>`;
      showPlayerChoiceModal(
        "Was ist dein Preis?",
        bodyHtml,
        (winnerIndex) => {
          addGive(winnerIndex, winnerGives);
          onDone();
        }
      );
      break;
    }
    default: {
      // TODO: später alle Spezialkarten (King, VS, Buddy, etc.)
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
    // Pech → 1–3 trinken
    const sips = 1 + Math.floor(Math.random() * 3); // 1-3
    addDrink(playerIndex, sips);
    msg = `${player.name} hat das Roulette voll gemacht und trinkt ${sips} Schluck${sips > 1 ? "e" : ""}.`;
  } else {
    // Glück → 1 verteilen
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

  // Buddy
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
  // Prüfen, ob mindestens eine volle Runde existiert
  const turnsArray = state.players.map((p) => p.turns);
  const minTurns = Math.min(...turnsArray);

  let computedStats;

  if (minTurns > 0) {
    // Nur volle Runden werten
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

    // Hinweis
    document.getElementById("summary-note").innerHTML =
      "<em>Hinweis: Für die Wertung wurden nur vollständig gespielte Runden berücksichtigt. Aktionen aus der letzten angebrochenen Runde sind nicht in die Platzierung eingeflossen.</em>";
  } else {
    // Variante A: trotzdem auswerten
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

  // Sortieren nach getrunkenen Schlücken (absteigend)
  computedStats.sort((a, b) => b.drunk - a.drunk);

  renderPodium(computedStats);

  switchView("view-summary");
}

function renderPodium(stats) {
  const podiumEl = document.getElementById("summary-podium");
  podiumEl.innerHTML = "";

  const top3 = stats.slice(0, 3);

  const places = [2, 1, 3]; // visuelle Reihenfolge (2 | 1 | 3)
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

gameCardEl.addEventListener("click", () => {
  if (!state.isCardRevealed) {
    revealCardUI();
  }
});

document.getElementById("btn-next").addEventListener("click", handleNextButton);

document.getElementById("btn-end-game").addEventListener("click", () => {
  // Frühzeitiges Beenden → Siegerehrung mit Hinweis
  endGameAndShowSummary(false);
});

document.getElementById("btn-new-game").addEventListener("click", () => {
  // gleiche Spieler erneut verwenden
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

  updateRouletteUI();
  updateCurrentPlayerUI();
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
