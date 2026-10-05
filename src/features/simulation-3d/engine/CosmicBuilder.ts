import * as THREE from 'three';

export interface SuctionParticle {
  r: number;
  theta: number;
  z: number;
  speed: number;
  inwardSpeed: number;
}

export interface CosmicSceneObjects {
  rootGroup: THREE.Group;
  blackHoleGroup: THREE.Group;
  milkyWayGroup: THREE.Group;
  solarSystemMarker: THREE.Object3D;
  blackHolePosition: THREE.Vector3;
  milkyWayPosition: THREE.Vector3;
  update: (dt: number) => void;
  dispose: () => void;
}

/**
 * Builds the Deep Universe:
 * - Supermassive Black Hole with event horizon, relativistic accretion disk (Doppler beaming),
 *   gravitational lensing photon arches, and live inward-swirling matter suction stream.
 * - Milky Way Galaxy (barred spiral with Solar System beacon in Orion arm).
 * - Andromeda Galaxy (M31 tilted grand spiral).
 * - Sombrero Galaxy (M104 elliptical core + dark dust lane).
 * - Intergalactic gas nebulae & deep field galaxy clusters.
 */
export class CosmicBuilder {

  /** Generate Doppler-beamed accretion disk texture */
  private static createAccretionTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    const cx = 512;
    const cy = 512;

