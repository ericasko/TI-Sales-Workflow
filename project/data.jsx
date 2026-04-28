// Shared mock data + icons for the wireframe set.

// ── Trigger icons (sketchy, drawn as inline SVG) ──
const TrigIcon = ({ kind }) => {
  const common = { className: "trig-ico", viewBox: "0 0 22 22" };
  switch (kind) {
    case "quote": // dollar / page
      return (
        <svg {...common}>
          <path d="M5 3 h10 l3 3 v15 h-13 z" />
          <path d="M11 9 v8 M9 11 q2 -1.5 4 0 q-2 1.5 -4 0 q2 1.5 4 0 q-2 1.5 -4 0" />
        </svg>
      );
    case "evm": // chip / board
      return (
        <svg {...common}>
          <rect x="4" y="6" width="14" height="11" />
          <path d="M7 9 h8 M7 12 h8 M7 15 h6" />
          <path d="M3 9 h1 M3 12 h1 M18 9 h1 M18 12 h1" />
        </svg>
      );
    case "agg": // 3 people
      return (
        <svg {...common}>
          <circle cx="6" cy="9" r="2.2" />
          <circle cx="11" cy="8" r="2.5" />
          <circle cx="16" cy="9" r="2.2" />
          <path d="M3 17 q3 -4 6 -2 M9 17 q2 -5 4 0 M13 17 q3 -4 6 -2" />
        </svg>
      );
    case "datasheet": // page with lines
      return (
        <svg {...common}>
          <path d="M5 3 h10 l3 3 v15 h-13 z" />
          <path d="M7 10 h8 M7 13 h8 M7 16 h5" />
        </svg>
      );
    case "sample": // box with arrow
      return (
        <svg {...common}>
          <path d="M3 8 l8 -4 l8 4 v9 l-8 4 l-8 -4 z" />
          <path d="M3 8 l8 4 l8 -4 M11 12 v9" />
        </svg>
      );
    case "appnote": // book
      return (
        <svg {...common}>
          <path d="M4 5 q4 -2 7 0 q3 -2 7 0 v13 q-4 -2 -7 0 q-3 -2 -7 0 z" />
          <path d="M11 5 v13" />
        </svg>
      );
    default:
      return null;
  }
};

