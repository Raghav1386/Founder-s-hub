export default {
    name: "Ministry of Agriculture & Farmers Welfare - Startup Schemes",
    baseUrl: "https://agriinfra.dac.gov.in/",
    startUrls: [
        "https://agriinfra.dac.gov.in/",
        "https://rkvy.nic.in/",
        "https://agricoop.gov.in/",
        "https://agriinfra.dac.gov.in/Home/AboutUs",
        "https://rkvy.nic.in/static/schemes/agri-entrepreneurship.html"
    ],
    allowedDomains: [
        "agriinfra.dac.gov.in",
        "rkvy.nic.in",
        "agricoop.gov.in",
        "www.agricoop.gov.in"
    ],
    includePatterns: [
        "aif",
        "agriinfra",
        "rkvy",
        "raftaar",
        "agri-entrepreneurship",
        "incubation",
        "grant",
        "subsidy",
        "loan",
        "scheme",
        "guideline",
        "eligibility",
        "funding",
        "startup",
        "agriculture"
    ],
    excludePatterns: [
        "login",
        "logout",
        "register",
        "dashboard",
        "profile",
        "privacy",
        "terms",
        "contact",
        "tenders",
        "careers",
        "weather",
        "mandi-prices",
        "news"
    ],
    followLinks: true,
    maxDepth: 2,
    crawlFrequency: "weekly",
    tags: [
        "agriculture",
        "aif",
        "rkvy-raftaar",
        "agri-startup",
        "grant",
        "subsidy",
        "funding",
        "incubator"
    ]
};
