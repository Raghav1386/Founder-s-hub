export default {
    name: "myScheme - Government Schemes Portal",
    baseUrl: "https://www.myscheme.gov.in/",
    startUrls: [
        "https://www.myscheme.gov.in/",
        "https://www.myscheme.gov.in/search",
        "https://www.myscheme.gov.in/schemes/business-entrepreneurship",
        "https://www.myscheme.gov.in/categories/business-entrepreneurship",
        "https://www.myscheme.gov.in/categories/science-technology-innovation"
    ],
    allowedDomains: [
        "myscheme.gov.in",
        "www.myscheme.gov.in"
    ],
    includePatterns: [
        "scheme",
        "schemes",
        "business-entrepreneurship",
        "science-technology",
        "startup",
        "grant",
        "fund",
        "financial-assistance",
        "subsidy",
        "loan",
        "eligibility",
        "benefit",
        "application"
    ],
    excludePatterns: [
        "login",
        "logout",
        "register",
        "signup",
        "dashboard",
        "profile",
        "privacy",
        "terms",
        "contact",
        "faq",
        "filter",
        "api",
        "assets"
    ],
    followLinks: true,
    maxDepth: 2,
    crawlFrequency: "weekly",
    tags: [
        "myscheme",
        "government-schemes",
        "india",
        "startup",
        "funding",
        "grant",
        "entrepreneurship"
    ]
};
