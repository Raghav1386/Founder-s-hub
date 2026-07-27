import { cleanMarkdown } from './engine/cleanMarkdown.js';

console.log('=======================================================');
console.log('🧪 Testing cleanMarkdown.js Transformation Pipeline');
console.log('=======================================================\n');

// Sample test markdown containing HTML entities, chrome navigation, logins, footers, and source-specific boilerplate
const sampleNoisyMarkdown = `
Skip to main content
Screen Reader Access
Select Language | English | हिन्दी
Font Size: A+ A A-

# Navigation
Home > Startup Schemes
Toggle Navigation
Site Map

User Login
Sign Up / Register Here
Forgot Password?
Enter OTP

# Startup India Seed Fund Scheme
The Startup India Seed Fund Scheme (SISFS) &amp; related initiatives aim to provide financial assistance to startups for proof of concept, prototype development, product trials, market entry and commercialization.

## Eligibility Criteria
1. A startup, recognized by DPIIT, incorporated not more than 2 years ago at the time of application.
2. Startup India Hub registration &amp; valid PAN.
3. Financial grant up to Rs. 20 Lakhs for validation.

BHASKAR Portal
DPIIT Recognition Portal

Copyright © 2026 Startup India. All Rights Reserved.
Privacy Policy
Terms of Use
Disclaimer
Visitor Count: 123,456
Designed and Developed by National Informatics Centre
`;

const cleanedResult = cleanMarkdown(sampleNoisyMarkdown, 'StartupIndia');

console.log('--- CLEANED OUTPUT RESULT ---');
console.log(cleanedResult);
console.log('-----------------------------\n');

// Verification assertions
const tests = [
    {
        desc: 'HTML Entities decoded (&amp; -> &)',
        pass: cleanedResult.includes('(SISFS) & related initiatives') && cleanedResult.includes('registration & valid PAN')
    },
    {
        desc: 'Navigation text stripped',
        pass: !cleanedResult.includes('Skip to main content') && !cleanedResult.includes('Screen Reader Access') && !cleanedResult.includes('Toggle Navigation')
    },
    {
        desc: 'Language selector stripped',
        pass: !cleanedResult.includes('Select Language') && !cleanedResult.includes('Font Size')
    },
    {
        desc: 'Login/Register modals stripped',
        pass: !cleanedResult.includes('User Login') && !cleanedResult.includes('Forgot Password?') && !cleanedResult.includes('Enter OTP')
    },
    {
        desc: 'Footer & Copyright boilerplate stripped',
        pass: !cleanedResult.includes('Copyright ©') && !cleanedResult.includes('Privacy Policy') && !cleanedResult.includes('National Informatics Centre')
    },
    {
        desc: 'Source-specific boilerplate stripped (StartupIndia)',
        pass: !cleanedResult.includes('BHASKAR Portal') && !cleanedResult.includes('DPIIT Recognition Portal')
    },
    {
        desc: 'Actual article & scheme content PRESERVED',
        pass: cleanedResult.includes('Startup India Seed Fund Scheme (SISFS)') && cleanedResult.includes('A startup, recognized by DPIIT') && cleanedResult.includes('Financial grant up to Rs. 20 Lakhs')
    }
];

let allPassed = true;
tests.forEach(t => {
    const icon = t.pass ? '✅ PASS' : '❌ FAIL';
    console.log(`${icon}: ${t.desc}`);
    if (!t.pass) allPassed = false;
});

console.log('\n=======================================================');
if (allPassed) {
    console.log('🎉 ALL CLEANING TESTS PASSED SUCCESSFULLY!');
} else {
    console.error('❌ SOME TESTS FAILED! Check logic.');
    process.exit(1);
}
console.log('=======================================================');
