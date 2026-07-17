import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';

export const blogPosts = [
  {
    slug: 'ai-native-cloud-cost-optimization',
    title: 'Why cloud cost optimization needs an AI-native service',
    eyebrow: 'Company thesis',
    date: 'July 2026',
    readTime: '9 min read',
    image: '/assets/images/region-expansion.jpg',
    imageAlt: 'Cloud stack optimization planning session',
    summary: 'Migracle reduces enterprise cloud cost by optimizing the full stack end-to-end and migrating workloads when another provider offers better economics.'
  }
];

const sections = [
  {
    title: 'What problem are you solving?',
    body: [
      'Reducing cloud cost for enterprises in a comprehensive way by providing an AI native service.',
      'Comprehensive means we reduce costs in 2 ways -',
      '1. Optimize their entire cloud stack end to end ie their infra + application architecture + databases/storage + data pipelines.',
      '2. Migrate their cloud stack to a different cloud provider if they receive a better enterprise discount program or more efficient SKUs at other cloud provider.',
      'Unlike existing finops and infra optimization tools which are available as subscription products, we have chosen to solve this problem by providing an AI native service to uncover comprehensive savings that were not possible to achieve before frontier AI agents on coding tasks became available.'
    ]
  },
  {
    title: 'How big is the problem?',
    body: [
      'Total TAM in 2025 is - $30B and expected to grow by 2028 to - $36B (explained below)',
      'Explanation - Global public + private cloud spend has reached $549B in 2025 and expected to touch $1.018T by 2030.',
      'Out of this, public cloud (AWS/Azure/GCP/Alibaba/Oracle/IBM/Digital ocean/Hetzner/Vultr etc) spend is $395B and private cloud spend is $154B. Within $395B, the top 3 hyperscaler clouds GCP, AWS, Azure account for $268B and rest $127B is spent on other public clouds. Out of this $395B public cloud spend, AI (GPU, LLM API) spend is 15% ($59B) and rest 85% ($335B) is traditional workloads. We are going after optimizing the traditional workloads ie $335B market. At a lower estimate (see below) 29-35% of this $335B spend is recognized waste that can be recovered and 30% of that can be charged as fee by us ie ~9% of $335B = $30B. This $335B in 2025 is expected to grow up to $407B by 2028 and corresponding TAM is expected to grow from $30B to $36B in next 3 years.',
      'Note 1 - We have removed productivity software ie Google workspace, Microsoft Office365 and Linkedin from starting point ($549B) of these calculations even though Google and Microsoft report workspace/office together with cloud numbers in their quarterly earnings reports.',
      'Note 2- We also remove GPU and LLM inference spend in TAM calculations above. These AI spends are expected to grow much faster than traditional workloads but will also be much more volatile in where that spend is deployed with new ASIC accelerator hardware, closed and open weights frontier models, token compressors, cost aware model routers, new quantization techniques and small models matching previous year\'s frontier capability, are being launched almost every quarter.'
    ]
  },
  {
    title: 'Who has this problem? And what\'s their biggest pain point?',
    body: [
      'Cloud spend is a top ranked (at 85%) cloud concern by cloud decision makers (VP eng, CFO, CTO, CIO, CEO) and they rank it above product deployment velocity, cloud native adoption, multi region deployment etc. Their self reported estimates in multiple surveys are that between 29-35% i.e. of their cloud spend is currently wasted. Reducing cloud spend also unblocks additional funds for them to deploy to other strategic initiatives and AI using existing budgets.',
      'A big pain point for them will be - Cost of code has become close to 0, but cost of cloud is still same as before. So with an expected 7-10x growth in code and data generation, their traditional cloud workload costs are also going up. So optimizing the existing 29-35% wasted spend is an existing pain point and avoiding triple digit growth in cloud bills in future is an upcoming pain point.',
      'As an aside, a new trend in last 1 year is that due to memory(HBM) supply crunch from AI demand, memory optimized server prices have gone up by 20% and cloud providers are passing this costs to customers of high memory VMs, managed databases and in-memory caches.',
      'So multiple existing and new sources of wasted + increased cloud spend have become pain points.'
    ]
  },
  {
    title: 'What\'s the solution? How are you solving the problem?',
    body: [
      'We are creating an AI native service (ie service backed by frontier and fine tuned agents) to solve this pain point for enterprises. As summarized above, we do this in 2 ways -',
      '1. Cloud cost optimization - We ingest and analyze their entire cloud stack - ie terraform/cdk infra codebase, application codebase, configs, test scripts, CI/CD specs, database schema, internal documentation and most importantly production observability logs, metrics and traces. We also analyze their current billing data. From these inputs our model proposes potential changes in their infra + application architecture + databases/storage + data pipelines. The proposed changes are provisioned, tested and validated against a comprehensive test suite of unit tests, integration tests, per service request/response replays, e2e feature level request/response replays and load tests for verifying exact functionality and SLA parity, but with a lower cost. We do a monte carlo tree search on successful proposals to build on them and keep iterating to discover further optimizations. At the end we deliver end to end cost optimizations that were not even feasible previously within same time/cost budget.',
      '2. Cloud migration - We migrate their cloud stack to a different cloud provider if they receive a better enterprise discount program or more efficient SKUs at other cloud provider. The technical steps are similar to above.',
      'Even though these 2 ways of saving costs are very differnt business problems, from AI agent perspective it\'s a very similar task sequence - understand stack, propose a new stack, verify for correctness, iterate to fix failures, flag for human intervention when needed. The entire process can be significantly automated by an AI agent fine tuned on long context RL rollouts where reward signal is a combination of functionality parity, SLAs parity and reduced cost.'
    ]
  },
  {
    title: 'Why will you be the best product or service? Not just newer with AI, faster, cheaper.',
    body: [
      'We will be best in the domain and distinct due to 3 moats',
      '1. Business model moat - We are building this business as an AI native service and not a product narrowly focussed on a particular part of infra eg k8s or object/block storage or database optimization. While services model introduces lower margin concerns (gross margin dropping from 95% for saas to 30-40% for services), our thesis is that we are unlocking a much higher TAM. This thesis is being pursued by top VC firms eg Sequoia and YC - https://sequoiacap.com/article/services-the-new-software/',
      'In addition we are providing this as an outcome based service where we charge 30-40% of savings we deliver, so customers get an immediate 2.5-3x ROI immediately and recurring savings forever. In short we deliver recurrings savings, not recurring invoices.',
      '2. Tech moat - To make optimizations and migration proposals, we are building a new model architecture which is encoder only and trained on very long context of code + config + documentation + production logs + metrics + request/responses replays + traces. This new encoder only model has bidirectional attention and transforms long context input to a long context output in 1 single forward pass. I call it "Editformer".',
      'As a reality check, existing frontier models eg Fable 5 with max thinking are still at just 29% pass rate for senior swe tasks on limited domain github repos - https://snorkel.ai/leaderboard/senior-swe-bench/, so to make this problem feasible we need to invest in our model with long context, bidrectional attention and full sequence to sequence output instead of generative decoding.',
      '3. GTM moat - We will find our customers through cloud (GCP/AWS/Azure) partner networks marketplaces and Anthropic/OpenAI partner networks in addition to direct B2B sales. We are already signed up as GCP and Azure partners. Since we are solving cloud migration in addition to cloud optimization, these partner networks are a low CAC way to acquire customers.'
    ]
  },
  {
    title: 'If users don\'t use you, what choices do they have?',
    body: [
      'Traditionally to save costs, enterprises have relied on internal engineering projects with assistance from finops cost visibility tools eg Flexera, Vantage, Cloudzero, Apptio etc. However, engineering teams are usually accountable for delivering product roadmap and tagging the resources and not for driving cost savings. P&L responsibility starts at VP eng level and below them even engineering directors usually don\'t have cloud cost visibility.',
      'On the other hand, finops teams have visibility of overall cost and cost slices at product/project/team levels, but not of cloud resource usage efficiency or engineering architecture.',
      'And neither of 2 teams have knowledge of unexplored cheaper architectures or alternative infrastructure which can deliver same functionality + SLA at lower costs.',
      'The existing alternatives which solve adjacent problems are -',
      '1. Traditional finops observability tools eg Flexera, CloudZero, Vantage, Harness Cloud Cost Management, Finout.io, AWS/GCP/Azure cost explorer - They provide cost allocation visibility, chargeback/showback, alerts on cost spikes, dashboards and cost trend analysis.',
      '2. Autonomous cost optimization tools which are focused on',
      'a) either particular infra eg kubernetes optimization (cast.ai, zesty, scaleops), snowflake optimization (chaos genius) or',
      'b) reserved instance and savings plan commitment management (usage.ai, prosperops, archera, nops).',
      'All these either require manual work or cover only a subset of the possible optimizations. As a result of above organizational and technical limitations, cost optimization happens in a very limited way today.'
    ]
  },
  {
    title: 'Why will your customers absolutely love your product VS another solution?',
    body: [
      'Customers will love us because 1. We will unlock cost optimization that were not possible before. 2. Deliver this as an outcome based service with an immediate 2.5-3x ROI and 100% recurring savings after that.'
    ]
  },
  {
    title: 'Do you\'ve any traction/ early wins?',
    body: [
      'We are currently working with two customers ($70k and $180k cloud spend) and helping them reduce cloud cost by optimizing their cloud stack. Once those projects successfully complete, we\'ll potentially migrate the same customers to a different cloud and unlock $200-$350k cloud credits for them. I\'m doing cold outreach to more.'
    ]
  },
  {
    title: 'What makes you an awesome team that will win? What\'s your unfair advantage?',
    body: [
      'We are a team of 4 AI experts and cloud devops domain experts currently who love operations. This combination is perfect for solving cloud cost optimization and migration by building AI agents, fine tuning new model architectures and human in the loop workflows.'
    ]
  },
  {
    title: 'Anything you wish we asked about your idea?',
    body: [
      'You could ask for deeper analysis for existing players in finops industry ie their history, focus, funding, revenue, acquisitions etc. We are broadly in finops but adjacent to all existing players, so also a potential acquisition target if we execute well on above vision.'
    ]
  },
  {
    title: 'About finops industry',
    body: [
      'Based on multiple market research reports, finops is a ~$16B market cap industry and growing at 17% CAGR. North America accounts for 40% of global revenue.',
      'Market players - There\'s 3 broad segments 1. Enterprise finops companies eg IBM, Flexera which are doing mergers and acquisitions to build their portfolio serve mature, on prem and regulated enterprises. IBM acquired Aptio, Cloudability, and Kubecost in the last 4 years for $5.5B.',
      'Flexera acquired Prosperops, Chaos Genius, NetApps Spot.io, and Snow Software for around $1.5B',
      '2. Finops visiblity startups (series A - D) FinOps companies focusing on medium to large cloud native enterprises eg CloudZero, Vantage, Finout. They provide semi auto tagging, cost allcation, chargeback/showback, anomaly detection, multi cloud integration. They\'ve raised around $220M and have a total valuation of around $1.2 billion.',
      '3. Autonomous infra optimization startups - These are focused on Medium to Large Cloud-Native Enterprises eg - Cast AI, scale ops, zesty, harness, PointFive, doit etc. They do Kubernetes and VM right sizing, auto scaling, unused resource deletion, spot instance management. They have raised around $800M and have a total valuation of around $3.5 billion.',
      '4. Autonomous cloud commitment management - these focus on cloud commitment management - ProsperOps, nops, usage.ai, archera. They have raised around $150M and are valued at around $650M.'
    ]
  },
  {
    title: 'How will you use GCP?',
    body: [
      'At Migracle AI, we are build AI RL agents for cloud cost optimization and cloud migration. We plan to finetune Gemini (gemma 4) and other models using TPUs and GPUs. For enterprise customers, sending their production logs and observability data to 3p LLM providers is a security blocker and frontier models don\'t work well on this data for complex scenarios with long context, and so fine tuning Gemma models on long context data and hosting them within customer\'s VPC is the feasible path.'
    ]
  },
  {
    title: 'what are your achievements',
    body: [
      'I have worked in AI/ML for 16 years now. Received ACM SIGAI industry award. Was head of engineering at a medical AI startup acquired by Nvidia. My research paper from Microsoft Research has been part of courses at MIT and Columbia. Have done 17 angel investments with 4 exits.',
      'Launched Bard v1 (gemini) agents platform at Deepmind. Launched AutoML NLP GA (vertex ai) at GCP. Got a Transformative Impact (T) rating for delivering highest metrics growth over 2 year in Assistant discovery org.'
    ]
  },
  {
    title: 'References',
    body: [
      'Public cloud research - https://gemini.google.com/app/42de5961b775da89',
      'Cost saving priorirty - https://share.gemini.google/jxxzwfZunUll',
      'Finops market size and autonomous cost optimization market size - https://gemini.google.com/share/4da8ac0fa060?skid=5229b1e7-5d86-43f4-b40e-2727f4b88c49'
    ]
  }
];

