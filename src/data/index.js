export const CHANNELS = {
  quote:  { code: "q", letter: "Q", name: "Quotes",   color: "#b6433d", bg: "#fdecec" },
  order:  { code: "o", letter: "O", name: "Orders",   color: "#2d7a52", bg: "#e7f4ee" },
  email:  { code: "m", letter: "@", name: "Email",    color: "#0c7691", bg: "#dff0f3" },
  web:    { code: "w", letter: "T", name: "TI.com",   color: "#4a6cb3", bg: "#e8eef8" },
  e2e:    { code: "e", letter: "E", name: "E2E",      color: "#8a4a9a", bg: "#f1e8f4" },
  synth:  { code: "s", letter: "↯", name: "Synth",    color: "#b97509", bg: "#fcf2e0" },
};

export const DRAFTS = [
  { id: "d1", rec: { initials: "MK", name: "Marcus Kim",        email: "marcus.kim@volthaus.io",     company: "Volthaus Battery",   role: "Sr. Power Engineer"      }, ch: "quote", why: "Submitted quote for TPS6521905 yesterday",                   subject: "About your TPS6521905 quote — quick note on the QFN variant",              preview: "Hi Marcus — saw your quote come through for the TPS6521905. Wanted to flag that the RGE QFN package has a few layout requirements worth knowing about up front…", attach: ["TPS6521905 ds", "PMP40123"],           conf: "ok",   model: "Claude"      },
  { id: "d2", rec: { initials: "PR", name: "Priya Ramaswamy",   email: "p.ram@northfield-sense.com", company: "Northfield Sense",   role: "Embedded SW Lead"        }, ch: "order", why: "Ordered MSP430 EVM 8d ago + 2× SLAA660 downloads",            subject: "Following up on your MSP430G2553 LaunchPad",                               preview: "Hi Priya — hope the MSP430G2553 LaunchPad arrived OK. I noticed you also pulled SLAA660 twice this month, which usually means…",                               attach: ["SLAA660", "MSP430G2553 ds"],          conf: "warn", model: "TI Internal", flag: true },
  { id: "d3", rec: { initials: "AC", name: "Acme Robotics",     email: "—",                          company: "Acme Robotics",      role: "Aggregate · 3 engineers" }, ch: "synth", why: "Pattern: 3 engineers viewing buck regulators (30d)",            subject: "Power-stage selection for your team's next platform",                       preview: "Hi — I noticed three engineers on your team have been looking at our buck family (TPS6521905, LMR33630)…",                                                      attach: ["LMR33630 ds", "TPS6521905 ds"],       conf: "ok",   model: "Claude",     multi: true },
  { id: "d4", rec: { initials: "JT", name: "Jen Tobias",        email: "jtobias@helio-charge.com",   company: "Helio Charge",       role: "Hardware Engineer"       }, ch: "web",   why: "Pulled BQ25895 datasheet 3× this week",                       subject: "BQ25895 — happy to walk through the I²C timing if useful",                 preview: "Hi Jen — saw the BQ25895 datasheet downloads. The I²C control register layout is the part most teams ask about…",                                              attach: ["BQ25895 ds", "SLUSC83"],             conf: "ok",   model: "Claude"      },
  { id: "d5", rec: { initials: "RS", name: "Raj Singh",         email: "raj@sensorgrid.io",          company: "SensorGrid",         role: "Founder / EE"            }, ch: "order", why: "INA226 samples shipped + iso ref design view",                subject: "INA226 samples — the iso ref design you might be missing",                  preview: "Hi Raj — your INA226 samples shipped Monday. If you're heading toward an isolated current path, TIDA-00467…",                                                  attach: ["INA226 ds", "TIDA-00467"],           conf: "warn", model: "TI Internal" },
  { id: "d6", rec: { initials: "LD", name: "Lena Duarte",       email: "lena.d@meridian-mc.com",     company: "Meridian MotorCtrl", role: "Motor Drives Engineer"   }, ch: "web",   why: "TMS320F28379D + InstaSPIN app note download",                 subject: "C2000 + InstaSPIN — common gotchas worth flagging",                        preview: "Hi Lena — wanted to share a few patterns we see with TMS320F28379D + InstaSPIN tuning. Most teams hit…",                                                       attach: ["SPRUH18"],                           conf: "ok",   model: "Claude"      },
  { id: "d7", rec: { initials: "OB", name: "Owen Brandt",       email: "owen.b@cinderlabs.com",      company: "CinderLabs",         role: "Power IC Engineer"       }, ch: "quote", why: "Quote on LMR33630 + sample order pending 6d",                subject: "LMR33630 — checking in on your eval",                                      preview: "Hi Owen — circling back on the LMR33630 quote and the sample order. If you're targeting 5V → 3.3V at…",                                                       attach: ["LMR33630 ds"],                       conf: "bad",  model: "TI Internal" },
  { id: "d8", rec: { initials: "SH", name: "Sofia Halberg",     email: "sofia@drift-ev.se",          company: "Drift EV",           role: "Systems Architect"       }, ch: "order", why: "Ordered TMS320F28379D EVM 4d ago",                            subject: "C2000 EVM — quick wins from teams shipping motor control",                  preview: "Hi Sofia — your C2000 EVM should be on its way. A couple of things teams usually want next: the InstaSPIN guide…",                                             attach: ["TMS320F28379D ds", "SPRUI98"],        conf: "ok",   model: "Claude"      },
  { id: "d9", rec: { initials: "TF", name: "Theo Falk",         email: "theo@lumenstack.com",        company: "LumenStack",         role: "Firmware Engineer"       }, ch: "e2e",   why: "Posted on E2E about TPS6521905 layout",                       subject: "TPS6521905 — design questions I usually get",                               preview: "Hi Theo — saw your E2E thread. The two things first-time users usually ask about: layout under the exposed pad…",                                              attach: ["TPS6521905 ds", "PMP22384"],         conf: "warn", model: "Claude"      },
];

