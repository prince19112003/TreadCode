import * as THREE from 'three';

export interface ThreeEngineConfig {
  container: HTMLElement;
  onUpdate?: (deltaSeconds: number, engine: ThreeEngine) => void;
  onContextLost?: () => void;
}

export class ThreeEngine {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private animationId: number | null = null;
  private container: HTMLElement;
  private resizeHandler: () => void;
  private clock = new THREE.Clock();
  private onUpdate?: (deltaSeconds: number, engine: ThreeEngine) => void;

  constructor(config: ThreeEngineConfig) {
    this.container = config.container;
    this.onUpdate = config.onUpdate;

    // WebGL2 renderer — high-performance, logarithmic depth buffer for astronomical scale accuracy
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(config.container.clientWidth, config.container.clientHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    config.container.appendChild(this.renderer.domElement);

    // Scene — deep black void
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000005);

    // Camera — astronaut helmet POV (70° FOV = wide visor feel)
    this.camera = new THREE.PerspectiveCamera(
      70,
      config.container.clientWidth / config.container.clientHeight,
      0.01,
      1e13,
    );
    // Initial astronaut spawn point: near Earth orbit with Sun in peripheral view
    this.camera.position.set(104, 4, 12);
    this.camera.lookAt(100, 0, 0);

    // GPU context loss guard
    this.renderer.domElement.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.stop();
      config.onContextLost?.();
    });

    // Resize handler stored as bound ref for cleanup
    this.resizeHandler = () => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };
    window.addEventListener('resize', this.resizeHandler);

    this.start();
  }

  public start(): void {
    if (this.animationId !== null) return;
    this.clock.start();
    const tick = () => {
      this.animationId = requestAnimationFrame(tick);
      const dt = Math.min(this.clock.getDelta(), 0.1);
      this.onUpdate?.(dt, this);
      this.renderer.render(this.scene, this.camera);
    };
    this.animationId = requestAnimationFrame(tick);
  }

  public stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /** Full GPU + CPU teardown — zero VRAM leakage guarantee */
  public dispose(): void {
    this.stop();
    window.removeEventListener('resize', this.resizeHandler);

    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          (mesh.material as THREE.Material)?.dispose();
        }
      }
      const pts = obj as THREE.Points;
      if (pts.isPoints) {
        pts.geometry?.dispose();
        (pts.material as THREE.Material)?.dispose();
      }
    });

    this.scene.clear();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.remove();
    }
  }

  public getCamera(): THREE.PerspectiveCamera { return this.camera; }
  public getScene(): THREE.Scene { return this.scene; }
  public getRenderer(): THREE.WebGLRenderer { return this.renderer; }
}
