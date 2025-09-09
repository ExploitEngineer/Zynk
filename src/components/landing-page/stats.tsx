export default function StatsSection() {
  return (
    <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
          <h2 className="text-4xl font-medium lg:text-5xl">
            Zynk AI in Numbers
          </h2>
          <p>
            Zynk is redefining AI-powered conversations with lightning-fast
            responses, intelligent integrations, and scalable infrastructure.
            Here’s a glimpse of our growing ecosystem.
          </p>
        </div>

        <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
          <div className="space-y-4">
            <div className="text-5xl font-bold">+15K</div>
            <p>Developers & Contributors</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold">2M+</div>
            <p>Conversations Processed</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold">+750</div>
            <p>Apps Powered by Zynk</p>
          </div>
        </div>
      </div>
    </section>
  );
}
