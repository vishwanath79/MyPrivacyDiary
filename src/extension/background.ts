// Import types
type TrackerData = {
  requests: Array<{
    url: string;
    type: string;
    method: string;
  }>;
  cookies: Array<string>;
  scripts: Array<{
    src: string;
    content: string;
  }>;
};

// Define tracking patterns inline for service worker
const TRACKING_PATTERNS = {
  analytics: [
    // Basic Analytics
    { pattern: 'google-analytics.com', name: 'Google Analytics', impact: 'high' },
    { pattern: 'analytics.js', name: 'Generic Analytics', impact: 'medium' },
    { pattern: 'gtag', name: 'Google Tag Manager', impact: 'high' },
    { pattern: 'googletagmanager.com', name: 'Google Tag Manager', impact: 'high' },
    { pattern: 'tealium.com', name: 'Tealium IQ', impact: 'high' },
    { pattern: 'tealiumiq.com', name: 'Tealium IQ', impact: 'high' },
    { pattern: 'tiqcdn.com', name: 'Tealium CDN', impact: 'high' },
    { pattern: 'segment.com', name: 'Segment', impact: 'high' },
    { pattern: 'mixpanel.com', name: 'Mixpanel', impact: 'high' },
    { pattern: 'statcounter.com', name: 'StatCounter', impact: 'medium' },
    { pattern: 'quantserve.com', name: 'Quantcast', impact: 'high' },
    { pattern: 'chartbeat.com', name: 'Chartbeat', impact: 'medium' },
    { pattern: 'parsely.com', name: 'Parse.ly', impact: 'medium' },
    { pattern: 'newrelic.com', name: 'New Relic', impact: 'medium' },
    { pattern: 'datadog', name: 'Datadog RUM', impact: 'medium' },
    { pattern: 'dynatrace.com', name: 'Dynatrace', impact: 'medium' },
    { pattern: 'comscore.com', name: 'ComScore', impact: 'high' },
    
    // Behavior Analytics
    { pattern: 'hotjar.com', name: 'Hotjar', impact: 'high' },
    { pattern: 'mouseflow.com', name: 'Mouseflow', impact: 'high' },
    { pattern: 'clarity.ms', name: 'Microsoft Clarity', impact: 'medium' },
    { pattern: 'luckyorange.com', name: 'Lucky Orange', impact: 'high' },
    { pattern: 'crazyegg.com', name: 'Crazy Egg', impact: 'medium' },
    { pattern: 'clicktale.net', name: 'Clicktale', impact: 'high' },
    { pattern: 'inspectlet.com', name: 'Inspectlet', impact: 'high' },
    { pattern: 'heatmap.it', name: 'Heatmap', impact: 'medium' },
    { pattern: 'contentsquare.com', name: 'Contentsquare', impact: 'high' },
    { pattern: 'decibel.com', name: 'Decibel Insight', impact: 'high' },
    { pattern: 'glassbox.com', name: 'Glassbox', impact: 'high' },
    
    // Privacy-Focused Analytics
    { pattern: 'plausible.io', name: 'Plausible Analytics', impact: 'low' },
    { pattern: 'matomo', name: 'Matomo Analytics', impact: 'medium' },
    { pattern: 'fathom.com', name: 'Fathom Analytics', impact: 'low' },
    { pattern: 'simple.analytics', name: 'Simple Analytics', impact: 'low' },
    { pattern: 'counter.dev', name: 'Counter.dev', impact: 'low' },
    { pattern: 'goatcounter.com', name: 'GoatCounter', impact: 'low' },
    { pattern: 'pirsch.io', name: 'Pirsch Analytics', impact: 'low' },
    { pattern: 'shynet.io', name: 'Shynet', impact: 'low' },
    
    // Enterprise Analytics
    { pattern: 'amplitude.com', name: 'Amplitude', impact: 'high' },
    { pattern: 'heap.io', name: 'Heap Analytics', impact: 'high' },
    { pattern: 'adobe.com/analytics', name: 'Adobe Analytics', impact: 'high' },
    { pattern: 'omniture', name: 'Adobe Analytics (Legacy)', impact: 'high' },
    { pattern: 'coremetrics.com', name: 'IBM Digital Analytics', impact: 'high' },
    { pattern: 'webtrends.com', name: 'Webtrends', impact: 'high' },
    { pattern: 'pendo.io', name: 'Pendo', impact: 'high' },
    { pattern: 'appsflyer.com', name: 'AppsFlyer', impact: 'high' },
    { pattern: 'adjust.com', name: 'Adjust', impact: 'high' },
    { pattern: 'kochava.com', name: 'Kochava', impact: 'high' }
  ],
  
  social_media: [
    // Facebook/Meta
    { pattern: 'facebook.com/tr/', name: 'Facebook Pixel', impact: 'high' },
    { pattern: 'connect.facebook.net', name: 'Facebook SDK', impact: 'high' },
    { pattern: 'facebook.com/plugins', name: 'Facebook Social Plugins', impact: 'medium' },
    { pattern: 'graph.facebook.com', name: 'Facebook Graph API', impact: 'high' },
    { pattern: 'facebook.com/audience', name: 'Facebook Audience Network', impact: 'high' },
    { pattern: 'fbsbx.com', name: 'Facebook Social Embed', impact: 'medium' },
    
    // Professional Networks
    { pattern: 'linkedin.com/px', name: 'LinkedIn Insight Tag', impact: 'medium' },
    { pattern: 'snap.licdn.com', name: 'LinkedIn Analytics', impact: 'medium' },
    { pattern: 'platform.linkedin.com', name: 'LinkedIn Platform', impact: 'medium' },
    { pattern: 'ads.linkedin.com', name: 'LinkedIn Ads', impact: 'high' },
    { pattern: 'licdn.com', name: 'LinkedIn Content', impact: 'medium' },
    
    // Other Social Networks
    { pattern: 'ads.twitter.com', name: 'Twitter Pixel', impact: 'medium' },
    { pattern: 'static.ads-twitter.com', name: 'Twitter Ads', impact: 'medium' },
    { pattern: 'platform.twitter.com', name: 'Twitter Platform', impact: 'medium' },
    { pattern: 'analytics.twitter.com', name: 'Twitter Analytics', impact: 'medium' },
    { pattern: 'pinterest.com/ct.js', name: 'Pinterest Tag', impact: 'medium' },
    { pattern: 'widgets.pinterest.com', name: 'Pinterest Widgets', impact: 'medium' },
    { pattern: 'instagram.com', name: 'Instagram Tracking', impact: 'high' },
    { pattern: 'tiktok.com', name: 'TikTok Pixel', impact: 'high' },
    { pattern: 'analytics.tiktok.com', name: 'TikTok Analytics', impact: 'high' },
    { pattern: 'snap.com', name: 'Snapchat Pixel', impact: 'high' },
    { pattern: 'sc-static.net', name: 'Snapchat Tracking', impact: 'high' },
    { pattern: 'reddit.com/api', name: 'Reddit Tracking', impact: 'medium' },
    { pattern: 'vk.com', name: 'VKontakte Tracking', impact: 'medium' },
    { pattern: 'weibo.com', name: 'Weibo Tracking', impact: 'medium' },
    { pattern: 'line.me', name: 'LINE Tracking', impact: 'medium' }
  ],
  
  ad_networks: [
    // Google Ads
    { pattern: 'doubleclick.net', name: 'Google Ads', impact: 'high' },
    { pattern: 'googlesyndication.com', name: 'Google AdSense', impact: 'high' },
    { pattern: 'google-analytics', name: 'Google Analytics', impact: 'high' },
    { pattern: 'googleadservices.com', name: 'Google Ad Services', impact: 'high' },
    { pattern: 'pagead2.googlesyndication', name: 'Google PageAds', impact: 'high' },
    { pattern: 'adsense.google.com', name: 'Google AdSense', impact: 'high' },
    { pattern: 'adwords.google.com', name: 'Google Ads', impact: 'high' },
    
    // Major Ad Networks
    { pattern: 'adnxs.com', name: 'AppNexus', impact: 'high' },
    { pattern: 'criteo.com', name: 'Criteo', impact: 'high' },
    { pattern: 'criteo.net', name: 'Criteo Network', impact: 'high' },
    { pattern: 'rubiconproject.com', name: 'Rubicon Project', impact: 'high' },
    { pattern: 'pubmatic.com', name: 'PubMatic', impact: 'high' },
    { pattern: 'openx.net', name: 'OpenX', impact: 'high' },
    { pattern: 'casalemedia.com', name: 'Casale Media', impact: 'high' },
    { pattern: 'advertising.com', name: 'AOL Advertising', impact: 'high' },
    { pattern: 'sharethrough.com', name: 'Sharethrough', impact: 'medium' },
    { pattern: 'bidswitch.net', name: 'Bidswitch', impact: 'high' },
    { pattern: 'mediamath.com', name: 'MediaMath', impact: 'high' },
    { pattern: 'contextweb.com', name: 'ContextWeb', impact: 'high' },
    { pattern: 'spotxchange.com', name: 'SpotX', impact: 'high' },
    { pattern: 'innovid.com', name: 'Innovid', impact: 'high' },
    { pattern: 'teads.tv', name: 'Teads', impact: 'high' },
    
    // Content Discovery
    { pattern: 'outbrain.com', name: 'Outbrain', impact: 'medium' },
    { pattern: 'taboola.com', name: 'Taboola', impact: 'medium' },
    { pattern: 'revcontent.com', name: 'RevContent', impact: 'medium' },
    { pattern: 'zergnet.com', name: 'ZergNet', impact: 'medium' },
    { pattern: 'dianomi.com', name: 'Dianomi', impact: 'medium' },
    { pattern: 'plista.com', name: 'Plista', impact: 'medium' },
    
    // E-commerce Ads
    { pattern: 'amazon-adsystem.com', name: 'Amazon Ads', impact: 'high' },
    { pattern: 'shopping.google.com', name: 'Google Shopping', impact: 'medium' },
    { pattern: 'merchant.com', name: 'Merchant Center', impact: 'medium' },
    { pattern: 'shopify.com/analytics', name: 'Shopify Analytics', impact: 'medium' },
    { pattern: 'affirm.com', name: 'Affirm', impact: 'medium' },
    { pattern: 'klarna.com', name: 'Klarna', impact: 'medium' },
    { pattern: 'afterpay.com', name: 'Afterpay', impact: 'medium' }
  ],
  
  fingerprinting: [
    // Device Fingerprinting
    { pattern: 'fingerprintjs', name: 'FingerprintJS', impact: 'high' },
    { pattern: 'canvas.fingerprint', name: 'Canvas Fingerprinting', impact: 'high' },
    { pattern: 'webgl.fingerprint', name: 'WebGL Fingerprinting', impact: 'high' },
    { pattern: 'audio.fingerprint', name: 'Audio Fingerprinting', impact: 'high' },
    { pattern: 'deviceid', name: 'Device ID', impact: 'high' },
    { pattern: 'visitorid', name: 'Visitor ID', impact: 'high' },
    { pattern: 'securepubads', name: 'SecurePubAds', impact: 'high' },
    { pattern: 'adsafeprotected', name: 'AdSafe Protected', impact: 'high' },
    { pattern: 'moatads', name: 'Moat Ads', impact: 'high' },
    
    // Session Recording
    { pattern: 'mouseflow.com', name: 'Mouseflow', impact: 'high' },
    { pattern: 'fullstory.com', name: 'FullStory', impact: 'high' },
    { pattern: 'sessioncam.com', name: 'SessionCam', impact: 'high' },
    { pattern: 'smartlook.com', name: 'Smartlook', impact: 'high' },
    { pattern: 'logrocket.com', name: 'LogRocket', impact: 'high' },
    { pattern: 'quantum.com', name: 'Quantum Metric', impact: 'high' },
    { pattern: 'sessionstack.com', name: 'SessionStack', impact: 'high' },
    { pattern: 'hotjar.io', name: 'Hotjar Recording', impact: 'high' },
    { pattern: 'mouseflow.io', name: 'Mouseflow Recording', impact: 'high' },
    
    // User Identification
    { pattern: 'amplitude.com', name: 'Amplitude', impact: 'high' },
    { pattern: 'mixpanel.com/track', name: 'Mixpanel Tracking', impact: 'high' },
    { pattern: 'kissmetrics.com', name: 'Kissmetrics', impact: 'high' },
    { pattern: 'optimizely.com', name: 'Optimizely', impact: 'high' },
    { pattern: 'split.io', name: 'Split.io', impact: 'high' },
    { pattern: 'launchdarkly.com', name: 'LaunchDarkly', impact: 'high' },
    { pattern: 'flagsmith.com', name: 'Flagsmith', impact: 'high' },
    { pattern: 'growthbook.io', name: 'GrowthBook', impact: 'high' }
  ],
  
  marketing: [
    // Marketing Automation
    { pattern: 'marketo.com', name: 'Marketo', impact: 'high' },
    { pattern: 'hubspot.com', name: 'HubSpot', impact: 'high' },
    { pattern: 'tealium.com/audiencestream', name: 'Tealium AudienceStream', impact: 'high' },
    { pattern: 'tealium.com/collect', name: 'Tealium EventStream', impact: 'high' },
    { pattern: 'pardot.com', name: 'Pardot', impact: 'high' },
    { pattern: 'eloqua.com', name: 'Oracle Eloqua', impact: 'high' },
    { pattern: 'act-on.com', name: 'Act-On', impact: 'high' },
    { pattern: 'salesforce.com', name: 'Salesforce', impact: 'high' },
    { pattern: 'autopilothq.com', name: 'Autopilot', impact: 'medium' },
    { pattern: 'activecampaign.com', name: 'ActiveCampaign', impact: 'high' },
    { pattern: 'omnisend.com', name: 'Omnisend', impact: 'medium' },
    { pattern: 'sendinblue.com', name: 'Sendinblue', impact: 'medium' },
    
    // Email Marketing
    { pattern: 'mailchimp.com', name: 'Mailchimp', impact: 'medium' },
    { pattern: 'sendgrid.net', name: 'SendGrid', impact: 'medium' },
    { pattern: 'constantcontact.com', name: 'Constant Contact', impact: 'medium' },
    { pattern: 'klaviyo.com', name: 'Klaviyo', impact: 'medium' },
    { pattern: 'bronto.com', name: 'Oracle Bronto', impact: 'medium' },
    { pattern: 'campaignmonitor.com', name: 'Campaign Monitor', impact: 'medium' },
    { pattern: 'drip.com', name: 'Drip', impact: 'medium' },
    { pattern: 'convertkit.com', name: 'ConvertKit', impact: 'medium' },
    { pattern: 'aweber.com', name: 'AWeber', impact: 'medium' },
    { pattern: 'getresponse.com', name: 'GetResponse', impact: 'medium' },
    
    // Chat & Support
    { pattern: 'intercom.io', name: 'Intercom', impact: 'medium' },
    { pattern: 'zendesk.com', name: 'Zendesk', impact: 'medium' },
    { pattern: 'drift.com', name: 'Drift', impact: 'medium' },
    { pattern: 'freshchat.com', name: 'Freshchat', impact: 'medium' },
    { pattern: 'livechatinc.com', name: 'LiveChat', impact: 'medium' },
    { pattern: 'olark.com', name: 'Olark', impact: 'medium' },
    { pattern: 'tawk.to', name: 'Tawk.to', impact: 'medium' },
    { pattern: 'helpscout.net', name: 'Help Scout', impact: 'medium' },
    { pattern: 'gorgias.com', name: 'Gorgias', impact: 'medium' },
    { pattern: 'crisp.chat', name: 'Crisp', impact: 'medium' }
  ]
};

