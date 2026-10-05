import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ThreeEngine } from '../engine/ThreeEngine';
import { CelestialBuilder, type CelestialObject } from '../engine/CelestialBuilder';
import { CosmicBuilder, type CosmicSceneObjects } from '../engine/CosmicBuilder';
import { EarthSurfaceBuilder, type EarthSurfaceScene } from '../engine/EarthSurfaceBuilder';
import { FlightControls } from '../engine/FlightControls';
import { EyeBlinkOverlay } from '../components/EyeBlinkOverlay';
import { HelmetHUD, type SimulationState } from '../components/HelmetHUD';
import { SimulationErrorBoundary } from '../components/SimulationErrorBoundary';
import { useNavigate } from 'react-router-dom';

/**
 * Fullscreen sandboxed 3D Universe & Solar System scene.
 * Quality-first:
 * - Phase 2.5: Deep Universe (Supermassive Black Hole with relativistic accretion disk,
 *   gravitational lensing, inward matter suction whirlpool, Milky Way, Andromeda, Sombrero)
 * - Seamless Relativistic Hyper-Descent into Our Solar System
 * - Phase 2: Proportional Sun & 8 authentic planets with procedural surface textures
 * - Phase 3: Atmospheric Entry with 3-stage re-entry & plasma heat shield
 * - Phase 4: Earth Surface vantage point (stationary 360° pitch/yaw horizon gaze)
 * - Full GPU/VRAM teardown on unmount
 */
