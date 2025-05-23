const utmHandler = () => {
  document.addEventListener("DOMContentLoaded", function() {
    // Get UTM parameters from URL or cookies
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    // Get UTM source
    const utmSource = urlParams.get('utm_source') || getCookie('utm_source') || 'Affiliates';
    if (urlParams.get('utm_source')) {
      setCookie('utm_source', urlParams.get('utm_source'));
    }

    // Get UTM medium
    const utmMedium = urlParams.get('utm_medium') || getCookie('utm_medium') || 'LandingPage';
    if (urlParams.get('utm_medium')) {
      setCookie('utm_medium', urlParams.get('utm_medium'));
    }

    // Get all anchor tags in the document
    const anchors = document.getElementsByTagName('a');
    
    // Convert HTMLCollection to Array and iterate
    Array.from(anchors).forEach(anchor => {
      if (anchor.getAttribute("href")) {
        const originalUrl = anchor.getAttribute("href");
        const urlObj = new URL(originalUrl);
        const baseUrl = urlObj.origin + urlObj.pathname;
        
        // Get existing campaign if present
        const campaign = getUtmParam(originalUrl, 'utm_campaign');
        
        // Build URL with exact parameter order
        let newUrl = `${baseUrl}?`;
        newUrl += `&utm_source=${utmSource}`;
        newUrl += `&utm_medium=${utmMedium}`;
        if (campaign) {
          newUrl += `&utm_campaign=${campaign}`;
        }
        if (token) {
          newUrl += `&token=${token}`;
        }
        
        anchor.setAttribute("href", newUrl);
      }
    });
  });
}

// Helper function to get cookie value
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Helper function to set cookie
function setCookie(name, value) {
  document.cookie = `${name}=${value}; path=/`;
}

// Helper function to get UTM parameter from URL
function getUtmParam(url, param) {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get(param);
  } catch (e) {
    return null;
  }
}

export default utmHandler; 
