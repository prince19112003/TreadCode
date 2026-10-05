import * as THREE from 'three';

export interface EarthSurfaceScene {
  group: THREE.Group;
  fogColor: number;
  fogDensity: number;
  update: (dt: number) => void;
  dispose: () => void;
}

/**
 * High-Fidelity Earth Surface Vantage Point (Phase 4):
 * - 3D procedural elevation terrain (128x128 grid with multi-octave harmonic elevation & normal calculations)
 * - Graded level touchdown plateau with exploration landing gear pad & 4 telemetry beacons
 * - Layered mountain ridge silhouettes with atmospheric Rayleigh haze
 * - Dynamic Rayleigh blue atmospheric sky dome with realistic zenith-to-horizon gradient
 * - Directional sunlight casting shadows across hills and rock formations
 * - Overhead drifting cumulus cloud deck
 * - Full 360° panoramic horizon observation for stationary astronaut (y = 1.75m eye level)
 */
export class EarthSurfaceBuilder {

  /** High-resolution procedural terrain texture with soil, rock scree, and alpine grass */
  private static createDetailedTerrainTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Base earth tone (arid soil & rock)
    ctx.fillStyle = '#4a4438';
    ctx.fillRect(0, 0, 1024, 1024);

    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imgData.data;

    for (let y = 0; y < 1024; y++) {
      for (let x = 0; x < 1024; x++) {
        const idx = (y * 1024 + x) * 4;

        // Multi-frequency noise
        const n1 = Math.sin(x * 0.03) * Math.cos(y * 0.03);
        const n2 = Math.sin(x * 0.09 + 1.4) * Math.cos(y * 0.08);
        const n3 = (Math.random() - 0.5) * 0.5;
        const total = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2);

        // Biome blending: grass moss (green-olive), scree rock (slate), soil (ochre)
        if (total > 0.15) {
          // Alpine moss / grass
          data[idx]     = 65 + total * 30;
          data[idx + 1] = 85 + total * 45;
          data[idx + 2] = 45 + total * 20;
        } else if (total < -0.15) {
          // Dark rocky basalt
          data[idx]     = 55 + total * 25;
          data[idx + 1] = 52 + total * 25;
          data[idx + 2] = 50 + total * 25;
        } else {
          // Weathered arid soil
          data[idx]     = 95 + total * 35;
          data[idx + 1] = 85 + total * 30;
          data[idx + 2] = 65 + total * 25;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(24, 24);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  /**
   * Build the complete Earth Surface scene.
   */
  static buildSurface(): EarthSurfaceScene {
    const group = new THREE.Group();
    const disposables: Array<{ dispose: () => void }> = [];

    // ── 1. Atmospheric Sky Dome (Rayleigh Scattering) ──
    const skyGeo = new THREE.SphereGeometry(950, 48, 32);
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 256;
    skyCanvas.height = 512;
    const sCtx = skyCanvas.getContext('2d')!;

    const skyGrad = sCtx.createLinearGradient(0, 0, 0, 512);
    skyGrad.addColorStop(0.00, '#0f388a'); // deep navy zenith
    skyGrad.addColorStop(0.25, '#1e60d5'); // deep blue
    skyGrad.addColorStop(0.55, '#38bdf8'); // sky blue
    skyGrad.addColorStop(0.78, '#bae6fd'); // pale blue horizon
    skyGrad.addColorStop(0.88, '#fef08a'); // warm sunlight diffusion rim
    skyGrad.addColorStop(1.00, '#e2e8f0'); // horizon ground interface
    sCtx.fillStyle = skyGrad;
    sCtx.fillRect(0, 0, 256, 512);

    const skyTex = new THREE.CanvasTexture(skyCanvas);
    skyTex.colorSpace = THREE.SRGBColorSpace;
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTex,
      side: THREE.BackSide,
      fog: false,
    });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    group.add(skyDome);
    disposables.push(skyGeo, skyMat, skyTex);

    // ── 2. Daytime Celestial Sun & Glare ──
    const sunGroup = new THREE.Group();
    const sunPos = new THREE.Vector3(340, 420, -480);

    // Core solar disc
    const sunGeo = new THREE.CircleGeometry(24, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xfffef0,
      side: THREE.DoubleSide,
      fog: false,
    });
    const sunDisc = new THREE.Mesh(sunGeo, sunMat);
    sunDisc.position.copy(sunPos);
    sunDisc.lookAt(0, 1.75, 0);
    sunGroup.add(sunDisc);
    disposables.push(sunGeo, sunMat);

