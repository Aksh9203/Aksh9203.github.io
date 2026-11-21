/**
 * Single Source of Truth for Aksh Chauhan's Portfolio
 * Every role, date, GPA, project, metric, and skill is strictly sourced
 * from Aksh's Resume, LinkedIn text, and GitHub profile.
 */

export const PORTFOLIO = {
  profile: {
    name: 'Aksh Chauhan',
    initials: 'AC',
    role: 'Software Engineer',
    focus: 'Backend · Cloud · GenAI',
    location: 'Tempe, Arizona',
    timezone: 'America/Phoenix',
    availability: 'Open to Full-Time SWE Roles',
    email: 'akshrajesh9203@gmail.com',
    resumePath: 'assets/Aksh_Chauhan_Resume.pdf',
    github: 'https://github.com/Aksh9203',
    linkedin: 'https://www.linkedin.com/in/aksh9/',
    headlineLead: 'I build the invisible layer',
    headlineAccent: 'everything depends on.',
    intro:
      'Software engineer and M.S. Software Engineering graduate (ASU, May 2026). Right now I build serverless AWS & GenAI systems at MindSpark—and I gravitate toward backend problems with a hard constraint.'
  },

  about: {
    paragraphs: [
      "I'm a software engineer who likes the backend side of things—the part nobody sees, but everything depends on. Right now I'm at MindSpark, where I build serverless systems on AWS. I put together a Stripe onboarding pipeline that keeps card data out of our systems entirely, an EventBridge reconciler that tracks billing across four states without letting anything slip or regress, and two GenAI services grounded on our own data with prompt updates that roll out without downtime.",
      "Before that I interned at Axisray, where I built a Spring Boot and React HR platform a 30+ person team actually used every day, wired up voice-driven employee queries with Alexa Skills Kit and AWS Lambda, and cut estimated deployment time roughly in half with an AWS CodePipeline CI/CD workflow.",
      "The projects I keep coming back to are the ones with a hard constraint in them: an autonomous research agent on Amazon Bedrock that turned manual SEC 10-K research into under 15 seconds, a Saga orchestrator that rolls back cleanly across three microservices when a booking fails halfway, and an emergency responder lookup on Uber H3 and Redis that went from scanning everything to a single indexed lookup."
    ],
    lookingFor:
      "I finished my M.S. in Software Engineering at Arizona State University in May 2026. I'm looking for a full-time Software Engineer role—backend, cloud, or GenAI—somewhere I can own systems end to end.",
    education: [
      {
        school: 'Arizona State University',
        degree: 'M.S. in Software Engineering',
        dates: 'Aug 2024 – May 2026',
        gpa: '3.73 / 4.00',
        location: 'Tempe, AZ'
      },
      {
        school: 'Gujarat Technological University',
        degree: 'B.E. in Computer Engineering',
        dates: 'Aug 2020 – May 2024',
        gpa: '8.33 / 10',
        location: 'Gujarat, India'
      }
    ]
  },

  experience: [
    {
      id: 'mindspark',
      org: 'MindSpark',
      role: 'Software Developer',
      type: 'Part-time',
      dates: 'Jun 2026 – Present',
      location: 'Tempe, AZ · Remote',
      highlights: [
        '100% cardholder data isolated',
        '4-state EventBridge reconciler',
        '2 grounded GenAI services',
        'Zero-downtime AppConfig prompts'
      ],
      bullets: [
        'Architected a 3-Lambda serverless onboarding pipeline with Stripe-hosted checkout, isolating 100% of cardholder data from internal databases and automating DynamoDB deduplication.',
        'Engineered an asynchronous EventBridge reconciler across 4 billing states using DynamoDB conditional writes, a 7-day TTL deduplication cache, and SQS DLQs to prevent state regression.',
        'Developed a role-based access gate (RBAC) using AWS Cognito JWT verification, preventing client identity spoofing and enabling 1-click payment recovery for abandoned checkouts.',
        'Deployed 2 serverless GenAI services querying across 3 DynamoDB tables to ground model outputs and mitigate hallucinations, enabling zero-downtime prompt updates via AWS AppConfig.'
      ],
      stack: [
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
      org: 'Axisray',
      role: 'Software Engineer Intern',
      type: 'Internship',
      dates: 'Jun 2023 – Jun 2024',
      location: 'Ahmedabad, India · On-site',
      highlights: [
        '30+ person daily HR platform',
        '~50% faster deployments',
        '95% YOLOv5 test accuracy',
        'Alexa voice query interface'
      ],
      bullets: [
        'Built a full-stack HR platform using Spring Boot, React, and MySQL integrated with AWS Lambda and S3, automating manual workflows for a 30+ person team.',
        'Engineered a voice-controlled query interface using AWS Lambda and Alexa Skills Kit, routing natural-language employee data queries through the Spring Boot backend.',
        'Implemented a CI/CD pipeline using AWS CodePipeline (CodeArtifact, CodeBuild, CodeDeploy) with GitHub webhooks, reducing estimated deployment time by ~50% and eliminating manual build errors.',
        'Custom-trained a YOLOv5 fire detection model from scratch on 10,000 images and 100 frame-extracted videos, achieving 95% accuracy on internal testing.'
      ],
      stack: [
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
    { id: 'all', label: 'All' },
    { id: 'cloud', label: 'AWS & Cloud' },
    { id: 'distributed', label: 'Distributed' },
    { id: 'genai', label: 'GenAI & ML' },
    { id: 'fullstack', label: 'Full-Stack' }
  ],

  projects: [
    {
      id: 'investor-intelligence',
      num: '01',
      title: 'AI-Powered Investor Intelligence Platform',
      categories: ['genai', 'cloud', 'distributed'],
      metric: '<15s across 5 yrs of SEC 10-K filings',
      summary:
        'Autonomous financial research agent on Amazon Bedrock (Claude 3 Haiku) with Tool Calling over SEC EDGAR APIs and a hybrid pgvector + relational RAG pipeline.',
      problem:
        'Manual SEC 10-K report gathering across five years of regulatory filings is slow, fragmented, and hard to cross-check against time-series metrics.',
      solution:
        'Architected an autonomous research agent using Amazon Bedrock (Claude 3 Haiku) and Tool Calling querying official SEC EDGAR APIs. Consolidated 1536-dim Amazon Titan vector embeddings and relational time-series metrics into a single Amazon RDS PostgreSQL (pgvector) instance, streaming analysis in real time via FastAPI WebSockets.',
      result:
        'Slashed company report gathering from manual search to under 15 seconds across 5 years of 10-K filings.',
      flow: ['SEC EDGAR APIs', '1536-dim Titan', 'RDS pgvector + SQL', 'Bedrock Haiku Agent', 'FastAPI WebSockets'],
      diagram: `[ Official SEC EDGAR APIs (5 yrs 10-K) ]
                 │
                 ▼
[ FastAPI Ingestion & Chunking Worker ]
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
      stack: ['Amazon Bedrock', 'Claude 3 Haiku', 'PostgreSQL', 'pgvector', 'FastAPI', 'WebSockets', 'Python'],
      repoUrl: 'https://github.com/Aksh9203',
      repoLabel: 'GitHub Profile',
      // TODO: Swap in direct repo URL if made public
      repoTodo: true
    },
    {
      id: 'safeguard-sos',
      num: '02',
      title: 'SafeGuard — Mobile SOS Application',
      categories: ['distributed', 'cloud', 'fullstack'],
      metric: 'O(N) → O(1) lookup · 11 Uber H3 rings',
      summary:
        'Hexagonal emergency responder matching engine using Uber H3 (res 9) and pipelined Redis caching, secured by Terraform-provisioned AWS Cognito SRP auth.',
      problem:
        'O(N) spatial scans choke emergency responder matching under load, and SOS apps demand automated, zero-drift identity provisioning.',
      solution:
        'Engineered an Uber H3 hexagonal search engine (resolution 9) with pipelined Redis caching across 11 dynamic rings (up to 2 miles). Authored modular Terraform IaC for AWS Cognito (SRP auth) and deployed stateless JWT verification middleware with strict MongoDB BSON schemas.',
      result:
        'Accelerated responder matching from O(N) spatial scans to O(1) indexed lookups and automated 100% of cloud identity provisioning.',
      flow: ['AWS Cognito SRP', 'Stateless JWT', 'Uber H3 (Res 9)', 'Pipelined Redis (11 Rings)', 'MongoDB BSON'],
      diagram: `[ Mobile SOS Distress Signal ]
                 │ (AWS Cognito SRP + Stateless JWT)
                 ▼
[ Uber H3 Hexagonal Indexer (Res 9) ]
                 │ Computes 11 Dynamic Rings (up to 2 miles)
                 ▼
[ Pipelined Redis Cache ] ──> O(1) Indexed Responder Lookup
                 │
                 ▼
[ MongoDB (Strict BSON Schemas) ] ──> Incident Persistence`,
      stack: ['Uber H3', 'Redis', 'Terraform', 'AWS Cognito', 'JWT', 'MongoDB'],
      repoUrl: 'https://github.com/Aksh9203',
      repoLabel: 'GitHub Profile',
      repoTodo: true
    },
    {
      id: 'saga-travel-booking',
      num: '03',
      title: 'Distributed Saga Travel Booking System',
      categories: ['distributed', 'cloud'],
      metric: '3-service automated rollback · Zero dual-writes',
      summary:
        'Serverless Saga orchestrator on AWS Step Functions, Lambda, and DynamoDB handling compensating rollbacks across Flight, Hotel, and Payment microservices.',
      problem:
        'Multi-service travel bookings suffer from partial failures, dual-write inconsistencies, and duplicate processing when a downstream step fails.',
      solution:
        'Engineered a serverless Saga orchestrator with AWS Step Functions, AWS Lambda, and DynamoDB to execute automated compensating rollbacks across 3 microservices. Implemented Transactional Outbox, Idempotency keys, and SQS DLQs.',
      result:
        'Eliminated dual-write errors and duplicate processing while guaranteeing clean compensating rollbacks across Flight, Hotel, and Payment.',
      flow: ['Step Functions Saga', 'Flight · Hotel · Payment', 'Transactional Outbox', 'Idempotency Keys', 'SQS DLQ'],
      diagram: `[ Booking Request ] ──> [ AWS Step Functions Saga Orchestrator ]
                                  │
      ┌───────────────────────────┼───────────────────────────┐
      ▼                           ▼                           ▼
[ 1. Flight Lambda ]       [ 2. Hotel Lambda ]        [ 3. Payment Lambda ]
   └─ Fail: Abort             └─ Fail: Release Flight    └─ Fail: Release Hotel & Flight
                                  │
                                  ▼
[ DynamoDB + Transactional Outbox + Idempotency Keys ] ──> [ SQS DLQ ]`,
      stack: ['AWS Step Functions', 'AWS Lambda', 'DynamoDB', 'Transactional Outbox', 'Idempotency', 'SQS DLQ'],
      repoUrl: 'https://github.com/Aksh9203/Distributed-Travel-Booking-Saga',
      repoLabel: 'View Repo',
      repoTodo: false
    },
    {
      id: 'edge-cloud-face-recognition',
      num: '04',
      title: 'Hybrid Edge-Cloud Face Recognition System',
      categories: ['cloud', 'genai', 'distributed'],
      metric: '0 → 15 EC2 autoscale · <1.2s avg latency',
      summary:
        'SQS backlog autoscaling controller paired with AWS IoT Greengrass MTCNN edge detection and an MQTT-to-Lambda FaceNet recognition pipeline.',
      problem:
        'Bursty recognition workloads need elastic scaling without sending empty "No-Face" video frames over the network to cloud compute.',
      solution:
        'Built a queue-depth autoscaling controller provisioning EC2 app-tier instances from 0 to 15 on SQS backlog. Deployed an AWS IoT Greengrass edge component running MTCNN on-device, routing detected faces via MQTT → SQS → Lambda FaceNet while returning "No-Face" directly at the edge.',
      result:
        'Achieved <1.2s average response latency across a 100-request workload while filtering empty frames at the edge.',
      flow: ['Greengrass MTCNN Edge', 'MQTT', 'SQS Backlog', 'EC2 0→15 Autoscaler', 'Lambda FaceNet'],
      diagram: `[ Edge Device (AWS IoT Greengrass + MTCNN) ]
      ├── No Face Detected ──> Return "No-Face" Directly at Edge
      └── Face Detected ──> [ MQTT ] ──> [ Amazon SQS Backlog ]
                                                 │
                   ┌─────────────────────────────┴─────────────────────────┐
                   ▼                                                       ▼
    [ Queue-Depth Autoscaler (0 → 15 EC2) ]                    [ Lambda FaceNet Pipeline ]`,
      stack: ['AWS EC2', 'AWS IoT Greengrass', 'MTCNN', 'FaceNet', 'MQTT', 'Amazon SQS', 'AWS Lambda'],
      repoUrl: 'https://github.com/Aksh9203',
      repoLabel: 'GitHub Profile',
      repoTodo: true
    },
    {
      id: 'movie-recommendation',
      num: '05',
      title: 'Movie Recommendation Engine',
      categories: ['cloud', 'distributed'],
      metric: '900k+ records · GCP Cloud Spanner',
      summary:
        'Scalable Java backend on Google Cloud Run utilizing GCP Pub/Sub and Cloud Spanner for asynchronous recommendation data processing.',
      problem:
        'Processing large interaction datasets asynchronously while maintaining global relational consistency.',
      solution:
        'Built containerized Java microservices hosted on Google Cloud Run, ingesting events asynchronously through GCP Pub/Sub into Google Cloud Spanner.',
      result: 'Processed 900k+ records asynchronously across GCP Cloud Run, Pub/Sub, and Cloud Spanner.',
      flow: ['Java Cloud Run', 'GCP Pub/Sub', 'Async Workers', 'Cloud Spanner'],
      diagram: `[ Client Requests ] ──> [ GCP Cloud Run (Java Services) ]
                                    │
                                    ▼
                           [ GCP Pub/Sub Topic ]
                                    │ (900k+ records async)
                                    ▼
                         [ Google Cloud Spanner ]`,
      stack: ['Java', 'GCP Cloud Run', 'GCP Pub/Sub', 'Cloud Spanner', 'Docker'],
      repoUrl: 'https://github.com/Aksh9203',
      repoLabel: 'GitHub Profile',
      repoTodo: true
    },
    {
      id: 'smart-code-editor',
      num: '06',
      title: 'Smart Code Editor',
      categories: ['fullstack', 'genai'],
      metric: 'Open-source repository',
      summary:
        'Browser-based code editor application built with Python, Flask, and JavaScript—available publicly on GitHub.',
      problem:
        'Providing a lightweight, integrated browser editing and execution workflow.',
      solution:
        'Built an interactive web code editor backed by a Python Flask service, published in Aksh9203/Smart-Code-Editor.',
      result: 'Public open-source implementation on GitHub.',
      flow: ['Browser Editor UI', 'Flask Backend', 'Execution Output'],
      diagram: `[ Browser Editor Client ] ──> [ Flask Web Backend ] ──> [ Output Stream ]`,
      stack: ['Python', 'JavaScript', 'Flask'],
      repoUrl: 'https://github.com/Aksh9203/Smart-Code-Editor',
      repoLabel: 'View Repo',
      repoTodo: false
    }
  ],

  skills: [
    {
      category: 'Languages',
      items: ['Java', 'Python', 'SQL', 'TypeScript', 'JavaScript', 'C / C++', 'C#']
    },
    {
      category: 'Cloud & Infrastructure',
      items: [
        'AWS Lambda',
        'Step Functions',
        'EventBridge',
        'SQS / DLQ',
        'DynamoDB',
        'API Gateway',
        'Cognito',
        'AppConfig',
        'EC2 & S3',
        'CodePipeline',
        'IoT Greengrass',
        'Amazon Bedrock',
        'GCP (Cloud Run, Pub/Sub, Spanner, Storage)',
        'Terraform',
        'Docker'
      ]
    },
    {
      category: 'Frameworks & Libraries',
      items: [
        'Spring Boot',
        'Spring MVC & Security',
        'FastAPI',
        'Flask',
        'React',
        'React Native',
        'Redux & React Query',
        'ASP.NET Core',
        'Hibernate & Entity Framework',
        'JUnit'
      ]
    },
    {
      category: 'Databases & Data',
      items: ['PostgreSQL', 'pgvector', 'DynamoDB', 'Redis', 'MySQL', 'MongoDB', 'SQL Server', 'SQLite', 'Oracle', 'Firebase']
    },
    {
      category: 'AI & Machine Learning',
      items: ['Amazon Bedrock', 'Hybrid RAG', 'Vector Embeddings', 'Tool Calling', 'YOLOv5', 'MTCNN', 'FaceNet', 'LangChain', 'Hugging Face']
    },
    {
      category: 'Architecture & Tools',
      items: [
        'Microservices',
        'Event-Driven Architecture',
        'Saga Pattern',
        'Transactional Outbox',
        'Idempotency Keys',
        'Uber H3',
        'MQTT',
        'Git',
        'Postman',
        'JIRA',
        'Swagger',
        'Socket.IO'
      ]
    }
  ]
};
