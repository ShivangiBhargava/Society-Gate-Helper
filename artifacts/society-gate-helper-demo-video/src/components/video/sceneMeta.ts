// Optional scene metadata for Replit workspace integrations. When the
// workspace's scene controls are enabled for this project, a viewer's click on
// a scene segment scopes their next chat request to that scene's source file.
// Fill one entry per SCENE_DURATIONS key in VideoTemplate.tsx only when a
// skill reference asks for it; otherwise leave the map empty. Scenes missing
// from the map still play and can be jumped to.
//
// Example:
//   export const SCENE_DETAILS: Record<string, SceneDetails> = {
//     open: { title: 'Intro', filePath: 'src/components/video/video_scenes/Scene1.tsx' },
//   };

export interface SceneDetails {
  title: string;
  filePath: string;
}

export const SCENE_DETAILS: Record<string, SceneDetails> = {
  overview: { title: 'Overview', filePath: 'src/components/video/SocietyScenes.tsx' },
  simulator: { title: 'Signed simulator', filePath: 'src/components/video/SocietyScenes.tsx' },
  resident: { title: 'Resident decision', filePath: 'src/components/video/SocietyScenes.tsx' },
  gateDesk: { title: 'Gate desk', filePath: 'src/components/video/SocietyScenes.tsx' },
  record: { title: 'Visitor record', filePath: 'src/components/video/SocietyScenes.tsx' },
  finale: { title: 'Resolution', filePath: 'src/components/video/SocietyScenes.tsx' },
};