const BlogList = () => {
  return (
    <section className="blog-page font-['Inter']" aria-label="Migracle Blog">
      <div className="container">
        <div className="blog-hero">
          <span className="mission-label">Blog</span>
          <h1>Ideas on cloud cost, AI-native services, and migration economics</h1>
          <p>
            Practical notes from Migracle on reducing cloud bills, extending cloud runway, and delivering parity-guaranteed infrastructure change.
          </p>
        </div>

        <div className="blog-list">
          {blogPosts.map((post) => (
            <a className="blog-card" href={`/blog/${post.slug}/`} key={post.slug}>
              <div className="blog-card-image-wrap">
                <img className="blog-card-image" src={post.image} alt={post.imageAlt} />
              </div>
              <div className="blog-card-copy">
                <span className="blog-eyebrow">{post.eyebrow}</span>
                <h2>{post.title}</h2>
                <div className="blog-meta-row">
                  <span><Calendar className="w-4 h-4" /> {post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <p>{post.summary}</p>
                <span className="blog-link">Read article <ArrowRight className="w-4 h-4" /></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const BlogPost = () => {
  const post = blogPosts[0];

  return (
    <article className="blog-page blog-article font-['Inter']" aria-label={post.title}>
      <div className="container">
        <a href="/blog/" className="blog-back">← Back to blog</a>
        <div className="blog-hero blog-article-hero">
          <span className="mission-label">{post.eyebrow}</span>
          <h1>{post.title}</h1>
          <p>{post.summary}</p>
          <div className="blog-meta-row blog-article-meta">
            <span><Calendar className="w-4 h-4" /> {post.date}</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        <div className="blog-content">
          {sections.map((section) => (
            <section className="blog-section" key={section.title}>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
};

const Blog = () => {
  const pathname = window.location.pathname.replace(/\/$/, '');

  if (pathname === '/blog/ai-native-cloud-cost-optimization') {
    return <BlogPost />;
  }

  return <BlogList />;
};

export default Blog;