const COOKIE_PATTERNS = {
  tracking: [
    // Analytics
    '_ga', '_gid', '_gat', // Google Analytics
    'utag_*', // Tealium
    'mp_*', // Mixpanel
    'amplitude_*', // Amplitude
    'ajs_*', // Segment
    '_pk_*', // Matomo
    's_vi', 's_fid', // Adobe Analytics
    'sc_*', // Snapchat
    'vk_*', // VKontakte
    
    // Social Media
    '_fbp', 'fr', // Facebook
    '_twitter_sess', // Twitter
    'li_*', // LinkedIn
    'pin_*', // Pinterest
    'tt_*', // TikTok
    
    // Advertising
    '_gcl', // Google Click ID
    'uid', '_ym_', // Yandex
    'MUID', // Microsoft
    'criteo_*', // Criteo
    'taboola_*', // Taboola
    
    // Marketing Tools
    '__hssc', '__hstc', 'hubspotutk', // HubSpot
    '_mkto_trk', // Marketo
    'optimizelyEndUserId', // Optimizely
    'intercom-session-*', // Intercom
    '_pin_unauth', // Pinterest
    'pardot', // Pardot
    'eloqua', // Eloqua
    'sf_*', // Salesforce
    'km_*', // Kissmetrics
    'kvcd', // Klaviyo
    'bm_sv', // Bronto
    'act-on_*', // Act-On
    'drip_*', // Drip
    'ck_*', // ConvertKit
    'omnisend_*' // Omnisend
  ],
  
  marketing: [
    '__hstc', '_mkto', '__lo', 'hubspotutk',
    'pardot', 'eloqua',
    'mc_*', // Mailchimp
    'ct_*', // Constant Contact
    'drift_*', // Drift
    'intercom-id-*', // Intercom
    'km_*', // Kissmetrics
    'kvcd', // Klaviyo
    'bm_sv', // Bronto
    'act-on_*', // Act-On
    'drip_*', // Drip
    'ck_*', // ConvertKit
    'omnisend_*', // Omnisend
    'aweber_*', // AWeber
    'getresponse_*' // GetResponse
  ],
  
  advertising: [
    'IDE', // DoubleClick
    'MUID', // Microsoft
    '__gads', 'DSID', // Google Advertising
    '_fbp', 'fr', // Facebook
    'criteo', // Criteo
    'taboola_*', // Taboola
    'outbrain_*', // Outbrain
    'adnxs_*', // AppNexus
    'pubmatic_*', // PubMatic
    'rubiconproject.com', // Rubicon
    'openx_*', // OpenX
    'amazon-adsystem', // Amazon Ads
    'mediamath_*', // MediaMath
    'spotx_*', // SpotX
    'innovid_*', // Innovid
    'teads_*' // Teads
  ],
  
  session: [
    'sessionid',
    'PHPSESSID',
    'JSESSIONID',
    'ASP.NET_SessionId',
    'SESS*', // Drupal
    'wp_session', // WordPress
    'laravel_session', // Laravel
    'cf_*', // CloudFlare
    'express:sess', // Express.js
    'connect.sid', // Express.js/Connect
    'rack.session', // Ruby Rack
    'django_session', // Django
    'session_id', // Generic
    'X-SESSION-ID', // Generic
    'AWSALB', // AWS Load Balancer
    'AWSALBCORS', // AWS Load Balancer (CORS)
    'JSESSIONID', // Java Session
    'SSESS*' // Symfony Session
  ]
};

