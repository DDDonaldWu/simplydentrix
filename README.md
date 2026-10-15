# Simply Dentrix website

Organized from the six main page exports and ten supplied product/category pages. Original page content and page-specific styling are preserved. This is a static website with no build step.

## Pages

| Page | File |
| --- | --- |
| Home | `index.html` |
| Customer Portal | `customer-portal.html` |
| Material | `material.html` |
| Product | `product.html` |
| Turn Around Time | `turn-around-time.html` |
| Contact | `contact.html` |
| PFM | `pfm.html` |
| All Ceramic | `all-ceramic.html` |
| High-Translucency Zirconia | `high-translucency-zirconia.html` |
| Partial Framework | `partial-framework.html` |
| Flexible Partials (RPD) | `flexible-partials-rpd.html` |
| Full Dentures | `full-dentures.html` |
| All-on-X Solutions | `all-on-x-solutions.html` |
| Comprehensive Smile Design | `comprehensive-smile-design.html` |
| Fixed Restorations | `fixed-restorations.html` |
| Removables | `removables.html` |

## Organization

- `assets/css/`: one stylesheet per page, plus shared accessibility adjustments. Page styles are intentionally isolated because the exports use the same class names with different layouts.
- `assets/js/`: material tabs, PDF download handling, contact submission handling, and public configuration.
- `assets/images/`: the original embedded logo extracted and reused across all pages.
- `docs/source-map.json`: maps the uploaded filenames to the organized files.
- `docs/external-dependencies.txt`: links and remote images retained from the supplied code.

## Preview locally

From this directory run `python3 -m http.server 8000`, then open http://localhost:8000. No package installation is required.

## Setup still required

Edit `assets/js/config.js` to set `rxForms.detailed`, `rxForms.simplified`, and `contactFormEndpoint`. Neither PDF nor a working contact endpoint was supplied. Until configured, PDF buttons display an availability message and the inquiry form does not submit. No authentication, file-upload service, database, or backend was supplied; the portal is a PDF-download and email workflow.

Sixteen pages now link to local `.html` files so navigation also works under a GitHub Pages repository path. Fixed Restorations and Removables link to their supplied product pages. Advanced Implantology and Aesthetic Planning category page code has not been supplied; those category links still point to the live website. All-on-X Solutions and Comprehensive Smile Design have their own local product pages. Legacy `/send-a-case` buttons now open the supplied Customer Portal.

Three homepage background images remain hosted on Unsplash. Product and category pages also retain the external images supplied in their CSS. The extracted local logo is reused on the portal instead of its remote logo. A full offline asset backup requires downloading the stock images separately.

This repository stores the website files. Uploading them does not itself enable GitHub Pages or change the live website. The original clean URLs (such as `/material`) require hosting redirects or rewrites to the corresponding `.html` pages when replacing the current site.
