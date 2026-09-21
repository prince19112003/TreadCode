import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_PACKS_DIR = path.join(ROOT_DIR, 'dist-packs');
const PACKS_DIR = path.join(DIST_PACKS_DIR, 'visualizer', 'packs');
const PUBLIC_PACKS_DIR = path.join(ROOT_DIR, 'public', 'visualizer', 'packs');

function serializeLesson(lesson) {
  if (!lesson) return null;
  let executionSteps = lesson.executionSteps || [];
  if (typeof lesson.generateSteps === 'function') {
    const defaultVars = {};
    if (lesson.editableVariables) {
      for (const [k, v] of Object.entries(lesson.editableVariables)) {
        defaultVars[k] = v.default;
      }
    }
    try {
      const generated = lesson.generateSteps(defaultVars);
      if (Array.isArray(generated) && generated.length > 0) {
        executionSteps = generated;
      }
    } catch (e) {
      console.warn(`[WARN] Failed to pre-generate steps for lesson ${lesson.id}:`, e.message);
    }
  }

  return {
    id: lesson.id,
    language: lesson.language,
    topic: lesson.topic,
    lessonNumber: lesson.lessonNumber,
    friendlyName: lesson.friendlyName,
    learningObjective: lesson.learningObjective,
    learningObjectiveHinglish: lesson.learningObjectiveHinglish,
    lines: lesson.lines,
    editableVariables: lesson.editableVariables,
    executionSteps: executionSteps
  };
}

async function exportAll() {
  console.log('🚀 Starting Pack Export for TreadCode Visualizer...');

  // Ensure directories exist
  fs.mkdirSync(PACKS_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC_PACKS_DIR, { recursive: true });

  const vite = await createServer({
    configFile: false,
    server: { middlewareMode: true, watch: null },
    appType: 'custom'
  });

  const modules = [
    { id: 'c', name: 'C Programming', path: './src/lessons/c/registry.ts', regKey: 'cRegistry' },
    { id: 'cpp', name: 'C++ Programming', path: './src/lessons/cpp/registry.ts', regKey: 'cppRegistry' },
    { id: 'java', name: 'Java Programming', path: './src/lessons/java/registry.ts', regKey: 'javaRegistry' },
    { id: 'dsa', name: 'Data Structures & Algorithms', path: './src/lessons/dsa/registry.ts', regKey: 'dsaRegistry' },
  ];

  const manifest = {};

  try {
    for (const mod of modules) {
      console.log(`📦 Processing ${mod.name} (${mod.id})...`);
      const imported = await vite.ssrLoadModule(mod.path);
      const rawRegistry = imported[mod.regKey];
      if (!rawRegistry) {
        console.error(`❌ Could not find ${mod.regKey} in ${mod.path}`);
        continue;
      }

      const serializedRegistry = {};
      let totalPrograms = 0;
      const seenIds = new Set();

      for (const [topicId, topicLessons] of Object.entries(rawRegistry)) {
        serializedRegistry[topicId] = {};
        for (const [progKey, progData] of Object.entries(topicLessons)) {
          const serialized = serializeLesson(progData);
          if (serialized) {
            serializedRegistry[topicId][progKey] = serialized;
            if (!seenIds.has(serialized.id)) {
              seenIds.add(serialized.id);
              totalPrograms++;
            }
          }
        }
      }

      const packData = {
        id: mod.id,
        name: mod.name,
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        topicsCount: Object.keys(serializedRegistry).length,
        programsCount: totalPrograms,
        registry: serializedRegistry
      };

      const outFilePath = path.join(PACKS_DIR, `${mod.id}.json`);
      const jsonContent = JSON.stringify(packData);
      fs.writeFileSync(outFilePath, jsonContent, 'utf-8');
      fs.writeFileSync(path.join(PUBLIC_PACKS_DIR, `${mod.id}.json`), jsonContent, 'utf-8');

      const sizeKB = (Buffer.byteLength(jsonContent, 'utf-8') / 1024).toFixed(1);
      console.log(`✅ Exported ${mod.id}.json (${sizeKB} KB, ${totalPrograms} programs, ${packData.topicsCount} topics)`);

      manifest[mod.id] = {
        name: mod.name,
        version: '1.0.0',
        sizeKB: Number(sizeKB),
        topicsCount: packData.topicsCount,
        programsCount: totalPrograms,
        active: true,
        downloadUrl: `visualizer/packs/${mod.id}.json`
      };
    }

    // ── Marker-only packs (ML & Networking — renderers are compiled, packs just unlock access) ──
    const markerModules = [
      { id: 'ml',         name: 'Machine Learning',  topics: 11, programs: 11 },
      { id: 'networking', name: 'Computer Networks', topics: 8,  programs: 8  },
    ];
    for (const mod of markerModules) {
      const packData = { id: mod.id, name: mod.name, version: '1.0.0', exportedAt: new Date().toISOString(), topicsCount: mod.topics, programsCount: mod.programs, isMarkerOnly: true, registry: {} };
      const outFilePath = path.join(PACKS_DIR, `${mod.id}.json`);
      const jsonContent = JSON.stringify(packData);
      fs.writeFileSync(outFilePath, jsonContent, 'utf-8');
      fs.writeFileSync(path.join(PUBLIC_PACKS_DIR, `${mod.id}.json`), jsonContent, 'utf-8');
      const sizeKB = (Buffer.byteLength(jsonContent, 'utf-8') / 1024).toFixed(1);
      console.log(`✅ Exported ${mod.id}.json (${sizeKB} KB — marker unlock pack)`);
      manifest[mod.id] = { name: mod.name, version: '1.0.0', sizeKB: Number(sizeKB), topicsCount: mod.topics, programsCount: mod.programs, isMarkerOnly: true, active: true, downloadUrl: `visualizer/packs/${mod.id}.json` };
    }

    // Write index.html for Cloudflare Pages Direct Upload
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TreadCode CDN Service</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; }
    .card { background: #1e293b; border-radius: 12px; padding: 24px; max-width: 600px; margin: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
    h1 { color: #38bdf8; font-size: 24px; margin-top: 0; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
    .status { display: inline-block; padding: 4px 12px; background: rgba(34,197,94,0.15); color: #4ade80; border-radius: 999px; font-size: 12px; font-weight: bold; }
    ul { list-style: none; padding: 0; }
    li { background: #334155; padding: 10px 14px; margin: 8px 0; border-radius: 6px; font-size: 13px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="card">
    <span class="status">● Active</span>
    <h1>TreadCode Pack CDN</h1>
    <p>This is the dynamic module storage server for TreadCode Visualizer extensions.</p>
    <ul>
      <li>/visualizer/packs/c.json</li>
      <li>/visualizer/packs/cpp.json</li>
      <li>/visualizer/packs/java.json</li>
      <li>/visualizer/packs/dsa.json</li>
    </ul>
  </div>
</body>
</html>`;
    fs.writeFileSync(path.join(DIST_PACKS_DIR, 'index.html'), indexHtml, 'utf-8');

    // Write manifest for Firebase RTDB import
    fs.writeFileSync(path.join(DIST_PACKS_DIR, 'modules_firebase_import.json'), JSON.stringify(manifest, null, 2), 'utf-8');

    console.log('\n🎉 ALL PACKS SUCCESSFULLY EXPORTED TO:');
    console.log(DIST_PACKS_DIR);

    await vite.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Export failed:', err);
    await vite.close();
    process.exit(1);
  }
}

exportAll();
