import * as THREE from 'three';

export interface FlightControlsOptions {
  camera: THREE.PerspectiveCamera;
  domElement: HTMLElement;
  celestialObjects: Array<{ name: string; worldPos: () => THREE.Vector3 }>;
  onSpeedChange: (kmPerSec: number) => void;
  onTargetChange: (name: string, distKm: number) => void;
  onLockChange?: (locked: boolean) => void;
}

/**
 * 6-DOF free-float navigation for the astronaut camera.
 *
 * Controls:
 *   W/S         forward / backward  (camera-relative)
 *   A/D         strafe left / right
 *   Q           thrust up
 *   E           thrust down
 *   Shift       turbo ×12
 *   Ctrl        ultra ×120  (Ctrl+Shift = ×1440 for crossing the system)
 *   Mouse drag  look — pointer lock engaged on first canvas click
 *
 * Inertia: velocity decays by DAMPING each frame → smooth stop.
 */
export class FlightControls {
  private readonly camera: THREE.PerspectiveCamera;
  private readonly domElement: HTMLElement;
  private celestialObjects: FlightControlsOptions['celestialObjects'];
  private readonly onSpeedChange: FlightControlsOptions['onSpeedChange'];
  private readonly onTargetChange: FlightControlsOptions['onTargetChange'];
  private readonly onLockChange?: FlightControlsOptions['onLockChange'];

  private velocity = new THREE.Vector3();
  private euler = new THREE.Euler(0, 0, 0, 'YXZ');
  private keys: Record<string, boolean> = {};
  private isLocked = false;
  private movementLocked = false;
  private lockedPosition = new THREE.Vector3();

  // Tuning
  private readonly MOUSE_SENS  = 0.0017;
  private readonly BASE_ACCEL  = 0.18;   // units added to velocity per frame
  private readonly DAMPING     = 0.87;
  private readonly TURBO       = 12;
  private readonly ULTRA        = 120;

  // Unit conversion: 1 scene unit = 149,600,000 / 100 km = 1,496,000 km
  private readonly UNIT_KM = 1_496_000;

  // Bound handlers for proper removeEventListener cleanup
  private readonly hdlKeyDown: (e: KeyboardEvent) => void;
  private readonly hdlKeyUp:   (e: KeyboardEvent) => void;
  private readonly hdlMove:    (e: MouseEvent) => void;
  private readonly hdlLock:    () => void;
  private readonly hdlClick:   () => void;

  constructor(opts: FlightControlsOptions) {
    this.camera = opts.camera;
    this.domElement = opts.domElement;
    this.celestialObjects = opts.celestialObjects;
    this.onSpeedChange = opts.onSpeedChange;
    this.onTargetChange = opts.onTargetChange;
    this.onLockChange = opts.onLockChange;

    this.euler.setFromQuaternion(this.camera.quaternion);

    this.hdlKeyDown = (e) => {
      this.keys[e.code] = true;
      // Prevent page scroll from arrow/space keys while in sim
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    };
    this.hdlKeyUp   = (e) => { this.keys[e.code] = false; };
    this.hdlMove    = (e) => this._onMouseMove(e);
    this.hdlLock    = ()  => {
      this.isLocked = document.pointerLockElement === this.domElement;
      this.onLockChange?.(this.isLocked);
    };
    this.hdlClick   = ()  => {
      if (!this.isLocked) {
        try {
          const res = this.domElement.requestPointerLock();
          if (res && typeof (res as Promise<void>).catch === 'function') {
            (res as Promise<void>).catch(() => {});
          }
        } catch {
          // ignore pointer lock rejections
        }
      }
    };

    document.addEventListener('keydown',           this.hdlKeyDown);
    document.addEventListener('keyup',             this.hdlKeyUp);
    document.addEventListener('mousemove',         this.hdlMove);
    document.addEventListener('pointerlockchange', this.hdlLock);
    this.domElement.addEventListener('click',      this.hdlClick);
  }

