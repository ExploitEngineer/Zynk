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
          backgroundImage: `
        radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #10b981 100%)
      `,
          backgroundSize: "100% 100%",
        }}
      />
      <div className="w-full h-full relative">{children}</div>
    </div>
  );
}
