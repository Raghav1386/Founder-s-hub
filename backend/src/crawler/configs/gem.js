export default {
    name: "GeM_GovernmentEMarketplace",
    baseUrl: "https://gem.gov.in",
    startUrls: [
        "https://gem.gov.in/Startup_Runway",
        "https://gem.gov.in/business-opportunities",
        "https://gem.gov.in/support/government_oms_circulars",
        "https://gem.gov.in/support/buyers",
        "https://gem.gov.in/userFaqs",
        "https://gem.gov.in/gem_hand_book",
        "https://gem.gov.in/aboutus"
    ],
    allowedDomains: ["gem.gov.in"],
    excludePatterns: [
        "/gemtickets",
        "/login",
        "/feedback",
        "/contactUs",
        "/gallery",
        "/media",
        "/landing/index/careers",
        "/forum",
        "/sitemap",
        "/incidentmanagement",
        "/websitePolicies",
        "/terms-of-use"
    ],
    followLinks: true,
    maxDepth: 3,
    crawlFrequency: "weekly",
    tags: [
        "government",
        "procurement",
        "gem",
        "startup-runway",
        "seller-registration",
        "public-marketplace",
        "policy",
        "circular",
        "msme"
    ]
}