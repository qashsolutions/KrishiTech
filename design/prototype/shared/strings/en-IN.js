/* KrishiTech onboarding prototype — en-IN (pre-login default, display-only post-login).
   This file is the key reference for all locales. UI strings only — no agronomic copy.
   Format mirrors a future packs/languages/ UI-strings section; review then port. */
window.KT_STRINGS = window.KT_STRINGS || {};
window.KT_STRINGS["en-IN"] = {
  meta: { code: "en-IN", scriptClass: "lang-en", reviewed: true },
  common: {
    continue_: "Continue",
    back: "Back",
    notNow: "Not now",
    retry: "Try again",
    listen: "Listen",
    hearAgain: "Hear it again",
    speaking: "Speaking…",
    noSignal: "No signal",
    change: "Change",
    done: "Done",
    micLabel: "Speak",
    needsSignal: "This needs a signal. Try when connected.",
    navHome: "Home",
    navCrop: "Crop",
    navHistory: "History",
    navMore: "More",
    packPending: "This comes from the agronomist-approved crop pack — it is never generated."
  },
  s01: {
    choose: "Choose your language",
    tagline: "Help for your farm, in your words",
    longpress: "Touch and hold to hear a language"
  },
  s02: {
    title: "Your phone number",
    helper: "We'll send a 6-digit code to this number by SMS",
    field: "Phone number",
    errShort: "This number needs 10 digits",
    errSend: "The code couldn't be sent. Try again.",
    loading: "Sending your code…",
    offline: "Signing in needs a signal. Move where there is signal and try again."
  },
  s03: {
    title: "Enter the code",
    helper: "Sent by SMS to",
    resend: "Send a new code",
    loading: "Checking your code…",
    errWrong: "That code didn't match. Check the SMS or send a new one.",
    offline: "Checking the code needs a signal. Try again when connected."
  },
  s04: {
    title: "Before we begin",
    p1: "Your farm details belong to you. We keep them safe to help you.",
    p2: "A dealer sees your problem only if you say yes.",
    p3: "You can hear, change, or delete everything — any time.",
    listen: "Hear this in your language",
    terms: "Full terms",
    privacy: "Privacy policy",
    agree: "I agree — continue",
    err: "Your consent couldn't be saved. Try again.",
    offline: "Saving your consent needs a signal. Try again when connected."
  },
  s05: {
    loading: "Setting up your account…",
    singleTitle: "You're set as a farmer",
    singleBody: "Everything you see here is built for your farm.",
    multiTitle: "How will you use KrishiTech today?",
    roleFarmer: "Farmer",
    roleFarmerSub: "My crops and fields",
    roleDealer: "Dealer",
    roleDealerSub: "My shop and customers",
    roleFpo: "FPO",
    roleFpoSub: "My member farmers",
    offline: "Setting up needs a signal. Try again when connected.",
    err: "Setup didn't finish. Try again."
  },
  s06: {
    title: "KrishiTech asks for these",
    helper: "Each one helps in the field. You can skip any of them.",
    micName: "Microphone",
    micWhy: "Speak instead of typing",
    camName: "Camera",
    camWhy: "Photograph a plant problem",
    locName: "Location",
    locWhy: "Find your field and its weather",
    notifName: "Notifications",
    notifWhy: "Weather warnings and reminders",
    allow: "Allow",
    granted: "Allowed",
    skipped: "Skipped",
    deniedTitle: "Location is off",
    deniedBody: "Nothing is blocked. You can pick your district by hand instead."
  },
  s07: {
    title: "Lock the app with your fingerprint?",
    body: "Then only you can open it. Works without signal.",
    use: "Use fingerprint",
    unavailable: "This phone has no fingerprint lock. Skip this — nothing is lost."
  },
  f01: {
    title: "Add your field",
    name: "What do you call this field?",
    nameHint: "Like: the field near the well",
    area: "How big is it?",
    unitGuntha: "guntha",
    unitCent: "cent",
    unitAcre: "acre",
    save: "Save field",
    queuedTitle: "Saved on your phone",
    queuedBody: "It will send by itself when the signal returns. Keep going."
  },
  f02: {
    title: "Where is this field?",
    gps: "Use my location",
    manualLink: "Pick district by hand",
    loading: "Finding where you are…",
    pin: "Pin is set. Drag it if it's off.",
    manualTitle: "Pick your district",
    district: "District",
    village: "Village",
    deniedBody: "Location is off. Picking your district by hand works just as well.",
    offlineBody: "The map can't load without signal. Pick your district — that works.",
    confirm: "This is the place"
  },
  f03: {
    title: "What grows in this field?",
    prompt: "Tap the mic. Say the crop and the sowing day.",
    listening: "Listening…",
    orTap: "Or tap to choose",
    crop: "Crop",
    variety: "Variety",
    varietyHint: "Write it if you know it",
    date: "Sowing date",
    cropChilli: "Chilli",
    cropTomato: "Tomato",
    cropOkra: "Okra",
    sampleDate: "12 Aug",
    readbackTitle: "Please check",
    readbackBody: "You said: {crop}, sown on {date}.",
    readbackOk: "That's right",
    readbackAgain: "Say it again"
  },
  f04: {
    title: "Setting this up for someone else?",
    body: "This account belongs to the farmer. Your help is written down — the farm's record will show who set it up.",
    ack: "Understood — continue"
  },
  f05: {
    title: "All set!",
    body: "The field is saved. One useful thing for right now:",
    tipPending: "The first tip appears here once the agronomist's approved crop pack is ready.",
    loading: "Getting your first tip…",
    offlineBody: "Your tip will arrive when the signal returns. Everything else is saved.",
    done: "See my crop"
  },
  f10: {
    loading: "Getting your farm ready…",
    offline: "No signal. Showing what's saved on your phone.",
    savedAge: "Saved yesterday evening",
    myCrop: "My crop",
    weather: "Weather",
    report: "Report a problem",
    ask: "Ask KrishiTech"
  },
  f11: {
    title: "Crop timeline",
    sown: "Sown {date}",
    stageNow: "Stage now",
    nextTasks: "Next three tasks"
  },
  f12: {
    title: "Task",
    what: "What to do",
    why: "Why it matters",
    when: "When",
    how: "How"
  },
  f13: {
    title: "Weather",
    decisionTitle: "What this means for your field",
    forecastTitle: "The forecast",
    updated: "Updated today at 6:05",
    stale: "This forecast is from yesterday evening.",
    offlineBody: "No signal. This forecast is from yesterday evening.",
    loading: "Getting the forecast…",
    error: "The forecast couldn't load. Try again.",
    today: "Today",
    tomorrow: "Tomorrow",
    day3: "Wednesday",
    day4: "Thursday",
    rain: "rain"
  },
  f14: {
    title: "Your fields",
    add: "Add a field",
    single: "You have one field. Add the next one when you're ready.",
    sample1: "Field near the well",
    sample2: "Atmakur field",
    selected: "Selected"
  },
  f20: {
    title: "Report a problem",
    step1: "Photo 1 — the whole plant",
    step2: "Photo 2 — the affected part",
    step3: "Photo 3 — under the leaf",
    shutter: "Take the photo",
    skipStep: "Skip this photo",
    review: "Check the photos",
    deniedTitle: "Camera is off",
    deniedBody: "Photos help the answer. Allow the camera, or describe the problem by voice instead."
  },
  f21: {
    title: "Check the photos",
    helper: "A blurry photo makes the answer worse. Retake any that look bad.",
    retake: "Retake",
    remove: "Remove",
    emptyTitle: "No photos left",
    emptyBody: "Take at least one photo, or describe the problem by voice.",
    toCamera: "Take photos again"
  },
  f22: {
    title: "Tell us what you see",
    prompt: "Tap the mic. Describe the problem in your own words.",
    transcriptLabel: "What you said",
    sample: "The chilli leaves are curling up, and there are small insects underneath. I sprayed last week but it's the same.",
    toEnglish: "Show in English",
    englishSample: "The chilli leaves are curling up, and there are small insects underneath. I sprayed last week but it is the same.",
    blockedTitle: "We can't use that recording",
    blockedBody: "Some words can't be sent. Nothing is deleted — please describe the plant problem again."
  },
  f23a: {
    title: "Did we get it right?",
    helper: "We understood it like this:",
    whereLabel: "Where on the plant",
    whereVal: "On the leaves, underneath",
    symptomLabel: "What's happening",
    symptomVal: "Leaves curling; small insects",
    loading: "Understanding what you said…",
    offline: "Checking your words needs a signal. Your recording is saved on the phone."
  },
  f23: {
    sentTitle: "Sent!",
    sentBody: "We'll speak when the answer is ready. You can keep working.",
    queuedBody: "The photos and your words are saved. They will send when the signal returns.",
    whatNext: "What happens next",
    nextBody: "KrishiTech looks at the photos. If something is unclear, it asks you one question."
  },
  f24: {
    title: "One question",
    q: "Are the small insects on the underside of the leaves?",
    yes: "Yes",
    no: "No",
    dontKnow: "I'm not sure",
    offline: "Questions and answers need a signal. Try when connected."
  },
  f25: {
    title: "The answer",
    sevUrgent: "Act now",
    sevCaution: "Watch this",
    healthyTitle: "Nothing serious found",
    healthyBody: "The plant looks healthy in these photos. If something changes, send new photos.",
    confLabel: "How sure we are",
    conf3: "Very sure",
    conf2: "Fairly sure",
    conf1: "Not sure",
    lowConfBody: "We are not sure about this one. A person can look at it.",
    askExpert: "Ask an expert",
    secWhat: "What it is",
    secWhy: "Why it happened",
    secWhen: "When to act",
    secDose: "How much to use",
    secPrec: "Be careful",
    secAlt: "Other options",
    gotIt: "Got it — I'll do it",
    loading: "Looking at your photos…",
    offline: "The answer needs a signal. Your case is saved and will send when connected."
  },
  f26: {
    title: "It's one of these two",
    helper: "The photos match two problems. Here is how to tell them apart.",
    optA: "Possibility 1",
    optB: "Possibility 2",
    howToTell: "How to tell",
    retakeCta: "Take one more photo"
  },
  f27: {
    title: "A person is looking",
    body: "Your case is with an expert. You don't need to do anything now.",
    eta: "Answer expected by this evening",
    notify: "We'll ring and speak when it's ready.",
    offlineNote: "No signal — status last checked this morning.",
    backHome: "Back to home"
  },
  f28: {
    title: "Where to get it",
    helper: "Dealers near you who stock this kind of remedy. Shown only after your answer is final.",
    hasStock: "In stock"
  },
  f29: {
    title: "Did you do it?",
    helper: "Last time we suggested a treatment. One tap:",
    didIt: "I did it",
    skipped: "I didn't",
    later: "I'll do it later",
    queuedBody: "Your answer is saved. It will send when the signal returns."
  },
  f30: {
    title: "How is the plant now?",
    better: "Better",
    same: "The same",
    worse: "Worse",
    doneTitle: "Noted — thank you",
    doneBody: "This helps the advice get better for everyone."
  },
  f40: {
    prompt: "Ask anything about your farm. Tap the mic and speak.",
    sampleQ: "It looks like rain. Can I spray tomorrow morning?",
    englishQ: "It looks like rain. Can I spray tomorrow morning?",
    yourQ: "Your question",
    send: "Get the answer",
    offline: "Asking needs a signal. Saved answers stay in History."
  },
  f41: {
    loading: "Finding your answer…",
    offline: "No signal. You can hear this saved answer again; new questions need signal.",
    askAnother: "Ask another question"
  },
  f42: {
    emptyTitle: "Nothing here yet",
    emptyBody: "When you report a problem or ask a question, it is saved here.",
    date2: "28 Jul",
    case2: "Spots on tomato leaves",
    statusOpen: "In progress"
  },
  f43: {
    title: "Case",
    photos: "Photos",
    advised: "What was advised",
    happened: "What happened"
  },
  f50: {
    title: "My images",
    used7: "7 of 10 slots used",
    used10: "10 of 10 — full",
    longpress: "Touch and hold a photo to hear about it",
    freeUp: "Free up space",
    buyMore: "Buy more slots"
  },
  f51: {
    title: "Space is full",
    body: "Your new photos are safe. To keep them, free 3 old images — or buy more space.",
    delete3: "Choose 3 to delete"
  },
  f52: {
    title: "Choose what to delete",
    helper: "The oldest are already picked. Change them if you want.",
    keepNote: "The full photo goes; a small copy stays in the case history.",
    deleteN: "Delete 3 photos",
    confirmTitle: "Delete these 3?",
    noUndo: "This cannot be undone.",
    confirmBtn: "Yes, delete",
    doneMsg: "Deleted. 3 slots free."
  },
  f53: {
    title: "Buy image space",
    offerName: "500 slots",
    payNote: "Paid safely through Google Play.",
    buyBtn: "Buy with Google Play",
    offline: "Buying needs a signal. Try when connected."
  },
  s20: { title: "Settings" },
  s21: {
    title: "Language",
    engDefault: "Show transcripts in English",
    engNote: "Off unless you turn it on. You can also switch it on any transcript.",
    packNote: "Changing language may download that language's pack — needs signal.",
    offline: "No signal — the new language pack can't download now. Your current language keeps working."
  },
  s22: {
    title: "Region & district",
    helper: "Correct what GPS guessed."
  },
  s23: {
    title: "Theme",
    day: "Day",
    night: "Night",
    system: "Follow the phone",
    lightOnly: "For farmers this app stays in day mode for now — it reads best in sunlight."
  },
  s24: {
    title: "Profile",
    name: "Name",
    sampleName: "Ramu"
  },
  s25: {
    title: "Security",
    bio: "Fingerprint lock"
  },
  s26: {
    title: "Notifications & quiet hours",
    tWeather: "Weather warnings",
    tTasks: "Task reminders",
    tExpert: "Expert replies",
    quiet: "Quiet hours",
    quietVal: "9 pm – 6 am",
    quietNote: "No rings or spoken alerts in these hours."
  },
  s27: {
    title: "Data & privacy",
    improve: "Help improve advice for other farmers",
    improveNote: "Your cases help train better advice. Off unless you say yes — never tied to any paid feature."
  },
  s28: { title: "Storage & plan" },
  s29: {
    title: "Get my data",
    body: "We prepare a file of everything KrishiTech holds about you — cases, fields, answers — and tell you when it's ready.",
    request: "Prepare my file",
    requested: "We're preparing it. We'll ring and tell you when it's ready — usually within a day."
  },
  s30: {
    title: "Delete my account",
    body: "Everything goes — your fields, cases, photos and answers. This cannot be undone.",
    start: "Delete everything",
    confirmHelp: "To finish, say it aloud — or tap the red button.",
    webNote: "Also available on the website: [DELETION URL]"
  },
  s31: {
    title: "Terms & policies",
    content: "Content policy"
  },
  s32: {
    title: "About",
    version: "Version",
    licences: "Open-source licences"
  },
  s40: {
    title: "Feedback",
    prompt: "Speak or type. It goes straight to the team.",
    attached: "Sent along automatically",
    send: "Send"
  },
  s41: {
    title: "Help",
    helper: "Short clips — tap to hear.",
    c2: "How to hear an answer again",
    c3: "Photos and space",
    support: "Feeling overwhelmed? Talk to someone"
  },
  s42: {
    title: "Support",
    body: "Talking helps. This line is free, open day and night, and speaks your language.",
    call: "Call 14416"
  },
  d: {
    navDemand: "Demand",
    navLeads: "Leads",
    navCounter: "Counter",
    name2: "Lakshmi",
    name3: "Suresh",
    name4: "Anita"
  },
  d01: {
    title: "Catchment",
    statFarmers: "Farmers",
    statProblems: "Active problems",
    statVillages: "Villages",
    cropSplit: "Crops in your catchment",
    stages: "Stages and problems"
  },
  d02: {
    title: "Demand forecast",
    window: "Next 14 days, by intervention class"
  },
  d03: {
    consented: "Shared with consent",
    reason: "Why this lead",
    emptyBody: "No consented leads right now. Leads appear when a farmer says yes to sharing."
  },
  d04: {
    title: "Lead",
    rec: "Recommendation",
    stock: "What to stock"
  },
  d05: {
    lookup: "Walk-in farmer — enter their number",
    search: "Look up",
    current: "Current recommendation",
    consentNote: "The farmer agreed to this when they joined your group. They can see every lookup and switch it off any time.",
    cacheNote: "Works offline for 7 days from the last sync."
  },
  d06: {
    title: "Log order",
    product: "Product",
    qty: "Quantity",
    save: "Save order"
  },
  d07: {
    title: "Stock",
    gap: "May run short",
    gapNote: "Based on the 14-day forecast."
  },
  p: {
    navMembers: "Members",
    navAlerts: "Alerts"
  },
  p01: {
    readOnly: "View only in this version"
  },
  p02: {
    title: "Crop map"
  },
  p03: {
    title: "Cluster alerts",
    spread1: "6 members · 3 villages",
    spread2: "3 members · 1 village",
    emptyBody: "No cluster alerts. That's good news."
  },
  p04: {
    title: "Alert",
    affected: "Affected members",
    response: "Coordinated response",
    notify: "Notify members"
  }
};
