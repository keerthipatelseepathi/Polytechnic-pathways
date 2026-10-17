const $ = (s) => document.querySelector(s),
  esc = (t) =>
    t.replace(
      /[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );
const store = {
  get: (k, d) => {
    try {
      return JSON.parse(localStorage.getItem(k)) ?? d;
    } catch {
      return d;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
};

/* Theme + menu */
const root = document.documentElement;
root.dataset.theme = store.get("theme", "light");
$("#theme").onclick = () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  store.set("theme", root.dataset.theme);
};
$("#menuBtn").onclick = (e) => {
  const o = $("#menu").classList.toggle("open");
  e.target.setAttribute("aria-expanded", o);
};
$("#menu").addEventListener(
  "click",
  (e) => e.target.tagName === "A" && $("#menu").classList.remove("open"),
);

/* Data */
const COURSES = [
  {
    k: "CME",
    n: "Computer Engineering",
    d: "Programming, databases, networks and web development.",
    c: "Software developer, web developer, IT support",
    f: "B.Tech CSE through lateral entry",
  },
  {
    k: "ECE",
    n: "Electronics & Communication",
    d: "Circuits, embedded systems and communication.",
    c: "Technician, telecom engineer, embedded developer",
    f: "B.Tech ECE through lateral entry",
  },
  {
    k: "EEE",
    n: "Electrical & Electronics",
    d: "Power systems, machines and control.",
    c: "Power sector, maintenance engineer",
    f: "B.Tech EEE through lateral entry",
  },
  {
    k: "MECH",
    n: "Mechanical Engineering",
    d: "Design, manufacturing, thermal systems and CAD.",
    c: "Production, quality, design drafter",
    f: "B.Tech Mechanical through lateral entry",
  },
  {
    k: "CIVIL",
    n: "Civil Engineering",
    d: "Surveying, structures and construction.",
    c: "Site engineer, surveyor, estimator",
    f: "B.Tech Civil through lateral entry",
  },
];
const INTERESTS = {
  "Coding & apps": "CME",
  "Gadgets & circuits": "ECE",
  "Power & wiring": "EEE",
  "Machines & vehicles": "MECH",
  "Buildings & roads": "CIVIL",
};
const COLLEGES = [
  [
    "Government Polytechnic, Siddipet",
    "Siddipet",
    ["CME", "ECE", "EEE", "MECH", "CIVIL"],
  ],
  [
    "Government Polytechnic, Hyderabad",
    "Hyderabad",
    ["CME", "ECE", "EEE", "MECH", "CIVIL"],
  ],
  [
    "Government Polytechnic, Warangal",
    "Warangal",
    ["CME", "ECE", "MECH", "CIVIL"],
  ],
  ["Government Polytechnic, Karimnagar", "Karimnagar", ["CME", "EEE", "MECH"]],
  ["Government Polytechnic, Nizamabad", "Nizamabad", ["CME", "ECE", "CIVIL"]],
  ["Government Polytechnic, Khammam", "Khammam", ["CME", "EEE", "CIVIL"]],
];
const STEPS = [
  [
    "Check eligibility",
    "You need to have passed Class 10 (SSC or equivalent). Check the age and subject rules in the notification.",
  ],
  [
    "Register and write POLYCET",
    "Apply online, pay the fee, download the hall ticket and write the entrance test.",
  ],
  [
    "Get your rank",
    "Your rank decides which colleges and branches you can choose.",
  ],
  [
    "Certificate verification",
    "Visit a help-line centre with your original certificates for verification.",
  ],
  [
    "Choose options",
    "List your preferred colleges and branches in order of priority.",
  ],
  [
    "Seat allotment and reporting",
    "Download the allotment letter, pay the fee and report to your college on time.",
  ],
];
const QUOTES = [
  [
    "Abhishek",
    "Polytechnic gave me practical knowledge and connected me with industry professionals. Internship exposure helped me get a job right after the course.",
  ],
  [
    "Keerthi",
    "In three years I gained the knowledge and confidence to start my career in engineering, and a strong foundation for further studies.",
  ],
  [
    "Narendra Vardhan",
    "I got a quality technical education at a much lower cost, and the diploma opened doors to good jobs and personal growth.",
  ],
  [
    "Deepika",
    "The technical training and industry projects prepared me to work in a professional environment right after graduation.",
  ],
];

/* Branch finder */
const chips = $("#chips");
Object.keys(INTERESTS).forEach((i) => {
  const b = document.createElement("button");
  b.className = "chip";
  b.textContent = i;
  b.onclick = () => {
    chips
      .querySelectorAll(".chip")
      .forEach((x) => x.classList.toggle("on", x === b));
    const c = COURSES.find((c) => c.k === INTERESTS[i]);
    $("#result").innerHTML =
      `<b>${c.n}</b><br>${c.d}<br>Careers: ${c.c}.<br><a href="#courses" data-k="${c.k}" class="jump">See this course</a>`;
  };
  chips.append(b);
});
$("#result").onclick = (e) => {
  if (e.target.dataset.k) {
    filterCourses(e.target.dataset.k);
  }
};

/* Courses */
let cf = "All";
const cfBox = $("#courseFilter");
["All", ...COURSES.map((c) => c.k)].forEach((k) => {
  const b = document.createElement("button");
  b.className = "chip";
  b.textContent = k;
  b.dataset.k = k;
  b.onclick = () => filterCourses(k);
  cfBox.append(b);
});
function filterCourses(k) {
  cf = k;
  cfBox
    .querySelectorAll(".chip")
    .forEach((b) => b.classList.toggle("on", b.dataset.k === k));
  $("#courseList").innerHTML = COURSES.filter((c) => k === "All" || c.k === k)
    .map(
      (c) => `<article class="course"><h3>${c.n}</h3><p>${c.d}</p>
 <button class="more" aria-expanded="false">Careers and next steps</button>
 <div class="extra"><p><b>Careers:</b> ${c.c}.<br><b>Further study:</b> ${c.f}.</p></div></article>`,
    )
    .join("");
}
$("#courseList").addEventListener("click", (e) => {
  if (e.target.classList.contains("more")) {
    const a = e.target.closest(".course");
    e.target.setAttribute("aria-expanded", a.classList.toggle("open"));
  }
});
filterCourses("All");

/* Counseling stepper */
let s = 0;
STEPS.forEach((st, i) => {
  const li = document.createElement("li"),
    b = document.createElement("button");
  b.textContent = `${i + 1}. ${st[0]}`;
  b.onclick = () => setStep(i);
  li.append(b);
  $("#steps").append(li);
});
function setStep(i) {
  s = i;
  $("#steps")
    .querySelectorAll("button")
    .forEach((b, j) => b.classList.toggle("on", j === i));
  $("#stepBody").innerHTML =
    `<h3>${STEPS[i][0]}</h3><p>${STEPS[i][1]}</p><button class="btn" id="nx">${i < STEPS.length - 1 ? "Next step" : "Start over"}</button>`;
  $("#nx").onclick = () => setStep(i < STEPS.length - 1 ? i + 1 : 0);
  $("#bar").style.width = ((i + 1) / STEPS.length) * 100 + "%";
}
setStep(0);

/* Colleges */
const br = $("#branch");
COURSES.forEach((c) =>
  br.insertAdjacentHTML("beforeend", `<option>${c.k}</option>`),
);
function renderColleges() {
  const q = $("#q").value.toLowerCase(),
    b = br.value;
  const r = COLLEGES.filter(
    (c) =>
      (!q || (c[0] + c[1]).toLowerCase().includes(q)) &&
      (!b || c[2].includes(b)),
  );
  $("#collegeList").innerHTML = r.length
    ? r
        .map(
          (c) =>
            `<article><h3>${c[0]}</h3><p>${c[1]}</p>${c[2].map((x) => `<span class="tag">${x}</span>`).join("")}</article>`,
        )
        .join("")
    : "<p>No colleges match. Clear the search or choose another branch.</p>";
}
$("#q").oninput = renderColleges;
br.onchange = renderColleges;
renderColleges();

/* Testimonials */
let qi = 0,
  timer;
QUOTES.forEach((_, i) => {
  const d = document.createElement("button");
  d.setAttribute("aria-label", "Quote " + (i + 1));
  d.onclick = () => {
    showQ(i);
    clearInterval(timer);
  };
  $("#dots").append(d);
});
function showQ(i) {
  qi = i;
  $("#qt").textContent = "“" + QUOTES[i][1] + "”";
  $("#qn").textContent = QUOTES[i][0];
  $("#dots")
    .querySelectorAll("button")
    .forEach((d, j) => d.classList.toggle("on", j === i));
}
showQ(0);
timer = setInterval(() => showQ((qi + 1) % QUOTES.length), 6000);

/* Feedback (saved in this browser) */
function renderFb() {
  const l = store.get("fb", []);
  $("#fbList").innerHTML = l.length
    ? l
        .map(
          (f) =>
            `<li><b>${esc(f.name)}</b> ${"★".repeat(f.rate)}<br>${esc(f.msg)}</li>`,
        )
        .join("")
    : "<li>No feedback yet. Be the first to share.</li>";
}
$("#fbForm").onsubmit = (e) => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  f.rate = +f.rate;
  store.set("fb", [f, ...store.get("fb", [])].slice(0, 20));
  e.target.reset();
  renderFb();
};
renderFb();

// /* Contact */
// $('#ctForm').onsubmit=e=>{e.preventDefault();$('#ctMsg').textContent='Message sent. We will reply to your email soon.';e.target.reset()};

// /* Count-up stats */
// new IntersectionObserver((en,o)=>en.forEach(x=>{if(!x.isIntersecting)return;o.unobserve(x.target);
//  x.target.querySelectorAll('b').forEach(b=>{const n=+b.dataset.n;let v=0;const t=setInterval(()=>{b.textContent=++v;if(v>=n)clearInterval(t)},250)})})).observe($('#stats'));
