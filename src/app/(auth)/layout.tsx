import { Navbar } from "@/components/landing-page/navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full bg-black">
      <Navbar />
      <div
        className="absolute inset-0 z-0 hidden dark:block"
        style={{
          backgroundImage: `
          radial-gradient(circle at 50% 100%, rgba(88, 28, 135, 0.6) 0%, transparent 60%),
          radial-gradient(circle at 50% 100%, rgba(37, 99, 235, 0.4) 0%, transparent 70%),
          radial-gradient(circle at 50% 100%, rgba(12, 74, 110, 0.3) 0%, transparent 80%)
        `,
        }}
      />

      <div
        className="absolute inset-0 z-0 block dark:hidden"
        style={{
          backgroundImage: `
        radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #10b981 100%)
      `,
          backgroundSize: "100% 100%",
        }}
      />
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}