    // Radial plasma gradient
    const radGrad = ctx.createRadialGradient(cx, cy, 140, cx, cy, 500);
    radGrad.addColorStop(0.00, 'rgba(255, 255, 255, 0.98)'); // ultra-hot inner boundary
    radGrad.addColorStop(0.12, 'rgba(255, 220, 120, 0.92)');
    radGrad.addColorStop(0.35, 'rgba(255, 130, 30, 0.85)');
    radGrad.addColorStop(0.65, 'rgba(180, 50, 10, 0.60)');
    radGrad.addColorStop(0.85, 'rgba(80, 20, 5, 0.30)');
    radGrad.addColorStop(1.00, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Relativistic Doppler beaming asymmetry:
    // Left side (approaching) is boosted in blue/white brightness; right side is attenuated
    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imgData.data;
    for (let y = 0; y < 1024; y++) {
      for (let x = 0; x < 1024; x++) {
        const idx = (y * 1024 + x) * 4;
        const dx = (x - cx) / 512; // -1 on left, +1 on right
        // Beaming factor: boosted on approaching side (dx < 0)
        const beaming = 1.0 - dx * 0.45;
        data[idx]     = Math.min(255, data[idx] * beaming);
        data[idx + 1] = Math.min(255, data[idx + 1] * (beaming > 1 ? beaming * 1.1 : beaming * 0.8));
        data[idx + 2] = Math.min(255, data[idx + 2] * (beaming > 1 ? beaming * 1.3 : beaming * 0.6));
      }
    }
    ctx.putImageData(imgData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  /**
   * Supermassive Black Hole with Event Horizon, Accretion Disk,
   * Gravitational Lensing Halo, and Dynamic Matter Inward Suction.
   */
  private static buildBlackHole(): {
    group: THREE.Group;
    update: (dt: number) => void;
    dispose: () => void;
  } {
    const group = new THREE.Group();
    const R_H = 30; // Event Horizon Radius

    // 1. Event Horizon: pure black sphere that absorbs all incoming light
    const horizonGeo = new THREE.SphereGeometry(R_H, 64, 64);
    const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const horizon = new THREE.Mesh(horizonGeo, horizonMat);
    group.add(horizon);

    // 2. Photon Sphere / Einstein Ring (light orbit boundary at 1.5 * R_H)
    const photonRingGeo = new THREE.RingGeometry(R_H * 1.48, R_H * 1.54, 96);
    const photonRingMat = new THREE.MeshBasicMaterial({
      color: 0xfff3cc,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });
    const photonRing = new THREE.Mesh(photonRingGeo, photonRingMat);
    group.add(photonRing);

    // 3. Relativistic Accretion Disk (horizontal plane)
    const diskTex = this.createAccretionTexture();
    const diskGeo = new THREE.RingGeometry(R_H * 1.6, R_H * 6.2, 128);
    const diskMat = new THREE.MeshBasicMaterial({
      map: diskTex,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const disk = new THREE.Mesh(diskGeo, diskMat);
    disk.rotation.x = Math.PI / 2.15; // slightly inclined for dramatic depth
    group.add(disk);

    // 4. Gravitational Lensing Halo (Warped Upper & Lower Arcs — General Relativity)
    const lensGeo = new THREE.RingGeometry(R_H * 1.52, R_H * 3.8, 96);
    const lensMat = new THREE.MeshBasicMaterial({
      map: diskTex,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const lensUpper = new THREE.Mesh(lensGeo, lensMat);
    lensUpper.rotation.y = Math.PI / 12;
    group.add(lensUpper);

    // 5. Inward Matter Suction Whirlpool ("real me jese sab khich leta h wesi uske pass feel ana chaiye")
    // 1,500 hot plasma particles swirling and accelerating inward into the event horizon
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const particles: SuctionParticle[] = [];

    for (let i = 0; i < count; i++) {
      const r = R_H * 1.55 + Math.random() * (R_H * 6.5);
      const theta = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 6 * (r / (R_H * 2));
      const speed = (0.8 + Math.random() * 0.4);
      const inwardSpeed = (12 + Math.random() * 18);

      particles.push({ r, theta, z, speed, inwardSpeed });

      positions[i * 3]     = r * Math.cos(theta);
      positions[i * 3 + 1] = z;
      positions[i * 3 + 2] = r * Math.sin(theta);

      colors[i * 3]     = 1.0;
      colors[i * 3 + 1] = 0.6;
      colors[i * 3 + 2] = 0.2;
    }

    const suctionGeo = new THREE.BufferGeometry();
    suctionGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    suctionGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const suctionMat = new THREE.PointsMaterial({
      size: 3.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
    });
    const suctionMesh = new THREE.Points(suctionGeo, suctionMat);
    suctionMesh.rotation.x = disk.rotation.x;
    group.add(suctionMesh);

    // Per-frame physics update: accelerate particles inward towards event horizon
    const update = (dt: number) => {
      disk.rotation.z += 0.25 * dt;
      photonRing.lookAt(group.position.clone().add(new THREE.Vector3(0, 0, 1)));

      const posAttr = suctionGeo.attributes.position as THREE.BufferAttribute;
      const colAttr = suctionGeo.attributes.color as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const colArr = colAttr.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const p = particles[i];

        // Stronger inward pull as radius shrinks (inverse square gravitational law)
        const pull = (p.inwardSpeed * (R_H * 3.5 / p.r)) * dt;
        p.r -= pull;

        // Angular acceleration (conservation of angular momentum: omega ~ 1/r^1.5)
        const spin = (p.speed * Math.pow(R_H * 3 / p.r, 1.5)) * dt;
        p.theta += spin;

        // Flatten towards equatorial plane as matter falls inward
        p.z *= 0.98;

        // If particle crosses event horizon, swallow it and spawn new matter at outer rim
        if (p.r <= R_H * 1.02) {
          p.r = R_H * 6.5 + Math.random() * (R_H * 2.0);
          p.theta = Math.random() * Math.PI * 2;
          p.z = (Math.random() - 0.5) * 8;
        }

        posArr[i * 3]     = p.r * Math.cos(p.theta);
        posArr[i * 3 + 1] = p.z;
        posArr[i * 3 + 2] = p.r * Math.sin(p.theta);

        // Heated color: blinding white-blue at inner horizon, red-orange at outer rim
        const heat = Math.max(0, Math.min(1, (R_H * 4 - p.r) / (R_H * 2.5)));
        colArr[i * 3]     = 1.0;
        colArr[i * 3 + 1] = 0.4 + heat * 0.6;
        colArr[i * 3 + 2] = 0.1 + heat * 0.9;
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    };

    const dispose = () => {
      horizonGeo.dispose();
      horizonMat.dispose();
      photonRingGeo.dispose();
      photonRingMat.dispose();
      diskGeo.dispose();
      diskMat.dispose();
      lensGeo.dispose();
      lensMat.dispose();
      suctionGeo.dispose();
      suctionMat.dispose();
      diskTex.dispose();
    };

    return { group, update, dispose };
  }

  /**
   * Milky Way Galaxy: Barred spiral with 2 main arms + central galactic bulge +
   * prominent Solar System location beacon in the Orion arm.
   */
  private static buildMilkyWay(): {
    group: THREE.Group;
    solarSystemMarker: THREE.Object3D;
    update: (dt: number) => void;
    dispose: () => void;
  } {
    const group = new THREE.Group();
    const starCount = 4000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    let idx = 0;

    // 1. Galactic Central Bulge (dense golden/orange stars)
    const coreCount = 1200;
    for (let i = 0; i < coreCount; i++, idx++) {
      const u = Math.random();
      const r = Math.pow(u, 2) * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.6;

      positions[idx * 3]     = r * Math.cos(theta) * Math.cos(phi);
      positions[idx * 3 + 1] = (r * 0.4) * Math.sin(phi);
      positions[idx * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);

      colors[idx * 3]     = 1.0;
      colors[idx * 3 + 1] = 0.85 + Math.random() * 0.15;
      colors[idx * 3 + 2] = 0.45;
    }

    // 2. Spiral Arms (Logarithmic spirals: r = a * e^(b*theta))
    const armStars = starCount - coreCount;
    for (let i = 0; i < armStars; i++, idx++) {
      const armIndex = i % 2; // 2 major arms
      const armOffset = armIndex * Math.PI;
      const t = Math.random();
      const theta = 0.8 + t * 4.2;
      const r = 35 * Math.exp(0.32 * theta);

      const spread = (Math.random() - 0.5) * (14 + r * 0.12);
      const zSpread = (Math.random() - 0.5) * (6 + r * 0.04);

      const angle = theta + armOffset;
      positions[idx * 3]     = r * Math.cos(angle) + spread;
      positions[idx * 3 + 1] = zSpread;
      positions[idx * 3 + 2] = r * Math.sin(angle) + spread;

      // Blue-white young star clusters along spiral arms
      if (Math.random() < 0.65) {
        colors[idx * 3] = 0.65; colors[idx * 3 + 1] = 0.82; colors[idx * 3 + 2] = 1.0;
      } else {
        colors[idx * 3] = 1.0; colors[idx * 3 + 1] = 0.95; colors[idx * 3 + 2] = 0.8;
      }
    }

    const galaxyGeo = new THREE.BufferGeometry();
    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const galaxyMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.90,
      blending: THREE.AdditiveBlending,
    });
    const galaxyPoints = new THREE.Points(galaxyGeo, galaxyMat);
    group.add(galaxyPoints);

    // 3. Solar System Location Marker (Orion Arm at r ~ 115)
    const markerGroup = new THREE.Group();
    const markerRadius = 118;
    const markerAngle = 2.45;
    markerGroup.position.set(
      markerRadius * Math.cos(markerAngle),
      2,
      markerRadius * Math.sin(markerAngle),
    );

    // Pulsing beacon ring
    const beaconRingGeo = new THREE.RingGeometry(3.5, 5.0, 32);
    const beaconRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });
    const beaconRing = new THREE.Mesh(beaconRingGeo, beaconRingMat);
    beaconRing.rotation.x = Math.PI / 2;
    markerGroup.add(beaconRing);

    // Central beacon core point
    const corePtGeo = new THREE.SphereGeometry(1.5, 16, 16);
    const corePtMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    markerGroup.add(new THREE.Mesh(corePtGeo, corePtMat));

    group.add(markerGroup);

    // Slight galaxy tilt for viewing angle
    group.rotation.x = Math.PI / 3.8;

    const update = (dt: number) => {
      galaxyPoints.rotation.y += 0.04 * dt;
      beaconRing.scale.setScalar(1.0 + Math.sin(Date.now() * 0.005) * 0.25);
    };

    const dispose = () => {
      galaxyGeo.dispose();
      galaxyMat.dispose();
      beaconRingGeo.dispose();
      beaconRingMat.dispose();
      corePtGeo.dispose();
      corePtMat.dispose();
    };

    return { group, solarSystemMarker: markerGroup, update, dispose };
  }

  /**
   * Andromeda Galaxy (M31): Tilted grand design spiral galaxy
   */
  private static buildAndromeda(): { group: THREE.Group; update: (dt: number) => void; dispose: () => void } {
    const group = new THREE.Group();
    const count = 3000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const arm = (i % 2) * Math.PI;
      const t = Math.random();
      const theta = 0.5 + t * 4.5;
      const r = 25 * Math.exp(0.28 * theta);
      const spread = (Math.random() - 0.5) * (18 + r * 0.15);
      const angle = theta + arm;

      pos[i * 3]     = r * Math.cos(angle) + spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * (8 + r * 0.05);
      pos[i * 3 + 2] = r * Math.sin(angle) + spread;

      // Bright blue spiral star-forming bands with yellowish core
      if (r < 40) {
        col[i * 3] = 1.0; col[i * 3 + 1] = 0.85; col[i * 3 + 2] = 0.5;
      } else {
        col[i * 3] = 0.55; col[i * 3 + 1] = 0.80; col[i * 3 + 2] = 1.0;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
      size: 2.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, mat);
    group.add(points);
    group.rotation.x = Math.PI / 2.6;
    group.rotation.z = Math.PI / 6;

    const update = (dt: number) => {
      points.rotation.y += 0.03 * dt;
    };

    const dispose = () => {
      geo.dispose();
      mat.dispose();
    };

    return { group, update, dispose };
  }

  /**
   * Sombrero / Elliptical Galaxy (M104): Luminous nucleus with dark equatorial dust lane
   */
  private static buildSombrero(): { group: THREE.Group; update: (dt: number) => void; dispose: () => void } {
    const group = new THREE.Group();
    const count = 2200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const r = Math.pow(u, 1.8) * 110;
      const theta = Math.random() * Math.PI * 2;
      const isCore = r < 45;

      pos[i * 3]     = r * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * (isCore ? 35 * (1 - r / 45) : 8);
      pos[i * 3 + 2] = r * Math.sin(theta);

      // Core is bright white-gold; outer disk has dark lane attenuation
      if (isCore) {
        col[i * 3] = 1.0; col[i * 3 + 1] = 0.95; col[i * 3 + 2] = 0.85;
      } else {
        col[i * 3] = 0.9; col[i * 3 + 1] = 0.75; col[i * 3 + 2] = 0.55;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Points(geo, mat));

    // Dark equatorial dust lane ring
    const dustGeo = new THREE.RingGeometry(48, 85, 64);
    const dustMat = new THREE.MeshBasicMaterial({
      color: 0x0a0505,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
    });
    const dust = new THREE.Mesh(dustGeo, dustMat);
    dust.rotation.x = Math.PI / 2;
    group.add(dust);

    group.rotation.x = Math.PI / 5;

    const update = (dt: number) => {
      group.rotation.y += 0.02 * dt;
    };

    const dispose = () => {
      geo.dispose();
      mat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
    };

    return { group, update, dispose };
  }

  /**
   * Deep Space Nebula Gas Clouds: Multi-colored interstellar gas dust
   */
  private static buildNebulaClouds(): { group: THREE.Group; dispose: () => void } {
    const group = new THREE.Group();
    const count = 1800;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    // 3 distinct colored interstellar clouds
    const centers = [
      { x: -300, y: 150, z: -400, r: 0.8, g: 0.2, b: 0.6 },  // magenta cloud
      { x: 450,  y: -180, z: 250,  r: 0.1, g: 0.6, b: 0.8 },  // cyan cloud
      { x: -200, y: -250, z: 400,  r: 0.4, g: 0.2, b: 0.8 },  // deep violet cloud
    ];

    for (let i = 0; i < count; i++) {
      const c = centers[i % 3];
      const r = Math.random() * 180;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      pos[i * 3]     = c.x + r * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = c.y + r * Math.sin(phi);
      pos[i * 3 + 2] = c.z + r * Math.sin(theta) * Math.cos(phi);

      col[i * 3]     = c.r + (Math.random() - 0.5) * 0.1;
      col[i * 3 + 1] = c.g + (Math.random() - 0.5) * 0.1;
      col[i * 3 + 2] = c.b + (Math.random() - 0.5) * 0.1;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
      size: 7.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Points(geo, mat));

    return {
      group,
      dispose: () => {
        geo.dispose();
        mat.dispose();
      },
    };
  }

  /**
   * Master builder for the entire Deep Universe vista
   */
  static buildUniverse(scene: THREE.Scene): CosmicSceneObjects {
    const rootGroup = new THREE.Group();

    // 1. Supermassive Black Hole
    const bh = this.buildBlackHole();
    const blackHolePosition = new THREE.Vector3(-450, 60, -700);
    bh.group.position.copy(blackHolePosition);
    rootGroup.add(bh.group);

    // 2. Milky Way Galaxy (Our Home)
    const mw = this.buildMilkyWay();
    const milkyWayPosition = new THREE.Vector3(650, 100, 350);
    mw.group.position.copy(milkyWayPosition);
    rootGroup.add(mw.group);

    // 3. Andromeda Galaxy (M31)
    const andromeda = this.buildAndromeda();
    andromeda.group.position.set(-850, 350, 400);
    rootGroup.add(andromeda.group);

    // 4. Sombrero Galaxy (M104)
    const sombrero = this.buildSombrero();
    sombrero.group.position.set(400, -350, -650);
    rootGroup.add(sombrero.group);

    // 5. Intergalactic Nebula Gas Clouds
    const nebulae = this.buildNebulaClouds();
    rootGroup.add(nebulae.group);

    scene.add(rootGroup);

    const update = (dt: number) => {
      bh.update(dt);
      mw.update(dt);
      andromeda.update(dt);
      sombrero.update(dt);
    };

    const dispose = () => {
      bh.dispose();
      mw.dispose();
      andromeda.dispose();
      sombrero.dispose();
      nebulae.dispose();
      scene.remove(rootGroup);
    };

    return {
      rootGroup,
      blackHoleGroup: bh.group,
      milkyWayGroup: mw.group,
      solarSystemMarker: mw.solarSystemMarker,
      blackHolePosition,
      milkyWayPosition,
      update,
      dispose,
    };
  }
}
