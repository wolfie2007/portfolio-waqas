'use client';

import { useEffect, useRef } from 'react';

const vertexShaderSource = `#version 300 es
in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_pointerStrength;
uniform vec2 u_click;
uniform float u_clickAge;
uniform float u_time;
uniform float u_cell;

out vec4 outColor;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439
  );

  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);

  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
    0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)),
    0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;

  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotate = mat2(0.80, 0.60, -0.60, 0.80);

  for (int i = 0; i < 4; i++) {
    value += amplitude * snoise(p);
    p = rotate * p * 2.03 + 17.13;
    amplitude *= 0.5;
  }

  return value;
}

const float BAYER[64] = float[64](
  0.0, 32.0, 8.0, 40.0, 2.0, 34.0, 10.0, 42.0,
  48.0, 16.0, 56.0, 24.0, 50.0, 18.0, 58.0, 26.0,
  12.0, 44.0, 4.0, 36.0, 14.0, 46.0, 6.0, 38.0,
  60.0, 28.0, 52.0, 20.0, 62.0, 30.0, 54.0, 22.0,
  3.0, 35.0, 11.0, 43.0, 1.0, 33.0, 9.0, 41.0,
  51.0, 19.0, 59.0, 27.0, 49.0, 17.0, 57.0, 25.0,
  15.0, 47.0, 7.0, 39.0, 13.0, 45.0, 5.0, 37.0,
  63.0, 31.0, 55.0, 23.0, 61.0, 29.0, 53.0, 21.0
);

float bayer8(ivec2 cell) {
  int index = (cell.y & 7) * 8 + (cell.x & 7);
  return BAYER[index] / 64.0 - 0.5;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;
  vec2 pointer = (u_pointer - 0.5 * u_resolution) / u_resolution.y;

  vec2 delta = p - pointer;
  float distanceToPointer = length(delta);
  float ripple = sin(distanceToPointer * 26.0 - u_time * 1.8) * exp(-distanceToPointer * 9.0);
  float glow = exp(-distanceToPointer * 5.0);
  vec2 warp = normalize(delta + 1e-4) * ripple * 0.045 * u_pointerStrength;

  // Concentric click wave
  vec2 clickPos = (u_click - 0.5 * u_resolution) / u_resolution.y;
  vec2 clickDelta = p - clickPos;
  float clickDist = length(clickDelta);
  float clickWave = 0.0;
  if (u_clickAge >= 0.0 && u_clickAge < 1.3) {
    float waveRadius = u_clickAge * 1.45;
    float ringDelta = clickDist - waveRadius;
    float ring = sin(ringDelta * 28.0) * exp(-ringDelta * ringDelta * 85.0);
    float decay = (1.0 - u_clickAge / 1.3) * exp(-clickDist * 1.4);
    clickWave = ring * decay;
    warp += normalize(clickDelta + 1e-4) * clickWave * 0.12;
  }

  float driftX = u_time * 0.018;
  float driftY = u_time * -0.012;
  vec2 q = p * 1.7 + warp + vec2(driftX, driftY);

  float field = fbm(q) * 0.5 + 0.5;
  float detail = fbm(q * 2.7 + vec2(-driftY, driftX)) * 0.5 + 0.5;
  field = mix(field, detail, 0.18);
  field = smoothstep(0.32, 0.78, field);
  field += glow * u_pointerStrength * 0.10;
  field += ripple * u_pointerStrength * 0.04;
  field += clickWave * 0.22;

  ivec2 cell = ivec2(floor(gl_FragCoord.xy / u_cell));
  float threshold = bayer8(cell);
  float levels = 4.0;
  float quantized = floor(field * levels + threshold + 0.5) / levels;
  quantized = clamp(quantized, 0.0, 1.0);

  float gray = mix(0.030, 0.165, quantized);

  vec2 vignetteUv = uv - 0.5;
  float vignette = 1.0 - smoothstep(
    0.20,
    0.90,
    length(vignetteUv * vec2(1.0, 0.82))
  );
  gray *= mix(0.28, 1.0, vignette);
  gray *= smoothstep(0.0, 0.22, uv.y);

  outColor = vec4(vec3(gray), 1.0);
}
`;

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export function DitherBackground() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });
    if (!gl) return;

    const context: WebGL2RenderingContext = gl;
    const hostEl: HTMLDivElement = host;
    const canvasEl: HTMLCanvasElement = canvas;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let disposed = false;
    let contextLost = false;
    let visible = true;
    let pageVisible = !document.hidden;
    let reduced = motionQuery.matches;
    let raf = 0;
    let lastFrame = 0;
    let time = 0;
    let width = 1;
    let height = 1;
    let dpr = 1;

    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let vao: WebGLVertexArrayObject | null = null;
    let uniforms: Record<string, WebGLUniformLocation | null> = {};

    const pointer = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      strength: 0,
      targetStrength: 0,
      lastMove: 0,
    };

    const click = {
      x: 0,
      y: 0,
      age: -1,
    };

    function setup(): boolean {
      const vertexShader = compileShader(context, context.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = compileShader(
        context,
        context.FRAGMENT_SHADER,
        fragmentShaderSource,
      );

      if (!vertexShader || !fragmentShader) {
        if (vertexShader) context.deleteShader(vertexShader);
        if (fragmentShader) context.deleteShader(fragmentShader);
        return false;
      }

      program = context.createProgram();
      if (!program) {
        context.deleteShader(vertexShader);
        context.deleteShader(fragmentShader);
        return false;
      }

      context.attachShader(program, vertexShader);
      context.attachShader(program, fragmentShader);
      context.linkProgram(program);
      context.deleteShader(vertexShader);
      context.deleteShader(fragmentShader);

      if (!context.getProgramParameter(program, context.LINK_STATUS)) {
        console.error(context.getProgramInfoLog(program));
        context.deleteProgram(program);
        program = null;
        return false;
      }

      buffer = context.createBuffer();
      vao = context.createVertexArray();

      if (!buffer || !vao) return false;

      context.bindVertexArray(vao);
      context.bindBuffer(context.ARRAY_BUFFER, buffer);
      context.bufferData(
        context.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        context.STATIC_DRAW,
      );

      const position = context.getAttribLocation(program, 'a_position');
      context.enableVertexAttribArray(position);
      context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);
      context.bindVertexArray(null);

      uniforms = {
        resolution: context.getUniformLocation(program, 'u_resolution'),
        pointer: context.getUniformLocation(program, 'u_pointer'),
        pointerStrength: context.getUniformLocation(program, 'u_pointerStrength'),
        click: context.getUniformLocation(program, 'u_click'),
        clickAge: context.getUniformLocation(program, 'u_clickAge'),
        time: context.getUniformLocation(program, 'u_time'),
        cell: context.getUniformLocation(program, 'u_cell'),
      };

      context.disable(context.DEPTH_TEST);
      context.disable(context.BLEND);
      context.clearColor(0.039, 0.039, 0.039, 1);

      return true;
    }

    function resize() {
      const rect = hostEl.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      const nextWidth = Math.max(1, Math.round(rect.width * dpr));
      const nextHeight = Math.max(1, Math.round(rect.height * dpr));

      if (canvasEl.width !== nextWidth || canvasEl.height !== nextHeight) {
        canvasEl.width = nextWidth;
        canvasEl.height = nextHeight;
      }

      const wasUnset = width === 1 && height === 1;
      width = nextWidth;
      height = nextHeight;

      if (wasUnset || pointer.lastMove === 0) {
        pointer.x = width * 0.5;
        pointer.y = height * 0.5;
        pointer.targetX = pointer.x;
        pointer.targetY = pointer.y;
      }
    }

    function render() {
      if (!program || !vao || contextLost) return;

      context.viewport(0, 0, width, height);
      context.clear(context.COLOR_BUFFER_BIT);
      context.useProgram(program);

      context.uniform2f(uniforms.resolution, width, height);
      context.uniform2f(uniforms.pointer, pointer.x, pointer.y);
      context.uniform1f(uniforms.pointerStrength, pointer.strength);
      context.uniform2f(uniforms.click, click.x, click.y);
      context.uniform1f(uniforms.clickAge, reduced ? -1 : click.age);
      context.uniform1f(uniforms.time, reduced ? 0 : time);
      context.uniform1f(uniforms.cell, Math.max(2, Math.round(2 * dpr)));

      context.bindVertexArray(vao);
      context.drawArrays(context.TRIANGLES, 0, 3);
      context.bindVertexArray(null);
    }

    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function start() {
      if (
        raf ||
        disposed ||
        contextLost ||
        reduced ||
        !visible ||
        !pageVisible
      ) {
        return;
      }

      lastFrame = performance.now();
      raf = requestAnimationFrame(tick);
    }

    function tick(now: number) {
      raf = 0;

      if (disposed || contextLost || reduced || !visible || !pageVisible) {
        return;
      }

      const delta = Math.min(32, now - lastFrame || 16);
      lastFrame = now;
      time += delta * 0.001;

      if (click.age >= 0) {
        click.age += delta * 0.001;
        if (click.age > 1.3) {
          click.age = -1;
        }
      }

      if (now - pointer.lastMove > 1400) {
        pointer.targetStrength = 0;
      }

      const pointerEase = 1 - Math.exp(-delta * 0.014);
      const strengthEase = 1 - Math.exp(-delta * 0.006);

      pointer.x += (pointer.targetX - pointer.x) * pointerEase;
      pointer.y += (pointer.targetY - pointer.y) * pointerEase;
      pointer.strength +=
        (pointer.targetStrength - pointer.strength) * strengthEase;

      render();
      raf = requestAnimationFrame(tick);
    }

    function onPointerMove(event: PointerEvent) {
      if (reduced) return;

      const rect = canvasEl.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) {
        pointer.targetStrength = 0;
        return;
      }

      pointer.targetX = (event.clientX - rect.left) * dpr;
      pointer.targetY = (rect.height - (event.clientY - rect.top)) * dpr;
      pointer.targetStrength = 1;
      pointer.lastMove = performance.now();
    }

    function onPointerDown(event: PointerEvent) {
      if (reduced) return;

      const rect = canvasEl.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) return;

      click.x = (event.clientX - rect.left) * dpr;
      click.y = (rect.height - (event.clientY - rect.top)) * dpr;
      click.age = 0.0;
      start();
    }

    function onVisibilityChange() {
      pageVisible = !document.hidden;
      if (pageVisible) start();
      else stop();
    }

    function onMotionChange() {
      reduced = motionQuery.matches;
      pointer.strength = 0;
      pointer.targetStrength = 0;

      if (reduced) {
        stop();
        render();
      } else {
        start();
      }
    }

    function onContextLost(event: Event) {
      event.preventDefault();
      contextLost = true;
      stop();
    }

    function onContextRestored() {
      contextLost = false;
      program = null;
      buffer = null;
      vao = null;

      if (setup()) {
        resize();
        if (reduced) render();
        else start();
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        if (visible) start();
        else stop();
      },
      { threshold: 0.01 },
    );

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduced) render();
    });

    observer.observe(hostEl);
    resizeObserver.observe(hostEl);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    motionQuery.addEventListener('change', onMotionChange);
    canvasEl.addEventListener('webglcontextlost', onContextLost);
    canvasEl.addEventListener('webglcontextrestored', onContextRestored);

    if (setup()) {
      resize();
      if (reduced) render();
      else start();
    }

    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      motionQuery.removeEventListener('change', onMotionChange);
      canvasEl.removeEventListener('webglcontextlost', onContextLost);
      canvasEl.removeEventListener('webglcontextrestored', onContextRestored);

      if (!context.isContextLost()) {
        if (program) context.deleteProgram(program);
        if (buffer) context.deleteBuffer(buffer);
        if (vao) context.deleteVertexArray(vao);
      }
    };
  }, []);

  return (
    <div ref={hostRef} className="absolute inset-0 overflow-hidden" aria-hidden>
      <canvas
        ref={canvasRef}
        className="h-full w-full opacity-[0.92] [mask-image:linear-gradient(to_bottom,#000_0%,#000_55%,transparent_96%)]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,transparent_0%,rgba(10,10,10,0.10)_48%,rgba(10,10,10,0.72)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-ink" />
    </div>
  );
}
