# Release QA — Universal Library & Web Series

Implemented: dynamic category/subcategory selectors; 34-category source taxonomy; retail/trade and product-advertising categories; AUTO/MANUAL/HYBRID topic handling; manual topic apply; live search button; auto-discover button; research result display; Series Bible, episode planning, continuity and exports.

Live search route is implemented in backend `/api/research/search` and requires `BRAVE_SEARCH_API_KEY`. It is not Google Search unless Google provider is explicitly configured. Local taxonomy is not infinite; live discovery expands topic discovery beyond local entries.

QA status is reported only after running the tests below. No claim of full provider E2E, deployed search, AI screenplay generation, media generation or rendering is made by static/unit tests.
