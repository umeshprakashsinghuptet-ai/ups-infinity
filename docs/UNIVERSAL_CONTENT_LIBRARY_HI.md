# UPS INFINITY — Universal Content Library

- Local taxonomy: 34 main categories.
- Retail & Trade category: 16 subgenres.
- Product Advertising & Commercials, Marketing & Branding, Interior & Real Estate are separate categories.
- Includes horror/paranormal, mystery/suspense, kids, cartoon, anime, GK, current affairs, motivation, education, history, mythology, science, technology, documentary, business, food, travel, nature, sports, comedy, drama, romance, fantasy, sci-fi, health education, arts, events, career and civics.

## Topic modes
- AUTO RANDOM: local taxonomy suggestions; attempts backend live search when configured by the current UI flow.
- AI SUGGESTION: provider capability must be connected; do not claim provider output if unavailable.
- LIVE WEB SEARCH: calls `/api/research/search`; backend requires `BRAVE_SEARCH_API_KEY`.
- MANUAL TOPIC: user's typed topic is used as the series premise.
- HYBRID: combines user topic with system-proposed structure.

## Scope and limitations
The local taxonomy is finite and extensible, not an unlimited offline database. Live web search can discover new pages/topics only when the backend is deployed and its search API key is configured. Search results must be checked at original sources before factual publication. The system must never invent search results or claim Google Search if a different configured provider is used.