// ── 9 mock draft rows ──
const DRAFTS = [
  {
    id: "d1",
    rec: { initials: "MK", name: "Marcus Kim", email: "marcus.kim@volthaus.io", company: "Volthaus Battery", role: "Sr. Power Engineer" },
    trigger: "quote",
    why: "Submitted quote for TPS6521905 yesterday",
    subject: "About your TPS6521905 quote — quick note on the QFN variant",
    preview: "Hi Marcus — saw your quote come through for the TPS6521905. Wanted to flag that the RGE QFN package has...",
    attach: ["TPS6521905 ds", "PMP40123"],
    conf: "ok",
    actions: ["Approve", "Edit", "Reject", "Defer"],
    model: "Claude",
    state: "ready",
  },
  {
    id: "d2",
    rec: { initials: "PR", name: "Priya Ramaswamy", email: "p.ram@northfield-sense.com", company: "Northfield Sense", role: "Embedded SW Lead" },
    trigger: "evm",
    why: "Ordered MSP430 EVM 8 days ago + 2× downloaded power-mgmt app note",
    subject: "Following up on your MSP430G2553 LaunchPad",
    preview: "Hi Priya — hope the MSP430G2553 LaunchPad arrived OK. I noticed you also pulled SLAA660 twice which suggests...",
    attach: ["SLAA660", "MSP430G2553 ds", "TIDA-00484"],
    conf: "warn",
    flag: "wrong-variant",
    actions: ["Approve", "Edit", "Reject", "Defer"],
    model: "TI Internal",
    state: "ready",
  },
  {
    id: "d3",
    rec: { initials: "AC", name: "Acme Robotics (3 engineers)", email: "—", company: "Acme Robotics", role: "Aggregate signal" },
    trigger: "agg",
    why: "3 engineers @ Acme viewing related power ICs in 30 days",
    subject: "Power-stage selection for your team's next platform",
    preview: "Hi — I noticed three engineers on your team have been looking at our buck family (TPS6521905, LMR33630)...",
    attach: ["LMR33630 ds", "TPS6521905 ds", "Power tree wkbk"],
    conf: "ok",
    actions: ["Approve", "Edit", "Reject", "Defer"],
    model: "Claude",
    state: "ready",
    multi: true,
  },
  {
    id: "d4",
    rec: { initials: "JT", name: "Jen Tobias", email: "jtobias@helio-charge.com", company: "Helio Charge", role: "Hardware Eng" },
    trigger: "datasheet",
    why: "Pulled BQ25895 datasheet 3× this week",
    subject: "BQ25895 — happy to walk through the I²C timing if useful",
    preview: "Hi Jen — saw the BQ25895 datasheet downloads. The I²C control register layout is the part most teams ask about...",
    attach: ["BQ25895 ds", "SLUSC83"],
    conf: "ok",
    actions: ["Approve", "Edit", "Reject", "Defer"],
    model: "Claude",
    state: "ready",
  },
  {
    id: "d5",
    rec: { initials: "RS", name: "Raj Singh", email: "raj@sensorgrid.io", company: "SensorGrid", role: "Founder / EE" },
    trigger: "sample",
    why: "Ordered INA226 samples + viewed isolated current-sense ref design",
    subject: "INA226 samples — the iso ref design you might be missing",
    preview: "Hi Raj — your INA226 samples shipped Monday. If you're heading toward an isolated current path, TIDA-00...",
    attach: ["INA226 ds", "TIDA-00467"],
    conf: "warn",
    actions: ["Approve", "Edit", "Reject", "Defer"],
    model: "TI Internal",
    state: "ready",
  },
  {
    id: "d6",
    rec: { initials: "LD", name: "Lena Duarte", email: "lena.d@meridian-mc.com", company: "Meridian MotorCtrl", role: "Motor Drives Eng" },
    trigger: "appnote",
    why: "Downloaded TMS320F28379D + InstaSPIN app note",
    subject: "C2000 + InstaSPIN — common gotchas worth flagging",
    preview: "Hi Lena — wanted to share a few patterns we see with TMS320F28379D + InstaSPIN tuning. Most teams hit...",
    attach: ["SPRUH18", "TMS320F28379D ds"],
    conf: "ok",
    actions: ["Approve", "Edit", "Reject", "Defer"],
    model: "Claude",
    state: "ready",
  },
  {
    id: "d7",
    rec: { initials: "OB", name: "Owen Brandt", email: "owen.b@cinderlabs.com", company: "CinderLabs", role: "Power IC Eng" },
    trigger: "quote",
    why: "Quote on LMR33630 + sample order pending",
    subject: "LMR33630 — checking in on your eval",
    preview: "Hi Owen — circling back on the LMR33630 quote and the sample order. If you're targeting 5 V → 3.3 V at...",
    attach: ["LMR33630 ds"],
    conf: "bad",
    actions: ["Approve", "Edit", "Reject", "Defer"],
    model: "TI Internal",
    state: "ready",
  },
  {
    id: "d8",
    rec: { initials: "SH", name: "Sofia Halberg", email: "sofia@drift-ev.se", company: "Drift EV", role: "Sys Architect" },
    trigger: "evm",
    why: "Ordered TMS320F28379D EVM 4 days ago",
    subject: "C2000 EVM — quick wins from teams shipping motor control",
    preview: "Hi Sofia — your C2000 EVM should be on its way. A couple of things teams usually want next: the InstaSPIN...",
    attach: ["TMS320F28379D ds", "SPRUI98"],
    conf: "ok",
    actions: ["Approve", "Edit", "Reject", "Defer"],
    model: "Claude",
    state: "ready",
  },
  {
    id: "d9",
    rec: { initials: "TF", name: "Theo Falk", email: "theo@lumenstack.com", company: "LumenStack", role: "FW Engineer" },
    trigger: "datasheet",
    why: "First-time TPS6521905 datasheet view + sample request",
    subject: "TPS6521905 — design questions I usually get",
    preview: "Hi Theo — welcome to the TPS6521905. The two things first-time users usually ask about: layout under the...",
    attach: ["TPS6521905 ds", "PMP22384"],
    conf: "warn",
    actions: ["Approve", "Edit", "Reject", "Defer"],
    model: "Claude",
    state: "ready",
  },
];

window.TrigIcon = TrigIcon;
window.DRAFTS = DRAFTS;