// Chrome extension types
declare global {
  interface Window {
    chrome: typeof chrome;
  }
}

// Import Google Generative AI
import { GoogleGenerativeAI } from '@google/generative-ai';

// Hardcoded API key
const GEMINI_API_KEY = '';

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed')
})

// Store for tab data
const tabData: { [tabId: number]: TrackerData } = {}

// Initialize tab data
function initTabData(tabId: number) {
  tabData[tabId] = {
    requests: [],
    cookies: [],
    scripts: []
  }
}

// Initialize Generative AI with API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Add new types for structured response
interface AnalysisResult {
  keyFindings: string[];
  privacyConcerns: string[];
  recommendations: string[];
  stats: {
    totalTrackers: number;
    highImpactTrackers: number;
    cookiesDetected: number;
  };
  detectedTrackers: Array<{
    category: string;
    name: string;
    impact: 'low' | 'medium' | 'high';
    source: string;
  }>;
}

// Function to analyze tracking data
async function analyzeTrackingData(data: TrackerData): Promise<AnalysisResult> {
  try {
    // Optimize the data before sending
    const optimizedData = {
      requests: data.requests.map(req => ({
        url: req.url.substring(0, 500), // Limit URL length
        type: req.type,
        method: req.method
      })).slice(0, 1000), // Limit to 1000 requests
      
      cookies: data.cookies.slice(0, 500), // Limit to 500 cookies
      
      scripts: data.scripts.map(script => ({
        src: script.src.substring(0, 500), // Limit source URL length
        content: script.content.substring(0, 1000) // Limit content length
      })).slice(0, 200), // Limit to 200 scripts
      
      trackingPatterns: TRACKING_PATTERNS
    };

    // Send optimized data to Vercel endpoint
    const response = await fetch('https://v0-new-project-8slfauivs9j-1ei2ui.vercel.app/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: optimizedData })
    });

    if (!response.ok) {
      // If still getting 413, try without script content
      if (response.status === 413) {
        console.log('Retrying without script content...');
        const minimalData = {
          ...optimizedData,
          scripts: optimizedData.scripts.map(script => ({
            src: script.src,
            content: '' // Remove script content
          }))
        };
        
        const retryResponse = await fetch('https://v0-new-project-8slfauivs9j-1ei2ui.vercel.app/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: minimalData })
        });
        
        if (!retryResponse.ok) {
          throw new Error(`HTTP error! status: ${retryResponse.status}`);
        }
        
        return await retryResponse.json();
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const analysisData = await response.json();
    
    // Validate the structure
    if (!analysisData.keyFindings || !Array.isArray(analysisData.keyFindings) ||
        !analysisData.privacyConcerns || !Array.isArray(analysisData.privacyConcerns) ||
        !analysisData.recommendations || !Array.isArray(analysisData.recommendations) ||
        !analysisData.stats || typeof analysisData.stats !== 'object' ||
        !analysisData.detectedTrackers || !Array.isArray(analysisData.detectedTrackers)) {
      throw new Error('Invalid response structure');
    }
    
    return analysisData;
  } catch (error) {
    console.error('Error in analyzeTrackingData:', error);
    
    // If API fails, use local detection as fallback
    const detectedTrackers = data.requests
      .map(req => detectTracker(req.url))
      .filter((tracker): tracker is NonNullable<typeof tracker> => tracker !== null);
    
    const uniqueTrackers = Array.from(new Set(detectedTrackers.map(t => t.name))).map(name => 
      detectedTrackers.find(t => t.name === name)!
    );
    
    return {
      keyFindings: [
        `Detected ${uniqueTrackers.length} tracking services`,
        `Found ${uniqueTrackers.filter(t => t.impact === 'high').length} high-impact trackers`,
        `${data.cookies.length} tracking cookies identified`
      ],
      privacyConcerns: uniqueTrackers
        .filter(t => t.impact === 'high')
        .map(t => `${t.name} is known for extensive data collection`),
      recommendations: [
        'Consider using a privacy-focused browser extension',
        'Review cookie settings and clear them regularly',
        'Use private browsing mode for sensitive activities'
      ],
      stats: {
        totalTrackers: uniqueTrackers.length,
        highImpactTrackers: uniqueTrackers.filter(t => t.impact === 'high').length,
        cookiesDetected: data.cookies.length
      },
      detectedTrackers: uniqueTrackers.map(t => ({
        category: t.category,
        name: t.name,
        impact: t.impact as 'low' | 'medium' | 'high',
        source: 'Network Request'
      }))
    };
  }
}

