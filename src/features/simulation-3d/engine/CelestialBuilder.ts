import * as THREE from 'three';
import { SUN, PLANETS, SIZE_SCALE, DIST_SCALE, SIM_DAYS_PER_SECOND, type PlanetSpec } from '../data/planetData';
import { PlanetTextureGenerator } from './PlanetTextureGenerator';

export interface CelestialObject {
  data: PlanetSpec;
  pivot: THREE.Group;        // centered at Sun — rotated for orbital motion
  group: THREE.Group;        // at orbit radius — rotated for axial spin
  mesh: THREE.Mesh;          // primary planet sphere
  cloudMesh?: THREE.Mesh;    // optional cloud layer
  orbitalSpeed: number;      // radians per second (simulation time)
  selfRotationSpeed: number; // radians per second
}

export class CelestialBuilder {

  /** Helper to get procedural texture per planet ID */
  private static getPlanetTexture(id: string): THREE.CanvasTexture {
    switch (id) {
      case 'mercury': return PlanetTextureGenerator.getMercuryTexture();
      case 'venus':   return PlanetTextureGenerator.getVenusTexture();
      case 'earth':   return PlanetTextureGenerator.getEarthTexture();
      case 'mars':    return PlanetTextureGenerator.getMarsTexture();
      case 'jupiter': return PlanetTextureGenerator.getJupiterTexture();
      case 'saturn':  return PlanetTextureGenerator.getSaturnTexture();
      case 'uranus':  return PlanetTextureGenerator.getUranusTexture();
      case 'neptune': return PlanetTextureGenerator.getNeptuneTexture();
      default:        return PlanetTextureGenerator.getEarthTexture();
    }
  }

  /** Sun: core sphere + 3-layer corona glow + point light */
  static buildSun(scene: THREE.Scene): THREE.Group {
    const group = new THREE.Group();
    // Scaled visual radius for astronomical visibility & Mercury orbital clearance (24x Earth size)
    const r = 12.0;

    // 1. Core — textured solar convective granulation
    const sunTex = PlanetTextureGenerator.getSunTexture();
    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(r, 64, 64),
      new THREE.MeshBasicMaterial({ map: sunTex }),
    );
    group.add(sunMesh);

