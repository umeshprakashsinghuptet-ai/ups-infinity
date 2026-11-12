/* UPS INFINITY — Provider Prompt Quality Gate
 * Local prompt preparation only; does not call Gemini or YT Create.
 */
(() => {
  'use strict';
  const DEFAULT_LIMIT = 900;
  const count = value => Array.from(String(value ?? '')).length;
  function validate(value, limit = DEFAULT_LIMIT) {
    const text = String(value ?? '').trim();
    const max = Number.isInteger(limit) && limit > 0 ? limit : DEFAULT_LIMIT;
    return Object.freeze({
      valid: count(text) <= max,
      characters: count(text),
      limit: max,
      remaining: max - count(text),
      text
    });
  }
  function compact(value, limit = DEFAULT_LIMIT) {
    const text = String(value ?? '').trim();
    const max = Number.isInteger(limit) && limit > 0 ? limit : DEFAULT_LIMIT;
    if (count(text) <= max) return text;
    const chars = Array.from(text);
    if (max <= 1) return chars.slice(0, max).join('');
    return chars.slice(0, max - 1).join('').trimEnd() + '…';
  }
  function build({ topic = '', visual = '', dialogue = '', camera = '', continuity = '', safety = '' } = {}, limit = DEFAULT_LIMIT) {
    const sections = [
      ['TOPIC', topic], ['VISUAL', visual], ['DIALOGUE', dialogue],
      ['CAMERA', camera], ['CONTINUITY', continuity], ['SAFETY / QA', safety]
    ].filter(([, value]) => String(value).trim());
    return compact(sections.map(([label, value]) => `${label}: ${String(value).trim()}`).join('\n'), limit);
  }
  window.UPS_PROMPT_QUALITY = Object.freeze({ DEFAULT_LIMIT, count, validate, compact, build });
})();
