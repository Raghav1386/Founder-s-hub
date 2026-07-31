export const INDIAN_STATES_UTS = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

export const INCORPORATION_TYPES = [
  { value: "Not yet", label: "Not Yet", desc: "Operating as an informal or early-stage team" },
  { value: "Proprietorship", label: "Proprietorship", desc: "Single owner business entity" },
  { value: "Partnership", label: "Partnership Firm", desc: "Unregistered or registered partnership" },
  { value: "LLP", label: "LLP", desc: "Limited Liability Partnership" },
  { value: "Private Limited", label: "Private Limited (Pvt Ltd)", desc: "Incorporated under Companies Act" },
  { value: "OPC", label: "One Person Company (OPC)", desc: "Single member corporate entity" },
  { value: "Other", label: "Other Structure", desc: "Section 8, Trust, Society, etc." }
];

export const DPIIT_OPTIONS = [
  { value: "Yes", label: "Yes, Recognized", desc: "Has active DPIIT certificate" },
  { value: "No", label: "No", desc: "Have not applied for DPIIT" },
  { value: "Applied", label: "Application Pending", desc: "Submitted DPIIT application" },
  { value: "Don't Know", label: "Don't Know", desc: "Unsure about DPIIT status" }
];

export const STARTUP_STAGES = [
  { value: "Idea", label: "Idea", desc: "Conceptualizing solution and market hypothesis" },
  { value: "Research", label: "Research", desc: "Validating market feasibility and user survey" },
  { value: "Prototype", label: "Prototype", desc: "Building proof of concept or design wireframe" },
  { value: "MVP", label: "MVP", desc: "Working minimum viable product in beta testing" },
  { value: "Early Revenue", label: "Early Revenue", desc: "First paying customers & recurring revenue" },
  { value: "Scaling", label: "Scaling", desc: "Proven unit economics, expanding team & market" }
];

export const TEAM_SIZES = [
  { value: "1", label: "1 Founder", desc: "Solo Founder" },
  { value: "2–5", label: "2–5 People", desc: "Core Co-founding Team" },
  { value: "6–10", label: "6–10 People", desc: "Growing Core Team" },
  { value: "11–25", label: "11–25 People", desc: "Mid-sized Team" },
  { value: "25+", label: "25+ People", desc: "Established Organization" }
];

export const SUPPORT_NEEDED_OPTIONS = [
  { id: "Funding", label: "Funding", category: "Capital", icon: "Coins", desc: "Equity funding from VCs & Angels" },
  { id: "Grant", label: "Grant", category: "Capital", icon: "Gift", desc: "Non-dilutive government & corporate grants" },
  { id: "Loan", label: "Loan / Debt", category: "Capital", icon: "BuildingBank", desc: "Collateral-free startup credit & low-interest debt" },
  { id: "Mentorship", label: "Mentorship", category: "Guidance", icon: "UserCheck", desc: "Guidance from industry veterans & advisors" },
  { id: "Incubator", label: "Incubator", category: "Program", icon: "Flame", desc: "Co-working space & seed incubation program" },
  { id: "Accelerator", label: "Accelerator", category: "Program", icon: "Rocket", desc: "Fast-track growth program with investor access" },
  { id: "Government Procurement", label: "Govt Procurement", category: "Business", icon: "Building2", desc: "GeM portal listing & government tenders" },
  { id: "Tax Benefits", label: "Tax Exemptions", category: "Compliance", icon: "ShieldCheck", desc: "80-IAC tax exemption & Section 56 angel tax relief" },
  { id: "Patent/IP Support", label: "Patent / IP Support", category: "Legal", icon: "FileText", desc: "Fast-tracked IP filing & patent reimbursement" },
  { id: "Export Support", label: "Export Support", category: "Business", icon: "Globe", desc: "Cross-border trade, export subsidies & market access" },
  { id: "Networking", label: "Networking", category: "Community", icon: "Users", desc: "Investor meetups, founder circles & industry events" },
  { id: "Compliance Help", label: "Compliance Help", category: "Legal", icon: "Scale", desc: "Secretarial, regulatory filing & legal support" }
];

export const FUNDING_REQUIREMENTS = [
  { value: "<₹10L", label: "< ₹10 Lakhs" },
  { value: "₹10L–50L", label: "₹10 Lakhs – ₹50 Lakhs" },
  { value: "₹50L–2Cr", label: "₹50 Lakhs – ₹2 Crore" },
  { value: "₹2Cr+", label: "₹2 Crore +" }
];

export const STEPS_CONFIG = [
  {
    id: 1,
    title: "General Info",
    subtitle: "Tell us about your startup identity",
    fields: ["startupName", "stateUt"]
  },
  {
    id: 2,
    title: "Legal & Recognition",
    subtitle: "Incorporation and DPIIT status",
    fields: ["isIncorporated", "dpiitRecognition"]
  },
  {
    id: 3,
    title: "Stage & Team",
    subtitle: "Maturity level and team size",
    fields: ["startupStage", "teamSize"]
  },
  {
    id: 4,
    title: "Support & Funding",
    subtitle: "Identify your key growth needs",
    fields: ["supportNeeded", "fundingRequirement"]
  },
  {
    id: 5,
    title: "Startup Pitch",
    subtitle: "Describe your product, market & vision",
    fields: ["description"]
  }
];
