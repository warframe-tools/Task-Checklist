// --- sources/js/i18n/locales/fr.js ---
// Français — active translation. Empty ("") or missing keys fall back to en.js
// (see ../i18n.js), so anything left blank shows the English default.
//
// Traduction active. Les clés vides ("") ou absentes reviennent à en.js
// (voir ../i18n.js) ; tout ce qui est laissé vide affiche la valeur anglaise par défaut.
import { iconURL } from "../../functions.js";

function _factionIcon(name) {
    const src = iconURL(`tasks/Syndicats/${name}`);
    return `<img class="icon-filter inline-icon" src="${src}">`;
}

const _baseOfOperationsTooltip = `<span class="tooltip" title="Orbiter, Camp du Drifter ou Arrière-salle">Base d'opérations</span>`;

const factions = `<p>Les Syndicats de Faction sont
                 ${_factionIcon("FactionSigilRebels.png")}Le Méridien d'Acier,
                 ${_factionIcon("FactionSigilJudge.png")}Les Arbitres d'Hexis,
                 ${_factionIcon("FactionSigilOracle.png")}Céphalon Suda,
                 ${_factionIcon("FactionSigilBusiness.png")}La Séquence Perrin,
                 ${_factionIcon("FactionSigilAssassins.png")}Le Voile Rouge,
                 et ${_factionIcon("FactionSigilChurch.png")}Le Nouveau Loka.</p>
                 <p>Prêtez allégeance à un syndicat de faction depuis la console Syndicats de votre ${_baseOfOperationsTooltip}.</p>`;