// Function to detect trackers in a URL
function detectTracker(url: string): { name: string; category: string; impact: string } | null {
  const lowerUrl = url.toLowerCase();
  
  // Check each category and pattern
  for (const [category, patterns] of Object.entries(TRACKING_PATTERNS)) {
    for (const pattern of patterns) {
      const patternLower = pattern.pattern.toLowerCase();
      // Check if pattern is in URL or if URL contains pattern as a subdomain
      if (lowerUrl.includes(patternLower) || 
          lowerUrl.includes(`//${patternLower}.`) || 
          lowerUrl.includes(`.${patternLower}.`)) {
        return {
          name: pattern.name,
          category: category,
          impact: pattern.impact
        };
      }
    }
  }
  return null;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeCurrentTab') {
    console.log('Starting analysis for current tab');
    
    (async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab?.id || !tab?.url) {
          sendResponse({ 
            success: false, 
            error: 'Could not find the active tab. Please make sure you have a webpage open and try again.'
          });
          return;
        }

        // Skip restricted URLs
        if (tab.url.startsWith('chrome://') || 
            tab.url.startsWith('chrome-extension://') || 
            tab.url.startsWith('edge://') || 
            tab.url.startsWith('about:')) {
          sendResponse({
            success: false,
            error: 'This page cannot be analyzed. Please try on a regular website.'
          });
          return;
        }

        // Inject content script to collect data
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            // Collect network requests using PerformanceObserver
            const requests: any[] = [];
            const observer = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (entry.entryType === 'resource') {
                  const resourceEntry = entry as PerformanceResourceTiming;
                  requests.push({
                    url: resourceEntry.name,
                    type: resourceEntry.initiatorType,
                    method: 'GET' // PerformanceAPI doesn't provide method info
                  });
                }
              }
            });
            
            observer.observe({ entryTypes: ['resource'] });

            // Collect cookies
            const cookies = document.cookie.split(';').map(cookie => cookie.trim());

            // Collect scripts
            const scripts = Array.from(document.getElementsByTagName('script'))
              .map(script => ({
                src: script.src || '',
                content: script.innerHTML || ''
              }));

            return {
              requests,
              cookies,
              scripts
            };
          }
        });

        if (!results || !results[0]?.result) {
          throw new Error('Failed to collect tracking data');
        }

        const trackingData = results[0].result as TrackerData;
        
        // Analyze the collected data
        const analysis = await analyzeTrackingData(trackingData);
        
        sendResponse({ 
          success: true, 
          data: analysis
        });
      } catch (error) {
        console.error('Error in analysis:', error);
        sendResponse({ 
          success: false, 
          error: 'An unexpected error occurred. Please try again.'
        });
      }
    })();
    
    return true; // Keep message channel open for async response
  }
});

// Cleanup tab data when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabData[tabId]
}) 