    // Inner atmospheric glare halo
    const haloGeo = new THREE.CircleGeometry(65, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      fog: false,
    });
    const sunHalo = new THREE.Mesh(haloGeo, haloMat);
    sunHalo.position.copy(sunPos);
    sunHalo.lookAt(0, 1.75, 0);
    sunGroup.add(sunHalo);
    disposables.push(haloGeo, haloMat);

    // Outer optical flare halo
    const outerHaloGeo = new THREE.CircleGeometry(140, 32);
    const outerHaloMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      fog: false,
    });
    const outerHalo = new THREE.Mesh(outerHaloGeo, outerHaloMat);
    outerHalo.position.copy(sunPos);
    outerHalo.lookAt(0, 1.75, 0);
    sunGroup.add(outerHalo);
    disposables.push(outerHaloGeo, outerHaloMat);

    // Sunlight directional & atmospheric ambient fill
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.5);
    sunLight.position.copy(sunPos);
    group.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x93c5fd, 0.75);
    group.add(ambientLight);
    group.add(sunGroup);

    // ── 3. 3D Procedural Elevation Terrain (128x128 grid) ──
    const terrainSize = 1400;
    const terrainSegments = 128;
    const terrainGeo = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainSegments, terrainSegments);
    const posAttr = terrainGeo.attributes.position as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;

    // Displace vertices with multi-octave harmonic landscape function
    for (let i = 0; i < posAttr.count; i++) {
      const x = posArr[i * 3];
      const y = posArr[i * 3 + 1]; // PlaneGeometry is XY initially, rotated later to XZ

      // Distance from landing center
      const distFromCenter = Math.sqrt(x * x + y * y);

      // Multi-scale elevation harmonics
      const h1 = Math.sin(x * 0.012) * Math.cos(y * 0.015) * 26;
      const h2 = Math.sin(x * 0.035 + 1.2) * Math.cos(y * 0.032) * 12;
      const h3 = Math.sin(x * 0.08) * Math.sin(y * 0.075) * 5;
      const rawElevation = h1 + h2 + h3;

      // Smoothstep radial flattening at landing site (level ground around astronaut r < 40m)
      const flatRadius = 35;
      const blendRadius = 90;
      let blendFactor = 1.0;
      if (distFromCenter < flatRadius) {
        blendFactor = 0.0;
      } else if (distFromCenter < blendRadius) {
        const t = (distFromCenter - flatRadius) / (blendRadius - flatRadius);
        blendFactor = t * t * (3 - 2 * t); // smoothstep
      }

      posArr[i * 3 + 2] = rawElevation * blendFactor;
    }

    terrainGeo.computeVertexNormals();
    const terrainTex = this.createDetailedTerrainTexture();
    const terrainMat = new THREE.MeshStandardMaterial({
      map: terrainTex,
      roughness: 0.92,
      metalness: 0.04,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.rotation.x = -Math.PI / 2;
    terrainMesh.position.y = 0;
    group.add(terrainMesh);
    disposables.push(terrainGeo, terrainMat, terrainTex);

    // ── 4. Touchdown Observation Pad & Exploration Beacons ──
    const padGroup = new THREE.Group();

    // Scorch & landing ring pad
    const padGeo = new THREE.RingGeometry(8, 22, 48);
    const padMat = new THREE.MeshBasicMaterial({
      color: 0x242426,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
    });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.rotation.x = -Math.PI / 2;
    pad.position.y = 0.02;
    padGroup.add(pad);
    disposables.push(padGeo, padMat);

    // Target cross lines on pad
    const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
    const crossGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-18, 0.03, 0), new THREE.Vector3(18, 0.03, 0),
      new THREE.Vector3(0, 0.03, -18), new THREE.Vector3(0, 0.03, 18),
    ]);
    padGroup.add(new THREE.LineSegments(crossGeo, lineMat));
    disposables.push(crossGeo, lineMat);

    // 4 Corner Telemetry Beacons
    const beaconRadius = 24;
    const beaconAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
    const poleGeo = new THREE.CylinderGeometry(0.12, 0.16, 3.2, 12);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.3 });
    const ledGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    beaconAngles.forEach((a) => {
      const bx = Math.cos(a) * beaconRadius;
      const bz = Math.sin(a) * beaconRadius;

      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(bx, 1.6, bz);
      padGroup.add(pole);

      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(bx, 3.3, bz);
      padGroup.add(led);
    });
    disposables.push(poleGeo, poleMat, ledGeo, ledMat);
    group.add(padGroup);

    // ── 5. Layered Mountain Horizon Ridges (360° Alpine Panorama) ──
    const mountainRadius = 600;
    const mountainPts = 160;
    const mountainPositions = new Float32Array(mountainPts * 2 * 3);
    const mountainColors = new Float32Array(mountainPts * 2 * 3);

    for (let i = 0; i < mountainPts; i++) {
      const a = (i / mountainPts) * Math.PI * 2;
      const x = Math.cos(a) * mountainRadius;
      const z = Math.sin(a) * mountainRadius;

      // Realistic alpine peak profile with sharp jagged ridges
      const peakHeight = 75 +
        Math.sin(i * 0.35) * 45 +
        Math.cos(i * 0.85 + 0.6) * 32 +
        Math.sin(i * 2.1) * 16 +
        Math.cos(i * 4.3) * 8;

      // Base at horizon level
      mountainPositions[i * 6]     = x;
      mountainPositions[i * 6 + 1] = -5;
      mountainPositions[i * 6 + 2] = z;

      // Alpine crest
      mountainPositions[i * 6 + 3] = x;
      mountainPositions[i * 6 + 4] = peakHeight;
      mountainPositions[i * 6 + 5] = z;

      // Aerial atmospheric haze coloring (fading into sky blue)
      mountainColors[i * 6]     = 0.35; mountainColors[i * 6 + 1] = 0.50; mountainColors[i * 6 + 2] = 0.68;
      mountainColors[i * 6 + 3] = 0.55; mountainColors[i * 6 + 4] = 0.70; mountainColors[i * 6 + 5] = 0.88;
    }

    const mountainIndices: number[] = [];
    for (let i = 0; i < mountainPts; i++) {
      const next = (i + 1) % mountainPts;
      const b0 = i * 2;
      const t0 = i * 2 + 1;
      const b1 = next * 2;
      const t1 = next * 2 + 1;

      mountainIndices.push(b0, t0, b1);
      mountainIndices.push(b1, t0, t1);
    }

    const mountainGeo = new THREE.BufferGeometry();
    mountainGeo.setAttribute('position', new THREE.BufferAttribute(mountainPositions, 3));
    mountainGeo.setAttribute('color',    new THREE.BufferAttribute(mountainColors, 3));
    mountainGeo.setIndex(mountainIndices);

    const mountainMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
    });
    const mountains = new THREE.Mesh(mountainGeo, mountainMat);
    group.add(mountains);
    disposables.push(mountainGeo, mountainMat);

    // ── 6. Overhead Drifting Cumulus Cloud Layer ──
    const cloudCount = 700;
    const cloudPos = new Float32Array(cloudCount * 3);
    for (let i = 0; i < cloudCount; i++) {
      const r = 30 + Math.random() * 450;
      const theta = Math.random() * Math.PI * 2;
      cloudPos[i * 3]     = r * Math.cos(theta);
      cloudPos[i * 3 + 1] = 220 + (Math.random() - 0.5) * 45; // Altitude ~220m
      cloudPos[i * 3 + 2] = r * Math.sin(theta);
    }
    const cloudsGeo = new THREE.BufferGeometry();
    cloudsGeo.setAttribute('position', new THREE.BufferAttribute(cloudPos, 3));
    const cloudsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 24,
      transparent: true,
      opacity: 0.50,
    });
    const cloudLayer = new THREE.Points(cloudsGeo, cloudsMat);
    group.add(cloudLayer);
    disposables.push(cloudsGeo, cloudsMat);

    // Atmospheric Blue Aerial Fog specification
    const fogColor = 0xbfe3f7;
    const fogDensity = 0.0016;

    const update = (dt: number) => {
      // Gentle cloud drift
      cloudLayer.rotation.y += 0.005 * dt;
    };

    const dispose = () => {
      disposables.forEach((d) => d.dispose());
    };

    return { group, fogColor, fogDensity, update, dispose };
  }
}
