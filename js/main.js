/**
 * Aksh Chauhan - Portfolio Interactive Engine
 * Inspired by the Tactile Maker & Editorial Workbench of Jackie Zhang
 */

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initAmbiencePlayer();
  initPolaroidDrag();
  initFilters();
  initProjectModal();
  initEmailCopy();
  initScrollNav();
});

/* ==========================================================================
   1. LIVE LOCAL TIME CLOCK (Phoenix / Tempe, AZ • MST / GMT-7)
   ========================================================================== */
function initClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  function updateClock() {
    try {
      const now = new Date();
      const options = {
        timeZone: 'America/Phoenix',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const timeStr = new Intl.DateTimeFormat('en-US', options).format(now);
      clockEl.textContent = `${timeStr} MST`;
    } catch (e) {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   2. AMBIENT LO-FI AUDIO PLAYER (Web Audio API Synthesizer)
   Warm analog chord drone + subtle tape warmth
   ========================================================================== */
function initAmbiencePlayer() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (!audioBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let oscillators = [];
  let masterGain = null;

  function startAmbientDrone() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Warm chords in F# Maj7 / Db (F#, A#, C#, F)
    const freqs = [185.00, 233.08, 277.18, 349.23];
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 2.5);

    // Warm low-pass filter to give that mellow lofi texture
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, audioCtx.currentTime);

    oscillators = freqs.map((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Subtle detune for lush chorus warmth
      osc.detune.setValueAtTime((idx % 2 === 0 ? 1 : -1) * (idx * 2.5 + 1.5), audioCtx.currentTime);

      oscGain.gain.value = 0.25;
      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      return osc;
    });

    filter.connect(masterGain);
    masterGain.connect(audioCtx.destination);
    isPlaying = true;
    audioBtn.classList.add('audio-playing');
    audioBtn.querySelector('.audio-label').textContent = 'Lofi Drone On';
  }

  function stopAmbientDrone() {
    if (masterGain && audioCtx) {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
      setTimeout(() => {
        oscillators.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch(e){}
        });
        oscillators = [];
        isPlaying = false;
      }, 1000);
    }
    audioBtn.classList.remove('audio-playing');
    audioBtn.querySelector('.audio-label').textContent = 'Ambience';
  }

  audioBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startAmbientDrone();
    } else {
      stopAmbientDrone();
    }
  });
}

/* ==========================================================================
   3. DRAGGABLE POLAROIDS (Physics & Tactile Interaction)
   ========================================================================== */
