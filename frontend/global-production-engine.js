/* UPS INFINITY — Global Production Engine */
(() => {
 'use strict';
 const spec=Object.freeze({
  visualMasters:['IMAGE','VIDEO','3D','HYBRID'],
  productionModes:['AUTO','MANUAL','HYBRID'],
  qualityLocks:['identity-preservation','temporal-consistency','natural-lighting','detail-integrity','motion-continuity','text-accuracy','safe-frame','export-validation'],
  defaults:{language:'Hindi',aspectRatio:'AUTO',duration:'AUTO',quality:'PREMIUM'},
  providerPolicy:'Never claim generation or rendering unless a connected provider confirms success.'
 });
 window.UPS_GLOBAL_PRODUCTION=Object.freeze({
  getSpec(){return JSON.parse(JSON.stringify(spec));},
  route(format='AUTO'){const f=String(format).toLowerCase();if(f.includes('poster')||f.includes('image'))return 'IMAGE';if(f.includes('video')||f.includes('reel'))return 'VIDEO';if(f.includes('3d'))return '3D';return 'HYBRID';}
 });
})();