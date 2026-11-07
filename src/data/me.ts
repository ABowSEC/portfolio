// The personal side of the site. Anything left "" or [] is hidden.
// Sources: your LinkedIn (education, experience, certification) and GitHub repo history.

export type NowItem = { label: string; text: string; href?: string };

export type Role = {
  title: string;
  org: string;
  team?: string;
  start: string;
  end?: string; // omit for current
  location: string;
  points: string[];
};

export const me = {
  school: "Colorado State University",
  schoolShort: "CSU",
  degree: "B.S. Computer Science, Network & Security",
  gradYear: "2027", // expected December 2027
  location: "Fort Collins, CO",
  photo: "", // TODO: add public/img/andrew.jpg (square, ~600px) and set "/img/andrew.jpg"
  timezone: "America/Denver",
  timezoneLabel: "Mountain Time",

  /** 2-3 sentences in your own voice: how you got into networks and space. */
  // Draft from your background; rewrite it in your own words.
  story:
    "Before I wrote code I cooked in a busy kitchen and trained as an EMT. Both taught me that when a lot is happening at once, a calm, simple system beats heroics, and that is still how I approach software.",

  experience: [
    {
      title: "SIS Intern",
      org: "Colorado State University",
      team: "Student Information Systems",
      start: "Oct 2025",
      location: "Fort Collins, CO · on-site",
      points: [
        "Work with the team to integrate student-service platforms with campus databases.",
        "Help build and maintain Boomi workflows, data connections and system updates that move information between programs and services.",
        "Develop, train and update an internal AI tool that makes the team more efficient.",
      ],
    },
  ] as Role[],

  certifications: [{ name: "SQL Essential Training", issuer: "LinkedIn Learning", date: "Dec 2025" }],

  /** What you're doing right now. Update nowUpdated when you edit it. */
  nowUpdated: "2026-11",
  now: [
    { label: "working", text: "as an intern on CSU's Student Information Systems team", href: "#about" },
    { label: "building", text: "CodeBreaker's game server and wire protocol", href: "#codebreaker" },
    { label: "running", text: "a desktop-vs-VR user study on Meta Quest 2", href: "#vr-workspace" },
    { label: "improving", text: "device identification in NetSleuth", href: "#netsleuth" },
    { label: "reading", text: "" }, // TODO: a book or paper
    { label: "watching", text: "" }, // TODO: e.g. "the next Starship flight"
  ] as NowItem[],

  /** Milestones, oldest first. `next: true` marks one that hasn't happened yet. */
  timeline: [
    { when: "2018–20", text: "Cooked at Canino's Italian Restaurant while in high school." },
    { when: "2020", text: "Graduated high school and trained as an EMT." },
    { when: "2020–25", text: "Worked at Columbine Health Systems until starting at CSU." },
    { when: "Aug 2022", text: "Started an A.S. in Computer Science at Front Range Community College." },
    { when: "Jun 2025", text: "Started Ephemeris and NetSleuth. Ephemeris is now live." },
    { when: "Jul 2025", text: "Finished my A.S. at Front Range." },
    { when: "Aug 2025", text: "Started a B.S. in Computer Science (Network & Security) at Colorado State." },
    { when: "Oct 2025", text: "Joined CSU's Student Information Systems team as an intern." },
    { when: "Sep 2026", text: "Began designing CodeBreaker's protocol for CS 457." },
    { when: "Nov 2026", text: "Published the VR office study for CS 464." },
    { when: "Dec 2027", text: "Graduate from Colorado State.", next: true },
  ] as { when: string; text: string; next?: boolean }[],

  interests: [] as string[], // TODO: outside of code, e.g. ["launch photography", "homelab", "climbing"]
};
