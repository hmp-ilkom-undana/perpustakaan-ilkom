import { useEffect, useRef } from "react";

// =============================================================================
// Circuit Board Canvas Animation — PCB aesthetic (no external deps)
// =============================================================================

type Point = { x: number; y: number };
type Segment = { p1: Point; p2: Point };
type Node = Point & { phase: number; speed: number; large: boolean };
type Signal = { path: Segment[]; segIdx: number; t: number; dt: number };

const GRID = 68;
const TRACE_COLOR = "rgba(0, 110, 255, 0.18)";
const TRACE_GLOW = "#0055ff";
const NODE_GLOW = "#00aaff";
const SIG_GLOW = "#00ccff";

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let allSegments: Segment[] = [];
    let signals: Signal[] = [];
    let animId: number;

    function lerp(a: Point, b: Point, t: number): Point {
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }

    function glow(color: string, blur: number) {
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
    }

    function noGlow() {
      ctx.shadowBlur = 0;
    }

    function init() {
      nodes = [];
      allSegments = [];
      signals = [];

      const cols = Math.ceil(width / GRID);
      const rows = Math.ceil(height / GRID);
      const used = new Set<string>();
      const targetCount = Math.floor(cols * rows * 0.2);

      // Place nodes at grid intersections
      for (let attempt = 0; attempt < targetCount * 15 && nodes.length < targetCount; attempt++) {
        const c = Math.floor(Math.random() * cols);
        const r = Math.floor(Math.random() * rows);
        const key = `${c}_${r}`;
        if (!used.has(key)) {
          used.add(key);
          nodes.push({
            x: c * GRID + GRID / 2,
            y: r * GRID + GRID / 2,
            phase: Math.random() * Math.PI * 2,
            speed: 0.012 + Math.random() * 0.02,
            large: Math.random() < 0.2,
          });
        }
      }

      // Connect nearby nodes with L-shaped orthogonal traces
      const paths: Segment[][] = [];
      const connected = new Set<string>();

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const nearby = nodes
          .map((b, j) => ({ j, dist: Math.hypot(b.x - a.x, b.y - a.y) }))
          .filter((d) => d.j !== i && d.dist > 10 && d.dist < GRID * 3.5)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 1 + Math.floor(Math.random() * 3));

        for (const { j } of nearby) {
          const pairKey = [i, j].sort().join("_");
          if (connected.has(pairKey)) continue;
          connected.add(pairKey);

          const b = nodes[j];
          const useHFirst = Math.random() < 0.5;
          let path: Segment[];

          if (useHFirst) {
            const mid: Point = { x: b.x, y: a.y };
            path = [
              { p1: { ...a }, p2: mid },
              { p1: mid, p2: { ...b } },
            ].filter(
              (s) => Math.abs(s.p1.x - s.p2.x) + Math.abs(s.p1.y - s.p2.y) > 1
            );
          } else {
            const mid: Point = { x: a.x, y: b.y };
            path = [
              { p1: { ...a }, p2: mid },
              { p1: mid, p2: { ...b } },
            ].filter(
              (s) => Math.abs(s.p1.x - s.p2.x) + Math.abs(s.p1.y - s.p2.y) > 1
            );
          }

          if (path.length > 0) {
            paths.push(path);
            allSegments.push(...path);
          }
        }
      }

      // Spawn animated signals
      const sigCount = Math.min(20, paths.length);
      [...paths]
        .sort(() => Math.random() - 0.5)
        .slice(0, sigCount)
        .forEach((path) => {
          signals.push({
            path,
            segIdx: 0,
            t: Math.random(),
            dt: 0.006 + Math.random() * 0.008,
          });
        });
    }

    function resize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
      init();
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // 1. Circuit traces
      ctx.lineWidth = 1;
      for (const seg of allSegments) {
        ctx.beginPath();
        ctx.moveTo(seg.p1.x, seg.p1.y);
        ctx.lineTo(seg.p2.x, seg.p2.y);
        ctx.strokeStyle = TRACE_COLOR;
        glow(TRACE_GLOW, 4);
        ctx.stroke();
      }
      noGlow();

      // 2. Moving signal pulses
      for (const sig of signals) {
        const seg = sig.path[sig.segIdx];
        const pos = lerp(seg.p1, seg.p2, sig.t);

        // Outer halo
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 180, 255, 0.2)";
        glow(SIG_GLOW, 22);
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        glow("#ffffff", 8);
        ctx.fill();
        noGlow();

        // Advance
        sig.t += sig.dt;
        if (sig.t >= 1) {
          sig.t = 0;
          sig.segIdx = (sig.segIdx + 1) % sig.path.length;
        }
      }

      // 3. Glowing nodes
      for (const node of nodes) {
        node.phase += node.speed;
        const pulse = 0.5 + 0.5 * Math.sin(node.phase);
        const coreR = node.large ? 4 : 2.5;
        const haloR = coreR + (node.large ? 10 : 6) * pulse;

        // Radial glow halo
        const grad = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, haloR
        );
        grad.addColorStop(0, `rgba(0, 160, 255, ${0.25 + pulse * 0.25})`);
        grad.addColorStop(1, "rgba(0, 80, 255, 0)");
        ctx.beginPath();
        ctx.arc(node.x, node.y, haloR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, coreR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(80, 200, 255, ${0.7 + pulse * 0.3})`;
        glow(NODE_GLOW, 8 + pulse * 10);
        ctx.fill();
        noGlow();

        // Square bracket around large "junction" nodes (PCB chip look)
        if (node.large) {
          const s = 7;
          ctx.strokeStyle = `rgba(0, 160, 255, ${0.35 + pulse * 0.3})`;
          ctx.lineWidth = 1;
          glow("#0088ff", 6);
          ctx.strokeRect(node.x - s, node.y - s, s * 2, s * 2);
          noGlow();
        }
      }

      animId = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    draw(); // ← Mulai animation loop setelah resize() set ukuran canvas

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
