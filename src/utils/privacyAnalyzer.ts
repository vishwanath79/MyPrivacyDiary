import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzePrivacyImpact(results: any) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    const summary = `
      Website Analysis:
      Total Trackers: ${results.totalTrackers}
      Risk Level: ${results.riskLevel}

      Trackers by Category:
      ${results.trackers.map(category => `
        ${category.category.toUpperCase()}:
        ${category.trackers.map(t => `- ${t.name} (${t.impact} impact)`).join('\n')}
      `).join('\n')}
    `;

    const prompt = {
      contents: [{
        parts: [{
          text: `Analyze these website trackers and provide a privacy summary in the following format:

Key Findings:
• [List 2-3 key findings about tracker usage. Add line breaks between each point.]

Privacy Concerns:
• [List 2-3 main privacy concerns. Add line breaks between each point.]

Recommendations:
• [List 2-3 specific recommendations for users. Add line breaks between each point.]

Use the following data:
${summary}`
        }]
      }]
    };

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return {
      summary: response,
      riskLevel: results.riskLevel,
      concerningTrackers: results.trackers
        .flatMap(cat => cat.trackers)
        .filter(t => t.impact === 'high')
        .map(t => t.name),
      totalTrackers: results.totalTrackers
    };
  } catch (error) {
    console.error('Privacy analysis error:', error);
    return {
      summary: `
Key Findings:
• Found ${results.totalTrackers} trackers on this website
• ${results.trackers.flatMap(cat => cat.trackers).filter(t => t.impact === 'high').length} high-impact trackers detected
• Multiple tracking categories present

Privacy Concerns:
• Significant tracking activity detected
• Presence of high-impact trackers
• Various data collection methods in use

Recommendations:
• Use privacy-focused browser extensions
• Consider cookie consent settings carefully
• Monitor site permissions`,
      riskLevel: results.riskLevel,
      concerningTrackers: results.trackers
        .flatMap(cat => cat.trackers)
        .filter(t => t.impact === 'high')
        .map(t => t.name),
      totalTrackers: results.totalTrackers
    };
  }
} 