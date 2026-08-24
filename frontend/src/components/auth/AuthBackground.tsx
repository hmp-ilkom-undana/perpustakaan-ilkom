import ParticleBackground from "@/components/ParticleBackground";

export function AuthBackground() {
  return (
    <>
      <ParticleBackground />
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/[0.08] rounded-full blur-[140px] pointer-events-none z-[2]" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-500/[0.06] rounded-full blur-[140px] pointer-events-none z-[2]" />
    </>
  );
}