function initPolaroidDrag() {
  const polaroids = document.querySelectorAll('.polaroid-card');
  let highestZ = 30;

  polaroids.forEach((card) => {
    let isDragging = false;
    let startX = 0, startY = 0;
    let currentX = 0, currentY = 0;

    card.addEventListener('mousedown', (e) => {
      // Don't drag if clicking a link
      if (e.target.tagName === 'A') return;
      isDragging = true;
      highestZ++;
      card.style.zIndex = highestZ;

      startX = e.clientX - currentX;
      startY = e.clientY - currentY;
      card.style.transition = 'none';
      card.style.cursor = 'grabbing';
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      currentX = e.clientX - startX;
      currentY = e.clientY - startY;
      card.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.05)`;
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      card.style.cursor = 'grab';
      card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      card.style.transform = `translate(${currentX}px, ${currentY}px) scale(1)`;
    });
  });
}

/* ==========================================================================
   4. SELECTED WORKS FILTERING
   ========================================================================== */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   5. ARCHITECTURE & CASE STUDY MODAL DRAWER
   ========================================================================== */
const projectData = {
  1: {
    title: "AI-Powered Investor Intelligence Platform",
    tag: "AUTONOMOUS RESEARCH AGENT • HYBRID RAG • FINANCIAL ML",
    metric: "Sub-Second Hybrid Retrieval // 99.4% Extraction Accuracy",
    challenge: "Traditional investment research requires analysts to parse thousands of pages of quarterly 10-K and 10-Q SEC EDGAR filings, leading to delayed insights and human oversight during high-volatility market windows.",
    solution: "Engineered an autonomous financial research agent utilizing Amazon Bedrock (Claude 3.5 Sonnet) with native Tool Calling and SEC EDGAR APIs. Built a hybrid RAG pipeline pairing PostgreSQL pgvector embeddings with structured time-series metrics. Live financial metrics and reasoning trajectories stream directly to clients over low-latency WebSockets.",
    architecture: `[ SEC EDGAR API ]
       │ (Auto-fetch 10-K/10-Q Filings)
       ▼
[ FastAPI Ingestion Worker ]
       │ ──> [ Chunker & Embedding Generator ]
       ▼
[ PostgreSQL + pgvector ] <── Hybrid Search ──> [ BM25 Full-Text Index ]
       ▲
       │ Query & Semantic Context
       ▼
[ Amazon Bedrock Agent (Tool Calling) ]
       │ ──> [ Financial Reasoning Stream ]
       ▼
[ WebSocket Broadcast ] ──> [ Modern Dashboard Client ]`,
    tech: ["Python", "Amazon Bedrock", "PostgreSQL", "pgvector", "FastAPI", "WebSockets", "Docker"],
    github: "https://github.com/Aksh9203"
  },
  2: {
    title: "SafeGuard Mobile SOS",
    tag: "GEOSPATIAL SYSTEMS • SUB-SECOND EMERGENCY DISPATCH",
    metric: "< 50ms Geo-Matching // Real-Time WebSocket Proximity",
    challenge: "Emergency response scenarios require sub-second latency to connect distress signals with the nearest available first responders, where traditional radius queries overload relational databases.",
    solution: "Implemented an emergency matching pipeline using Uber's H3 geospatial hexagonal indexing algorithm. Partitioned active responder locations into hexagonal cells and maintained sub-millisecond lookups via Redis pipelined spatial indexes. Integrated WebSockets for bi-directional live tracking.",
    architecture: `[ Mobile Client (SOS Distress) ]
       │ (Coordinates + Telemetry)
       ▼
[ API Gateway / WebSocket Server ]
       │
       ▼
[ Uber H3 Spatial Indexer ] ──> Quantizes Lat/Lng into Resolution-8 Hexagons
       │
       ▼
[ Redis In-Memory Cluster ] ──> Pipelined k-Ring Neighbor Search (< 5ms)
       │
       ▼
[ Dispatch Optimizer ] ──> Matches nearest active first responder
       │
       ▼
[ WebSockets Notification ] ──> Alerts responder with turn-by-turn routing`,
    tech: ["TypeScript", "Uber H3", "Redis", "WebSockets", "Terraform", "Node.js"],
    github: "https://github.com/Aksh9203"
  },
  3: {
    title: "Serverless Travel Booking Platform",
    tag: "DISTRIBUTED SAGA • EVENT-DRIVEN • ZERO DUAL-WRITES",
    metric: "100% Data Consistency // Zero Dual-Write Inconsistencies",
    challenge: "Coordinating multi-step distributed booking workflows (flight reservation, hotel booking, payment processing, notification dispatch) across independent microservices without distributed lock bottlenecks or data drift.",
    solution: "Designed and implemented a hybrid Saga pattern orchestrator with AWS Step Functions and DynamoDB. Eliminated dual-write errors by strictly applying the Transactional Outbox pattern, Idempotency keys, and automated compensation handlers for rollback on payment failure.",
    architecture: `[ Customer Booking Request ]
       │
       ▼
[ AWS API Gateway ]
       │
       ▼
[ AWS Step Functions (Saga Coordinator) ]
  ├── 1. Reserve Flight (Lambda ──> DynamoDB)
  │      └── On Fail: Cancel Workflow
  ├── 2. Reserve Hotel (Lambda ──> DynamoDB)
  │      └── On Fail: Release Flight + Cancel
  ├── 3. Process Stripe Payment (Lambda)
  │      └── On Fail: Release Hotel + Release Flight
  └── 4. Transactional Outbox Event ──> AWS SES Confirmation
       │
[ Amazon SQS DLQ ] ──> Dead Letter Queue for anomalous failures`,
    tech: ["AWS Step Functions", "DynamoDB", "AWS Lambda", "Transactional Outbox", "Spring Boot", "SES"],
    github: "https://github.com/Aksh9203"
  },
  4: {
    title: "Hybrid Edge-Cloud Face Recognition",
    tag: "EDGE COMPUTING • IOT GREENGRASS • ELASTIC SCALING",
    metric: "Autoscaling to 15 Instances // 65% Cloud Bandwidth Reduction",
    challenge: "Processing high-resolution video streams from hundreds of distributed surveillance cameras in the cloud incurs severe bandwidth saturation and unacceptable detection latency.",
    solution: "Built a hybrid edge-cloud pipeline using AWS IoT Greengrass deployed on edge nodes running local MTCNN face detection. Only extracted face crops and metadata are dispatched to the cloud over MQTT, where an elastic AWS EC2 worker tier autoscales up to 15 instances via SQS queue depth triggers.",
    architecture: `[ Edge Video Camera ]
       │ (Raw 1080p Video Stream)
       ▼
[ AWS IoT Greengrass Edge Node ]
       │ Local MTCNN Face Detection (Filters out 80% non-face frames)
       ▼
[ MQTT Broker / AWS IoT Core ]
       │ Lightweight Cropped Face + Telemetry
       ▼
[ Amazon SQS Queue ] ──> Monitors backlog depth
       │
       ▼
[ Cloud Auto Scaling Group (EC2) ] ──> Scales 1 to 15 Deep Learning Workers
       │
       ▼
[ Facial Feature Matching & S3 Storage ]`,
    tech: ["AWS EC2", "IoT Greengrass", "MTCNN", "Amazon SQS", "Lambda", "MQTT", "Python"],
    github: "https://github.com/Aksh9203"
  },
  5: {
    title: "Movie Recommendation Engine",
    tag: "GCP CLOUD RUN • CLOUD SPANNER • ASYNC EVENT STREAMING",
    metric: "50,000+ Records Asynchronously Processed // Sub-80ms Query Latency",
    challenge: "Calculating personalized recommendations across tens of thousands of movie ratings without blocking write transactions or degrading user read latencies.",
    solution: "Architected a decoupled microservices platform hosted on Google Cloud Run. Leveraged GCP Pub/Sub for asynchronous event streaming, decoupling rating ingestion from collaborative filtering computations, backed by Google Cloud Spanner for globally consistent relational storage.",
    architecture: `[ Web Client ]
       │ Rating / Search Interaction
       ▼
[ GCP Cloud Run (Java Ingestion Service) ]
       │
       ▼
[ Google Cloud Pub/Sub ] ──> Asynchronous Event Topic
       │
       ▼
[ Recommendation Worker Service ]
       │ Collaborative Filtering & Cosine Similarity Matrix
       ▼
[ Google Cloud Spanner ] ──> Globally Distributed Relational Storage
       ▲
       │ Low-Latency Read Queries (< 80ms)
[ Client Recommendation Feed ]`,
    tech: ["Google Cloud Run", "Cloud Spanner", "Java", "GCP Pub/Sub", "Docker"],
    github: "https://github.com/Aksh9203"
  },
  6: {
    title: "Smart Code Editor & AI Mentor",
    tag: "GENERATIVE AI • MULTI-LANGUAGE RUNTIME • INTERACTIVE IDE",
    metric: "Multi-Language Execution // Real-time Code Diagnostic & Mentor",
    challenge: "Beginner and intermediate developers often get stuck on cryptic compiler errors and lack immediate, context-aware architectural feedback while coding.",
    solution: "Engineered an AI-augmented browser IDE with Flask, Google GenAI SDK (Gemini), and the Piston API for sandboxed multi-language code compilation (Python, Java, C++). Integrated an AI code mentor providing step-by-step logic explanations and remediation advice.",
    architecture: `[ Browser IDE (Monaco Editor) ]
       │ Code Input + Language Selection
       ▼
[ Flask Application Server ]
  ├── Execution Request ──> [ Piston API Sandboxed Container ]
  │                               └── Returns Stdout / Stderr
  └── AI Mentor Request  ──> [ Google GenAI SDK (Gemini) ]
                                  └── Returns Explanation & Code Fix
       │
       ▼
[ Real-time Syntax Highlighting & AI Dialogue UI ]`,
    tech: ["Flask", "Google GenAI SDK", "Gemini", "Piston API", "JavaScript", "Python"],
    github: "https://github.com/Aksh9203"
  },
  7: {
    title: "Netflix Modern Streaming UI",
    tag: "REACT FRONTEND • FIREBASE AUTH & FIRESTORE • REACT QUERY",
    metric: "Optimistic UI Updates // Seamless Google Auth Session State",
    challenge: "Creating a fluid, high-performance streaming web application with dynamic media carousels, responsive video previews, and resilient user bookmarking.",
    solution: "Built a Netflix-style streaming client using React, React Query for server-state caching and background pre-fetching, and Firebase Authentication for frictionless Google OAuth. Stored user watchlists in Cloud Firestore with real-time updates.",
    architecture: `[ User Client (React UI) ]
       ├── Auth State ──> [ Firebase Authentication (OAuth) ]
       ├── Data Query ──> [ React Query Cache & TMDB API ]
       └── Watchlist  ──> [ Cloud Firestore Real-Time Database ]`,
    tech: ["React", "Firebase", "React Query", "Cloud Firestore", "CSS3"],
    github: "https://github.com/Aksh9203"
  },
  8: {
    title: "Car Rental Distributed Management System",
    tag: "SPRING BOOT MICROSERVICES • RESTful ARCHITECTURE • REACT",
    metric: "Real-Time Fleet Availability // Automated Booking Validation",
    challenge: "Preventing double-booking anomalies during concurrent reservation attempts across multiple vehicle hubs.",
    solution: "Developed robust Spring Boot CRUD microservices with optimistic locking to manage live car inventory and prevent race conditions. Provided dynamic filtering and administrative fleet management interfaces in React.",
    architecture: `[ React Admin & Customer UI ]
       │ REST API Requests
       ▼
[ Spring Boot Controller & Service Tier ]
       │ Validates Booking Window & Locks Inventory Row
       ▼
[ MySQL Database (ACID Transactions) ]`,
    tech: ["Spring Boot", "React", "Java", "REST API", "MySQL"],
    github: "https://github.com/Aksh9203"
  }
};

function initProjectModal() {
  const modalOverlay = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalMetric = document.getElementById('modal-metric');
  const modalChallenge = document.getElementById('modal-challenge');
  const modalSolution = document.getElementById('modal-solution');
  const modalArchitecture = document.getElementById('modal-architecture');
  const modalTechList = document.getElementById('modal-tech-list');
  const modalGithubLink = document.getElementById('modal-github-link');

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-project-id');
      const data = projectData[id];
      if (!data) return;

      modalTag.textContent = data.tag;
      modalTitle.textContent = data.title;
      modalMetric.textContent = data.metric;
      modalChallenge.textContent = data.challenge;
      modalSolution.textContent = data.solution;
      modalArchitecture.textContent = data.architecture;
      modalGithubLink.href = data.github;

      modalTechList.innerHTML = '';
      data.tech.forEach(t => {
        const span = document.createElement('span');
        span.className = 'project-tag-pill';
        span.textContent = t;
        modalTechList.appendChild(span);
      });

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. ONE-CLICK EMAIL COPY & TOAST NOTIFICATION
   ========================================================================== */
function initEmailCopy() {
  const copyElements = document.querySelectorAll('.copy-email-trigger');
  const toast = document.getElementById('toast-notice');

  copyElements.forEach(el => {
    el.addEventListener('click', () => {
      const email = 'akshrajesh9203@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        if (toast) {
          toast.textContent = '📋 Email copied to clipboard: ' + email;
          toast.classList.add('show');
          setTimeout(() => {
            toast.classList.remove('show');
          }, 3200);
        }
      }).catch(err => {
        window.location.href = 'mailto:' + email;
      });
    });
  });
}

/* ==========================================================================
   7. ACTIVE NAV TRACKING ON SCROLL
   ========================================================================== */
function initScrollNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.parentElement.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.parentElement.classList.add('active');
      }
    });
  });
}
