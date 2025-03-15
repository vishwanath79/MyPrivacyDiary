import { GoogleGenerativeAI } from '@google/generative-ai';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Generative AI with API key from environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'No data provided' });
    }

    const prompt = `You are a privacy analysis tool. Analyze the following website tracking data and provide a JSON response (no markdown, no code blocks, just pure JSON):

Requests (${data.requests.length}):
${JSON.stringify(data.requests, null, 2)}

Cookies (${Array.from(data.cookies).length}):
${JSON.stringify(Array.from(data.cookies), null, 2)}

Scripts (${data.scripts.length}):
${JSON.stringify(data.scripts, null, 2)}

Known Tracking Patterns:
${JSON.stringify(data.trackingPatterns, null, 2)}

Respond with a JSON object containing:
- keyFindings: array of strings with main findings
- privacyConcerns: array of strings with privacy concerns
- recommendations: array of strings with actionable recommendations
- stats: object with totalTrackers (number), highImpactTrackers (number), cookiesDetected (number)
- detectedTrackers: array of objects, each with category (string), name (string), impact (low/medium/high), source (string)

IMPORTANT: Respond ONLY with the JSON object, no other text, no markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Clean the response text to ensure it's valid JSON
    let responseText = response.text().trim();
    responseText = responseText.replace(/^```json\s*/, '').replace(/```$/, '');
    
    try {
      const analysisData = JSON.parse(responseText);
      
      // Validate the structure
      if (!analysisData.keyFindings || !Array.isArray(analysisData.keyFindings) ||
          !analysisData.privacyConcerns || !Array.isArray(analysisData.privacyConcerns) ||
          !analysisData.recommendations || !Array.isArray(analysisData.recommendations) ||
          !analysisData.stats || typeof analysisData.stats !== 'object' ||
          !analysisData.detectedTrackers || !Array.isArray(analysisData.detectedTrackers)) {
        throw new Error('Invalid response structure');
      }
      
      return res.status(200).json(analysisData);
    } catch (parseError) {
      console.error('Failed to parse response:', responseText);
      return res.status(500).json({ error: 'Failed to parse analysis results' });
    }
  } catch (error) {
    console.error('Error in analysis:', error);
    return res.status(500).json({
      keyFindings: ['Error analyzing tracking data'],
      privacyConcerns: ['Unable to analyze privacy concerns'],
      recommendations: ['Please try again or refresh the page'],
      stats: {
        totalTrackers: 0,
        highImpactTrackers: 0,
        cookiesDetected: 0
      },
      detectedTrackers: []
    });
  }
} 