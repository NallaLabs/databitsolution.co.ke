# databitsolution.co.ke

Landing page for **Databit Solution Ltd**, a Kenyan ICT company sourcing office/IT products and licensed software, plus IT services (software development, CCTV, cybersecurity, repairs, training).

## Structure
- `index.html` — single-page site
- `css/styles.css` — styles
- `js/` — page behaviour
- `assets/` — logo, favicons, fonts, product images

Static site: no build step. Open `index.html` in a browser, or deploy the folder to any static host.

## AI & search discoverability

Files that help search engines and AI assistants find, read and cite the site
(based on the AI Discoverability Playbook):

| File | Purpose | Update when |
|---|---|---|
| `robots.txt` | Crawl rules + `Content-Signal` usage preferences + sitemap link. Currently open to search, AI answers and AI training; set `ai-train=no` to opt out of training. | Policy changes |
| `sitemap.xml` | URL list for crawlers | Change `<lastmod>` only when page content really changes |
| `llms.txt` | Short factual summary + section links for AI agents | Products, services, contacts or team change |
| `.well-known/security.txt` | Security contact (RFC 9116) | Before the `Expires` date (2027-11-13) |
| JSON-LD in `index.html` `<head>` | Organization, website, team and product/service catalogue as structured data | Any fact on the page changes |

**Keep facts in sync.** Company name, phones, email, team and offerings appear
in the page, the JSON-LD, and `llms.txt`. Change all three together.
Phone numbers are written in the HTML (not filled in by JavaScript) so
crawlers that don't run scripts can see them.

**Test after changes**
```
curl -s https://databitsolution.co.ke/robots.txt
curl -s https://databitsolution.co.ke/llms.txt
curl -s https://databitsolution.co.ke/ | grep -c "0758 358 610"
```
Validate structured data at https://validator.schema.org/ and
https://search.google.com/test/rich-results.

**Measure.** `docs/ai-baseline-prompts.csv` (local only) holds fixed prompts.
Run them in ChatGPT, Perplexity, Claude and Gemini before launch and then
monthly, without rewording.

**Not possible on GitHub Pages:** custom response headers (`Link`, `Vary`,
`Content-Signal`), markdown content negotiation, and crawler logging. These need
an edge worker (for example Cloudflare) in front of the site.
