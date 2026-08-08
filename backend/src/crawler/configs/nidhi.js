export default {
    name: "DST NIDHI - National Initiative for Developing and Harnessing Innovations",
    baseUrl: "http://nidhi-prayas.org/",
    startUrls: [
        "http://nidhi-prayas.org/",
        "http://www.nidhi-eir.in/",
        "https://dst.gov.in/national-initiative-developing-and-harnessing-innovations-nidhi-program",
        "https://dst.gov.in/technology-business-incubators-tbi"
    ],
    allowedDomains: [
        "dst.gov.in",
        "www.dst.gov.in",
        "nidhi-prayas.org",
        "www.nidhi-prayas.org",
        "nidhi-eir.in",
        "www.nidhi-eir.in"
    ],
    includePatterns: [
        "nidhi",
        "tbi",
        "incubator",
        "technology-business-incubator",
        "prayas",
        "eir",
        "sss",
        "seed-support",
        "grant",
        "funding",
        "eligibility",
        "guidelines",
        "scheme",
        "startup"
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
        "news",
        "gallery",
        "staff"
    ],
    followLinks: true,
    maxDepth: 2,
    crawlFrequency: "weekly",
    tags: [
        "dst",
        "nidhi",
        "tbi",
        "incubator",
        "nidhi-prayas",
        "nidhi-eir",
        "nidhi-sss",
        "grant",
        "funding"
    ]
};
