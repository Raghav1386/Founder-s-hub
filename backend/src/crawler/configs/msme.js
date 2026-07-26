export default {
    name: "MSME",
    baseUrl: "https://www.msme.gov.in",
    startUrls: [
        "https://www.msme.gov.in/offerings",
        "https://www.msme.gov.in/offerings/initiatives",
        "https://www.msme.gov.in/offerings/international-collaboration",
        "https://www.msme.gov.in/documents",
        "https://www.msme.gov.in/documents/orders-and-notices",
        "https://www.msme.gov.in/documents/budget-allocation",
        "https://www.msme.gov.in/documents/publications",
        "https://www.msme.gov.in/whats-new",
        "https://www.msme.gov.in/important-links"
    ],
    allowedDomains: [
        "msme.gov.in",
        "www.msme.gov.in"
    ],
    excludePatterns: [
        "/connect",
        "/search",
        "/sitemap",
        "/help",
        "/policies",
        "/cookies",
        "/RelatedLinks",
        "/offerings/vacancies",
        "/offerings/tenders",
        "/offerings/competitions-and-awards",
        "/media",
        "/ministry/our-team"
    ],
    followLinks: true,
    maxDepth: 3,
    crawlFrequency: "weekly",
    tags: [
        "startup",
        "government",
        "india",
        "msme",
        "funding",
        "scheme",
        "loan",
        "credit-guarantee",
        "grant",
        "policy",
        "notification"
    ]
}