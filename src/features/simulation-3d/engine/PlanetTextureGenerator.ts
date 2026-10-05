import * as THREE from 'three';

/**
 * Procedural realistic texture generator for the solar system.
 * Generates high-detail planet surface textures in-memory via HTML5 Canvas.
 * Zero external asset dependencies — guaranteed offline & 100% authentic planetary appearances.
 */
export class PlanetTextureGenerator {
  private static textures: Map<string, THREE.CanvasTexture> = new Map();

  /** Helper to create offscreen canvas */
  private static createCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    return [canvas, ctx];
  }

  private static toTexture(canvas: HTMLCanvasElement, key: string): THREE.CanvasTexture {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    PlanetTextureGenerator.textures.set(key, tex);
    return tex;
  }

  /**
   * Sun Surface: turbulent granulation, convective solar cells, glowing active regions
   */
  static getSunTexture(): THREE.CanvasTexture {
    if (this.textures.has('sun')) return this.textures.get('sun')!;
    const [canvas, ctx] = this.createCanvas(1024, 512);
    const { width: w, height: h } = canvas;

    // Base fiery orange-yellow
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#ff7700');
    grad.addColorStop(0.3, '#ffaa00');
    grad.addColorStop(0.5, '#ffd24d');
    grad.addColorStop(0.7, '#ffaa00');
    grad.addColorStop(1, '#ff7700');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Convective granules & flare mottling
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const n1 = Math.sin(x * 0.08) * Math.cos(y * 0.08);
        const n2 = Math.sin(x * 0.02 + y * 0.03) * Math.sin(y * 0.04);
        const noise = (n1 * 0.4 + n2 * 0.6) * 35;

        data[idx] = Math.min(255, data[idx] + noise * 0.8);
        data[idx + 1] = Math.min(255, data[idx + 1] + noise * 0.6);
        data[idx + 2] = Math.max(0, data[idx + 2] - noise * 0.5);
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Solar active spots (bright flare regions)
    ctx.fillStyle = 'rgba(255, 255, 230, 0.35)';
    for (let i = 0; i < 40; i++) {
      const rx = Math.random() * w;
      const ry = (0.2 + Math.random() * 0.6) * h;
      const r = 10 + Math.random() * 30;
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.fill();
    }

    return this.toTexture(canvas, 'sun');
  }

  /**
   * Mercury: Desolate, heavily cratered dark grey basaltic surface with ray systems
   */
  static getMercuryTexture(): THREE.CanvasTexture {
    if (this.textures.has('mercury')) return this.textures.get('mercury')!;
    const [canvas, ctx] = this.createCanvas(1024, 512);
    const { width: w, height: h } = canvas;

    // Mottled rocky grey base
    ctx.fillStyle = '#7a7a7a';
    ctx.fillRect(0, 0, w, h);

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const grain = (Math.random() - 0.5) * 45;
        const mare = Math.sin(x * 0.008) * Math.cos(y * 0.012) * 25;
        const c = Math.max(30, Math.min(200, 115 + grain + mare));
        data[idx] = c;
        data[idx + 1] = c;
        data[idx + 2] = c + 4; // slight cool tone
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Impact craters with rims and ejecta rays
    for (let i = 0; i < 180; i++) {
      const cx = Math.random() * w;
      const cy = Math.random() * h;
      const r = 2 + Math.random() * 18;

      // Dark crater floor
      ctx.fillStyle = 'rgba(35, 35, 38, 0.65)';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Bright elevated rim
      ctx.strokeStyle = 'rgba(210, 210, 215, 0.7)';
      ctx.lineWidth = Math.max(1, r * 0.2);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // Ray system for larger craters
      if (r > 10) {
        ctx.strokeStyle = 'rgba(225, 225, 230, 0.25)';
        ctx.lineWidth = 1;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(a) * r * 4.5, cy + Math.sin(a) * r * 4.5);
          ctx.stroke();
        }
      }
    }

    return this.toTexture(canvas, 'mercury');
  }

  /**
   * Venus: Opaque creamy sulfur-yellow cloud deck with high-speed upper tropospheric swirls
   */
  static getVenusTexture(): THREE.CanvasTexture {
    if (this.textures.has('venus')) return this.textures.get('venus')!;
    const [canvas, ctx] = this.createCanvas(1024, 512);
    const { width: w, height: h } = canvas;

    // Atmospheric warm golden base
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#d1ab60');
    grad.addColorStop(0.25, '#ecd087');
    grad.addColorStop(0.5, '#f5deb3');
    grad.addColorStop(0.75, '#e5c57b');
    grad.addColorStop(1, '#cda255');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Sweeping diagonal sulfuric cloud streaks (Y-feature and zonal winds)
    ctx.strokeStyle = 'rgba(180, 140, 60, 0.18)';
    for (let i = 0; i < 120; i++) {
      const y = Math.random() * h;
      ctx.lineWidth = 4 + Math.random() * 16;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(
        w * 0.3, y + Math.sin(y * 0.05) * 40,
        w * 0.7, y - Math.cos(y * 0.05) * 40,
        w, y + 15
      );
      ctx.stroke();
    }

    // Bright high-altitude haze zones
    ctx.fillStyle = 'rgba(255, 248, 220, 0.15)';
    for (let i = 0; i < 30; i++) {
      const y = (0.2 + Math.random() * 0.6) * h;
      ctx.fillRect(0, y, w, 8 + Math.random() * 24);
    }

    return this.toTexture(canvas, 'venus');
  }

  /**
   * Earth Surface: Realistic continents, blue oceans, polar ice caps
   */
  static getEarthTexture(): THREE.CanvasTexture {
    if (this.textures.has('earth')) return this.textures.get('earth')!;
    const [canvas, ctx] = this.createCanvas(1024, 512);
    const { width: w, height: h } = canvas;

    // 1. Deep Ocean Base
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
    oceanGrad.addColorStop(0, '#0a2342');
    oceanGrad.addColorStop(0.5, '#124578');
    oceanGrad.addColorStop(1, '#0a2342');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, w, h);

    // Ocean depth variation & shallow coastal shelves
    ctx.fillStyle = 'rgba(24, 110, 170, 0.4)';
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * w;
      const y = (0.2 + Math.random() * 0.6) * h;
      ctx.beginPath();
      ctx.arc(x, y, 20 + Math.random() * 60, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Continental Landmasses
    ctx.fillStyle = '#3a6635'; // forest / vegetation green

    // Helper for landmass blobs
    const drawLand = (cx: number, cy: number, rx: number, ry: number, color = '#426839') => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, (Math.random() - 0.5) * 0.4, 0, Math.PI * 2);
      ctx.fill();
      // Desert / arid interior
      ctx.fillStyle = '#9b814a';
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx * 0.55, ry * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    // Americas
    drawLand(w * 0.22, h * 0.32, w * 0.08, h * 0.16); // North America
    drawLand(w * 0.28, h * 0.64, w * 0.06, h * 0.18); // South America

    // Eurasia & Africa
    drawLand(w * 0.54, h * 0.28, w * 0.14, h * 0.14, '#4d6937'); // Europe & Russia
    drawLand(w * 0.72, h * 0.35, w * 0.12, h * 0.15, '#6b6e3b'); // Asia / China / India
    drawLand(w * 0.52, h * 0.56, w * 0.08, h * 0.18, '#8c7643'); // Africa (Sahara tan + savanna)

    // Australia & Pacific islands
    drawLand(w * 0.82, h * 0.68, w * 0.05, h * 0.08, '#9c663b'); // Australia (outback red-tan)

    // Greenland
    ctx.fillStyle = '#dde8ef';
    ctx.beginPath();
    ctx.ellipse(w * 0.38, h * 0.16, w * 0.03, h * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Polar Ice Caps
    ctx.fillStyle = '#ffffff';
    // North polar cap
    ctx.fillRect(0, 0, w, h * 0.08);
    // South polar cap (Antarctica)
    ctx.fillRect(0, h * 0.88, w, h * 0.12);

    // Jagged ice shelf borders
    for (let x = 0; x < w; x += 12) {
      ctx.fillRect(x, h * 0.08, 12, Math.sin(x * 0.1) * 8);
      ctx.fillRect(x, h * 0.88 - Math.cos(x * 0.08) * 12, 12, 14);
    }

    return this.toTexture(canvas, 'earth');
  }

  /**
   * Earth Clouds: Atmospheric weather systems, equatorial band, swirling cyclone vortexes
   */
  static getEarthCloudTexture(): THREE.CanvasTexture {
    if (this.textures.has('earth_clouds')) return this.textures.get('earth_clouds')!;
    const [canvas, ctx] = this.createCanvas(1024, 512);
    const { width: w, height: h } = canvas;

    ctx.clearRect(0, 0, w, h);

    // Swirling weather systems
    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
    for (let i = 0; i < 70; i++) {
      const cx = Math.random() * w;
      const cy = (0.15 + Math.random() * 0.7) * h;
      const rx = 25 + Math.random() * 80;
      const ry = 10 + Math.random() * 30;

      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, (Math.random() - 0.5) * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cyclone vortex swirls
    for (let c = 0; c < 6; c++) {
      const sx = Math.random() * w;
      const sy = (0.2 + Math.random() * 0.6) * h;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 4; a += 0.2) {
        const rad = 2 + a * 5;
        const px = sx + Math.cos(a) * rad;
        const py = sy + Math.sin(a) * rad * 0.6;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Equatorial cloud band (ITCZ)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillRect(0, h * 0.46, w, h * 0.08);

    return this.toTexture(canvas, 'earth_clouds');
  }

  /**
   * Mars: Red planet iron oxide, Syrtis Major dark basalt patches, Valles Marineris canyon, polar caps
   */
  static getMarsTexture(): THREE.CanvasTexture {
    if (this.textures.has('mars')) return this.textures.get('mars')!;
    const [canvas, ctx] = this.createCanvas(1024, 512);
    const { width: w, height: h } = canvas;

    // Rusty red-orange base
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#9e3914');
    grad.addColorStop(0.3, '#c24b1a');
    grad.addColorStop(0.5, '#d35c24');
    grad.addColorStop(0.7, '#ba4618');
    grad.addColorStop(1, '#8e300f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Dark basalt volcanic plains (Syrtis Major, Acidalia Planitia)
    ctx.fillStyle = 'rgba(56, 26, 16, 0.7)';
    // Syrtis Major triangle
    ctx.beginPath();
    ctx.moveTo(w * 0.58, h * 0.35);
    ctx.lineTo(w * 0.66, h * 0.58);
    ctx.lineTo(w * 0.52, h * 0.55);
    ctx.closePath();
    ctx.fill();

    // Dark southern highlands & patches
    for (let i = 0; i < 40; i++) {
      const cx = Math.random() * w;
      const cy = (0.35 + Math.random() * 0.4) * h;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 20 + Math.random() * 50, 10 + Math.random() * 25, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Valles Marineris canyon scar
    ctx.strokeStyle = 'rgba(40, 18, 10, 0.85)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w * 0.22, h * 0.52);
    ctx.bezierCurveTo(w * 0.30, h * 0.50, w * 0.38, h * 0.54, w * 0.44, h * 0.53);
    ctx.stroke();

    // North & South Polar Ice Caps (Water ice & Dry ice)
    ctx.fillStyle = '#ffffff';
    // North pole
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.04, w * 0.22, h * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
    // South pole
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.96, w * 0.16, h * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();

    return this.toTexture(canvas, 'mars');
  }

  /**
   * Jupiter: Banded belts and zones in cream/russet/tan with wavy turbulent boundaries + Great Red Spot
   */
  static getJupiterTexture(): THREE.CanvasTexture {
    if (this.textures.has('jupiter')) return this.textures.get('jupiter')!;
    const [canvas, ctx] = this.createCanvas(1024, 512);
    const { width: w, height: h } = canvas;

    // Atmospheric bands (alternating Belts & Zones)
    const bands = [
      { y: 0.00, h: 0.10, color: '#7a5a3a' }, // North Polar Region
      { y: 0.10, h: 0.08, color: '#cfb997' }, // North North Temperate Zone
      { y: 0.18, h: 0.09, color: '#8b4b24' }, // North Temperate Belt
      { y: 0.27, h: 0.10, color: '#e5d7bd' }, // North Tropical Zone
      { y: 0.37, h: 0.10, color: '#9c3818' }, // North Equatorial Belt (red-brown)
      { y: 0.47, h: 0.06, color: '#fff3db' }, // Equatorial Zone (bright cream)
      { y: 0.53, h: 0.12, color: '#8f3214' }, // South Equatorial Belt (deep reddish)
      { y: 0.65, h: 0.09, color: '#dfcca5' }, // South Tropical Zone
      { y: 0.74, h: 0.08, color: '#91532b' }, // South Temperate Belt
      { y: 0.82, h: 0.08, color: '#c4ad87' }, // South South Temperate Zone
      { y: 0.90, h: 0.10, color: '#6e5138' }, // South Polar Region
    ];

    bands.forEach((b) => {
      ctx.fillStyle = b.color;
      ctx.fillRect(0, b.y * h, w, b.h * h);
    });

    // Turbulent wavy interfaces between counter-rotating jet streams
    bands.forEach((b) => {
      const boundaryY = b.y * h;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 10) {
        const wave = Math.sin(x * 0.04) * 4 + Math.cos(x * 0.09) * 2;
        if (x === 0) ctx.moveTo(x, boundaryY + wave);
        else ctx.lineTo(x, boundaryY + wave);
      }
      ctx.stroke();
    });

    // ── The Great Red Spot (Southern hemisphere, around y = 0.60) ──
    const grsX = w * 0.62;
    const grsY = h * 0.61;
    const grsW = w * 0.07;
    const grsH = h * 0.055;

    // Red oval storm body
    ctx.fillStyle = '#b83218';
    ctx.beginPath();
    ctx.ellipse(grsX, grsY, grsW, grsH, 0, 0, Math.PI * 2);
    ctx.fill();

    // Inner storm core
    ctx.fillStyle = '#dc4622';
    ctx.beginPath();
    ctx.ellipse(grsX, grsY, grsW * 0.6, grsH * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // White turbulence wake around Red Spot
    ctx.strokeStyle = 'rgba(255, 245, 230, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(grsX, grsY, grsW * 1.25, grsH * 1.3, 0, 0, Math.PI * 2);
    ctx.stroke();

    return this.toTexture(canvas, 'jupiter');
  }

  /**
   * Saturn: Muted butterscotch / caramel horizontal bands
   */
  static getSaturnTexture(): THREE.CanvasTexture {
    if (this.textures.has('saturn')) return this.textures.get('saturn')!;
    const [canvas, ctx] = this.createCanvas(1024, 512);
    const { width: w, height: h } = canvas;

    // Elegant golden-tan atmospheric gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#7d6b46'); // dark golden polar hood
    grad.addColorStop(0.2, '#cbb27a');
    grad.addColorStop(0.35, '#dfcb96');
    grad.addColorStop(0.5, '#edd9a8'); // warm pale equatorial zone
    grad.addColorStop(0.65, '#dfcb96');
    grad.addColorStop(0.8, '#cbb27a');
    grad.addColorStop(1, '#7d6b46');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Delicate subtle latitudinal bands
    for (let y = 0; y < h; y += 8) {
      const alpha = 0.04 + Math.sin(y * 0.1) * 0.03;
      ctx.fillStyle = y % 16 === 0 ? `rgba(255, 245, 215, ${alpha})` : `rgba(130, 100, 50, ${alpha})`;
      ctx.fillRect(0, y, w, 8);
    }

    return this.toTexture(canvas, 'saturn');
  }

  /**
   * Saturn Rings: Concentric striped texture with A Ring, Cassini Division, B Ring, and C Ring
   */
  static getSaturnRingTexture(): THREE.CanvasTexture {
    if (this.textures.has('saturn_rings')) return this.textures.get('saturn_rings')!;
    const [canvas, ctx] = this.createCanvas(1024, 64);
    const { width: w, height: h } = canvas;

    ctx.clearRect(0, 0, w, h);

    // Rings mapped horizontally from inner edge (0) to outer edge (w)
    const ringGrad = ctx.createLinearGradient(0, 0, w, 0);
    // C Ring (innermost, dim, translucent)
    ringGrad.addColorStop(0.00, 'rgba(120, 100, 70, 0.15)');
    ringGrad.addColorStop(0.22, 'rgba(160, 135, 95, 0.35)');
    // B Ring (brightest, densest)
    ringGrad.addColorStop(0.25, 'rgba(230, 205, 155, 0.95)');
    ringGrad.addColorStop(0.58, 'rgba(215, 190, 140, 0.85)');
    // Cassini Division (major gap — transparent)
    ringGrad.addColorStop(0.60, 'rgba(10, 10, 10, 0.04)');
    ringGrad.addColorStop(0.65, 'rgba(10, 10, 10, 0.04)');
    // A Ring (outer ring)
    ringGrad.addColorStop(0.67, 'rgba(195, 175, 135, 0.75)');
    ringGrad.addColorStop(0.88, 'rgba(180, 160, 120, 0.65)');
    // Encke Gap & outer edge
    ringGrad.addColorStop(0.92, 'rgba(15, 15, 15, 0.05)');
    ringGrad.addColorStop(0.95, 'rgba(170, 150, 115, 0.45)');
    ringGrad.addColorStop(1.00, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = ringGrad;
    ctx.fillRect(0, 0, w, h);

    // Fine concentric micro-grooves
    for (let x = 0; x < w; x += 3) {
      if (Math.random() > 0.4) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(x, 0, 1, h);
      }
    }

    return this.toTexture(canvas, 'saturn_rings');
  }

  /**
   * Uranus: Featureless pale cyan-aquamarine with smooth polar limb darkening
   */
  static getUranusTexture(): THREE.CanvasTexture {
    if (this.textures.has('uranus')) return this.textures.get('uranus')!;
    const [canvas, ctx] = this.createCanvas(1024, 512);
    const { width: w, height: h } = canvas;

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#56b8b8'); // polar haze
    grad.addColorStop(0.3, '#7fe6e6');
    grad.addColorStop(0.5, '#99f2f2'); // bright equator
    grad.addColorStop(0.7, '#7fe6e6');
    grad.addColorStop(1, '#56b8b8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle faint bands
    for (let y = 0; y < h; y += 12) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(0, y, w, 6);
    }

    return this.toTexture(canvas, 'uranus');
  }

  /**
   * Neptune: Deep azure/cobalt blue with bright white methane cirrus cloud streaks & Great Dark Spot
   */
  static getNeptuneTexture(): THREE.CanvasTexture {
    if (this.textures.has('neptune')) return this.textures.get('neptune')!;
    const [canvas, ctx] = this.createCanvas(1024, 512);
    const { width: w, height: h } = canvas;

    // Deep dynamic azure blue
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#102268');
    grad.addColorStop(0.25, '#19399c');
    grad.addColorStop(0.5, '#264ecd');
    grad.addColorStop(0.75, '#1b3da4');
    grad.addColorStop(1, '#0e1d5e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Great Dark Spot (oval storm at y = 0.40)
    ctx.fillStyle = 'rgba(10, 24, 75, 0.75)';
    ctx.beginPath();
    ctx.ellipse(w * 0.45, h * 0.38, w * 0.06, h * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();

    // High-altitude white methane cirrus streaks ("Scooter" clouds)
    ctx.strokeStyle = 'rgba(225, 240, 255, 0.85)';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 16; i++) {
      const y = (0.25 + Math.random() * 0.5) * h;
      const sx = Math.random() * w * 0.6;
      ctx.beginPath();
      ctx.moveTo(sx, y);
      ctx.lineTo(sx + 50 + Math.random() * 140, y + (Math.random() - 0.5) * 6);
      ctx.stroke();
    }

    return this.toTexture(canvas, 'neptune');
  }

  /** Dispose all generated textures to free GPU memory */
  static dispose(): void {
    this.textures.forEach((tex) => tex.dispose());
    this.textures.clear();
  }
}
