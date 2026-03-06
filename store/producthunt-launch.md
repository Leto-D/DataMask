# Product Hunt Launch Plan

## Tagline
Your AI chats are leaking data. DataMask fixes that — 100% locally.

## Description
DataMask is a Chrome extension that automatically pseudonymizes sensitive data (emails, names, IBANs, phone numbers) when you paste into ChatGPT, Claude, Gemini and 3 other AI chatbots.

Zero servers. Zero cloud. Everything runs in your browser.

It also includes a structured prompt builder with real-time quality scoring and AI-specific formatting.

## Topics
- Privacy
- Chrome Extensions
- Artificial Intelligence
- GDPR
- Productivity

## First Comment
Hey Product Hunt! I built DataMask because I kept seeing colleagues paste client names and emails into ChatGPT without thinking twice.

The problem: 64% of professionals worry about data leaks to AI, but 50% keep pasting sensitive data anyway.

DataMask sits quietly in your browser and pseudonymizes personal data at the moment you paste. "M. Dupont" becomes "[Nom_1]", "jean@company.com" becomes "[Email_1]".

Key design decisions:
- 100% client-side — your data never touches a server
- Fail-open on AI sites — if something breaks, your text still gets pasted (just without protection)
- 28 detection patterns with mathematical validation (Luhn, IBAN mod97)
- Encrypted compliance journal for GDPR audits

Would love your feedback, especially from anyone in legal, HR or healthcare who deals with sensitive data daily.

## Maker
LetoD

## Screenshots needed
1. Before/after pseudonymization on ChatGPT
2. Toast + PII badge on Claude
3. Prompt builder with quality score
4. Dashboard with stats
5. Trust badges: "100% Local | GDPR | EU AI Act Ready"
