import { useMemo } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { type ISourceOptions, MoveDirection, OutMode } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

// =============================================================================
// INIT — dijalankan sekali oleh ParticlesProvider
// =============================================================================

const particlesInit = async (engine: Parameters<typeof loadSlim>[0]) => {
  await loadSlim(engine);
};

// =============================================================================
// KOMPONEN
// =============================================================================

export default function ParticleBackground() {
  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: { value: "transparent" },
      },
      fpsLimit: 60,
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            width: 800,
            height: 800,
          },
        },
        color: {
          value: ["#3b82f6", "#f97316", "#94a3b8"],
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: { min: 0.1, max: 0.6 },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 2.5 },
        },
        links: {
          enable: true,
          distance: 150,
          color: "#cbd5e1",
          opacity: 0.3,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.6,
          direction: MoveDirection.none,
          outModes: {
            default: OutMode.out,
          },
        },
      },
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },
          onClick: {
            enable: true,
            mode: "push",
          },
          resize: {
            enable: true,
          },
        },
        modes: {
          grab: {
            distance: 180,
            links: {
              opacity: 0.8,
              color: "#104396ff", // Warna biru saat ditarik kursor
            },
          },
          push: {
            quantity: 3,
          },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  return (
    <ParticlesProvider init={particlesInit}>
      {/* Tanpa pointer-events-none agar hover grab bisa dideteksi mouse */}
      <Particles
        id="ilkom-particle-bg"
        options={options}
        className="absolute inset-0 w-full h-full z-0"
      />
    </ParticlesProvider>
  );
}
