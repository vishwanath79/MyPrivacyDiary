# Who Can Track Me?

A privacy-focused web application that analyzes websites for tracking scripts, cookies, and potential privacy concerns. Powered by AI analysis using Google's Gemini model.

## Features

- **Real-time Website Analysis**: Scans websites for tracking scripts and cookies
- **AI-Powered Privacy Analysis**: Uses Gemini AI to provide detailed privacy impact assessments
- **Comprehensive Tracking Detection**:
  - Analytics tools
  - Social media trackers
  - Ad networks
  - Fingerprinting scripts
  - Cookie analysis
- **Risk Level Assessment**: Categorizes trackers by impact level (low, medium, high)
- **Privacy Recommendations**: AI-generated suggestions for privacy protection

## Setup

1. Clone and install dependencies:
```bash
git clone [your-repo]
cd tracker-analyzer
npm install
```

2. Set up environment variables:
```bash
# Create .env file and add your Gemini API key
GEMINI_API_KEY=your_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

## How It Works

1. **URL Analysis**: Enter any website URL to analyze
2. **Deep Scanning**: Uses Puppeteer to:
   - Detect tracking scripts
   - Monitor network requests
   - Analyze cookies
3. **AI Analysis**: Processes findings through Gemini AI to:
   - Assess privacy impact
   - Identify concerning trackers
   - Generate recommendations

## Privacy Patterns Detected

- Google Analytics
- Facebook Pixel
- Adobe Analytics
- Amplitude
- Heap Analytics
- Various ad networks
- Social media trackers
- Fingerprinting scripts
- And many more...

## API Endpoints

- `POST /api/analyze`: Performs initial website tracking analysis
- `POST /api/analyze/ai`: Generates AI-powered privacy analysis

## Tech Stack

- Next.js
- TypeScript
- Puppeteer (for website scanning)
- Google Gemini AI (for privacy analysis)
- Cheerio (for HTML parsing)