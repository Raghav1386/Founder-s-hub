/**
 * founderProfileChain.js
 * 
 * Purpose:
 * LangChain JS chain utilizing Groq (ChatGroq) with LCEL and structured output (Zod).
 * Transforms raw founder onboarding form answers into a clean, structured JSON profile
 * and a concise searchText string for semantic vector search in Qdrant.
 */

import { ChatGroq } from '@langchain/groq';
import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Define Zod Schema for Structured Output
export const founderProfileZodSchema = z.object({
  summary: z
    .string()
    .describe('A clear 2-3 sentence executive summary of the startup, product, and mission.'),
  sector: z
    .string()
    .describe('Primary industry sector (e.g. Enterprise SaaS, FinTech, HealthTech, AgriTech, CleanTech, DeepTech, EdTech).'),
  subSector: z
    .string()
    .describe('Specific sub-sector or market niche (e.g. AI Supply Chain Analytics, B2B MSME Payments).'),
  businessModel: z
    .string()
    .describe('Core business & monetization model (e.g. B2B SaaS, B2C Subscription, Marketplace Commission, Freemium).'),
  technology: z
    .array(z.string())
    .describe('Key technologies, tech stack elements, or proprietary technical innovations.'),
  targetCustomers: z
    .string()
    .describe('Target customer persona or Ideal Customer Profile (ICP) (e.g. D2C e-commerce brands in India, MSMEs, Hospitals).'),
  keywords: z
    .array(z.string())
    .describe('5 to 10 relevant key terms for search indexing and incubator/grant matching.'),
  goals: z
    .array(z.string())
    .describe('Key short-term and strategic goals identified for the venture.'),
  challenges: z
    .array(z.string())
    .describe('Key operational or resource challenges and areas where support is needed.'),
  startupStage: z
    .string()
    .describe('Current stage of maturity (Idea, Research, Prototype, MVP, Early Revenue, Scaling).'),
  fundingIntent: z
    .string()
    .describe('Detailed summary of fundraising requirements, grant needs, or debt financing goals.'),
  confidenceScore: z
    .number()
    .min(0)
    .max(1)
    .describe('Confidence score between 0.0 and 1.0 evaluating the completeness and quality of input details.'),
  searchText: z
    .string()
    .describe('Government scheme targeted search query string. Example: "Government financial scheme grant subsidy seed fund incentive program for CleanTech startup in Karnataka. Stage: MVP. DPIIT: Yes. Seeking: Funding, Grant, Mentorship."')
});

// Prompt Template for LangChain
const SYSTEM_PROMPT = `You are an expert Startup Ecosystem Analyst and VC Investment Officer.
Analyze the following founder onboarding data and extract structured profile details.

FOUNDER ONBOARDING DATA:
- Startup Name: {startupName}
- Location (State/UT): {state}
- Incorporation Status: {incorporated}
- DPIIT Recognition: {dpiit}
- Startup Stage: {stage}
- Team Size: {teamSize}
- Support Needed: {supportNeeded}
- Funding Required: {fundingRequired}
- Pitch & Description: {description}

INSTRUCTIONS:
1. Synthesize the startup description and answers into structured insights.
2. Provide concise, professional, and precise values for all required fields.
3. Formulate a targeted "searchText" string prefixing with scheme retrieval intent:
   Example: "Government financial scheme grant subsidy seed fund incentive program for CleanTech startup in Karnataka. Stage: MVP. DPIIT: Yes. Seeking: Funding, Grant, Mentorship."
`;

const promptTemplate = PromptTemplate.fromTemplate(SYSTEM_PROMPT);

/**
 * Creates and returns the LCEL RunnableSequence with ChatGroq structured output.
 */
export function createFounderProfileChain() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is missing in environment variables.');
  }

  // Initialize ChatGroq instance
  const groqModel = new ChatGroq({
    apiKey: apiKey,
    model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
    temperature: 0.1
  });

  // Bind structured output using Zod schema
  const structuredLlm = groqModel.withStructuredOutput(founderProfileZodSchema, {
    name: 'founder_profile'
  });

  // Build LCEL Runnable Sequence: prompt -> structured LLM
  return promptTemplate.pipe(structuredLlm);
}

/**
 * Helper function to run the Founder Profile chain with raw onboarding payload
 * @param {Object} onboardingData Raw form payload
 * @returns {Promise<Object>} Structured founder profile object including searchText
 */
export async function analyzeFounderProfile(onboardingData) {
  const chain = createFounderProfileChain();

  // Normalize support array
  const supportStr = Array.isArray(onboardingData.supportNeeded)
    ? onboardingData.supportNeeded.join(', ')
    : onboardingData.supportNeeded || 'None specified';

  const inputPayload = {
    startupName: onboardingData.startupName || 'Unnamed Startup',
    state: onboardingData.state || onboardingData.stateUt || 'Not specified',
    incorporated: onboardingData.incorporated || onboardingData.isIncorporated || 'Not yet',
    dpiit: onboardingData.dpiit || onboardingData.dpiitRecognition || "Don't Know",
    stage: onboardingData.stage || onboardingData.startupStage || 'Idea',
    teamSize: onboardingData.teamSize || '1',
    supportNeeded: supportStr,
    fundingRequired: onboardingData.fundingRequired || onboardingData.fundingRequirement || 'None',
    description: onboardingData.description || ''
  };

  const result = await chain.invoke(inputPayload);
  return result;
}

export default analyzeFounderProfile;
