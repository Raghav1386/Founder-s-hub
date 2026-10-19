import dotenv from 'dotenv';
import connectDB from './src/configs/db.js';
import Document from './src/models/Document.js';

dotenv.config();

// Keywords that indicate actual schemes, grants, incubators, accelerators, or credit programs
const PROGRAM_POSITIVE_TERMS = [
  'scheme',
  'grant',
  'seed fund',
  'fund of funds',
  'incubation',
  'incubator',
  'accelerator',
  'nidhi',
  'prayas',
  'birac',
  'bionest',
  'big scheme',
  'sisfs',
  'tide',
  'samridh',
  'credit guarantee',
  'cgss',
  'tax exemption',
  '80-iac',
  'section 80',
  'subsidy',
  'soft loan',
  'concessional loan',
  'venture capital',
  'fellowship',
  'entrepreneur in residence',
  'eir',
  'cohort',
  'credits',
  'cloud program',
  'founders hub',
  'activate',
  'inception',
  'hatch',
  'for startups',
  'pegasus',
  'scale-up',
  'mentorship program'
];

// Heuristics for definitely non-scheme irrelevant content
function classifyDocument(doc) {
  const title = (doc.title || '').trim();
  const url = (doc.url || '').trim();
  const source = (doc.source || '').trim();
  const oppType = (doc.opportunityType || '').trim();
  const structured = doc.structured || {};
  const markdown = (doc.markdown || '').slice(0, 5000); // sample
  
  const t = title.toLowerCase();
  const u = url.toLowerCase();

  // 1. Technical / Product sales & marketing pages (Azure, Nvidia, Mongo, etc.)
  const isProductCatalog = 
    u.includes('/products/') ||
    u.includes('/ai-apps-for-rtx-pcs') ||
    u.includes('/ai-data-science') ||
    u.includes('/solutions/ai/') ||
    u.includes('ngc.nvidia.com') ||
    u.includes('/high-performance-computing') ||
    u.includes('/platforms/ai') ||
    u.includes('azure.microsoft.com/en-us/products') ||
    u.includes('azure.microsoft.com/en-us/explore') ||
    u.includes('cloud.google.com/ai') ||
    u.includes('mongodb.com/products') ||
    u.includes('mongodb.com/cloud/atlas') ||
    t.includes('virtual machines') ||
    t.includes('database for') ||
    t.includes('cosmos db') ||
    t.includes('kubernetes service') ||
    t.includes('ai foundry') ||
    t.includes('copilot') ||
    t.includes('azure arc') ||
    t.includes('foundry agent') ||
    t.includes('foundry models') ||
    t.includes('ai models | nvidia') ||
    t.includes('ai inference backends') ||
    t.includes('hpc containers') ||
    t.includes('autonomous vehicles') ||
    t.includes('cybersecurity solutions') ||
    t.includes('atlas database') ||
    t.includes('stream processing') ||
    t.includes('learning hub');

  if (isProductCatalog && !u.includes('startup') && !t.includes('startup') && !t.includes('inception')) {
    return { isScheme: false, category: 'Commercial Product / Tech Documentation', reason: `Product feature/sales page (${title})` };
  }

  // 2. Customer Stories & Case Studies
  const isCaseStudy = 
    u.includes('/library/atlas-database') ||
    u.includes('/case-studies') ||
    u.includes('/customer-stories') ||
    u.includes('/success-stories') ||
    t.includes('powers ai innovation') ||
    t.includes('brings scalability') ||
    t.includes('allowing developers to focus') ||
    t.includes('optimizing your internal developer platform') ||
    t.includes('success story') ||
    t.includes('kaggel grandmasters');

  if (isCaseStudy) {
    return { isScheme: false, category: 'Case Study / Customer Showcase', reason: `Customer case study/whitepaper (${title})` };
  }

  // 3. Financial retail products / General Banking (Fixed deposits, savings)
  if (t.includes('fixed deposit') || u.includes('fixed-scheme') || u.includes('fixed-deposit') || t.includes('senior citizen')) {
    return { isScheme: false, category: 'Retail Banking / Personal Finance', reason: `Retail fixed deposit product (${title})` };
  }

  // 4. Macro Reports, Surveys, Newsletters, Podcasts
  if (
    u.includes('/annualreports') || 
    u.includes('microfinance-pulse') || 
    t.includes('microfinance pulse') || 
    t.includes('annual report') || 
    t.includes('msme sector – progress and challenges') ||
    u.includes('/ai-podcast') ||
    t.includes('ai podcast') ||
    t.includes('states startup ranking') ||
    u.includes('/srf/home') ||
    u.includes('nsa5.0results')
  ) {
    return { isScheme: false, category: 'Macro Report / Research / Newsletter / Podcast', reason: `Report/Survey/Podcast (${title})` };
  }

  // 5. Portal Utilities, UI, Legal, Notices, Forms, Lists
  if (
    u.includes('/logo-form') ||
    u.includes('/show-user-list') ||
    u.includes('/notice-board') ||
    t.includes('notice board') ||
    t.includes('disclaimer') ||
    u.includes('/disclaimer') ||
    u.includes('/privacy') ||
    t.includes('privacy policy') ||
    u.includes('/hyperlink-policy') ||
    t.includes('regulatory updates') ||
    u.includes('/regulatory_updates') ||
    u.includes('/support/government_oms_circulars') ||
    t.includes('logo request') ||
    t.includes('archive-notice') ||
    u.includes('/userfaqs/') ||
    t.includes('incident faqs') ||
    t.includes('services faqs') ||
    t.includes('forward auction faqs') ||
    t.includes('gem_hand_book') ||
    t.includes('hand book') ||
    t.includes('sitemap') ||
    u.endsWith('/faqs.html') ||
    t === 'faq' ||
    t === 'blogs' ||
    u.includes('/bloglist.html') ||
    u.includes('startup_india_notes.html')
  ) {
    return { isScheme: false, category: 'Portal Utility / Form / FAQ / Notice / Legal', reason: `Utility/Legal/Form/FAQ (${title})` };
  }

  // 6. Generic homepages with no specific program details
  if (
    (u === 'https://www.startupindia.gov.in/' || u === 'https://www.startupindia.gov.in/content/sih/en/home-page.html' || t === 'home' || t === 'startup india') &&
    !u.includes('startup-scheme') && !u.includes('government-schemes') && !u.includes('incubator-schemes')
  ) {
    // Check if it's the bare portal root
    if (u === 'https://www.startupindia.gov.in/' || u === 'https://www.startupindia.gov.in/content/sih/en/home-page.html') {
      return { isScheme: false, category: 'Portal Homepage / Generic Root', reason: `Root portal landing page (${title})` };
    }
  }

  // 7. Check if it's a genuine Cloud Credit or Startup Incentive Program
  if (
    ['AWS Activate', 'Microsoft for Startups', 'Google for Startups Cloud Program', 'NVIDIA Inception', 'MongoDB for Startups', 'DigitalOcean Hatch', 'Cloudflare for Startups'].includes(source) ||
    oppType === 'cloud_credit'
  ) {
    // If it's the actual startup program or program benefits/tiers/FAQ
    if (
      u.includes('/startups') ||
      u.includes('/startup') ||
      u.includes('/inception') ||
      u.includes('hatch') ||
      u.includes('activate') ||
      t.includes('inception') ||
      t.includes('for startups') ||
      t.includes('pegasus') ||
      t.includes('accelerator') ||
      t.includes('perks') ||
      t.includes('benefits')
    ) {
      return { isScheme: true, category: 'Startup Program / Cloud Credit', reason: 'Official Startup Cloud/Perk Program' };
    } else {
      // It was crawled under a cloud source but points to a non-startup page
      return { isScheme: false, category: 'Non-Startup Cloud Infrastructure Page', reason: `Sub-page outside startup program scope (${title})` };
    }
  }

  // 8. Government schemes, grants, incubators
  return { isScheme: true, category: 'Government Scheme / Grant / Policy', reason: 'Government scheme or policy' };
}

