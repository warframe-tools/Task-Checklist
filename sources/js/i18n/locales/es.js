// --- sources/js/i18n/locales/es.js ---
// Español — translation scaffold. Every value is empty ("") and falls back to
// en.js / the source data until filled in (see ../i18n.js). Fill strings in place;
// leaving a value "" keeps the English default, so partial translations are safe.
//
// Plantilla de traducción. Cada valor está vacío ("") y recurre a en.js / los datos
// de origen hasta que se rellena (consulta ../i18n.js). Escribe las cadenas aquí;
// dejar un valor "" mantiene el texto en inglés, así que las traducciones parciales son seguras.

export default {
    meta: { code: "es", label: "Español", htmlLang: "es" },

    ui: {
        "document.title": "",
        "app.title": "",
        "app.description": "",

        // aria-labels
        "aria.toggleTheme": "",
        "aria.openMenu": "",
        "aria.closeError": "",
        "aria.closeMenu": "",
        "aria.closeSchedule": "",
        "aria.selectLanguage": "",

        // language switcher
        "lang.helpTranslate": "",

        // error display banner
        "error.copy": "",
        "error.copied": "",
        "error.failed": "",

        // task sections
        "section.daily": "",
        "section.weekly": "",
        "section.other": "",
        "section.hide": "",

        // reset / countdown timers ({timer} is the highlighted countdown span)
        "countdown.resetEllipsis": "",
        "countdown.loading": "",
        "countdown.resetsInTimer": "",
        "countdown.availableForTimer": "",
        "countdown.availableInTimer": "",
        "countdown.dailyFallback": "",
        "countdown.weeklyFallback": "",

        // save status
        "save.saved": "",
        "save.loading": "",
        "save.storageNotice": "",
        "save.lastSaved": "",
        "save.never": "",

        "reminder": "",

        // footer
        "footer.appVersion": "",
        "footer.warframeVersion": "",
        "footer.license": "",
        "footer.disclaimer": "",

        // options menu + reset confirmation buttons
        "menu.options": "",
        "menu.resetDaily": "",
        "menu.resetWeekly": "",
        "menu.resetAll": "",
        "menu.unhideAll": "",
        "menu.confirm": "",

        // cycle schedule dialog
        "schedule.for": "",
        "schedule.date": "",
        "schedule.now": "",
        "schedule.cycleRepeats": "",

        // info line (labels are icon tooltips; buttons use &nbsp; to avoid wrapping)
        "info.location": "",
        "info.npc": "",
        "info.terminal": "",
        "info.requirements": "",
        "info.info": "",
        "info.showSchedule": "",
        "info.moreInfo": "",

        // current-cycle prefixes (rendered as HTML; &nbsp; keeps them on one line)
        "cycle.thisWeek": "",
        "cycle.today": "",
        "cycle.currentCycle": "",
        "cycle.nextCycle": "",

        "baseOfOperations.label": "",
        "baseOfOperations.tooltip": "",

        // desktop notifications + permission prompts
        "notif.toggleFor": "",
        "notif.hideTask": "",
        "notif.leavingSoonTitle": "",
        "notif.leavingSoonBody": "",
        "notif.resetTitle": "",
        "notif.resetBody": "",
        "notif.noSupport": "",
        "notif.denied": "",
        "notif.deniedPersist": "",

        // save/load/startup errors
        "errors.saveFailed": "",
        "errors.saveFailedQuota": "",
        "errors.loadFailed": "",
        "errors.themeSaveFailed": "",
        "errors.critical": "",
    },

    tasks: {
        // --- daily ---
        daily_login: { text: "" },
        daily_craft_forma: { text: "", location: "", terminal: "" },
        daily_craft_other: { text: "", location: "", terminal: "" },
        daily_first_win_bonus: { text: "", location: "", terminal: "" },
        daily_syndicate_gain: { text: "", prereq: "", info: "" },
        daily_syndicate_spend: { text: "", location: "", terminal: "", prereq: "" },
        daily_world_syndicate_parent: { text: "" },
        daily_world_syndicate_simaris: { text: "", location: "" },
        daily_world_syndicate_ostron: { text: "", location: "", prereq: "" },
        daily_world_syndicate_quills: { text: "", location: "", prereq: "" },
        daily_world_syndicate_solaris: { text: "", location: "", prereq: "" },
        daily_world_syndicate_vox: { text: "", location: "", prereq: "" },
        daily_world_syndicate_ventkids: { text: "", location: "", prereq: "" },
        daily_world_syndicate_entrati: { text: "", location: "", prereq: "" },
        daily_world_syndicate_necraloid: { text: "", location: "", prereq: "" },
        daily_world_syndicate_holdfasts: { text: "", location: "", prereq: "" },
        daily_world_syndicate_cavia: { text: "", location: "", prereq: "" },
        daily_world_syndicate_hex: { text: "", location: "", prereq: "" },
        daily_sortie: { text: "", location: "", terminal: "", prereq: "" },
        daily_focus: { text: "", prereq: "" },
        daily_steel_path: { text: "", prereq: "" },
        daily_kim_parent: { text: "", location: "", terminal: "" },
        daily_kim_hex_parent: { text: "", prereq: "" },
        daily_kim_arthur: { text: "" },
        daily_kim_eleanor: { text: "" },
        daily_kim_lettie: { text: "" },
        daily_kim_amir: { text: "" },
        daily_kim_aoi: { text: "" },
        daily_kim_quincy: { text: "" },
        daily_kim_roundtable_parent: { text: "", prereq: "" },
        daily_kim_flare: { text: "", prereq: "" },
        daily_kim_minerva_velimir: { text: "", prereq: "" },
        daily_kim_kaya: { text: "", prereq: "" },
        daily_kim_devils_triad_parent: { text: "", prereq: "" },
        daily_kim_marie: { text: "" },
        daily_kim_roathe: { text: "" },
        daily_kim_lyon: { text: "", prereq: "" },
        daily_vendors: { text: "" },
        daily_acrithis: { text: "", location: "", npc: "", prereq: "" },
        daily_ticker_crew: { text: "", location: "", npc: "", prereq: "" },
        daily_marie: { text: "", location: "", npc: "", prereq: "" },

        // --- weekly ---
        weekly_nightwave_complete: { text: "" },
        weekly_nightwave_spend: { text: "" },
        weekly_ayatan: { text: "", location: "", npc: "" },
        weekly_clem: { text: "", location: "", npc: "", prereq: "" },
        weekly_kahl_garrison: { text: "", location: "", npc: "", prereq: "" },
        weekly_archon_hunt: { text: "", location: "", terminal: "", prereq: "" },
        weekly_duviri_circuit: { text: "", location: "", terminal: "", prereq: "" },
        weekly_duviri_circuit_sp: { text: "", location: "", terminal: "", prereq: "" },
        weekly_search_pulses: { text: "" },
        weekly_netracells: { text: "", location: "", npc: "", prereq: "", info: "" },
        weekly_eda: { text: "", location: "", npc: "", prereq: "", info: "" },
        weekly_eta: { text: "", location: "", npc: "", prereq: "", info: "" },
        weekly_calendar: { text: "", location: "", terminal: "", prereq: "" },
        weekly_invigorations: { text: "", location: "", npc: "", prereq: "" },
        weekly_descendia: { text: "", location: "", terminal: "" },
        weekly_descendia_sp: { text: "", location: "", terminal: "" },
        weekly_vendors: { text: "" },
        weekly_iron_wake: { text: "", location: "", npc: "", prereq: "" },
        weekly_yonta: { text: "", location: "", npc: "", prereq: "" },
        weekly_acrithis: { text: "", location: "", npc: "", prereq: "" },
        weekly_teshin: { text: "", location: "", npc: "", prereq: "" },
        weekly_bird3: { text: "", location: "", npc: "", prereq: "" },
        weekly_nightcap: { text: "", location: "", npc: "", prereq: "" },
        weekly_zorba: { text: "", location: "", npc: "", prereq: "" },

        // --- other ---
        other_baro: { text: "", location: "", npc: "" },
        other_grandmother_tokens: { text: "", location: "", prereq: "" },
        other_yonta_voidplumes: { text: "", location: "", npc: "", prereq: "" },
        other_loid_voca: { text: "", location: "", npc: "", prereq: "" },
        other_glast: { text: "", location: "", npc: "", prereq: "" },
        other_eleanor: { text: "", location: "", npc: "", prereq: "" },
    },

    cycles: {
        // column names
        "Item": "",
        "Tileset": "",
        "Boss": "",
        "Season": "",
        "Mission": "",
        "Price": "",
        "Location": "",
        "Increased Spawns": "",
        "Items": "",
        "Coda Weapons": "",

        // weekly_ayatan items
        "Ayatan Sah Sculpture": "",
        "Ayatan Ayr Sculpture": "",
        "Ayatan Orta Sculpture": "",
        "Ayatan Vaya Sculpture": "",
        "Ayatan Piv Sculpture": "",
        "Ayatan Valana Sculpture": "",

        // weekly_ayatan tileset
        "Orokin Derelict (Deimos)": "",
        "Orokin Tower (Void)": "",

        // weekly_kahl_garrison mission
        "Sneaky Sabotage": "",
        "Junk Run": "",
        "Prison Break": "",

        // weekly_kahl_garrison tileset
        "Spaceport (Orb Vallis, Venus)": "",
        "Grineer Forest (Earth)": "",
        "Murex": "",

        // weekly_archon_hunt items
        "Azure Archon Shard": "",
        "Crimson Archon Shard": "",
        "Amber Archon Shard": "",

        // weekly_archon_hunt bosses
        "🦉 Archon Boreal": "",
        "🐺 Archon Amar": "",
        "🐍 Archon Nira": "",

        // weekly_archon_hunt tilesets
        "Grineer Settlement (Mars)": "",
        "Corpus Gas City (Jupiter)": "",

        // weekly_duviri_circuit items
        "Blueprints for Excalibur, Trinity, or Ember": "",
        "Blueprints for Loki, Mag, or Rhino": "",
        "Blueprints for Ash, Frost, or Nyx": "",
        "Blueprints for Saryn, Vauban, or Nova": "",
        "Blueprints for Nekros, Valkyr, or Oberon": "",
        "Blueprints for Hydroid, Mirage, or Limbo": "",
        "Blueprints for Mesa, Chroma, or Atlas": "",
        "Blueprints for Ivara, Inaros, or Titania": "",
        "Blueprints for Nidus, Octavia, or Harrow": "",
        "Blueprints for Gara, Khora, or Revenant": "",
        "Blueprints for Garuda, Baruuk, or Hildryn": "",

        // weekly_duviri_circuit_sp items
        "Incarnon Adapters for Braton, Kunai, Lato, Paris, and Skana": "",
        "Incarnon Adapters for Angstrum, Anku, Boar, Gammacor, and Gorgon": "",
        "Incarnon Adapters for Bo, Furax, Furis, Latron, and Strun": "",
        "Incarnon Adapters for Boltor, Bronco, Ceramic Dagger, Lex, and Magistar": "",
        "Incarnon Adapters for Atomos, Dual Ichor, Dual Toxocyst, Miter, and Torid": "",
        "Incarnon Adapters for Ack & Brunt, Burston, Nami Solo, Soma, and Vasto": "",
        "Incarnon Adapters for Despair, Dread, Hate, Sibear, and Zylok": "",
        "Incarnon Adapters for Cestra, Dera, Okina, Sicarus, and Sybaris": "",

        // weekly_calendar seasons
        "Winter": "",
        "Spring": "",
        "Summer": "",
        "Autumn": "",

        // weekly_calendar increased spawns (keep emoji, translate eximus type)
        "❄️ Arctic Eximus": "",
        "🟢 Jade Light Eximus": "",
        "🔥 Arson Eximus": "",
        "🧲 Energy Leech Eximus": "",

        // weekly_teshin items
        "Umbra Forma Blueprint": "",
        "50,000 Kuva": "",
        "Kitgun Riven Mod": "",
        "3x Built Forma": "",
        "Zaw Riven Mod": "",
        "30,000 Endo": "",
        "Rifle Riven Mod": "",
        "Shotgun Riven Mod": "",

        // other_baro locations
        "Strata Relay, Earth": "",
        "Larunda Relay, Mercury": "",
        "Kronia Relay, Saturn": "",
        "Orcus Relay, Pluto (MR 8+)": "",

        // other_eleanor coda weapons
        "Hema, Sporothrix, Catabolyst, Pox, Dual Torxica, Mire, and Motovore": "",
        "Bassocyst, Bubonico, Synapse, Tysis, Caustacyst, Hirudo, and Pathocyst": "",
    },

    moreInfo: {
        daily_first_win_bonus: "",
        daily_syndicate_gain: "",
        daily_syndicate_spend: "",
    },
};