const SolarSystemSceneInner: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<ThreeEngine | null>(null);
  const controlsRef = useRef<FlightControls | null>(null);

  // Scene root references
  const cosmicRef = useRef<CosmicSceneObjects | null>(null);
  const solarGroupRef = useRef<THREE.Group | null>(null);
  const earthSurfaceRef = useRef<EarthSurfaceScene | null>(null);
  const solarPlanetsRef = useRef<CelestialObject[]>([]);
  const solarTargetsRef = useRef<Array<{ name: string; worldPos: () => THREE.Vector3 }>>([]);
  const cosmicTargetsRef = useRef<Array<{ name: string; worldPos: () => THREE.Vector3 }>>([]);

  const [blinkDone, setBlinkDone] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // HUD telemetry & simulation state
  const [simState, setSimState] = useState<SimulationState>('universe');
  const [speed, setSpeed] = useState(0);
  const [targetLabel, setTargetLabel] = useState('Milky Way Galaxy (Solar System)');
  const [targetDist, setTargetDist] = useState(2.5e17);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [canEnterSolarSystem, setCanEnterSolarSystem] = useState(false);

  // Phase 3 & 4: Atmospheric Entry & Earth Surface state
  const [canEnterEarth, setCanEnterEarth] = useState(false);
  const [altitudeKm, setAltitudeKm] = useState(450);
  const [heatShieldTemp, setHeatShieldTemp] = useState(20);
  const [entryProgress, setEntryProgress] = useState(0);
  const [compassHeading, setCompassHeading] = useState(0);
  const [compassPitch, setCompassPitch] = useState(0);

  const lastTelemetryTime = useRef(0);
  const rawTelemetry = useRef({ speed: 0, target: 'Milky Way Galaxy', dist: 2.5e17 });
  const warpAnimRef = useRef<{ active: boolean; startTime: number; startPos: THREE.Vector3; endPos: THREE.Vector3 } | null>(null);
  const entryAnimRef = useRef<{ active: boolean; startTime: number; startPos: THREE.Vector3; initialEarthPos: THREE.Vector3 } | null>(null);
  const ascentAnimRef = useRef<{ active: boolean; startTime: number; startY: number } | null>(null);
  const trackingPlanetRef = useRef<CelestialObject | null>(null);

  const handleBlinkComplete = useCallback(() => setBlinkDone(true), []);
  const handleContextLost = useCallback(() => setContextLost(true), []);

  // Hierarchical exit: Surface → Space → Universe → Hub
  const handleExit = useCallback(() => {
    if (simState === 'surface') {
      // Trigger rocket ascent lift-off back into orbit
      const cam = engineRef.current?.getCamera();
      if (cam) {
        ascentAnimRef.current = {
          active: true,
          startTime: performance.now(),
          startY: cam.position.y,
        };
      }
      return;
    }

    if (simState === 'space' || simState === 'approach') {
      // Step back to Deep Universe view
      if (solarGroupRef.current) solarGroupRef.current.visible = false;
      if (cosmicRef.current) cosmicRef.current.rootGroup.visible = true;
      if (engineRef.current) engineRef.current.getScene().fog = null;

      // Reset camera to cosmic overview
      const cam = engineRef.current?.getCamera();
      if (cam && controlsRef.current) {
        controlsRef.current.setPosition(new THREE.Vector3(0, 80, 520), new THREE.Vector3(150, 40, -100));
        controlsRef.current.setTargets(cosmicTargetsRef.current);
      }
      setSimState('universe');
      setWarningMessage(null);
      setCanEnterEarth(false);
    } else {
      // Exit from Universe to Hub
      navigate('/simulation-3d');
    }
  }, [simState, navigate]);

  // Abort atmospheric re-entry: thrust back into orbit
  const handleAbortEntry = useCallback(() => {
    if (entryAnimRef.current) {
      entryAnimRef.current.active = false;
    }
    const earthObj = solarPlanetsRef.current.find((p) => p.data.id === 'earth');
    if (earthObj && controlsRef.current) {
      const earthPos = earthObj.mesh.getWorldPosition(new THREE.Vector3());
      controlsRef.current.setPosition(
        earthPos.clone().add(new THREE.Vector3(6, 2, 4)),
        earthPos,
      );
    }
    setSimState('space');
    setAltitudeKm(450);
    setHeatShieldTemp(20);
    setEntryProgress(0);
  }, []);

  // Initiate hyper-descent into Solar System
  const initiateSolarSystemDescent = useCallback(() => {
    if (simState !== 'universe' || !engineRef.current || !cosmicRef.current) return;

    const cam = engineRef.current.getCamera();
    const targetMarkerPos = cosmicRef.current.solarSystemMarker.getWorldPosition(new THREE.Vector3());

    warpAnimRef.current = {
      active: true,
      startTime: performance.now(),
      startPos: cam.position.clone(),
      endPos: targetMarkerPos.clone().add(new THREE.Vector3(0, 5, 20)),
    };

    setSimState('warp');
    setWarningMessage(null);
  }, [simState]);

  // Phase 3: Initiate Earth Atmospheric Entry
  const initiateEarthEntry = useCallback(() => {
    if ((simState !== 'space' && simState !== 'approach') || !engineRef.current) return;

    const earthObj = solarPlanetsRef.current.find((p) => p.data.id === 'earth');
    if (!earthObj) return;

    const cam = engineRef.current.getCamera();
    const earthPos = earthObj.mesh.getWorldPosition(new THREE.Vector3());

    trackingPlanetRef.current = null;
    entryAnimRef.current = {
      active: true,
      startTime: performance.now(),
      startPos: cam.position.clone(),
      initialEarthPos: earthPos.clone(),
    };

    setSimState('entry');
    setEntryProgress(0);
  }, [simState]);

  // Quick Target Navigation Handler
  const handleFocusTarget = useCallback((targetKey: string) => {
    if (!engineRef.current || !controlsRef.current) return;

    if (simState === 'universe') {
      if (!cosmicRef.current) return;
      if (targetKey === 'milkyway') {
        const mwPos = cosmicRef.current.solarSystemMarker.getWorldPosition(new THREE.Vector3());
        controlsRef.current.setPosition(mwPos.clone().add(new THREE.Vector3(0, 15, 65)), mwPos);
      } else if (targetKey === 'blackhole') {
        const bhPos = cosmicRef.current.blackHolePosition;
        controlsRef.current.setPosition(bhPos.clone().add(new THREE.Vector3(0, 30, 140)), bhPos);
      } else if (targetKey === 'andromeda') {
        const andrPos = new THREE.Vector3(-850, 350, 400);
        controlsRef.current.setPosition(andrPos.clone().add(new THREE.Vector3(0, 40, 180)), andrPos);
      } else if (targetKey === 'sombrero') {
        const sombPos = new THREE.Vector3(400, -350, -650);
        controlsRef.current.setPosition(sombPos.clone().add(new THREE.Vector3(0, 40, 180)), sombPos);
      }
    } else if (simState === 'space' || simState === 'approach') {
      if (entryAnimRef.current) entryAnimRef.current.active = false;

      if (targetKey === 'sun') {
        trackingPlanetRef.current = null;
        controlsRef.current.setPosition(new THREE.Vector3(0, 6, 26), new THREE.Vector3(0, 0, 0));
        setCanEnterEarth(false);
        setSimState('space');
      } else {
        const p = solarPlanetsRef.current.find((pl) => pl.data.id === targetKey);
        if (p) {
          trackingPlanetRef.current = p;
          p.mesh.updateMatrixWorld(true);
          const pWorld = p.mesh.getWorldPosition(new THREE.Vector3());
          const r = p.data.radiusKm * (0.5 / 6371);
          const viewDist = p.data.rings ? r * 3.4 : (targetKey === 'earth' ? 2.8 : Math.max(r * 2.8, 1.4));
          const toSun = new THREE.Vector3(0, 0, 0).sub(pWorld);
          if (toSun.lengthSq() < 0.001) toSun.set(0, 0, 1);
          toSun.normalize();

          const camPos = pWorld.clone().addScaledVector(toSun, viewDist).add(new THREE.Vector3(0, r * 0.22, 0));
          controlsRef.current.setPosition(camPos, pWorld);

          if (targetKey === 'earth') {
            setCanEnterEarth(true);
            setSimState('approach');
          } else {
            setCanEnterEarth(false);
            setSimState('space');
          }
        }
      }
    }
  }, [simState]);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Initialize Engine
    const engine = new ThreeEngine({
      container: containerRef.current,
      onContextLost: handleContextLost,
      onUpdate: (dt, eng) => {
        const cam = eng.getCamera();

        // ── A. Warp Animation Loop ──
        if (warpAnimRef.current && warpAnimRef.current.active) {
          const elapsed = (performance.now() - warpAnimRef.current.startTime) / 2200; // 2.2s warp
          if (elapsed < 1.0) {
            // Smooth ease-in-out cubic
            const t = elapsed < 0.5 ? 4 * elapsed * elapsed * elapsed : 1 - Math.pow(-2 * elapsed + 2, 3) / 2;
            cam.position.lerpVectors(warpAnimRef.current.startPos, warpAnimRef.current.endPos, t);
            cam.fov = 70 + Math.sin(elapsed * Math.PI) * 22; // Relativistic FOV expansion
            cam.updateProjectionMatrix();

            // Warp speed readout
            rawTelemetry.current.speed = Math.round(300_000 * (1.5 + elapsed * 6.5));
            return;
          } else {
            // Warp complete: switch to Solar System
            warpAnimRef.current.active = false;
            cam.fov = 70;
            cam.updateProjectionMatrix();

            if (cosmicRef.current) cosmicRef.current.rootGroup.visible = false;
            if (solarGroupRef.current) solarGroupRef.current.visible = true;

            // Place astronaut in Earth orbit view
            controlsRef.current?.setPosition(new THREE.Vector3(104, 4, 12), new THREE.Vector3(100, 0, 0));
            controlsRef.current?.setTargets(solarTargetsRef.current);

            setSimState('space');
            return;
          }
        }

        // ── A2. Rocket Ascent Lift-off Loop (Phase 4: Surface → Orbit) ──
        if (ascentAnimRef.current && ascentAnimRef.current.active) {
          const elapsed = (performance.now() - ascentAnimRef.current.startTime) / 2400; // 2.4s launch
          const p = Math.min(1.0, elapsed);

          if (p < 1.0) {
            const t = p * p;
            cam.position.y = ascentAnimRef.current.startY + t * 240;
            rawTelemetry.current.speed = Math.round(t * 3400);

            // Fade atmospheric fog during ascent
            const sceneFog = eng.getScene().fog as THREE.FogExp2 | null;
            if (sceneFog && earthSurfaceRef.current) {
              sceneFog.density = earthSurfaceRef.current.fogDensity * (1.0 - p);
            }
            return;
          } else {
            // Ascent complete: hand-off to Solar System orbit
            ascentAnimRef.current.active = false;
            eng.getScene().fog = null;
            if (earthSurfaceRef.current) earthSurfaceRef.current.group.visible = false;
            if (solarGroupRef.current) solarGroupRef.current.visible = true;

            const earthObj = solarPlanetsRef.current.find((pl) => pl.data.id === 'earth');
            if (earthObj && controlsRef.current) {
              const earthPos = earthObj.mesh.getWorldPosition(new THREE.Vector3());
              controlsRef.current.setMovementLocked(false);
              controlsRef.current.setPosition(
                earthPos.clone().add(new THREE.Vector3(4, 1.5, 3)),
                earthPos,
              );
              controlsRef.current.setTargets(solarTargetsRef.current);
            }
            setSimState('space');
            return;
          }
        }

        // ── B. Atmospheric Re-entry Loop (Phase 3) ──
        if (entryAnimRef.current && entryAnimRef.current.active) {
          const now = performance.now();
          const elapsed = (now - entryAnimRef.current.startTime) / 7500; // 7.5s descent
          const p = Math.min(1.0, Math.max(0, elapsed));

          const earthObj = solarPlanetsRef.current.find((pl) => pl.data.id === 'earth');
          const earthWorldPos = earthObj
            ? earthObj.mesh.getWorldPosition(new THREE.Vector3())
            : entryAnimRef.current.initialEarthPos;

          // Surface target on the sunlit hemisphere of Earth
          const sunDir = new THREE.Vector3(0, 0, 0).sub(earthWorldPos).normalize();
          const surfaceTarget = earthWorldPos.clone().addScaledVector(sunDir, 0.505);

          // Decelerating cubic descent curve
          const ease = 1 - Math.pow(1 - p, 2.5);
          cam.position.lerpVectors(entryAnimRef.current.startPos, surfaceTarget, ease);
          cam.lookAt(earthWorldPos);

          // Altitude: 450 km down to 0 km
          const curAlt = Math.max(0, 450 * (1 - p));
          setAltitudeKm(curAlt);
          setEntryProgress(p);

          // Entry velocity decay: 7.8 km/s down to terminal 0.05 km/s
          const curVel = Math.max(50, Math.round(7800 * Math.pow(1 - p, 1.8)));
          rawTelemetry.current.speed = curVel;

          // Heat shield temperature curve: peaks at ~1890°C around 120-90 km altitude
          const heatFactor = Math.sin(Math.min(Math.PI, p * 2.3));
          const curHeat = Math.round(20 + Math.pow(heatFactor, 1.8) * 1870);
          setHeatShieldTemp(curHeat);

          // Aerodynamic buffeting & micro-vibrations
          if (curHeat > 350 && p < 0.75) {
            const shake = (curHeat / 1900) * 0.007;
            cam.position.x += (Math.random() - 0.5) * shake;
            cam.position.y += (Math.random() - 0.5) * shake;
          }

          if (p >= 1.0) {
            // Touchdown transition to Surface Observation (Phase 4)
            entryAnimRef.current.active = false;
            if (solarGroupRef.current) solarGroupRef.current.visible = false;
            if (earthSurfaceRef.current) {
              earthSurfaceRef.current.group.visible = true;
              eng.getScene().fog = new THREE.FogExp2(
                earthSurfaceRef.current.fogColor,
                earthSurfaceRef.current.fogDensity,
              );
            }

            // Lock astronaut boots at standing eye level (y = 1.75m), enable 360° mouse look
            controlsRef.current?.setMovementLocked(true, new THREE.Vector3(0, 1.75, 0));
            controlsRef.current?.setPosition(new THREE.Vector3(0, 1.75, 0), new THREE.Vector3(0, 1.75, -50));

            setSimState('surface');
            setAltitudeKm(0);
            setHeatShieldTemp(22);
            setEntryProgress(1);
            rawTelemetry.current.speed = 0;
            rawTelemetry.current.target = 'Earth Surface Horizon';
            rawTelemetry.current.dist = 0;
          }
          return;
        }

        // ── C. Flight Controls Step ──
        controlsRef.current?.update();

        // ── C2. Synchronous Orbital Lock for Focused Planet ──
        if (trackingPlanetRef.current && !entryAnimRef.current?.active && simState !== 'surface' && controlsRef.current) {
          const p = trackingPlanetRef.current;
          p.mesh.updateMatrixWorld(true);
          const pWorld = p.mesh.getWorldPosition(new THREE.Vector3());
          const r = p.data.radiusKm * (0.5 / 6371);
          const viewDist = p.data.rings ? r * 3.4 : (p.data.id === 'earth' ? 2.8 : Math.max(r * 2.8, 1.4));
          const toSun = new THREE.Vector3(0, 0, 0).sub(pWorld);
          if (toSun.lengthSq() < 0.001) toSun.set(0, 0, 1);
          toSun.normalize();

          const camPos = pWorld.clone().addScaledVector(toSun, viewDist).add(new THREE.Vector3(0, r * 0.22, 0));
          controlsRef.current.setPosition(camPos, pWorld);
        }

        // ── D. Universe Mode Physics & Cosmic Entities ──
        if (cosmicRef.current && cosmicRef.current.rootGroup.visible) {
          cosmicRef.current.update(dt);

          // Gravitational suction physics near Black Hole ("real me jese sab khich leta h wesi uske pass feel ana chaiye")
          const toBH = cosmicRef.current.blackHolePosition.clone().sub(cam.position);
          const distBH = toBH.length();

          if (distBH < 360) {
            if (distBH > 52) {
              setWarningMessage('GRAVITATIONAL ANOMALY · INWARD ACCRETION SUCTION ACTIVE');
              // Real-time gravitational attraction pulling camera toward singularity
              const pullStrength = Math.min(3.2, 95 / distBH);
              cam.position.addScaledVector(toBH.normalize(), pullStrength * dt * 26);
            } else {
              // Event Horizon proximity emergency repulsion (safety boundary)
              setWarningMessage('RETRO-THRUSTER ACTIVE · EVENT HORIZON DEFLECTION');
              cam.position.addScaledVector(toBH.normalize().negate(), 75 * dt);
            }
          } else {
            setWarningMessage(null);
          }

          // Check proximity to Milky Way Solar System marker
          const mwMarkerPos = cosmicRef.current.solarSystemMarker.getWorldPosition(new THREE.Vector3());
          const distToSolar = cam.position.distanceTo(mwMarkerPos);
          setCanEnterSolarSystem(distToSolar < 350 || rawTelemetry.current.target.includes('Milky Way'));
        }

        // ── E. Solar System Mode Orbits, Rotations & Earth Proximity ──
        if (solarGroupRef.current && solarGroupRef.current.visible) {
          for (let i = 0; i < solarPlanetsRef.current.length; i++) {
            const p = solarPlanetsRef.current[i];
            p.pivot.rotation.y += p.orbitalSpeed * dt;
            p.group.rotation.y += p.selfRotationSpeed * dt;
            if (p.cloudMesh) {
              p.cloudMesh.rotation.y += p.selfRotationSpeed * 1.25 * dt;
            }
          }

          // Earth Proximity Detection for Atmospheric Entry
          const earthObj = solarPlanetsRef.current.find((pl) => pl.data.id === 'earth');
          if (earthObj && !entryAnimRef.current?.active && simState !== 'surface') {
            const earthWorldPos = earthObj.mesh.getWorldPosition(new THREE.Vector3());
            const distToEarth = cam.position.distanceTo(earthWorldPos);

            // Proximity threshold: within 18 scene units (~27,000 km)
            if (distToEarth < 18) {
              setCanEnterEarth(true);
              if (simState === 'space') setSimState('approach');
            } else {
              setCanEnterEarth(false);
              if (simState === 'approach') setSimState('space');
            }
          }
        }

        // ── F. Throttled HUD State Updates (10 Hz) ──
        const now = performance.now();
        if (now - lastTelemetryTime.current > 100) {
          lastTelemetryTime.current = now;
          const { speed: s, target: t, dist: d } = rawTelemetry.current;
          setSpeed(s);
          setTargetLabel(t);
          setTargetDist(d);

          // Calculate surface 360° compass heading & pitch when grounded
          if (simState === 'surface') {
            const euler = new THREE.Euler(0, 0, 0, 'YXZ').setFromQuaternion(cam.quaternion);
            let deg = Math.round((-euler.y * 180) / Math.PI) % 360;
            if (deg < 0) deg += 360;
            const pitch = Math.round((-euler.x * 180) / Math.PI);
            setCompassHeading(deg);
            setCompassPitch(pitch);
          }
        }

        // ── G. Update Earth Surface Scene (Phase 4) ──
        if (earthSurfaceRef.current && earthSurfaceRef.current.group.visible) {
          earthSurfaceRef.current.update(dt);
        }
      },
    });
    engineRef.current = engine;
    const scene = engine.getScene();

    // 2. Build Deep Universe (Supermassive Black Hole, Milky Way, Andromeda, Sombrero)
    const cosmic = CosmicBuilder.buildUniverse(scene);
    cosmicRef.current = cosmic;

    // 3. Build Solar System (Sun, 8 Proportional Planets, Orbit Traces)
    const solarGroup = new THREE.Group();
    solarGroup.visible = false; // Hidden initially while in Universe mode
    scene.add(solarGroup);
    solarGroupRef.current = solarGroup;

    // Solar system starfield & bodies
    const starfield = CelestialBuilder.buildStarfield();
    solarGroup.add(starfield);

    const sun = CelestialBuilder.buildSun(scene);
    solarGroup.add(sun);

    const planets = CelestialBuilder.buildPlanets(scene);
    planets.forEach((p) => solarGroup.add(p.pivot));
    solarPlanetsRef.current = planets;

    planets.forEach((p) => {
      const trace = CelestialBuilder.buildOrbitalTrace(p.data.orbitKm);
      solarGroup.add(trace);
    });

    // 4. Build Earth Surface Vantage Scene (Phase 4)
    const earthSurface = EarthSurfaceBuilder.buildSurface();
    earthSurface.group.visible = false;
    scene.add(earthSurface.group);
    earthSurfaceRef.current = earthSurface;

    // 5. Target Lists
    const cosmicTargets = [
      { name: 'Milky Way Galaxy (Solar System)', worldPos: () => cosmic.solarSystemMarker.getWorldPosition(new THREE.Vector3()) },
      { name: 'Supermassive Black Hole', worldPos: () => cosmic.blackHolePosition },
      { name: 'Andromeda Galaxy (M31)', worldPos: () => new THREE.Vector3(-850, 350, 400) },
      { name: 'Sombrero Galaxy (M104)', worldPos: () => new THREE.Vector3(400, -350, -650) },
    ];
    cosmicTargetsRef.current = cosmicTargets;

    const solarTargets = [
      { name: 'Sun', worldPos: () => new THREE.Vector3(0, 0, 0) },
      ...planets.map((p) => ({
        name: p.data.name,
        worldPos: () => p.mesh.getWorldPosition(new THREE.Vector3()),
      })),
    ];
    solarTargetsRef.current = solarTargets;

    // 6. Initialize Astronaut Camera & 6-DOF Flight Controls
    const cam = engine.getCamera();
    cam.position.set(0, 80, 520);
    cam.lookAt(150, 40, -100);

    const controls = new FlightControls({
      camera: cam,
      domElement: engine.getRenderer().domElement,
      celestialObjects: cosmicTargets,
      onSpeedChange: (kmPerSec) => {
        if (!warpAnimRef.current?.active) {
          rawTelemetry.current.speed = kmPerSec;
        }
      },
      onTargetChange: (targetName, distKm) => {
        rawTelemetry.current.target = targetName;
        rawTelemetry.current.dist = distKm;
      },
      onLockChange: (locked) => {
        setIsLocked(locked);
      },
    });
    controlsRef.current = controls;

    // Teardown
    return () => {
      controls.dispose();
      controlsRef.current = null;
      earthSurface.dispose();
      earthSurfaceRef.current = null;
      cosmic.dispose();
      cosmicRef.current = null;
      CelestialBuilder.dispose();
      engine.dispose();
      engineRef.current = null;
    };
  }, [handleContextLost]);

  if (contextLost) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#060608',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#e2e8f0',
          fontFamily: 'monospace',
          gap: 16,
          padding: 24,
        }}
      >
        <span style={{ fontSize: 28 }}>⚠</span>
        <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', maxWidth: 320 }}>
          GPU context was lost. Your main application is unaffected.
        </p>
        <button
          type="button"
          onClick={() => navigate('/simulation-3d')}
          style={{
            padding: '8px 20px',
            border: '1px solid #334155',
            borderRadius: 6,
            background: '#1e2433',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          Return to Hub
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000005', overflow: 'hidden' }}>
      {/* Three.js canvas mount point */}
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Helmet HUD — layered above canvas, revealed after eye blink */}
      {blinkDone && (
        <HelmetHUD
          simState={simState}
          speed={speed}
          targetLabel={targetLabel}
          targetDistance={targetDist}
          isLocked={isLocked}
          warningMessage={warningMessage}
          canEnterSolarSystem={canEnterSolarSystem}
          onEnterSolarSystem={initiateSolarSystemDescent}
          canEnterEarth={canEnterEarth}
          onEnterEarth={initiateEarthEntry}
          altitudeKm={altitudeKm}
          heatShieldTemp={heatShieldTemp}
          entryProgress={entryProgress}
          compassHeading={compassHeading}
          compassPitch={compassPitch}
          onAbortEntry={handleAbortEntry}
          onFocusTarget={handleFocusTarget}
          onExit={handleExit}
        />
      )}

      {/* Cinematic 2-blink eye opening */}
      <EyeBlinkOverlay onComplete={handleBlinkComplete} />
    </div>
  );
};

/** Exported scene with error boundary wrapping for GPU crash isolation */
export const SolarSystemScene: React.FC = () => (
  <SimulationErrorBoundary>
    <SolarSystemSceneInner />
  </SimulationErrorBoundary>
);
