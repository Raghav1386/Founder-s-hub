import { isKnowledgePage } from './engine/isKnowledgePage.js';

console.log('=======================================================');
console.log('🧪 Testing isKnowledgePage.js Scoring Logic');
console.log('=======================================================\n');

const testCases = [
    {
        name: 'Valid Scheme Page',
        page: {
            url: 'https://www.startupindia.gov.in/content/sih/en/startup-scheme.html',
            title: 'Startup India Seed Fund Scheme Guidelines',
            markdown: 'The Startup India Seed Fund Scheme (SISFS) provides financial assistance to startups for proof of concept, prototype development, and commercialization. Eligibility criteria: DPIIT recognized startups.'
        },
        expected: true
    },
    {
        name: 'Login Form Page',
        page: {
            url: 'https://www.startupindia.gov.in/login.html',
            title: 'User Login - Startup India',
            markdown: 'Login to your account. Enter Captcha. Enter OTP. Forgot Password?'
        },
        expected: false
    },
    {
        name: 'User Dashboard Page',
        page: {
            url: 'https://www.startupindia.gov.in/user/dashboard',
            title: 'My Profile & Dashboard',
            markdown: 'Welcome User. Settings, Notifications, Account Details, Change Password.'
        },
        expected: false
    },
    {
        name: 'Policy Document Page',
        page: {
            url: 'https://www.msme.gov.in/policy/micro-small-enterprise-policy',
            title: 'National MSME Policy Overview & Incentives',
            markdown: 'The policy outlines financial subsidies, credit guarantee schemes, and industrial incentives for micro and small enterprises.'
        },
        expected: true
    },
    {
        name: 'Short Error/404 Page',
        page: {
            url: 'https://www.sidbi.in/error404',
            title: '404 - Page Not Found',
            markdown: 'Page not found.'
        },
        expected: false
    }
];

let allPassed = true;

testCases.forEach(tc => {
    const result = isKnowledgePage(tc.page);
    const pass = result === tc.expected;
    const icon = pass ? '✅ PASS' : '❌ FAIL';
    console.log(`${icon}: [${tc.name}] -> Evaluated: ${result} (Expected: ${tc.expected})`);
    if (!pass) allPassed = false;
});

console.log('\n=======================================================');
if (allPassed) {
    console.log('🎉 ALL KNOWLEDGE SCORING TESTS PASSED SUCCESSFULLY!');
} else {
    console.error('❌ SOME TESTS FAILED! Check scoring rules.');
    process.exit(1);
}
console.log('=======================================================');