export const ACTION_TYPES = {
  "email-out":   { label: "Email · outbound", short: "Email"   },
  "email-reply": { label: "Email · reply",    short: "Reply"   },
  "call":        { label: "Schedule call",    short: "Call"    },
  "loop-pm":     { label: "Loop in product",  short: "Loop PM" },
  "intro-fae":   { label: "Intro FAE",        short: "Intro"   },
  "human":       { label: "Human-led action", short: "Human"   },
};

export const ACTIONS = DRAFTS.map((d, i) => ({
  ...d,
  actionType: i === 1 ? "email-reply" : i === 3 ? "call" : i === 5 ? "loop-pm" : i === 6 ? "human" : "email-out",
  needsHuman: d.flag === true || i === 6,
}));

export const SIGNALS = [
  { id: "s15", time: "9:55a",    ch: "email", who: "Priya Ramaswamy", co: "Northfield Sense",   text: "Replied — asking about RGZ variant pinout + bypass cap layout", draftId: "d2", weight: "strong" },
  { id: "s1",  time: "9:42a",    ch: "quote", who: "Marcus Kim",      co: "Volthaus Battery",   text: "Submitted quote — TPS6521905 (5kpc, RGE QFN)",              draftId: "d1", weight: "strong" },
  { id: "s2",  time: "9:31a",    ch: "web",   who: "Theo Falk",       co: "LumenStack",         text: "First-time TPS6521905 datasheet view",                      draftId: "d9", weight: "med"    },
  { id: "s3",  time: "9:18a",    ch: "web",   who: "Priya Ramaswamy", co: "Northfield Sense",   text: "Downloaded SLAA660 (low-power app note · 2nd time)",        draftId: "d2", weight: "med"    },
  { id: "s16", time: "9:08a",    ch: "email", who: "Marcus Kim",      co: "Volthaus Battery",   text: "Replied: \"Thanks — got the datasheet, will review.\"",     draftId: null, weight: "weak"   },
  { id: "s4",  time: "8:55a",    ch: "synth", who: "3 engineers",     co: "Acme Robotics",      text: "Pattern: convergence on buck regulators (30d)",             draftId: "d3", weight: "strong" },
  { id: "s5",  time: "8:40a",    ch: "web",   who: "Jen Tobias",      co: "Helio Charge",       text: "BQ25895 datasheet · 3rd view this week",                    draftId: "d4", weight: "med"    },
  { id: "s17", time: "yest 5p",  ch: "email", who: "Jen Tobias",      co: "Helio Charge",       text: "Replied: \"Can we set up a 30-min call next Tue on BQ25895?\"", draftId: "d4", weight: "strong" },
  { id: "s6",  time: "yest 6p",  ch: "order", who: "Sofia Halberg",   co: "Drift EV",           text: "Ordered TMS320F28379D EVM",                                 draftId: "d8", weight: "strong" },
  { id: "s7",  time: "yest 4p",  ch: "order", who: "Raj Singh",       co: "SensorGrid",         text: "Ordered INA226 samples (10pc)",                             draftId: "d5", weight: "strong" },
  { id: "s8",  time: "yest 3p",  ch: "web",   who: "Lena Duarte",     co: "Meridian MotorCtrl", text: "Downloaded SPRUH18 (InstaSPIN tuning)",                     draftId: "d6", weight: "med"    },
  { id: "s9",  time: "yest 2p",  ch: "e2e",   who: "Theo Falk",       co: "LumenStack",         text: "Posted on E2E: \"TPS6521905 layout under exposed pad?\"",   draftId: "d9", weight: "strong" },
  { id: "s10", time: "yest 1p",  ch: "order", who: "Priya Ramaswamy", co: "Northfield Sense",   text: "MSP430G2553 LaunchPad delivered",                           draftId: "d2", weight: "weak"   },
  { id: "s11", time: "yest 11a", ch: "quote", who: "Owen Brandt",     co: "CinderLabs",         text: "Quote LMR33630 — sample order pending 6d",                  draftId: "d7", weight: "strong" },
  { id: "s12", time: "Mon 4p",   ch: "web",   who: "Elena Vargas",    co: "Volthaus Battery",   text: "TPS6521905 product folder · viewed",                        draftId: null, weight: "weak"   },
  { id: "s13", time: "Mon 2p",   ch: "e2e",   who: "Kai Nakamura",    co: "Drift EV",           text: "Replied on E2E: C2000 ref design thread",                   draftId: "d8", weight: "weak"   },
  { id: "s14", time: "Mon 11a",  ch: "web",   who: "Theo Falk",       co: "LumenStack",         text: "TPS6521905 ds · viewed",                                    draftId: "d9", weight: "weak"   },
];