  private _onMouseMove(e: MouseEvent): void {
    if (!this.isLocked) return;
    this.euler.y -= e.movementX * this.MOUSE_SENS;
    this.euler.x -= e.movementY * this.MOUSE_SENS;
    this.euler.x = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, this.euler.x));
    this.camera.quaternion.setFromEuler(this.euler);
  }

  /** Lock position for stationary surface observation */
  public setMovementLocked(locked: boolean, fixedPos?: THREE.Vector3): void {
    this.movementLocked = locked;
    this.velocity.set(0, 0, 0);
    if (fixedPos) {
      this.lockedPosition.copy(fixedPos);
      this.camera.position.copy(fixedPos);
    } else if (locked) {
      this.lockedPosition.copy(this.camera.position);
    }
  }

  /** Call every animation frame from the ThreeEngine tick */
  public update(): void {
    // If movement is locked (stationary astronaut stance on Earth surface), allow only 360° pitch/yaw
    if (this.movementLocked) {
      this.camera.position.copy(this.lockedPosition);
      this.velocity.set(0, 0, 0);
      this.onSpeedChange(0);
      return;
    }

    const isShift = this.keys['ShiftLeft']   || this.keys['ShiftRight'];
    const isCtrl  = this.keys['ControlLeft'] || this.keys['ControlRight'];

    let mult = 1;
    if      (isShift && isCtrl) mult = this.ULTRA * this.TURBO;
    else if (isCtrl)            mult = this.ULTRA;
    else if (isShift)           mult = this.TURBO;

    const accel = this.BASE_ACCEL * mult;

    const dir = new THREE.Vector3();
    if (this.keys['KeyW'] || this.keys['ArrowUp'])    dir.z -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown'])  dir.z += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft'])  dir.x -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) dir.x += 1;
    if (this.keys['KeyQ']) dir.y += 1;
    if (this.keys['KeyE']) dir.y -= 1;

    if (dir.lengthSq() > 0) {
      dir.normalize().applyQuaternion(this.camera.quaternion);
      this.velocity.addScaledVector(dir, accel);
    }

    this.velocity.multiplyScalar(this.DAMPING);
    this.camera.position.add(this.velocity);

    // Speed in km/s for HUD (assume 60 fps → velocity is per-frame, × 60 for per-second)
    this.onSpeedChange(Math.round(this.velocity.length() * 60 * this.UNIT_KM / 1000));

    // Nearest body for targeting
    this._reportNearestTarget();
  }

  private _reportNearestTarget(): void {
    if (this.celestialObjects.length === 0) return;
    let minDist = Infinity;
    let nearestName = '';
    const camPos = this.camera.position;
    for (const obj of this.celestialObjects) {
      const d = camPos.distanceTo(obj.worldPos());
      if (d < minDist) { minDist = d; nearestName = obj.name; }
    }
    this.onTargetChange(nearestName, Math.round(minDist * this.UNIT_KM));
  }

  public setTargets(targets: Array<{ name: string; worldPos: () => THREE.Vector3 }>): void {
    this.celestialObjects = targets;
  }

  public setPosition(pos: THREE.Vector3, lookAtTarget?: THREE.Vector3): void {
    this.camera.position.copy(pos);
    this.velocity.set(0, 0, 0);
    if (lookAtTarget) {
      this.camera.lookAt(lookAtTarget);
      this.euler.setFromQuaternion(this.camera.quaternion, 'YXZ');
      this.camera.quaternion.setFromEuler(this.euler);
    }
  }

  public get locked(): boolean { return this.isLocked; }

  public dispose(): void {
    document.removeEventListener('keydown',           this.hdlKeyDown);
    document.removeEventListener('keyup',             this.hdlKeyUp);
    document.removeEventListener('mousemove',         this.hdlMove);
    document.removeEventListener('pointerlockchange', this.hdlLock);
    this.domElement.removeEventListener('click',      this.hdlClick);
    if (document.pointerLockElement === this.domElement) document.exitPointerLock();
  }
}

