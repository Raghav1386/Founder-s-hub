export default {
    name: "BIRAC - Biotechnology Industry Research Assistance Council",
    baseUrl: "https://birac.nic.in/",
    startUrls: [
        "https://birac.nic.in/",
        "https://birac.nic.in/bionest.php",
        "https://birac.nic.in/schemes.php",
        "https://birac.nic.in/national_biopharma_mission.php",
        "https://birac.nic.in/call_for_proposals.php"
    ],
    allowedDomains: [
        "birac.nic.in",
        "www.birac.nic.in"
    ],
    includePatterns: [
        "bionest",
        "big",
        "biotechnology-ignition-grant",
        "sparsh",
        "bipp",
        "pace",
        "seed",
        "incubator",
        "scheme",
        "schemes",
        "grant",
        "funding",
        "eligibility",
        "guideline",
        "call_for_proposals"
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
        "gallery",
        "rti",
        "news"
    ],
    followLinks: true,
    maxDepth: 2,
    crawlFrequency: "weekly",
    tags: [
        "birac",
        "biotech",
        "bionest",
        "incubator",
        "big-scheme",
        "sparsh",
        "grant",
        "funding",
        "bio-startup"
    ]
};