// Email threads keyed by draftId — present only for contacts where there's prior history
// (typically derived from email-channel signals on the feed).
export const THREADS = {
  d1: [
    { from: "them", date: "Apr 28, 9:08 AM", body: "Thanks — got the datasheet, will review.\n\n— Marcus" },
    { from: "us",   date: "Apr 25, 4:12 PM", body: "Hi Marcus — sending the TPS6521905 datasheet from our call. §7.3 has the layout requirements for the RGE QFN package — that's the section worth focusing on for the inductor placement question.\n\nLet me know if you want me to pull the PMP40123 reference design too.\n\n— Erica" },
  ],
  d2: [
    { from: "them", date: "Apr 28, 9:55 AM", body: "Hi Erica — quick follow-up. We're actually using the PW (TSSOP) variant, not RGZ. Can you send the layout guide for PW? Also wondering about the FB divider trace differences — the datasheet section is a little thin there.\n\n— Priya" },
    { from: "us",   date: "Apr 22, 10:12 AM", body: "Hi Priya — saw the second SLAA660 pull. If you're working on the low-power side of the design, here's the walkthrough we use internally for the MSP430G2553 LaunchPad → battery sensor path.\n\nHoller if the LDO startup sequence behaves oddly — there's a known gotcha around BOR.\n\n— Erica" },
    { from: "us",   date: "Apr 14, 8:45 AM", body: "Hi Priya — your MSP-EXP430G2ET shipped today. Full kit + the SLAA660 walkthrough should get you running by end of week. Reach out anytime.\n\n— Erica" },
  ],
  d4: [
    { from: "them", date: "Apr 27, 5:00 PM", body: "Erica — yes, this is timely. I'm hitting some weirdness with the I²C ACK on BQ25895 in fast-charge mode. Can we set up a 30-min call next Tue? Open mid-afternoon.\n\n— Jen" },
    { from: "us",   date: "Apr 27, 9:30 AM", body: "Hi Jen — I noticed you've been pulling the BQ25895 datasheet a few times this week. The I²C control register layout (especially around REG07) is the part most teams ask about — happy to walk through it if useful.\n\n— Erica" },
  ],
};

export const SYNTH_INSIGHTS = [
  { id: "i1", title: "Acme Robotics — buck regulator convergence",   body: "Three engineers (M. Kapoor, J. Lin, S. Park) viewed TPS6521905 + LMR33630 within a 30-day window. Pattern suggests platform decision in flight.", co: "Acme Robotics",     sigCount: 8, draftId: "d3" },
  { id: "i2", title: "Northfield Sense — sustained engagement",       body: "Priya: EVM ordered → 2× app-note pulls → datasheet revisits. Momentum building toward design-in.",                                                  co: "Northfield Sense", sigCount: 4, draftId: "d2" },
];
