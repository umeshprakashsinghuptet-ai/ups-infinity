# Google Indexing — UPS INFINITY

Frontend में SEO title, description, robots, canonical, Open Graph, Twitter card और SoftwareApplication JSON-LD जोड़े गए हैं। `robots.txt` और `sitemap.xml` भी `frontend/` में हैं।

## Deployment से पहले जरूरी
1. GitHub Pages की वास्तविक public URL तय करें।
2. यदि URL `https://umeshprakashsinghuptet-ai.github.io/upscreatorstudio/` से अलग है, तो `frontend/index.html` के canonical URL और `frontend/robots.txt`, `frontend/sitemap.xml` के URL बदलें।
3. GitHub Pages पर `frontend/` publish करें या Render static site में publish directory `frontend` रखें।
4. HTTPS पर URL खोलें, फिर Google Search Console में property verify करके sitemap.xml submit करें।
5. Indexing Google के निर्णय/क्रॉल पर निर्भर है; sitemap जमा करने से indexing की गारंटी नहीं होती।
6. यह SPA dashboard app है। Search preview के लिए public landing content बेहतर होगा; private project data और account screens को index न करें।

## Limitations
यह metadata implementation है, Google indexing का प्रमाण नहीं। Google Search Console, live crawl और rich result validation deployment के बाद ही हो सकते हैं।
