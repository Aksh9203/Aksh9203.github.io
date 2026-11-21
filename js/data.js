/**
 * Single Source of Truth for Aksh Chauhan's VisionQuest Portfolio
 * Edit this file to update bio, experience, education, projects, skills, links, or easter eggs.
 * Every factual claim is strictly sourced from Aksh's Resume, LinkedIn text, and GitHub profile.
 */

export const SITE_DATA = {
  profile: {
    name: 'Aksh Chauhan',
    initials: 'AC',
    title: 'Software Engineer',
    subtitle: 'Backend, Cloud & GenAI Systems',
    location: 'Tempe, Arizona, United States',
    timezone: 'America/Phoenix',
    availability: 'Seeking Full-Time SWE Roles (Backend · Cloud · GenAI)',
    email: 'akshrajesh9203@gmail.com',
    resumePath: 'assets/Aksh_Chauhan_Resume.pdf',
    github: 'https://github.com/Aksh9203',
    linkedin: 'https://www.linkedin.com/in/aksh9/',
    siteUrl: 'https://aksh9203.github.io/',
    portrait: 'assets/images/aksh_portrait.webp',
    portraitFallback: 'assets/images/aksh_portrait.jpg',
    greeting: 'Good evening. Loading profile: Aksh Chauhan…',
    heroSummary:
      'Software engineer and M.S. Software Engineering graduate (ASU, May 2026) building resilient backend systems, serverless AWS architectures, and grounded GenAI services.'
  },

  aiHosts: {
    hero: {
      id: 'jarvis',
      name: 'J.A.R.V.I.S.',
      role: 'INTERFACE // PROFILE INITIALIZATION',
      status: 'J.A.R.V.I.S. ONLINE',
      accentVar: '--ai-jarvis'
    },
    about: {
      id: 'vision',
      name: 'VISION',
      role: 'SYNTHESIS // HUMANITY & CRAFT',
      status: 'VISION ONLINE',
      accentVar: '--ai-vision-gold'
    },
    experience: {
      id: 'friday',
      name: 'F.R.I.D.A.Y.',
      role: 'TACTICAL // MISSION LOGS',
      status: 'F.R.I.D.A.Y. ONLINE',
      accentVar: '--ai-friday'
    },
    projects: {
      id: 'edith',
      name: 'E.D.I.T.H.',
      role: 'RECON // TARGET ANALYSIS',
      status: 'E.D.I.T.H. ONLINE',
      accentVar: '--ai-edith-reticle'
    },
    skills: {
      id: 'ultron',
      name: 'ULTRON',
      role: 'UPGRADE LAB // SYSTEM CAPABILITIES',
      status: 'ULTRON ONLINE',
      accentVar: '--ai-ultron'
    },
    contact: {
      id: 'jarvis-comms',
      name: 'J.A.R.V.I.S.',
      role: 'COMMS // DIRECT UPLINK',
      status: 'J.A.R.V.I.S. COMMS',
      accentVar: '--ai-jarvis'
    }
  },

  about: {
    heading: 'The part nobody sees, that everything depends on.',
    paragraphs: [
      "I'm a software engineer who likes the backend side of things—the part nobody sees, but everything depends on. Right now I'm at MindSpark, where I build serverless systems on AWS: a Stripe onboarding pipeline that keeps card data out of our systems entirely, an EventBridge reconciler that tracks billing across four states without letting anything slip or regress, and two GenAI services grounded on our own data with zero-downtime prompt rollouts.",
      "Before that I interned at Axisray, where I built a Spring Boot and React HR platform that a 30+ person team used every day, wired up voice-driven employee queries with Alexa Skills Kit and AWS Lambda, and cut estimated deployment time roughly in half with an AWS CodePipeline CI/CD workflow.",
      "The projects I keep coming back to are the ones with a hard constraint in them: an autonomous Bedrock research agent that turned manual SEC 10-K research into under 15 seconds, a Saga orchestrator that rolls back cleanly across three microservices when a booking fails halfway, and an emergency responder lookup on Uber H3 and Redis that moved from scanning everything to a single indexed lookup."
    ],
    lookingFor:
      "I finished my M.S. in Software Engineering at Arizona State University in May 2026. I'm looking for a full-time Software Engineer role—backend, cloud, or GenAI—somewhere I can own systems end to end.",
    education: [
      {
        school: 'Arizona State University',
        degree: 'Master of Science, Software Engineering',
        dates: 'Aug 2024 – May 2026',
        gpa: 'GPA: 3.73 / 4.00',
        location: 'Tempe, AZ'
      },
      {
        school: 'Gujarat Technological University',
        degree: 'Bachelor of Engineering, Computer Engineering',
        dates: 'Aug 2020 – May 2024',
        gpa: 'GPA: 8.33 / 10',
        location: 'Gujarat, India'
      }
    ]
  },

  experience: [
    {
      id: 'mindspark',
      code: 'LOG // 01',
      status: 'ACTIVE DEPLOYMENT',
      role: 'Software Developer',
      org: 'MindSpark',
      type: 'Part-time',
      dates: 'Jun 2026 – Present',
      location: 'Tempe, Arizona, United States · Remote',
      metrics: [
        '100% cardholder data isolated',
        '4 billing states reconciled',
        '2 grounded GenAI services',
        'Zero-downtime AppConfig prompts'
      ],
      bullets: [
        'Architected a 3-Lambda serverless onboarding pipeline with Stripe-hosted checkout, isolating 100% of cardholder data from internal databases and automating DynamoDB deduplication.',
        'Engineered an asynchronous EventBridge reconciler across 4 billing states using DynamoDB conditional writes, a 7-day TTL deduplication cache, and SQS DLQs to prevent state regression.',
        'Developed a role-based access gate (RBAC) using AWS Cognito JWT verification, preventing client identity spoofing and enabling 1-click payment recovery for abandoned checkouts.',
        'Deployed 2 serverless GenAI services querying across 3 DynamoDB tables to ground model outputs and mitigate hallucinations, enabling zero-downtime prompt updates via AWS AppConfig.'
      ],
      tech: [
        'AWS Lambda',
        'EventBridge',
        'DynamoDB',
        'SQS DLQ',
        'AWS Cognito',
        'AWS AppConfig',
        'Stripe',
        'Serverless GenAI'
      ]
    },
    {
      id: 'axisray',
      code: 'LOG // 02',
      status: 'MISSION COMPLETE',
      role: 'Software Engineer Intern',
      org: 'Axisray',
      type: 'Internship',
      dates: 'Jun 2023 – Jun 2024',
      location: 'Ahmedabad, Gujarat, India · On-site',
      metrics: [
        '30+ person daily HR platform',
        '~50% faster deployments',
        '95% YOLOv5 test accuracy',
        '10k images + 100 videos trained'
      ],
      bullets: [
        'Built a full-stack HR platform using Spring Boot, React, and MySQL integrated with AWS Lambda and S3, automating manual workflows for a 30+ person team.',
        'Engineered a voice-controlled query interface using AWS Lambda and Alexa Skills Kit, routing natural-language employee data queries through the Spring Boot backend.',
        'Implemented a CI/CD pipeline using AWS CodePipeline (CodeArtifact, CodeBuild, CodeDeploy) with GitHub webhooks, reducing estimated deployment time by ~50% and eliminating manual build errors.',
        'Custom-trained a YOLOv5 fire detection model from scratch on 10,000 images and 100 frame-extracted videos, achieving 95% accuracy on internal testing.'
      ],
      tech: [
        'Spring Boot',
        'React',
        'MySQL',
        'AWS Lambda',
        'Amazon S3',
        'Alexa Skills Kit',
        'AWS CodePipeline',
        'YOLOv5'
      ]
    }
  ],

  projectFilters: [
    { id: 'all', label: 'All Targets' },
    { id: 'cloud', label: 'AWS & Cloud' },
    { id: 'genai', label: 'GenAI & ML' },
    { id: 'distributed', label: 'Distributed' },
    { id: 'fullstack', label: 'Full-Stack' }
  ],

  projects: [
    {
      id: 'investor-intelligence',
      code: 'TGT // 01',
      title: 'AI-Powered Investor Intelligence Platform',
      categories: ['genai', 'cloud', 'distributed'],
      metric: '<15s SEC 10-K Research · 5 Years of Filings',
      summary:
        'Autonomous financial research agent on Amazon Bedrock (Claude 3 Haiku) with Tool Calling over official SEC EDGAR APIs and a hybrid pgvector + relational RAG pipeline.',
      problem:
        'Gathering company reports across multi-year SEC 10-K filings requires tedious manual searching across dense regulatory disclosures and time-series tables.',
      role: 'Backend & AI Systems Engineer — designed the autonomous Bedrock agent, hybrid pgvector schema, and WebSocket streaming pipeline.',
      result:
        'Slashed company report gathering from manual search to under 15 seconds across 5 years of 10-K filings, streaming analysis in real time via FastAPI WebSockets.',
      solution:
        'Architected an autonomous research agent using Amazon Bedrock (Claude 3 Haiku) and Tool Calling querying official SEC EDGAR APIs. Consolidated 1536-dim Titan vector embeddings and relational time-series metrics into a single Amazon RDS PostgreSQL (pgvector) instance for hybrid retrieval.',
      architecture: `[ Official SEC EDGAR APIs (5 yrs 10-K) ]
                 │
                 ▼
[ FastAPI Ingestion & Chunking Pipeline ]
                 │ ──> 1536-dim Amazon Titan Embeddings
                 ▼
[ Amazon RDS PostgreSQL + pgvector ]
   ├── Vector Similarity Search
   └── Relational Time-Series Metrics
                 ▲
                 │ Tool Calling + Hybrid RAG Context
                 ▼
[ Amazon Bedrock Agent (Claude 3 Haiku) ]
                 │
                 ▼
[ FastAPI WebSockets ] ──> Real-Time Analysis Stream`,
      stack: [
        'Amazon Bedrock',
        'Claude 3 Haiku',
        'Titan Embeddings',
        'PostgreSQL',
        'pgvector',
        'FastAPI',
        'WebSockets',
        'Python'
      ],
      repoUrl: 'https://github.com/Aksh9203',
      repoLabel: 'GitHub Profile',
      // TODO: Replace repoUrl with the dedicated repository URL if made public
      repoTodo: true
    },
    {
      id: 'safeguard-sos',
      code: 'TGT // 02',
      title: 'SafeGuard — Mobile SOS Application',
      categories: ['distributed', 'cloud', 'fullstack'],
      metric: 'O(N) → O(1) Indexed Geo-Lookup · 100% Terraform IaC',
      summary:
        'Uber H3 hexagonal emergency responder matching engine with pipelined Redis caching and modular Terraform-provisioned AWS Cognito security.',
      problem:
        'Emergency responder discovery relying on O(N) spatial scans slows down under load, while SOS workflows demand hardened identity and schema validation.',
      role: 'Backend & Cloud Infrastructure Engineer — built the H3/Redis search engine, Terraform Cognito IaC, and stateless JWT middleware.',
      result:
        'Accelerated emergency responder matching from O(N) spatial scans to O(1) indexed lookups across 11 dynamic rings (up to 2 miles) and automated 100% of cloud identity provisioning.',
      solution:
        'Engineered an Uber H3 hexagonal search engine (resolution 9) with pipelined Redis caching across 11 dynamic rings. Authored modular Terraform IaC for AWS Cognito (SRP auth) and deployed stateless JWT verification middleware paired with strict MongoDB BSON schemas.',
      architecture: `[ Mobile SOS Distress Request ]
                 │ (Authenticated via AWS Cognito SRP / JWT)
                 ▼
[ Stateless JWT Verification Middleware ]
                 │
                 ▼
[ Uber H3 Indexer (Resolution 9) ]
                 │ Computes 11 Dynamic Rings (up to 2 miles)
                 ▼
[ Pipelined Redis Cache ] ──> O(1) Indexed Responder Lookup
                 │
                 ▼
[ MongoDB (Strict BSON Schemas) ] ──> Persistent Incident Log`,
      stack: ['Uber H3', 'Redis', 'Terraform', 'AWS Cognito', 'JWT', 'MongoDB'],
      repoUrl: 'https://github.com/Aksh9203',
      repoLabel: 'GitHub Profile',
      // TODO: Replace repoUrl with the dedicated repository URL if made public
      repoTodo: true
    },
    {
      id: 'saga-travel-booking',
      code: 'TGT // 03',
      title: 'Distributed Saga Travel Booking System',
      categories: ['distributed', 'cloud'],
      metric: '3-Service Automated Rollback · Exactly-Once Delivery',
      summary:
        'Serverless Saga orchestrator on AWS Step Functions, Lambda, and DynamoDB managing distributed rollbacks across Flight, Hotel, and Payment microservices.',
      problem:
        'Coordinating bookings across independent Flight, Hotel, and Payment services causes dual-write errors, duplicate processing, and partial-failure drift without deterministic rollbacks.',
      role: 'Distributed Systems Engineer — architected the Step Functions Saga workflow, Outbox relay, idempotency layer, and DLQs.',
      result:
        'Eliminated dual-write errors and duplicate processing while executing automated compensating rollbacks across all 3 microservices.',
      solution:
        'Engineered a serverless Saga orchestrator with AWS Step Functions, AWS Lambda, and DynamoDB. Implemented the Transactional Outbox pattern, Idempotency keys, and Dead-Letter Queues (DLQs) to ensure exactly-once delivery and reliable state transitions.',
      architecture: `[ Booking Request ] ──> [ AWS Step Functions Saga Orchestrator ]
                                  │
      ┌───────────────────────────┼───────────────────────────┐
      ▼                           ▼                           ▼
[ 1. Flight Lambda ]       [ 2. Hotel Lambda ]        [ 3. Payment Lambda ]
   └─ Fail: Abort             └─ Fail: Release Flight    └─ Fail: Release Hotel & Flight
                                  │
                                  ▼
[ DynamoDB + Transactional Outbox + Idempotency Keys ] ──> [ SQS DLQ on Fault ]`,
      stack: [
        'AWS Step Functions',
        'AWS Lambda',
        'DynamoDB',
        'Transactional Outbox',
        'Idempotency',
        'SQS DLQ'
      ],
      repoUrl: 'https://github.com/Aksh9203/Distributed-Travel-Booking-Saga',
      repoLabel: 'View Repository',
      repoTodo: false
    },
    {
      id: 'edge-cloud-face-recognition',
      code: 'TGT // 04',
      title: 'Hybrid Edge-Cloud Face Recognition System',
      categories: ['cloud', 'genai', 'distributed'],
      metric: '0 → 15 EC2 Autoscale · <1.2s Avg Latency',
      summary:
        'SQS-driven EC2 autoscaling controller paired with an AWS IoT Greengrass MTCNN edge detector and MQTT-to-Lambda FaceNet recognition pipeline.',
      problem:
        'Bursty recognition workloads need rapid compute scaling without shipping empty "No-Face" frames over the network to cloud workers.',
      role: 'Cloud & Edge Engineer — built the queue-depth autoscaler and deployed the Greengrass edge-to-cloud recognition pipeline.',
      result:
        'Dynamically provisioned EC2 instances from 0 to 15 on SQS backlog, achieving <1.2s average response latency across a 100-request workload while returning "No-Face" results directly at the edge.',
      solution:
        'Built a queue-depth autoscaling controller provisioning EC2 app-tier instances from 0 to 15 based on SQS backlog. Deployed an AWS IoT Greengrass edge component running MTCNN on-device, routing detected faces through an MQTT-to-SQS-to-Lambda FaceNet pipeline.',
      architecture: `[ Edge Device (AWS IoT Greengrass + MTCNN) ]
      ├── No Face Detected ──> Return "No-Face" Immediately at Edge
      └── Face Detected ──> [ MQTT ] ──> [ Amazon SQS Backlog ]
                                                 │
                   ┌─────────────────────────────┴─────────────────────────┐
                   ▼                                                       ▼
    [ Queue-Depth Autoscaler (0 → 15 EC2) ]                    [ Lambda FaceNet Pipeline ]`,
      stack: [
        'AWS EC2',
        'AWS IoT Greengrass',
        'MTCNN',
        'FaceNet',
        'MQTT',
        'Amazon SQS',
        'AWS Lambda'
      ],
      repoUrl: 'https://github.com/Aksh9203',
      repoLabel: 'GitHub Profile',
      // TODO: Replace repoUrl with the dedicated repository URL if made public
      repoTodo: true
    },
    {
      id: 'movie-recommendation',
      code: 'TGT // 05',
      title: 'Movie Recommendation Engine',
      categories: ['cloud', 'distributed'],
      metric: '900k+ Records Processed · GCP Cloud Spanner',
      summary:
        'Scalable Java backend on Google Cloud Run leveraging GCP Pub/Sub and Cloud Spanner for asynchronous recommendation data processing.',
      problem:
        'Processing large-scale rating datasets without blocking interactive requests requires decoupled asynchronous ingestion and globally consistent storage.',
      role: 'Backend Engineer — built the Java Cloud Run services and Pub/Sub-to-Spanner ingestion flow.',
      result:
        'Processed 900k+ records asynchronously across containerized Java microservices backed by Google Cloud Spanner.',
      solution:
        'Implemented Java microservices deployed on Google Cloud Run, decoupled with GCP Pub/Sub topics for asynchronous event ingestion into Google Cloud Spanner.',
      architecture: `[ Client Requests ] ──> [ GCP Cloud Run (Java Services) ]
                                    │
                                    ▼
                           [ GCP Pub/Sub Topic ]
                                    │ (900k+ records async)
                                    ▼
                         [ Google Cloud Spanner ]`,
      stack: ['Java', 'GCP Cloud Run', 'GCP Pub/Sub', 'Cloud Spanner', 'Docker'],
      repoUrl: 'https://github.com/Aksh9203',
      repoLabel: 'GitHub Profile',
      // TODO: Replace repoUrl with the dedicated repository URL if made public
      repoTodo: true
    },
    {
      id: 'smart-code-editor',
      code: 'TGT // 06',
      title: 'Smart Code Editor',
      categories: ['fullstack', 'genai'],
      metric: 'Public Open-Source Repository',
      summary:
        'Web-based code editor application built with Python and JavaScript, available publicly on GitHub.',
      problem:
        'Streamlining browser-based code editing and execution workflows in a lightweight web interface.',
      role: 'Full-Stack Developer — designed and built the web client and backend integration.',
      result: 'Published open-source implementation in Aksh9203/Smart-Code-Editor.',
      solution:
        'Built an interactive browser code editor backed by a Python web service. Explore the source code directly on GitHub.',
      architecture: `[ Browser Editor Client ] ──> [ Python Web Backend ] ──> [ Execution & Output Feed ]`,
      stack: ['Python', 'JavaScript', 'Flask'],
      repoUrl: 'https://github.com/Aksh9203/Smart-Code-Editor',
      repoLabel: 'View Repository',
      repoTodo: false
    }
  ],

  skills: [
    {
      id: 'languages',
      nodeLabel: 'LANG',
      title: 'Languages',
      items: [
        { name: 'Java', level: 'Primary' },
        { name: 'Python', level: 'Primary' },
        { name: 'SQL', level: 'Primary' },
        { name: 'TypeScript', level: 'Production' },
        { name: 'JavaScript', level: 'Production' },
        { name: 'C / C++', level: 'Strong' },
        { name: 'C#', level: 'Familiar' }
      ]
    },
    {
      id: 'cloud',
      nodeLabel: 'CLOUD',
      title: 'Cloud & Infrastructure',
      items: [
        { name: 'AWS Lambda & Step Functions', level: 'Primary' },
        { name: 'AWS EventBridge & SQS', level: 'Primary' },
        { name: 'AWS Cognito & AppConfig', level: 'Primary' },
        { name: 'AWS EC2, S3 & API Gateway', level: 'Primary' },
        { name: 'AWS CodePipeline & SES', level: 'Production' },
        { name: 'AWS IoT Greengrass & Bedrock', level: 'Production' },
        { name: 'GCP (Cloud Run, Pub/Sub, Spanner, Storage)', level: 'Production' },
        { name: 'Terraform & Docker', level: 'Production' }
      ]
    },
    {
      id: 'frameworks',
      nodeLabel: 'FRAME',
      title: 'Frameworks & Libraries',
      items: [
        { name: 'Spring Boot / MVC / Security', level: 'Primary' },
        { name: 'FastAPI', level: 'Primary' },
        { name: 'React', level: 'Production' },
        { name: 'Flask', level: 'Production' },
        { name: 'Redux & React Query', level: 'Production' },
        { name: 'Hibernate & JUnit', level: 'Production' },
        { name: 'React Native', level: 'Familiar' },
        { name: 'ASP.NET Core & Entity Framework', level: 'Familiar' }
      ]
    },
    {
      id: 'databases',
      nodeLabel: 'DATA',
      title: 'Databases & Data',
      items: [
        { name: 'PostgreSQL & pgvector', level: 'Primary' },
        { name: 'Amazon DynamoDB', level: 'Primary' },
        { name: 'Redis', level: 'Primary' },
        { name: 'MySQL', level: 'Production' },
        { name: 'MongoDB', level: 'Production' },
        { name: 'SQL Server, SQLite, Oracle & Firebase', level: 'Familiar' }
      ]
    },
    {
      id: 'aiml',
      nodeLabel: 'AI/ML',
      title: 'AI & Machine Learning',
      items: [
        { name: 'Amazon Bedrock', level: 'Primary' },
        { name: 'Hybrid RAG & Vector Embeddings', level: 'Primary' },
        { name: 'Tool Calling', level: 'Primary' },
        { name: 'YOLOv5', level: 'Production' },
        { name: 'MTCNN & FaceNet', level: 'Production' },
        { name: 'LangChain & Hugging Face', level: 'Familiar' }
      ]
    },
    {
      id: 'concepts',
      nodeLabel: 'ARCH',
      title: 'Distributed Concepts & Tools',
      items: [
        { name: 'Microservices & Event-Driven Architecture', level: 'Primary' },
        { name: 'Saga Pattern & Transactional Outbox', level: 'Primary' },
        { name: 'Idempotency & Dead-Letter Queues', level: 'Primary' },
        { name: 'Uber H3 & MQTT', level: 'Production' },
        { name: 'Git, Postman, JIRA, Swagger, Socket.IO, Taiga', level: 'Production' }
      ]
    }
  ],

  /**
   * MCU-themed Easter Eggs (Engineering & Portfolio Flavor Only — no invented personal-life facts)
   */
  eggs: {
    mindStone: {
      id: 'mind-stone',
      classification: 'CLASSIFIED // MIND STONE SYNTHESIS',
      host: 'VISION',
      title: 'Why I Build the Invisible Layer',
      quote: '"A thing isn\'t beautiful because it lasts." — But well-architected backends should.',
      body: [
        "Most users never see an EventBridge reconciler, a Transactional Outbox table, or a DynamoDB conditional write—and that's the point. When the backend is designed cleanly, everything above it feels effortless.",
        'Three hard constraints define the engineering work I return to most: cutting manual SEC 10-K research to under 15 seconds with Bedrock Tool Calling, rolling back cleanly across 3 microservices with Step Functions Sagas, and replacing O(N) geospatial scans with O(1) Uber H3 + Redis lookups.'
      ],
      tags: ['Backend Engineering', 'Hard Constraints', 'Resilience']
    },
    infinityStones: {
      id: 'infinity-stones',
      classification: 'OMEGA CLEARANCE // ALL 6 STONES COLLECTED',
      host: 'J.A.R.V.I.S.',
      title: 'Six Verified Engineering Milestones',
      quote: '"I am inevitable." — Especially deterministic state machines.',
      stones: [
        {
          id: 'space',
          name: 'Space Stone',
          color: 'var(--stone-space)',
          section: 'hero',
          detail: 'O(N) → O(1) geospatial lookup across 11 Uber H3 rings (up to 2 miles) in SafeGuard.'
        },
        {
          id: 'mind',
          name: 'Mind Stone',
          color: 'var(--stone-mind)',
          section: 'about',
          detail: '2 serverless GenAI services at MindSpark grounded on 3 DynamoDB tables with zero-downtime AppConfig updates.'
        },
        {
          id: 'time',
          name: 'Time Stone',
          color: 'var(--stone-time)',
          section: 'experience',
          detail: 'Autonomous Bedrock research agent cutting manual 5-year SEC 10-K analysis to <15 seconds.'
        },
        {
          id: 'reality',
          name: 'Reality Stone',
          color: 'var(--stone-reality)',
          section: 'projects',
          detail: '4-state asynchronous EventBridge billing reconciler with 7-day TTL deduplication and SQS DLQs.'
        },
        {
          id: 'power',
          name: 'Power Stone',
          color: 'var(--stone-power)',
          section: 'skills',
          detail: 'SQS-driven EC2 autoscaler dynamically scaling 0 → 15 instances at <1.2s average latency.'
        },
        {
          id: 'soul',
          name: 'Soul Stone',
          color: 'var(--stone-soul)',
          section: 'contact',
          detail: '100% cardholder data isolation via a 3-Lambda Stripe-hosted checkout onboarding pipeline.'
        }
      ]
    },
    protocol3000: {
      id: 'protocol-3000',
      classification: 'PROTOCOL 3000 // RELIABILITY MANIFEST',
      host: 'J.A.R.V.I.S.',
      title: 'I Love Distributed Reliability 3000',
      quote: '"Part of the journey is the end." — Especially graceful failure recovery.',
      body: [
        'Every production system eventually meets network partitions, retries, and abandoned checkouts. These are the battle-tested safeguards wired across my projects and production work:'
      ],
      checklist: [
        'DynamoDB conditional writes + 7-day TTL deduplication cache to stop billing state regression',
        'Transactional Outbox + Idempotency keys + SQS DLQs for exactly-once Saga delivery',
        'AWS Cognito JWT RBAC preventing client identity spoofing with 1-click checkout recovery',
        'Zero-downtime GenAI prompt rollouts via AWS AppConfig grounded on internal DynamoDB tables'
      ]
    },
    paletteSecrets: {
      'jarvis, you up?': {
        id: 'palette-secrets',
        classification: 'TERMINAL // OVERRIDE 01',
        host: 'J.A.R.V.I.S.',
        title: 'For you, sir—always.',
        quote: '"Check the telemetry. All five synthetic hosts are online."',
        body: [
          'System status: MindSpark serverless pipelines active in Tempe, AZ. M.S. in Software Engineering at Arizona State University completed May 2026 (GPA 3.73/4.00). Ready for full-time backend, cloud, or GenAI missions.'
        ]
      },
      'avengers assemble': {
        id: 'palette-secrets',
        classification: 'TERMINAL // OVERRIDE 02',
        host: 'F.R.I.D.A.Y.',
        title: 'Core Stack Assembled',
        quote: '"Suiting up the full distributed systems roster."',
        body: [
          'Languages: Java, Python, TypeScript, SQL, C/C++.',
          'Cloud & Data: AWS (Lambda, Step Functions, EventBridge, DynamoDB, Bedrock, Cognito, AppConfig, EC2, IoT Greengrass), GCP (Cloud Run, Pub/Sub, Spanner), PostgreSQL + pgvector, Redis, Terraform, Docker.'
        ]
      },
      'i am iron man': {
        id: 'palette-secrets',
        classification: 'TERMINAL // OVERRIDE 03',
        host: 'E.D.I.T.H.',
        title: 'Mark LXXXV Architecture Principle',
        quote: '"Sometimes you gotta run before you can walk—just add a Dead-Letter Queue first."',
        body: [
          'Hard constraints produce the sharpest architectures: <15s autonomous SEC 10-K synthesis, O(1) Uber H3 responder matching, automated 3-service Saga rollbacks, and edge-first MTCNN filtering.'
        ]
      }
    },
    postCredits: {
      id: 'post-credits',
      classification: 'POST-CREDITS SCENE // STARK ARCHIVE',
      host: 'VISION',
      title: 'Aksh Chauhan Will Return…',
      quote: '"What is grief, if not perseverance?" — What is engineering, if not owning systems end to end?',
      body: [
        "Fresh off completing my M.S. in Software Engineering at ASU (May 2026) and shipping serverless AWS & GenAI systems at MindSpark, I'm actively looking for a full-time Software Engineer role in Backend, Cloud, or GenAI engineering.",
        "If you're building reliable distributed systems or grounded AI workflows and want someone who owns architecture from Terraform IaC to production telemetry—let's connect."
      ]
    },
    shawarma: {
      id: 'shawarma',
      classification: 'POST-BATTLE TRANSMISSION // SHAWARMA',
      host: 'J.A.R.V.I.S.',
      title: 'Shawarma after the battle?',
      quote: '"There\'s a shawarma joint about two blocks from here. I don\'t know what it is, but I wanna try it."',
      body: [
        "Email is copied and ready at akshrajesh9203@gmail.com. Whether it's a full-time Backend/Cloud/GenAI role, a distributed-systems deep dive, or a quick intro—drop a note anytime."
      ]
    }
  }
};
