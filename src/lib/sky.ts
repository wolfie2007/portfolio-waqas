/*
  The sky. One WebGL2 canvas.

  Baked once per resize, at full resolution:
    1. ~60k faint "grain" stars, the unresolved crowd that makes a real
       Milky Way look detailed instead of smeared, packed along the band.
    2. The band itself: domain-warped gradient noise for the star clouds,
       filamentary dust lanes that also dim the grain behind them, a warm
       glow toward the galactic centre and faint red emission patches.
  Drawn every frame:
    3. ~2.2k foreground stars as instanced capsules in 3D: sharp round
       points at rest, light streaks during the warp. Power-law brightness,
       real star colours, spikes only on the handful of brightest, and the
       cursor bends their light like a gravitational lens.
*/

const STAR_VS = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_corner;
layout(location=1) in vec2 a_p;
layout(location=2) in float a_z;
layout(location=3) in float a_mag;
layout(location=4) in vec3 a_col;
layout(location=5) in float a_ph;
uniform vec2 u_res; uniform float u_dpr; uniform float u_focal;
uniform float u_travel; uniform float u_streak; uniform vec2 u_mouse;
uniform vec2 u_cursor; uniform float u_lens; uniform float u_time; uniform float u_intro;
out vec2 v_local; out float v_L; out float v_size; out float v_alpha; out vec3 v_col; out float v_spike;

float depth(float raw) { return mix(0.04, 1.0, raw); }
vec2 project(vec2 xy, float zz) {
  vec2 p = u_res * 0.5 + vec2(xy.x, -xy.y) / zz * u_focal;
  return p + u_mouse * mix(22.0, 2.0, zz) * u_dpr;      // near stars drift more
}
vec2 lens(vec2 p) {                                     // point-mass lens: r' = (r + sqrt(r^2 + 4E^2)) / 2
  vec2 d = p - u_cursor; float r = max(length(d), 0.001);
  float E = u_lens * u_dpr;
  return u_cursor + d / r * 0.5 * (r + sqrt(r * r + 4.0 * E * E));
}
void main() {
  float z0 = depth(a_z);
  vec2 xy = a_p * z0;
  float raw = fract(a_z - u_travel);
  float zz = depth(raw);
  vec2 head = lens(project(xy, zz));
  vec2 tail = lens(project(xy, depth(min(raw + u_streak, 1.0))));
  vec2 ax = tail - head; float L = length(ax);
  vec2 dir = L > 0.5 ? ax / L : vec2(1.0, 0.0);
  if (L <= 0.5) L = 0.0;
  vec2 perp = vec2(-dir.y, dir.x);

  float near = smoothstep(0.35, 0.04, zz);               // only during the warp do stars come this close
  float size = (0.42 + 1.05 * sqrt(a_mag) + near * 1.2) * u_dpr;
  float spike = smoothstep(0.86, 0.99, a_mag) * (1.0 - smoothstep(0.0, 6.0, L));
  float w = size * mix(3.0, 14.0, spike);
  vec2 local = vec2(mix(-w, L + w, a_corner.x * 0.5 + 0.5), a_corner.y * w);
  gl_Position = vec4((head + dir * local.x + perp * local.y) / u_res * 2.0 - 1.0, 0.0, 1.0);
  gl_Position.y *= -1.0;

  float tw = 1.0 + 0.16 * sin(u_time * (0.7 + a_ph * 2.0) + a_ph * 40.0) * smoothstep(0.3, 0.95, a_mag);
  float fade = smoothstep(1.0, 0.9, raw) * smoothstep(0.0, 0.05, raw);
  float born = smoothstep(a_ph * 0.7, a_ph * 0.7 + 0.3, u_intro);
  v_local = local; v_L = L; v_size = size; v_spike = spike; v_col = a_col;
  v_alpha = (0.22 + 0.9 * a_mag + near * 0.5) * tw * fade * born;
}`;

const STAR_FS = `#version 300 es
precision highp float;
in vec2 v_local; in float v_L; in float v_size; in float v_alpha; in vec3 v_col; in float v_spike;
uniform float u_dpr;
out vec4 o;
void main() {
  vec2 d = vec2(v_local.x - clamp(v_local.x, 0.0, v_L), v_local.y);
  float r = length(d) / v_size;
  float core = exp(-r * r * 2.2);                         // a tight PSF, like a sharp photo
  float halo = 0.045 * exp(-r * 0.9) * v_spike;           // only bright stars bloom
  float t = 0.38 * u_dpr;
  float sp = v_spike * (exp(-abs(d.y) / t) * exp(-abs(d.x) / (v_size * 4.0)) + exp(-abs(d.x) / t) * exp(-abs(d.y) / (v_size * 4.0)));
  float streakDim = 1.0 / (1.0 + v_L / (v_size * 6.0));
  float i = (core + halo + sp * 0.32) * v_alpha * mix(1.0, 0.65 + 0.35 * streakDim, step(0.5, v_L));
  vec3 c = mix(v_col, vec3(1.0), core * 0.45);            // hot white centre, coloured rim
  o = vec4(c * i, i);
}`;

const GRAIN_VS = `#version 300 es
layout(location=0) in vec2 a_uv;
layout(location=1) in float a_b;
layout(location=2) in float a_t;
uniform float u_dpr;
out float v_b; out float v_t;
void main() {
  gl_Position = vec4(a_uv * 2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = (1.6 + a_b * 1.6) * u_dpr;
  v_b = a_b; v_t = a_t;
}`;

const GRAIN_FS = `#version 300 es
precision highp float;
in float v_b; in float v_t;
out vec4 o;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float i = exp(-dot(d, d) * 26.0) * (0.11 + 0.85 * v_b);
  vec3 c = mix(vec3(0.78, 0.84, 1.0), vec3(1.0, 0.88, 0.74), v_t);
  o = vec4(c * i, i);
}`;

const QUAD_VS = `#version 300 es
layout(location=0) in vec2 a_corner;
out vec2 v_uv;
void main() { v_uv = a_corner * 0.5 + 0.5; gl_Position = vec4(a_corner, 0.0, 1.0); }`;

// shared with the grain placement in JS: the band's axis
const AN = -0.5;
const BAND_FS = `#version 300 es
precision highp float;
in vec2 v_uv; uniform vec2 u_res;
out vec4 o;
vec2 g2(vec2 p) { p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453); }
float gn(vec2 p) { vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(dot(g2(i), f), dot(g2(i + vec2(1, 0)), f - vec2(1, 0)), u.x),
             mix(dot(g2(i + vec2(0, 1)), f - vec2(0, 1)), dot(g2(i + vec2(1, 1)), f - vec2(1, 1)), u.x), u.y); }