    // 2. Inner corona (BackSide so camera sees it from outside)
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(r * 1.08, 32, 32),
      new THREE.MeshBasicMaterial({
        color: SUN.coronaColor, transparent: true,
        opacity: 0.32, side: THREE.BackSide,
      }),
    ));

    // 3. Outer glow
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(r * 1.28, 32, 32),
      new THREE.MeshBasicMaterial({
        color: SUN.glowColor, transparent: true,
        opacity: 0.1, side: THREE.BackSide,
      }),
    ));

    // 4. Point light — illuminates all planets with zero distance decay
    const light = new THREE.PointLight(0xFFF5CC, 4.5, 0, 0);
    light.decay = 0;
    group.add(light);

    // 5. Rich ambient fill light so textures on all sides and outer planets are clearly visible
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));

    scene.add(group);
    return group;
  }

  /** All 8 planets — proportional sizes, authentic textures, atmospheres, clouds, rings */
  static buildPlanets(scene: THREE.Scene): CelestialObject[] {
    return PLANETS.map((data) => {
      const pivot = new THREE.Group();
      const group = new THREE.Group();
      pivot.add(group);
      scene.add(pivot);

      const r = data.radiusKm * SIZE_SCALE;
      const orbitR = data.orbitKm * DIST_SCALE;
      group.position.x = orbitR;

      // Authentic planet body with procedural texture
      const tex = this.getPlanetTexture(data.id);
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(r, 64, 64),
        new THREE.MeshStandardMaterial({
          map: tex,
          roughness: data.roughness,
          metalness: data.metalness,
        }),
      );
      group.add(mesh);

      // Atmosphere rim
      if (data.atmosphereColor !== undefined && data.atmosphereOpacity !== undefined) {
        group.add(new THREE.Mesh(
          new THREE.SphereGeometry(r * 1.065, 32, 32),
          new THREE.MeshBasicMaterial({
            color: data.atmosphereColor,
            transparent: true,
            opacity: data.atmosphereOpacity,
            side: THREE.BackSide,
          }),
        ));
      }

      // Cloud layer (Earth) with procedural meteorological weather swirl texture
      let cloudMesh: THREE.Mesh | undefined;
      if (data.clouds) {
        const cloudTex = PlanetTextureGenerator.getEarthCloudTexture();
        cloudMesh = new THREE.Mesh(
          new THREE.SphereGeometry(r * 1.022, 48, 48),
          new THREE.MeshStandardMaterial({
            map: cloudTex,
            transparent: true,
            opacity: data.clouds.opacity,
            roughness: 0.9,
            metalness: 0,
            blending: THREE.NormalBlending,
          }),
        );
        group.add(cloudMesh);
      }

      // Saturn rings — radial UV mapping for realistic concentric divisions (Cassini, A/B/C)
      if (data.rings) {
        const innerR = r * data.rings.innerRatio;
        const outerR = r * data.rings.outerRatio;
        const ringGeo = new THREE.RingGeometry(innerR, outerR, 128, 8);

        // Adjust UVs so u maps from inner (0) to outer (1)
        const pos = ringGeo.attributes.position;
        const uv = ringGeo.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const rad = Math.sqrt(x * x + y * y);
          const u = Math.max(0, Math.min(1, (rad - innerR) / (outerR - innerR)));
          uv.setXY(i, u, 0.5);
        }
        uv.needsUpdate = true;

        const ringTex = PlanetTextureGenerator.getSaturnRingTexture();
        const ringMesh = new THREE.Mesh(
          ringGeo,
          new THREE.MeshBasicMaterial({
            map: ringTex,
            transparent: true,
            opacity: data.rings.opacity,
            side: THREE.DoubleSide,
          }),
        );
        ringMesh.rotation.x = -Math.PI / 2.3;
        group.add(ringMesh);
      }

      // Random start angle to spread planets around orbits
      pivot.rotation.y = Math.random() * Math.PI * 2;

      const orbitalSpeed = (2 * Math.PI / data.orbitalPeriodDays) * SIM_DAYS_PER_SECOND;
      const selfRotationSpeed = (2 * Math.PI / (data.orbitalPeriodDays * 0.01)) * SIM_DAYS_PER_SECOND;

      return { data, pivot, group, mesh, cloudMesh, orbitalSpeed, selfRotationSpeed };
    });
  }

  /** 5000-star field with realistic white/blue-white/yellow-white color distribution */
  static buildStarfield(): THREE.Points {
    const count = 5_000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 6_000 + Math.random() * 4_000;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const t = Math.random();
      if (t < 0.12) {
        // Blue-white (hot class A/B stars)
        colors[i * 3] = 0.78; colors[i * 3 + 1] = 0.88; colors[i * 3 + 2] = 1.0;
      } else if (t < 0.25) {
        // Yellow-white (class F/G)
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 0.72;
      } else if (t < 0.35) {
        // Orange-red (class K/M)
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.68; colors[i * 3 + 2] = 0.45;
      } else {
        // White
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    return new THREE.Points(geo, new THREE.PointsMaterial({
      size: 1.4,
      sizeAttenuation: false,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
    }));
  }

  /** Subtle dotted orbital trace ring for each planet */
  static buildOrbitalTrace(orbitKm: number): THREE.Line {
    const orbitR = orbitKm * DIST_SCALE;
    const pts: THREE.Vector3[] = [];
    const segs = 512;
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * orbitR, 0, Math.sin(a) * orbitR));
    }
    return new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0x223344, transparent: true, opacity: 0.35 }),
    );
  }

  /** Free all procedural GPU textures */
  static dispose(): void {
    PlanetTextureGenerator.dispose();
  }
}
