export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-black relative">
      <div
        className="absolute inset-0 z-0 dark:block hidden"
        style={{
          backgroundImage: `
          radial-gradient(circle at 50% 100%, rgba(88, 28, 135, 0.6) 0%, transparent 60%),
          radial-gradient(circle at 50% 100%, rgba(37, 99, 235, 0.4) 0%, transparent 70%),
          radial-gradient(circle at 50% 100%, rgba(12, 74, 110, 0.3) 0%, transparent 80%)
        `,
        }}
      />

      <div
        className="absolute inset-0 z-0 dark:hidden block"
        style={{
          background: `
        radial-gradient(ellipse 80% 60% at 70% 20%, rgba(175, 109, 255, 0.85), transparent 68%),
        radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.75), transparent 68%),
        radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.98), transparent 68%),
        radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.3), transparent 68%),
        linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
      `,
        }}
      />
      <div className="w-full h-full relative">{children}</div>
    </div>
  );
}
