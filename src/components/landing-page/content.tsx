import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ContentSection() {
  return (
    <section id="content" className="py-16 md:py-32">
      <div className="relative mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        <div className="relative w-full h-[500px]">
          <Image
            className="rounded-(--radius) grayscale"
            src="/assets/images/content.avif"
            fill
            objectFit="cover"
            loading="lazy"
            alt="team image"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <h2 className="text-4xl font-medium">
            Powering the Future of AI-Driven Conversations
          </h2>
          <div className="space-y-6">
            <p>
              Zynk isn't just a chat platform — it's an intelligent ecosystem
              designed to help you build, deploy, and scale AI-powered
              experiences. From real-time responses to context-aware insights,
              Zynk integrates cutting-edge models with powerful APIs and
              developer tools.
            </p>

            <Button
              asChild
              variant="secondary"
              size="sm"
              className="gap-1 pr-1.5"
            >
              <Link href="#">
                <span>Learn More</span>
                <ChevronRight className="size-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
