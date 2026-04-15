export const BackgroundGradient = () => (
  <div
    className="fixed left-[50%] top-[50%] z-[-5] h-[900px] w-[1000px] -translate-x-1/2 -translate-y-1/2 animate-[pulse_7s_ease-in-out_infinite] motion-reduce:animate-none"
    style={{
      background: "radial-gradient(circle, var(--glow-color) 0%, transparent 65%)",
      willChange: "opacity",
    }}
  />
);
