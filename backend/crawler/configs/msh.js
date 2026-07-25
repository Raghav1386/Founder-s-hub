export default {
    name: "MeitY Startup Hub",
    baseUrl: "https://msh.meity.gov.in/",
    startUrls: [
        "https://msh.meity.gov.in/",
        "https://msh.meity.gov.in/schemes/samridh",
        "https://msh.meity.gov.in/schemes/sasact"
    ],
    allowedDomains: [
        "msh.meity.gov.in",
        "meity.gov.in",
        "dic.gov.in"
    ],
    excludePatterns: [
        "/login",
        "/register",
        "/search",
        "/gallery",
        "/events",
        "/careers",
        "/contact",
        "/successtoryview",
        "/#"
    ],
    followLinks: true,
    maxDepth: 3,
    crawlFrequency: "weekly",
    tags: [
        "startup",
        "government",
        "india",
        "meity",
        "funding",
        "grant",
        "incubator",
        "accelerator",
        "scheme",
        "deeptech",
        "policy"
    ]
}