export default {
    meta: { code: "fr", label: "Français", htmlLang: "fr", ready: true },

    ui: {
        "document.title": "Warframe Task Checklist",
        "app.title": "Warframe Task Checklist",
        "app.description": "Suivez vos tâches quotidiennes, hebdomadaires et autres dans Warframe.",

        // aria-labels
        "aria.toggleTheme": "Changer de thème",
        "aria.openMenu": "Ouvrir le menu",
        "aria.closeError": "Fermer le message d'erreur",
        "aria.closeMenu": "Fermer le menu",
        "aria.closeSchedule": "Fermer le calendrier",
        "aria.selectLanguage": "Choisir la langue",

        // language switcher
        "lang.helpTranslate": "Aider à traduire sur GitHub",

        // error display banner
        "error.copy": "Copier",
        "error.copied": "Copié !",
        "error.failed": "Échec",

        // task sections
        "section.daily": "Tâches quotidiennes",
        "section.weekly": "Tâches hebdomadaires",
        "section.other": "Autres tâches",
        "section.hide": "Masquer la section",

        // reset / countdown timers ({timer} is the highlighted countdown span)
        "countdown.resetEllipsis": "(Réinitialisation...)",
        "countdown.loading": "(Chargement...)",
        "countdown.resetsInTimer": "(Réinitialisation dans {timer})",
        "countdown.availableForTimer": "(Disponible pendant {timer})",
        "countdown.availableInTimer": "(Disponible dans {timer})",
        "countdown.dailyFallback": "(Réinitialisation à 00:00 UTC)",
        "countdown.weeklyFallback": "(Réinitialisation lun. 00:00 UTC)",

        // save status
        "save.saved": "Enregistré !",
        "save.loading": "Chargement...",
        "save.storageNotice": "Votre progression est enregistrée localement.",
        "save.lastSaved": "Dernier enregistrement : {time}",
        "save.never": "Jamais",

        "reminder": "*N'oubliez pas que vous n'êtes pas obligé de tout faire ! Priorisez les tâches en fonction de vos objectifs et de votre progression actuelle.*",

        // footer
        "footer.appVersion": "Version de l'application",
        "footer.warframeVersion": "Version de Warframe {version}",
        "footer.license": "Licence (GPLv3)",
        "footer.disclaimer": "Ceci est un outil non officiel créé par des fans. Warframe et tous les éléments associés sont la propriété intellectuelle de Digital Extremes Ltd. Ce projet n'est ni affilié à Digital Extremes Ltd, ni approuvé ou sponsorisé par cette dernière.",

        // options menu + reset confirmation buttons
        "menu.options": "Options",
        "menu.resetDaily": "Réinitialiser les coches quotidiennes",
        "menu.resetWeekly": "Réinitialiser les coches hebdomadaires",
        "menu.resetAll": "Réinitialiser toutes les coches",
        "menu.unhideAll": "Réafficher toutes les tâches",
        "menu.confirm": "Êtes-vous sûr ?",

        // cycle schedule dialog
        "schedule.for": "Calendrier pour",
        "schedule.date": "Date",
        "schedule.now": "Maintenant",
        "schedule.cycleRepeats": "(Le cycle se répète)",

        // info line (labels are icon tooltips; buttons use &nbsp; to avoid wrapping)
        "info.location": "Lieu",
        "info.npc": "PNJ",
        "info.terminal": "Terminal",
        "info.requirements": "Prérequis",
        "info.info": "Info",
        "info.showSchedule": "Afficher&nbsp;le&nbsp;calendrier",
        "info.moreInfo": "Plus&nbsp;d'infos",

        // current-cycle prefixes (rendered as HTML; &nbsp; keeps them on one line)
        "cycle.thisWeek": "Cette&nbsp;semaine",
        "cycle.today": "Aujourd'hui",
        "cycle.currentCycle": "Cycle&nbsp;actuel",
        "cycle.nextCycle": "Prochain&nbsp;cycle",

        "baseOfOperations.label": "Base d'opérations",
        "baseOfOperations.tooltip": "Orbiter, Camp du Drifter ou Arrière-salle",

        // desktop notifications + permission prompts
        "notif.toggleFor": "Basculer les notifications pour {name}",
        "notif.hideTask": "Masquer la tâche : {name}",
        "notif.leavingSoonTitle": "{name} bientôt indisponible !",
        "notif.leavingSoonBody": "Environ {minutes} minutes restantes.",
        "notif.resetTitle": "{name} a été réinitialisé !",
        "notif.resetBody": "Le stock du vendeur a peut-être été mis à jour.",
        "notif.noSupport": "Ce navigateur ne prend pas en charge les notifications de bureau.",
        "notif.denied": "L'autorisation des notifications a été refusée. Vous pouvez l'activer dans les paramètres de votre navigateur.",
        "notif.deniedPersist": "L'autorisation des notifications a été refusée. Veuillez l'activer dans les paramètres de votre navigateur si vous souhaitez recevoir des notifications.",

        // save/load/startup errors
        "errors.saveFailed": "Impossible d'enregistrer la progression.",
        "errors.saveFailedQuota": "Impossible d'enregistrer la progression. Le stockage du navigateur est peut-être plein.",
        "errors.loadFailed": "Échec du chargement de la progression enregistrée. Les données sont peut-être corrompues.",
        "errors.themeSaveFailed": "Impossible d'enregistrer la préférence de thème.",
        "errors.critical": "Une erreur critique s'est produite au démarrage de l'application. Veuillez vérifier la console.",
    },

    tasks: {
        // --- daily ---
        daily_login: { text: "Connexion : Récupérez la récompense de connexion quotidienne." },
        daily_craft_forma: {
            text: "Fabrication (Forma) : Commencez la fabrication d'un nouveau Forma (et récupérez ceux qui sont terminés).",
            location: "Base d'opérations",
            terminal: "Fonderie",
        },
        daily_craft_other: {
            text: "Fabrication (Autre) : Fabriquez d'autres ressources ou objets quotidiens à l'aide de plans réutilisables (consultez la Fonderie ou l'application compagnon).",
            location: "Base d'opérations",
            terminal: "Fonderie",
        },
        daily_first_win_bonus: {
            text: "Bonus quotidien de première victoire : Obtenez le double des crédits de base sur votre première mission.",
            location: "Base d'opérations",
            terminal: "Navigation",
        },
        daily_syndicate_gain: {
            text: "Syndicats de Faction : Atteignez le plafond de réputation quotidien avec le(s) Syndicat(s) auxquels vous êtes affilié.",
            prereq: "Palier de maîtrise 3",
            info: "Gagnez de l'affinité dans n'importe quelle mission pour augmenter votre réputation de faction",
        },
        daily_syndicate_spend: {
            text: "Syndicats de Faction : Si votre réputation est au maximum, dépensez-la (packs de Reliques, packs de Vosfor, etc.).",
            location: "Base d'opérations / N'importe quel Relais",
            terminal: "Syndicats",
            prereq: "Palier de maîtrise 3",
        },
        daily_world_syndicate_parent: { text: "Syndicats du monde (réputation)" },
        daily_world_syndicate_simaris: { text: "Céphalon Simaris", location: "N'importe quel Relais" },
        daily_world_syndicate_ostron: { text: "Ostron", location: "Cetus, Terre", prereq: "Saya's Vigil" },
        daily_world_syndicate_quills: { text: "Les Plumes", location: "Cetus, Terre", prereq: "La Guerre Intérieure" },
        daily_world_syndicate_solaris: { text: "Union Solaris", location: "Fortuna, Vénus", prereq: "Vox Solaris (Quête)" },
        daily_world_syndicate_vox: { text: "Vox Solaris", location: "Fortuna, Vénus", prereq: "La Guerre Intérieure" },
        daily_world_syndicate_ventkids: { text: "Orphelins des Conduits", location: "Fortuna, Vénus", prereq: "Vox Solaris (Quête)" },
        daily_world_syndicate_entrati: { text: "Entrati", location: "Necralisk, Deimos", prereq: "Cœur de Deimos" },
        daily_world_syndicate_necraloid: { text: "Necraloïde", location: "Necralisk, Deimos", prereq: "La Guerre Intérieure" },
        daily_world_syndicate_holdfasts: { text: "Les Irréductibles", location: "Chrysalith, Zariman", prereq: "Les Anges du Zariman" },
        daily_world_syndicate_cavia: { text: "Cavia", location: "Sanctum Anatomica, Deimos", prereq: "Murmures dans les murs" },
        daily_world_syndicate_hex: { text: "L'Hexagone", location: "Höllvania Central Mall", prereq: "L'Hexagone (Quête)" },
        daily_sortie: {
            text: "Sortie : Terminez les 3 missions quotidiennes de la Sortie.",
            location: "Base d'opérations",
            terminal: "Navigation",
            prereq: "La Guerre Intérieure",
        },
        daily_focus: {
            text: "Focus : Atteignez le maximum de gain de Focus quotidien (par ex. via le Sanctuary Onslaught).",
            prereq: "Le Second Rêve",
        },
        daily_steel_path: {
            text: "Incursions de la Route de l'Acier : Terminez les missions quotidiennes de la Route de l'Acier pour de l'Essence d'Acier.",
            prereq: "Route de l'Acier débloqué",
        },
        daily_kim_parent: {
            text: "KIM : Terminez les conversations quotidiennes avec les Protoframes.",
            location: "Base d'opérations",
            terminal: "POM-2 PC",
        },
        daily_kim_hex_parent: { text: "L'Hexagone", prereq: "L'Hexagone (Quête)" },
        daily_kim_arthur: { text: "Broadsword (Arthur)" },
        daily_kim_eleanor: { text: "Salem (Eleanor)" },
        daily_kim_lettie: { text: "Belladona (Lettie)" },
        daily_kim_amir: { text: "H16h V0l7463 (Amir)" },
        daily_kim_aoi: { text: "xX GLIMMER Xx (Aoi)" },
        daily_kim_quincy: { text: "Soldja1Shot1kil (Quincy)" },
        daily_kim_roundtable_parent: { text: "The Roundtable", prereq: "L'Hexagone (Quête) Finale" },
        daily_kim_flare: { text: "Liminus_Star (Flare)", prereq: "Rang 4 L'Hexagone" },
        daily_kim_minerva_velimir: { text: "MomToxicated & PapaPolar (Minerva & Velimir)", prereq: "Rang 5 L'Hexagone" },
        daily_kim_kaya: { text: "KOLTrial_5115 (Kaya)", prereq: "Rang 5 L'Hexagone" },
        daily_kim_devils_triad_parent: { text: "The Devil's Triad", prereq: "L'Ancienne Paix" },
        daily_kim_marie: { text: "Marie" },
        daily_kim_roathe: { text: "Roathe" },
        daily_kim_lyon: { text: "Lyon", prereq: "\"Apprécié\" par Marie" },
        daily_vendors: { text: "Vendeurs" },
        daily_acrithis: {
            text: "Acrithis : Consultez l'offre quotidienne d'Arcanes et de scènes Captura.",
            location: "Duviri/Dormizone",
            npc: "Acrithis",
            prereq: "Inhérences du Voyageur : Opportunité, rang 9 (pour les Arcanes)",
        },
        daily_ticker_crew: {
            text: "Ticker : Consultez l'équipage Railjack disponible à l'embauche.",
            location: "Fortuna, Vénus",
            npc: "Ticker",
            prereq: "Marée Montante & Inhérences de Commandement 1",
        },
        daily_marie: {
            text: "Marie : Achetez des mods Tektolyst, des arcanes et des ressources Perita/Descendia.",
            location: "La Cathédrale (Sanctum Anatomica, Deimos)",
            npc: "Marie",
            prereq: "L'Ancienne Paix",
        },

        // --- weekly ---
        weekly_nightwave_complete: { text: "Nightwave : Terminez les missions hebdomadaires Nightwave pertinentes." },
        weekly_nightwave_spend: { text: "Nightwave (dépenser) : Dépensez vos crédits Nightwave si nécessaire (mods d'Aura, Catalysts/Reactors, etc.)." },
        weekly_ayatan: {
            text: "Chasse au trésor Ayatan : Terminez la mission hebdomadaire de Maroo pour obtenir une sculpture Ayatan",
            location: "Le Bazar de Maroo, Mars",
            npc: "Maroo",
        },
        weekly_clem: {
            text: "Aider Clem : Aidez Clem dans sa survie hebdomadaire, sinon il mourra.",
            location: "N'importe quel Relais",
            npc: "Darvo",
            prereq: "Un Homme Peu Bavard",
        },
        weekly_kahl_garrison: {
            text: "Briser Narmer : Terminez la mission hebdomadaire de Kahl pour du Stock.",
            location: "Drifter's Camp, Terre",
            npc: "Kahl",
            prereq: "Brise-Voile",
        },
        weekly_archon_hunt: {
            text: "Chasse aux Archontes : Terminez la Chasse aux Archontes hebdomadaire pour obtenir un Fragment d'Archonte garanti.",
            location: "Base d'opérations",
            terminal: "Navigation",
            prereq: "La Nouvelle Guerre",
        },
        weekly_duviri_circuit: {
            text: "Duviri Circuit (normal) : Consultez les options de Warframe hebdomadaires et lancez le Circuit si vous le souhaitez.",
            location: "Base d'opérations/Dormizone",
            terminal: "Navigation",
            prereq: "Le Paradoxe Duviri",
        },
        weekly_duviri_circuit_sp: {
            text: "Duviri Circuit (Route de l'Acier) : Consultez les Incarnon Adapters hebdomadaires et lancez le Circuit si vous le souhaitez.",
            location: "Base d'opérations/Dormizone",
            terminal: "Navigation",
            prereq: "Route de l'Acier débloqué & Le Paradoxe Duviri",
        },
        weekly_search_pulses: { text: "Impulsions de Recherche : Utilisez vos 5 Impulsions de Recherche hebdomadaires sur les Netracells et les Archimédées." },
        weekly_netracells: {
            text: "Netracells : Terminez jusqu'à 5 missions Netracell hebdomadaires pour avoir des chances d'obtenir un Fragment d'Archonte.",
            location: "Sanctum Anatomica, Deimos",
            npc: "Tagfer",
            prereq: "Murmures dans les murs",
            info: "Coûte 1 Impulsion de Recherche par mission réussie",
        },
        weekly_eda: {
            text: "Archimédée Profonde : Tentez l'Archimédée d'Élite hebdomadaire pour de grandes chances d'obtenir un Fragment d'Archonte (réservé au endgame).",
            location: "Sanctum Anatomica, Deimos",
            npc: "Necraloid",
            prereq: "Rang 5 Cavia",
            info: "Coûte 2 Impulsions de Recherche pour le débloquer pour la semaine",
        },
        weekly_eta: {
            text: "Archimédée Temporelle : Tentez l'Archimédée d'Élite hebdomadaire pour de grandes chances d'obtenir un Fragment d'Archonte (réservé au endgame).",
            location: "Höllvania Central Mall",
            npc: "Kaya",
            prereq: "Rang 5 L'Hexagone",
            info: "Coûte 2 Impulsions de Recherche pour le débloquer pour la semaine",
        },
        weekly_calendar: {
            text: "Calendrier 1999 : Terminez les tâches hebdomadaires du calendrier.",
            location: "Base d'opérations",
            terminal: "POM-2 PC",
            prereq: "L'Hexagone",
        },
        weekly_invigorations: {
            text: "Helminth : Utilisez les Invigorations hebdomadaires.",
            location: "Base d'opérations",
            npc: "Helminth",
            prereq: "Rang 5 Entrati",
        },
        weekly_descendia: {
            text: "La Descendia (normal) : Mode de jeu hebdomadaire de la Tour pour diverses ressources.",
            location: "Ténèbres Réfractaires (Base d'opérations)",
            terminal: "Navigation",
        },
        weekly_descendia_sp: {
            text: "La Descendia (Route de l'Acier) : Mode de jeu hebdomadaire de la Tour pour diverses ressources.",
            location: "Ténèbres Réfractaires (Base d'opérations)",
            terminal: "Navigation",
        },
        weekly_vendors: { text: "Vendeurs" },
        weekly_iron_wake: {
            text: "Paladino : Échangez des Brisure Riven.",
            location: "Iron Wake, Terre",
            npc: "Paladino",
            prereq: "Le Fardeau de Harrow",
        },
        weekly_yonta: {
            text: "Archimédienne Yonta : Achetez du Kuva hebdomadaire avec des Plumes du Néant.",
            location: "Chrysalith, Zariman",
            npc: "Yonta",
            prereq: "Les Anges du Zariman",
        },
        weekly_acrithis: {
            text: "Acrithis : Consultez les marchandises et dépensez vos Pathos Clamps si vous le souhaitez (Catalysts/Reactors recommandés si besoin). Achetez du Kuva avec des Scuttler Husks.",
            location: "Duviri/Dormizone",
            npc: "Acrithis",
            prereq: "Le Paradoxe Duviri",
        },
        weekly_teshin: {
            text: "Teshin (Route de l'Acier) : Consultez la boutique Essence d'Acier de Teshin, notamment pour la rotation de Forma Umbra toutes les 8 semaines.",
            location: "N'importe quel Relais",
            npc: "Teshin",
            prereq: "Route de l'Acier débloqué",
        },
        weekly_bird3: {
            text: "Bird 3 : Achetez le Fragment d'Archonte hebdomadaire pour 30k de réputation Cavia.",
            location: "Sanctum Anatomica, Deimos",
            npc: "Bird 3",
            prereq: "Rang 5 Cavia",
        },
        weekly_nightcap: {
            text: "Nightcap : Échangez du Fergolyte contre du Kuva et une sculpture Ayatan.",
            location: "Fortuna, Vénus",
            npc: "Nightcap",
            prereq: "La Nouvelle Guerre",
        },
        weekly_zorba: {
            text: "Aspirant Zorba : Échangez de l'Atramentum contre du Kuva.",
            location: "N'importe quel Relais",
            npc: "Aspirant Zorba",
            prereq: "Le Fardeau de Harrow",
        },

        // --- other ---
        other_baro: {
            text: "Baro Ki'Teer : Consultez l'inventaire de Baro Ki'Teer et achetez les objets souhaités avec des Ducats (échangez des pièces Prime contre des Ducats).",
            location: "Relais avec le symbole",
            npc: "Baro Ki'Teer",
        },
        other_grandmother_tokens: {
            text: "Mend the Family : Achetez des Family Tokens auprès de Grandmother.",
            location: "Necralisk, Deimos",
            prereq: "Cœur de Deimos",
        },
        other_yonta_voidplumes: {
            text: "Échanger contre des Plumes du Néant",
            location: "Chrysalith, Zariman",
            npc: "Yonta",
            prereq: "Les Anges du Zariman",
        },
        other_loid_voca: {
            text: "Échanger contre des Voca",
            location: "Sanctum Anatomica, Deimos",
            npc: "Loid",
            prereq: "Murmures dans les murs",
        },
        other_glast: {
            text: "Armes Tenet : Consultez la boutique d'Ergo Glast pour de bons bonus de valence.",
            location: "N'importe quel Relais",
            npc: "Ergo Glast",
            prereq: "The Archwing + Palier de maîtrise 14",
        },
        other_eleanor: {
            text: "Armes Coda : Consultez la boutique d'Eleanor pour de bons bonus de valence.",
            location: "Höllvania Central Mall",
            npc: "Eleanor Nightingale",
            prereq: "L'Hexagone (Quête)",
        },
    },

    cycles: {
        // column names
        "Item": "Objet",
        "Tileset": "Tileset",
        "Boss": "Boss",
        "Season": "Saison",
        "Mission": "Mission",
        "Price": "Prix",
        "Location": "Lieu",
        "Increased Spawns": "Apparitions accrues",
        "Items": "Objets",
        "Coda Weapons": "Armes Coda",

        // weekly_ayatan tileset
        "Orokin Derelict (Deimos)": "Épave orokin (Deimos)",
        "Orokin Tower (Void)": "Tour orokin (Le Néant)",

        // weekly_kahl_garrison tileset
        "Spaceport (Orb Vallis, Venus)": "Spatioport (Orb Vallis, Vénus)",
        "Grineer Forest (Earth)": "Forêt grineer (Terre)",

        // weekly_archon_hunt tilesets
        "Grineer Settlement (Mars)": "Colonie grineer (Mars)",
        "Corpus Gas City (Jupiter)": "Cité gazière corpus (Jupiter)",

        // weekly_duviri_circuit items
        "Blueprints for Excalibur, Trinity, or Ember": "Plans pour Excalibur, Trinity ou Ember",
        "Blueprints for Loki, Mag, or Rhino": "Plans pour Loki, Mag ou Rhino",
        "Blueprints for Ash, Frost, or Nyx": "Plans pour Ash, Frost ou Nyx",
        "Blueprints for Saryn, Vauban, or Nova": "Plans pour Saryn, Vauban ou Nova",
        "Blueprints for Nekros, Valkyr, or Oberon": "Plans pour Nekros, Valkyr ou Oberon",
        "Blueprints for Hydroid, Mirage, or Limbo": "Plans pour Hydroid, Mirage ou Limbo",
        "Blueprints for Mesa, Chroma, or Atlas": "Plans pour Mesa, Chroma ou Atlas",
        "Blueprints for Ivara, Inaros, or Titania": "Plans pour Ivara, Inaros ou Titania",
        "Blueprints for Nidus, Octavia, or Harrow": "Plans pour Nidus, Octavia ou Harrow",
        "Blueprints for Gara, Khora, or Revenant": "Plans pour Gara, Khora ou Revenant",
        "Blueprints for Garuda, Baruuk, or Hildryn": "Plans pour Garuda, Baruuk ou Hildryn",

        // weekly_duviri_circuit_sp items
        "Incarnon Adapters for Braton, Kunai, Lato, Paris, and Skana": "Incarnon Adapters pour Braton, Kunai, Lato, Paris et Skana",
        "Incarnon Adapters for Angstrum, Anku, Boar, Gammacor, and Gorgon": "Incarnon Adapters pour Angstrum, Anku, Boar, Gammacor et Gorgon",
        "Incarnon Adapters for Bo, Furax, Furis, Latron, and Strun": "Incarnon Adapters pour Bo, Furax, Furis, Latron et Strun",
        "Incarnon Adapters for Boltor, Bronco, Ceramic Dagger, Lex, and Magistar": "Incarnon Adapters pour Boltor, Bronco, Ceramic Dagger, Lex et Magistar",
        "Incarnon Adapters for Atomos, Dual Ichor, Dual Toxocyst, Miter, and Torid": "Incarnon Adapters pour Atomos, Dual Ichor, Dual Toxocyst, Miter et Torid",
        "Incarnon Adapters for Ack & Brunt, Burston, Nami Solo, Soma, and Vasto": "Incarnon Adapters pour Ack & Brunt, Burston, Nami Solo, Soma et Vasto",
        "Incarnon Adapters for Despair, Dread, Hate, Sibear, and Zylok": "Incarnon Adapters pour Despair, Dread, Hate, Sibear et Zylok",
        "Incarnon Adapters for Cestra, Dera, Okina, Sicarus, and Sybaris": "Incarnon Adapters pour Cestra, Dera, Okina, Sicarus et Sybaris",

        // weekly_calendar seasons
        "Winter": "Hiver",
        "Spring": "Printemps",
        "Summer": "Été",
        "Autumn": "Automne",

        // weekly_calendar increased spawns (keep emoji, translate eximus type)
        "❄️ Arctic Eximus": "❄️ Eximus Arctique",
        "🟢 Jade Light Eximus": "🟢 Eximus Lumière de Jade",
        "🔥 Arson Eximus": "🔥 Eximus Incendiaire",
        "🧲 Energy Leech Eximus": "🧲 Eximus Sangsue d'Énergie",

        // weekly_teshin items
        "Umbra Forma Blueprint": "Forma Umbra (Schéma)",
        "50,000 Kuva": "50 000 Kuva",
        "Kitgun Riven Mod": "Mod Riven de Kitgun",
        "3x Built Forma": "3 Forma fabriqués",
        "Zaw Riven Mod": "Mod Riven de Zaw",
        "30,000 Endo": "30 000 Endo",
        "Rifle Riven Mod": "Mod Riven de Fusil",
        "Shotgun Riven Mod": "Mod Riven de Fusil à Pompe",

        // other_baro locations
        "Strata Relais, Earth": "Relais Strata, Terre",
        "Larunda Relais, Mercury": "Relais Larunda, Mercure",
        "Kronia Relais, Saturn": "Relais Kronia, Saturne",
        "Orcus Relais, Pluto (MR 8+)": "Relais Orcus, Pluton (PM 8+)",
    },

    moreInfo: {
        daily_first_win_bonus: `<p>Votre première mission terminée après la réinitialisation quotidienne octroie le double des <em>crédits de base récompensés</em>. Cela ne s'applique qu'au bonus de fin de mission, et <strong>non</strong> aux crédits ramassés pendant la mission.</p>
    <p>Cela ne s'applique <strong>pas</strong> non plus aux types de mission et lieux suivants :</p>
    <ul>
        <li><strong>The Index</strong></li>
        <li>Mondes ouverts (y compris Profit Taker)</li>
        <li>Zariman</li>
        <li>Höllvania (y compris les coffres Techrot)</li>
    </ul>
    <p>Terminer l'une de ces missions consommera le bonus sans octroyer de crédits supplémentaires.</p>
    <p>Le bonus <strong>se cumule</strong> avec les Credit Boosters, les Credit Blessings et les événements à crédits doublés. Se rendre dans un Relais ou une autre zone hors mission ne consomme <strong>pas</strong> le bonus.</p>
    <p>Voici quelques bonnes missions pour l'utiliser :</p>
    <table>
        <thead><tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Crédits de base</th>
            <th>Niveau ennemi</th>
        </tr></thead>
        <tbody>
            <tr>
                <td>Tikal, Terre</td>
                <td>Dark Sector Excavation</td>
                <td>13 500</td>
                <td>6 - 16</td>
            </tr>
            <tr>
                <td>Gabii, Cérès</td>
                <td>Dark Sector Survival</td>
                <td>22 400</td>
                <td>15 - 25</td>
            </tr>
            <tr>
                <td>Bendar Cluster, Terre Proxima</td>
                <td>Railjack Skirmish</td>
                <td>48 800</td>
                <td>29 - 36</td>
            </tr>
            <tr>
                <td>Sabmir Cloud, Voile Proxima</td>
                <td>Railjack Spy</td>
                <td>156 600</td>
                <td>56 - 60</td>
            </tr>
        </tbody>
    </table>
    <p>Consultez <a href="https://wiki.warframe.com/w/Daily_Tribute#Daily_First_Win_Bonus">Daily First Win Bonus</a>, <a href="https://wiki.warframe.com/w/Dark_Sectors">Dark Sectors</a> et <a href="https://wiki.warframe.com/w/Mission#Locations">Mission</a> sur le wiki pour plus de détails.</p>
    <p>(Il existe actuellement un bug visuel où les crédits bonus n'apparaissent pas sur l'écran de fin de mission. Ils <em>sont</em> toutefois bien ajoutés à votre compte.)</p>`,

        daily_syndicate_gain: factions,
        daily_syndicate_spend: factions,
    },
};