float fbm(vec2 p) { float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int k = 0; k < 7; k++) { v += a * gn(p); p = m * p + 3.7; a *= 0.5; } return v; }
float h1(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  vec2 p = (v_uv - 0.5) * vec2(u_res.x / u_res.y, 1.0);
  float an = ${AN.toFixed(2)};
  vec2 q = vec2(cos(an) * p.x - sin(an) * p.y, sin(an) * p.x + cos(an) * p.y);
  q.y += 0.06 * sin(q.x * 2.1) + 0.04;

  vec2 w = vec2(fbm(q * 1.4 + 1.3), fbm(q * 1.4 + 7.7));
  float clouds = fbm(q * vec2(2.6, 6.5) + w * 1.3) * 0.5 + 0.5;
  float across = exp(-q.y * q.y / 0.028);
  float bulge = exp(-q.y * q.y / 0.007) * exp(-pow(q.x + 0.18, 2.0) / 0.22);
  float fine = fbm(q * vec2(16.0, 26.0) + w * 3.0) * 0.5 + 0.5;
  float light = across * (0.18 + 0.82 * smoothstep(0.38, 0.82, clouds)) * (0.7 + 0.6 * fine) * 0.25 + bulge * 0.14;

  // dust: broad lanes plus thin ridged filaments, hugging the mid-plane
  float lanes = smoothstep(0.55, 0.86, fbm(q * vec2(3.6, 12.0) + w * 2.2 + 3.1) * 0.5 + 0.5);
  float rid = 1.0 - abs(fbm(q * vec2(5.5, 17.0) + w * 2.6 + 9.0));
  float fil = smoothstep(0.86, 0.97, rid);
  float dust = clamp((lanes * 0.6 + fil * 0.45) * exp(-pow(q.y - 0.012, 2.0) / 0.011), 0.0, 0.93);
  float tr = 1.0 - dust;

  vec3 cool = vec3(0.70, 0.77, 0.96), warm = vec3(1.0, 0.85, 0.68);
  vec3 col = mix(cool, warm, clamp(bulge * 3.0 + 0.25 * clouds, 0.0, 1.0)) * light * tr;
  float ha = smoothstep(0.62, 0.86, fbm(q * 6.0 + 11.0) * 0.5 + 0.5) * across * tr;
  col += vec3(0.95, 0.32, 0.26) * ha * 0.028;             // faint hydrogen glow
  col += (h1(v_uv * u_res) - 0.5) / 255.0;               // dither, no banding
  o = vec4(col, tr);
}`;

const COPY_FS = `#version 300 es
precision highp float;
in vec2 v_uv; uniform sampler2D u_tex; uniform float u_a;
out vec4 o;
void main() { o = vec4(vec3(0.045, 0.046, 0.055) + texture(u_tex, v_uv).rgb * u_a, 1.0); }`;

function compile(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const p = gl.createProgram()!;
  for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]] as const) {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
    gl.attachShader(p, s);
  }
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? 'link');
  return p;
}

// seeded so the sky is the same on every visit
function rng(seed: number) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const gauss = (R: () => number) => Math.sqrt(-2 * Math.log(R() + 1e-9)) * Math.cos(2 * Math.PI * R());
const TEMPS: [number, [number, number, number]][] = [
  [0.12, [0.7, 0.79, 1.0]], [0.66, [1.0, 0.97, 0.95]], [0.9, [1.0, 0.88, 0.74]], [1, [1.0, 0.76, 0.55]],
];

export type SkyState = {
  mouse: [number, number];     // -1..1 parallax
  cursor: [number, number];    // css px
  lens: number;                // css px Einstein radius
  travel: number; streak: number; band: number; intro: number;
};

export function createSky(canvas: HTMLCanvasElement, count = 2200) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  const starP = compile(gl, STAR_VS, STAR_FS);
  const grainP = compile(gl, GRAIN_VS, GRAIN_FS);
  const bandP = compile(gl, QUAD_VS, BAND_FS);
  const copyP = compile(gl, QUAD_VS, COPY_FS);
  const U = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);

  // ---- foreground stars ----
  const corner = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const R = rng(20031207);
  const data = new Float32Array(count * 8);
  for (let i = 0; i < count; i++) {
    let x: number, y: number;
    if (R() < 0.25) {
      const t = (R() * 2 - 1) * 1.5, off = gauss(R) * 0.16, an = -AN;
      x = Math.cos(an) * t - Math.sin(an) * off; y = Math.sin(an) * t + Math.cos(an) * off;
    } else { x = (R() * 2 - 1) * 1.2; y = (R() * 2 - 1) * 1.2; }
    const mag = Math.pow(R(), 5.2);
    const c = R(); const col = TEMPS.find(([p]) => c <= p)![1];
    data.set([x, y, 0.05 + R() * 0.85, mag, col[0], col[1], col[2], R()], i * 8);
  }
  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);
  const cb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, cb); gl.bufferData(gl.ARRAY_BUFFER, corner, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const ib = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, ib); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  for (const [loc, size, off] of [[1, 2, 0], [2, 1, 2], [3, 1, 3], [4, 3, 4], [5, 1, 7]] as const) {
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 32, off * 4); gl.vertexAttribDivisor(loc, 1);
  }
  const qvao = gl.createVertexArray()!;
  gl.bindVertexArray(qvao);
  gl.bindBuffer(gl.ARRAY_BUFFER, cb);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const gvao = gl.createVertexArray()!;
  const gbuf = gl.createBuffer()!;
  gl.bindVertexArray(gvao);
  gl.bindBuffer(gl.ARRAY_BUFFER, gbuf);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
  gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 16, 8);
  gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 16, 12);
  gl.bindVertexArray(null);

  // ---- the baked background ----
  const tex = gl.createTexture()!;
  const fbo = gl.createFramebuffer()!;
  let W = 0, H = 0, dpr = 1;

  const bake = () => {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, W, H);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 1. grain, placed in the band's own coordinates
    const cssW = W / dpr, cssH = H / dpr, aspect = W / H;
    const n = Math.round(Math.min(150000, Math.max(30000, (cssW * cssH) / 13)));
    const G = rng(7), buf = new Float32Array(n * 4);
    const ca = Math.cos(AN), sa = Math.sin(AN);
    for (let i = 0; i < n; i++) {
      let px: number, py: number;
      if (G() < 0.76) {
        const qx = (G() * 2 - 1) * (aspect * 0.75 + 0.3);
        const qy = gauss(G) * (G() < 0.6 ? 0.06 : 0.13) - 0.06 * Math.sin(qx * 2.1) - 0.04;
        px = ca * qx + sa * qy; py = -sa * qx + ca * qy;      // undo the shader's rotation
      } else { px = (G() - 0.5) * aspect; py = G() - 0.5; }
      buf[i * 4] = px / aspect + 0.5; buf[i * 4 + 1] = py + 0.5;
      buf[i * 4 + 2] = Math.pow(G(), 4); buf[i * 4 + 3] = G();
    }
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.useProgram(grainP);
    gl.uniform1f(U(grainP, 'u_dpr'), dpr);
    gl.bindVertexArray(gvao);
    gl.bindBuffer(gl.ARRAY_BUFFER, gbuf);
    gl.bufferData(gl.ARRAY_BUFFER, buf, gl.STATIC_DRAW);
    gl.drawArrays(gl.POINTS, 0, n);

    // 2. the band on top: adds its light, and its dust dims the grain (dst *= transmission)
    gl.blendFunc(gl.ONE, gl.SRC_ALPHA);
    gl.useProgram(bandP);
    gl.uniform2f(U(bandP, 'u_res'), W, H);
    gl.bindVertexArray(qvao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.disable(gl.BLEND);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };

  const resize = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (w === W && h === H) return;
    W = canvas.width = w; H = canvas.height = h;
    bake();
  };

  const draw = (s: SkyState, time: number) => {
    gl.viewport(0, 0, W, H);
    gl.disable(gl.BLEND);
    gl.useProgram(copyP);
    gl.bindVertexArray(qvao);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(U(copyP, 'u_tex'), 0);
    gl.uniform1f(U(copyP, 'u_a'), s.band * s.intro);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.useProgram(starP);
    gl.bindVertexArray(vao);
    gl.uniform2f(U(starP, 'u_res'), W, H);
    gl.uniform1f(U(starP, 'u_dpr'), dpr);
    gl.uniform1f(U(starP, 'u_focal'), 0.5 * Math.max(W, H));
    gl.uniform1f(U(starP, 'u_travel'), s.travel);
    gl.uniform1f(U(starP, 'u_streak'), s.streak);
    gl.uniform2f(U(starP, 'u_mouse'), s.mouse[0], s.mouse[1]);
    gl.uniform2f(U(starP, 'u_cursor'), s.cursor[0] * dpr, s.cursor[1] * dpr);
    gl.uniform1f(U(starP, 'u_lens'), s.lens);
    gl.uniform1f(U(starP, 'u_time'), time);
    gl.uniform1f(U(starP, 'u_intro'), s.intro);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
  };

  resize();
  return {
    resize, draw,
    destroy: () => gl.getExtension('WEBGL_lose_context')?.loseContext(),
  };
}

/** the same lens the shader applies, for things drawn in the DOM (css px) */
export function lensPoint(x: number, y: number, cx: number, cy: number, E: number): [number, number] {
  const dx = x - cx, dy = y - cy, r = Math.max(Math.hypot(dx, dy), 0.001);
  const k = 0.5 * (r + Math.sqrt(r * r + 4 * E * E)) / r;
  return [cx + dx * k, cy + dy * k];
}
