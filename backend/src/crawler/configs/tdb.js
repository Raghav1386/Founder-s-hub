export default {
    name: "Technology Development Board (TDB)",
    baseUrl: "https://tdb.gov.in/",
    startUrls: [
        "https://tdb.gov.in/",
        "https://tdb.gov.in/financial-assistance/",
        "https://tdb.gov.in/guidelines/",
        "https://tdb.gov.in/loan-assistance/",
        "https://tdb.gov.in/equity-capital/",
        "https://tdb.gov.in/grant-in-aid/"
    ],
    allowedDomains: [
        "tdb.gov.in",
        "www.tdb.gov.in"
    ],
    includePatterns: [
        "financial-assistance",
        "loan",
        "equity",
        "grant",
        "guidelines",
        "scheme",
        "funding",
        "eligibility",
        "commercialization",
        "technology-development",
        "project-funding"
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
        "news",
        "board-members"
    ],
    followLinks: true,
    maxDepth: 2,
    crawlFrequency: "weekly",
    tags: [
        "tdb",
        "technology-development-board",
        "loan",
        "grant",
        "equity",
        "funding",
        "dst",
        "commercialization"
    ]
};
