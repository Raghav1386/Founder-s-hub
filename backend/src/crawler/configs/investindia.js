export default {
    name: "invest-india",
    baseUrl: "https://www.investindia.gov.in",
    startUrls: [
        "https://www.investindia.gov.in/india-opportunity",
        "https://www.investindia.gov.in/sectors/list",
        "https://www.investindia.gov.in/states/list",
        "https://www.investindia.gov.in/brochure",
        "https://www.investindia.gov.in/team-india-blogs/role-government-initiatives-boosting-startups",
        "https://www.investindia.gov.in/team-india-blogs/what-seed-funding-and-how-startup-india-can-help-you-raise-it-startup-india-seed",
        "https://www.investindia.gov.in/blogs/collateral-free-funding-reality-indian-entrepreneurs-credit-guarantee-scheme-startups",
        "https://www.investindia.gov.in/team-india-blogs/facilitating-startup-ecosystem-india-through-government-initiatives",
        "https://www.investindia.gov.in/team-india-blogs/scheme-facilitating-startups-intellectual-property-protection"
    ],
    allowedDomains: [
        "investindia.gov.in",
        "www.investindia.gov.in",
        "static.investindia.gov.in"
    ],
    excludePatterns: [
        "/careers",
        "/request-for-proposal",
        "/contact-us",
        "/invest-india-feedback",
        "/privacy_policy",
        "/terms-of-usage",
        "/team-india-blogs/indias-union-budget",
        "/about",
        "/efta-desk",
        "/global-investment-opportunities-for-indian-businesses",
        "/search",
        "/login"
    ],
    followLinks: true,
    maxDepth: 2,
    crawlFrequency: "monthly",
    tags: [
        "startup",
        "government",
        "funding",
        "investment",
        "FDI",
        "policy",
        "scheme",
        "incentive"
    ]
}