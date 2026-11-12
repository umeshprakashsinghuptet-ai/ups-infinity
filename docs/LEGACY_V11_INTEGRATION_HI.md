# V11 Legacy Tools Lab — Integration Notes

The previous V11 Infinity Final Plus frontend has been copied into `frontend/legacy-v11/` and is now reachable from the current dashboard using **V11 Legacy Tools Lab**. This keeps its specialised tools accessible on the same static frontend deployment without pretending that its separate render backend or provider integrations are merged into the current API.

Retained tools include its Visual & Reference Lab, storyboard/keyframe planner, identity/continuity workspace, transition planner, quality profile, browser speech/transcript workspace, captions/SRT, local asset preview, multi-track timeline/editor planner, API monitor and QA console.

Important: PNG/SVG keyframe cards are planning previews, not AI-generated photos. Speech recognition depends on browser support. FFmpeg rendering requires the legacy server and a compatible FFmpeg binary; it is not automatically connected to the new backend. Uploaded media is not cloud-stored by this legacy frontend.

The old V11 source remains in `legacy-reference/V11_INFINITY_FINAL_PLUS/` as a recovery/reference copy.
