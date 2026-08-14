import { z } from 'zod';

/**
 * schemeSchema.js
 * 
 * Purpose:
 * Defines the Zod schema for structured output extraction using Gemini and LangChain.
 * This schema guarantees that the JSON extracted from government scheme documents 
 * conforms to a predictable structure.
 */

export const schemeSchema = z.object({
    summary: z
        .string()
        .describe('A concise 2-3 sentence overview of the government scheme or document.'),
        
    eligibility: z.object({
        dpiitRequired: z
            .union([z.boolean(), z.string()])
            .transform((val) => {
                if (typeof val === 'string') return val.toLowerCase() === 'true';
                return Boolean(val);
            })
            .describe('True if DPIIT startup recognition is mandatory/required to apply, false otherwise.'),
            
        startupStages: z
            .array(z.string())
            .describe('Applicable startup stages, e.g. ["Ideation", "Validation", "Early Traction", "Scaling"].'),
            
        sectors: z
            .array(z.string())
            .describe('Target industry sectors, e.g. ["Agriculture", "FinTech", "Healthcare", "All Sectors"].'),
            
        states: z
            .array(z.string())
            .describe('Applicable Indian states or UTs, e.g. ["All India", "Maharashtra", "Karnataka"].'),
            
        entityTypes: z
            .array(z.string())
            .describe('Eligible entity types, e.g. ["Private Limited", "LLP", "Sole Proprietorship", "Individual"].')
    }).passthrough().describe('Eligibility criteria for the scheme.'),

    benefits: z
        .array(z.string())
        .describe('Key financial and non-financial benefits provided by the scheme.'),

    funding: z.object({
        type: z
            .string()
            .describe('Type of funding provided, e.g. "Grant", "Soft Loan", "Equity", "Subsidy", "Tax Exemption", "N/A".'),
            
        amount: z
            .string()
            .describe('Maximum funding amount or financial support scale, e.g. "Up to ₹20 Lakhs", "N/A".')
    }).describe('Funding details.'),

    requiredDocuments: z
        .array(z.string())
        .describe('List of documents required for applying to this scheme.'),

    applicationProcess: z
        .array(z.string())
        .describe('Step-by-step process or procedure to apply for the scheme.'),

    deadline: z
        .string()
        .describe('Application deadline or intake timeline, e.g. "Rolling / Open All Year", "31st December 2026", "N/A".'),

    keywords: z
        .array(z.string())
        .describe('Relevant keywords, tags, or domain terms associated with this document for search.')
}).passthrough();

export default schemeSchema;
