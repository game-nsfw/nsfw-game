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
