const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Job = require('./models/Job');

dotenv.config();

(async () => {
  try {
    await connectDB();

    // Find the recruiter user
    const recruiter = await User.findOne({ email: 'recruiter@example.com' });
    if (!recruiter) {
      console.error('Recruiter user recruiter@example.com not found. Please run seedUsers.js first.');
      process.exit(1);
    }

    // Clear existing jobs to ensure clean slate
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    const jobs = [
      // REMOTE / GLOBAL
      {
        title: 'Senior Staff Software Engineer',
        company: 'Google',
        location: 'Remote',
        salary: '$240,000',
        description: 'Lead engineering direction for our global web infrastructure team. Design and build next-generation distributed systems processing billions of requests daily. Mentor senior developers and collaborate across multiple product units.',
        createdBy: recruiter._id
      },
      {
        title: 'Principal Developer Advocate',
        company: 'GitHub',
        location: 'Remote',
        salary: '$165,000',
        description: 'Grow the developer ecosystem around GitHub Actions and Copilot. Create world-class educational videos, sample repos, and work directly with open-source communities.',
        createdBy: recruiter._id
      },

      // UNITED STATES
      {
        title: 'iOS Core Systems Engineer',
        company: 'Apple',
        location: 'San Francisco, CA',
        salary: '$185,000',
        description: 'Design and build the low-level rendering pipelines and operating systems features for Apple products. Collaborate with hardware and developer relations teams to optimize UX animations and high-performance apps.',
        createdBy: recruiter._id
      },
      {
        title: 'Azure Principal Architect',
        company: 'Microsoft',
        location: 'Seattle, WA',
        salary: '$195,000',
        description: 'Architect scalable cloud infrastructures and multi-tenant architectures. Drive technical designs of core distributed services to guarantee high reliability, security, and developer productivity.',
        createdBy: recruiter._id
      },
      {
        title: 'Deep Learning Research Scientist',
        company: 'NVIDIA',
        location: 'San Jose, CA',
        salary: '$220,000',
        description: 'Pioneer advanced computer vision and neural rendering algorithms for next-generation generative AI systems. Publish papers at top AI conferences and integrate state-of-the-art models into standard products.',
        createdBy: recruiter._id
      },
      {
        title: 'AI Alignment Research Engineer',
        company: 'OpenAI',
        location: 'San Francisco, CA',
        salary: '$350,000',
        description: 'Research safety measures, reinforcement learning from human feedback (RLHF), and alignment safety guardrails for extremely capable AI models. Help write reliable metrics scripts.',
        createdBy: recruiter._id
      },
      {
        title: 'Senior Cloud Security Analyst',
        company: 'Palo Alto Networks',
        location: 'New York, NY',
        salary: '$155,000',
        description: 'Conduct comprehensive security audits, design Zero-Trust architectures, and implement secure runtime containers for global enterprise clients.',
        createdBy: recruiter._id
      },

      // INDIA (Salaries formatted strictly in Rupees LPA)
      {
        title: 'Senior Associate Consultant',
        company: 'Infosys',
        location: 'Bangalore, India',
        salary: '₹12 LPA',
        description: 'Advise Fortune 500 clients on digital transformation strategies. Implement enterprise database pipelines and manage systems integrations and large migration schedules.',
        createdBy: recruiter._id
      },
      {
        title: 'Systems Engineer',
        company: 'TCS',
        location: 'Noida, India',
        salary: '₹6 LPA',
        description: 'Optimize high-throughput transaction processing systems for leading banks. Implement logging frameworks, unit test logic coverages, and automate integration deploys.',
        createdBy: recruiter._id
      },
      {
        title: 'Cloud Migration Lead',
        company: 'Cognizant',
        location: 'Pune, India',
        salary: '₹16 LPA',
        description: 'Lead hybrid cloud migration initiatives. Move legacy databases into containerized, autoscaling microservices architectures. Establish logging and metrics suites.',
        createdBy: recruiter._id
      },
      {
        title: 'Senior Project Manager',
        company: 'Wipro',
        location: 'Hyderabad, India',
        salary: '₹22 LPA',
        description: 'Oversee multi-million dollar software deliveries for logistics and aerospace partners. Keep agile sprints on track, track client approvals, and manage engineering capacities.',
        createdBy: recruiter._id
      },
      {
        title: 'DevOps Engineer',
        company: 'Capgemini',
        location: 'Chennai, India',
        salary: '₹9 LPA',
        description: 'Maintain CI/CD pipelines, configure Kubernetes clusters, and optimize cloud infrastructure spending. Secure secrets storage policies and implement dynamic backups.',
        createdBy: recruiter._id
      },
      {
        title: 'Staff AI/ML Engineer',
        company: 'TCS',
        location: 'Gurgaon, India',
        salary: '₹28 LPA',
        description: 'Build predictive model pipelines for e-commerce conversion optimizations. Work with PyTorch, AWS SageMaker, and establish high-speed feature stores.',
        createdBy: recruiter._id
      },
      {
        title: 'Technical Architect (React/Node)',
        company: 'Cognizant',
        location: 'Mumbai, India',
        salary: '₹32 LPA',
        description: 'Lead front-end architecture decisions across multiple internal product divisions. Design micro-frontend structures, reusable component libraries, and build design systems.',
        createdBy: recruiter._id
      },
      {
        title: 'Senior Data Engineer',
        company: 'Wipro',
        location: 'Kolkata, India',
        salary: '₹18 LPA',
        description: 'Design robust ETL pipelines to ingest and transform large-scale logs database formats. Manage Apache Spark, Snowflake databases, and optimize query latency.',
        createdBy: recruiter._id
      },
      {
        title: 'Database Administrator',
        company: 'Infosys',
        location: 'Ahmedabad, India',
        salary: '₹10 LPA',
        description: 'Secure, optimize, and maintain Oracle and PostgreSQL databases. Configure real-time replication clusters, automated failovers, and optimize indexing schemes.',
        createdBy: recruiter._id
      },

      // UNITED KINGDOM
      {
        title: 'Senior Backend Engineer (Infrastructure)',
        company: 'Spotify',
        location: 'London, UK',
        salary: '£95,000',
        description: 'Improve the real-time audio compression and low-latency streaming infrastructure supporting hundreds of millions of active accounts worldwide. Optimize network layouts and storage.',
        createdBy: recruiter._id
      },
      {
        title: 'UX/UI Product Designer',
        company: 'Deliveroo',
        location: 'Manchester, UK',
        salary: '£65,000',
        description: 'Craft beautiful, modern user experiences and checkout flows for millions of customers. Conduct user research and build highly interactive design system components.',
        createdBy: recruiter._id
      },

      // CANADA
      {
        title: 'Lead Frontend Engineer',
        company: 'Shopify',
        location: 'Toronto, ON',
        salary: '$145,000 CAD',
        description: 'Craft premium merchant dashboards and highly responsive web apps for millions of businesses worldwide. Establish custom design tokens, layout policies, and optimize runtime performance.',
        createdBy: recruiter._id
      },
      {
        title: 'Staff Site Reliability Engineer',
        company: 'Slack',
        location: 'Vancouver, BC',
        salary: '$150,000 CAD',
        description: 'Keep messaging systems highly available. Manage multi-region Kubernetes deployments, load balancers, and respond to platform bottlenecks using robust logging pipelines.',
        createdBy: recruiter._id
      },

      // GERMANY
      {
        title: 'Autonomous Driving Engineer',
        company: 'BMW',
        location: 'Munich, Germany',
        salary: '€85,000',
        description: 'Develop and test high-precision sensor fusion algorithms, lidar data pipelines, and control systems for Level 3/4 self-driving luxury vehicles. Work closely with hardware engineering teams.',
        createdBy: recruiter._id
      },
      {
        title: 'Staff Backend Architect (Go)',
        company: 'Delivery Hero',
        location: 'Berlin, Germany',
        salary: '€92,000',
        description: 'Scale our core food dispatch backend platform written in Go. Design event-driven communication protocols utilizing Apache Kafka and optimize geo-spatial routing queries.',
        createdBy: recruiter._id
      },

      // FRANCE
      {
        title: 'DevRel Engineer',
        company: 'Vercel',
        location: 'Paris, France',
        salary: '€80,000',
        description: 'Evangelize Vercel and Next.js developer ecosystems across Europe. Build beautiful open-source reference implementations, speak at global conferences, and build interactive technical content.',
        createdBy: recruiter._id
      },

      // AUSTRALIA
      {
        title: 'Senior Full Stack Developer',
        company: 'Atlassian',
        location: 'Sydney, Australia',
        salary: 'A$140,000',
        description: 'Build robust collaboration features for Jira and Confluence using modern React and Node.js. Guarantee premium rendering speed and write highly robust e2e test coverages.',
        createdBy: recruiter._id
      },

      // JAPAN
      {
        title: 'PlayStation Game Dev Lead',
        company: 'Sony',
        location: 'Tokyo, Japan',
        salary: '¥9,500,000',
        description: 'Direct high-end console game development projects. Write raw C++ rendering engines, optimize memory usage on next-gen hardware, and manage cross-functional dev sprints.',
        createdBy: recruiter._id
      },
      {
        title: 'Frontend Specialist (React/Next)',
        company: 'Nintendo',
        location: 'Kyoto, Japan',
        salary: '¥8,000,000',
        description: 'Build beautiful e-commerce web applications and interactive client lobbies for millions of active gamers globally. Optimize web graphics performance using WebGL.',
        createdBy: recruiter._id
      },

      // SINGAPORE
      {
        title: 'Database Developer',
        company: 'Supabase',
        location: 'Singapore, Singapore',
        salary: 'S$120,000',
        description: 'Design highly scalable, real-time database extensions for PostgreSQL. Work on database clustering, schema migration tooling, and help open-source databases scale infinitely.',
        createdBy: recruiter._id
      },

      // NETHERLANDS
      {
        title: 'SaaS Software Architect',
        company: 'Philips',
        location: 'Eindhoven, Netherlands',
        salary: '€95,000',
        description: 'Architect secure cloud infrastructures for global healthcare devices. Integrate low-latency real-time telemetry pipelines and secure API communication frameworks.',
        createdBy: recruiter._id
      },

      // IRELAND
      {
        title: 'Staff Payments Product Manager',
        company: 'Stripe',
        location: 'Dublin, Ireland',
        salary: '€110,000',
        description: 'Guide product roadmap for Stripe Billing and international currency processing suites. Translate enterprise requirements into API primitives that power global economic transaction streams.',
        createdBy: recruiter._id
      }
    ];

    for (const job of jobs) {
      const newJob = new Job(job);
      await newJob.save();
      console.log(`Created job: ${job.title} at ${job.company}`);
    }

    console.log(`Jobs seeding complete! Successfully seeded ${jobs.length} global tech jobs.`);
    process.exit(0);
  } catch (err) {
    console.error('Jobs seeding failed', err);
    process.exit(1);
  }
})();
