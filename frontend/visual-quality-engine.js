/* UPS CREATOR STUDIO — Visual Quality Master Engine
 * Deterministic prompt-planning rules. This does not itself render media.
 */
(() => {
  'use strict';
  const VISUAL_MASTERS = Object.freeze({
    IMAGE: 'ULTRA-PHOTOREALISTIC RAW DSLR QUALITY',
    VIDEO: 'ULTRA-REALISTIC CINEMATIC PHOTOREALISM',
    THREE_D: 'ULTRA-REALISTIC 3D / CGI QUALITY',
    HYBRID: 'PHOTOREALISTIC + CINEMATIC 3D + HYBRID VFX'
  });
  const LOCKS = Object.freeze({
    lighting: ['Natural exposure','Realistic shadows','Balanced highlights','No artificial glow','No excessive brightness','No oversaturation'],
    detail: ['Natural textures','Realistic materials','Fine details','Depth and dimension','Professional composition'],
    motion: ['Natural movement','Realistic physics','Smooth camera motion','Frame consistency','No flicker','No distortion'],
    identity: ['Preserve the reference identity and facial features','No face redesign or artificial beautification','Maintain natural skin texture and tone','Keep identity consistent across scenes and frames'],
    temporal: ['Maintain character, wardrobe, prop and environment continuity','Maintain lighting and color continuity','Prevent frame-to-frame morphing','Prevent unwanted object changes and visual glitches']
  });
  function route(input = {}) {
    const text = [input.category,input.subject,input.scene,input.purpose,input.format].join(' ').toLowerCase();
    if (/3d|cgi|anatomy|molecule|architecture model|scientific visual|product exploded|mechanism/.test(text)) return 'THREE_D';
    if (/hybrid|fantasy environment|historical reconstruction|virtual set|complex vfx|composit/.test(text)) return 'HYBRID';
    if (/poster|photo|thumbnail|portrait|still image|cover/.test(text) || input.format === 'Poster / Image') return 'IMAGE';
    return 'VIDEO';
  }
  function build(input = {}) {
    const master = input.master && VISUAL_MASTERS[input.master] ? input.master : route(input);
    return {
      selectedMaster: master,
      qualityTarget: VISUAL_MASTERS[master],
      locks: LOCKS,
      routingReason: `Selected from category, subject, scene, purpose and output format: ${master}`,
      note: 'Prompt guidance only. Actual output quality depends on the connected generation model and must be visually reviewed.'
    };
  }
  window.UPS_VISUAL_QUALITY = Object.freeze({ VISUAL_MASTERS, LOCKS, route, build });
})();
