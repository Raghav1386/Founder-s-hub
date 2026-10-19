export default {
    name: "GeM_GovernmentEMarketplace",
    baseUrl: "https://gem.gov.in",
    startUrls: [
        "https://gem.gov.in/Startup_Runway",
        "https://gem.gov.in/business-opportunities"
    ],
    allowedDomains: [
        "gem.gov.in",
        "www.gem.gov.in"
    ],
    includePatterns: [
        "startup",
        "runway",
        "scheme",
        "opportunity",
        "incentive"
    ],
    excludePatterns: [
        "hand_book",
        "userFaqs",
        "support",
        "circulars",
        "login",
        "logout",
        "register",
        "signup",
        "dashboard",
        "profile",
        "notification-settings",
        "settings",
        "password",
        "privacy",
        "terms",
        "sitemap",
        "feedback",
        "contact",
        "subscribe",
        "search",
        "verify",
        "certificate",
        "download-certificate",
        "otp",
        "digilocker",
        "create-password",
        "reset-password",
        "account",
        "modal",
        "popup",
        "grievance",
        "careers",
        "tenders"
    ],
    followLinks: true,
    maxDepth: 3,
    crawlFrequency: "weekly",
    tags: [
        "gem",
        "government",
        "india",
        "procurement",
        "public-procurement",
        "startup-runway",
        "business-opportunity",
        "circular"
    ]
}