export default {
    name: "AWS Activate",
    provider: "AWS",
    opportunityType: "cloud_credit",
    baseUrl: "https://aws.amazon.com/activate/",
    startUrls: [
        "https://aws.amazon.com/activate/",
        "https://aws.amazon.com/activate/portfolio/",
        "https://aws.amazon.com/activate/founders/",
        "https://aws.amazon.com/activate/faq/"
    ],
    allowedDomains: [
        "aws.amazon.com",
        "www.aws.amazon.com"
    ],
    includePatterns: [
        "activate",
        "founders",
        "portfolio",
        "credits",
        "startup",
        "faq",
        "eligibility",
        "benefits"
    ],
    excludePatterns: [
        "login",
        "signin",
        "console",
        "dashboard",
        "pricing",
        "blogs",
        "news",
        "careers",
        "privacy",
        "terms",
        "documentation",
        "doc",
        "products",
        "services"
    ],
    followLinks: true,
    maxDepth: 2,
    crawlFrequency: "weekly",
    tags: [
        "cloud_credit",
        "aws",
        "amazon",
        "startup",
        "credits",
        "infrastructure"
    ]
};