async function run() {
  await connectDB();
  const docs = await Document.find({}).lean();
  console.log(`Auditing ${docs.length} documents...\n`);

  const results = {
    validSchemes: [],
    invalidDocs: [],
    invalidByCategory: {}
  };

  for (const doc of docs) {
    const classification = classifyDocument(doc);
    if (classification.isScheme) {
      results.validSchemes.push({ id: doc._id, title: doc.title, url: doc.url, source: doc.source, category: classification.category });
    } else {
      results.invalidDocs.push({ id: doc._id, title: doc.title, url: doc.url, source: doc.source, category: classification.category, reason: classification.reason });
      results.invalidByCategory[classification.category] = (results.invalidByCategory[classification.category] || 0) + 1;
    }
  }

  console.log(`=======================================================`);
  console.log(`📊 FINAL SMART AUDIT RESULTS`);
  console.log(`=======================================================`);
  console.log(`Total Documents in Database:         ${docs.length}`);
  console.log(`✅ Genuine Schemes & Startup Programs: ${results.validSchemes.length}`);
  console.log(`❌ Irrelevant Non-Scheme Documents:   ${results.invalidDocs.length}`);
  console.log(`=======================================================`);
  console.log(`\nBreakdown of Irrelevant Documents:`);
  for (const [cat, count] of Object.entries(results.invalidByCategory)) {
    console.log(` - ${cat}: ${count}`);
  }

  console.log(`\nSample of Invalid Documents (first 10):`);
  results.invalidDocs.slice(0, 10).forEach((d, idx) => {
    console.log(` ${idx + 1}. [${d.category}] "${d.title}" -> ${d.url}`);
  });

  process.exit(0);
}

run().catch(console.error);
