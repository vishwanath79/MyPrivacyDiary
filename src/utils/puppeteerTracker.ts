import puppeteer from 'puppeteer'

interface NetworkRequest {
  url: string
  type: string
  method: string
}

export async function analyzeSiteWithPuppeteer(url: string) {
  let browser;
  try {
    console.log('Starting browser setup...')
    
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ],
      ignoreHTTPSErrors: true
    })

    console.log('Browser launched successfully')
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(90000)
    await page.setDefaultTimeout(90000)
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
    
    // Initialize arrays before event listeners
    const requests: NetworkRequest[] = []
    const cookies: Set<string> = new Set()
    let scripts: any[] = []

    // Store network requests
    page.on('request', request => {
      try {
        requests.push({
          url: request.url(),
          type: request.resourceType(),
          method: request.method()
        })
      } catch (e) {
        console.error('Request capture error:', e)
      }
    })

    // Store cookies
    page.on('response', async response => {
      try {
        const headers = response.headers()
        const setCookie = headers['set-cookie']
        if (setCookie) {
          if (Array.isArray(setCookie)) {
            setCookie.forEach(cookie => cookies.add(cookie))
          } else {
            cookies.add(setCookie)
          }
        }
      } catch (e) {
        console.error('Cookie capture error:', e)
      }
    })

    console.log('Navigating to:', url)
    try {
      await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: 90000
      })
      console.log('Navigation complete')

      // Wait for dynamic content
      await page.waitForTimeout(5000)

      // Get scripts
      scripts = await page.evaluate(() => {
        return Array.from(document.getElementsByTagName('script'))
          .map(script => ({
            src: script.src || '',
            content: script.innerHTML || ''
          }))
      })

      console.log(`Analysis complete. Found:
        - ${requests.length} requests
        - ${cookies.size} cookies
        - ${scripts.length} scripts
      `)

      const result = {
        requests,
        cookies: Array.from(cookies),
        scripts
      }

      return result
    } catch (error) {
      console.error('Navigation or script error:', error)
      // Return partial data even if navigation fails
      return {
        requests,
        cookies: Array.from(cookies),
        scripts: scripts || []
      }
    }

  } catch (error) {
    console.error('Puppeteer analysis error:', error)
    // Return empty data on complete failure
    return {
      requests: [],
      cookies: [],
      scripts: []
    }
  } finally {
    if (browser) {
      try {
        await browser.close()
        console.log('Browser closed successfully')
      } catch (e) {
        console.error('Browser close error:', e)
      }
    }
  }
} 