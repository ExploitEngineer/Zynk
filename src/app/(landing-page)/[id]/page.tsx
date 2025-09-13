import ContentSection from "@/components/landing-page/content";
import FAQsSection from "@/components/landing-page/faqs";
import FeaturesSection from "@/components/landing-page/features-section";
import { Navbar } from "@/components/landing-page/navbar";
import PricingSection from "@/components/landing-page/pricing";
import StatsSection from "@/components/landing-page/stats";
import { notFound } from "next/navigation";
import { JSX } from "react";

const sections: Record<string, JSX.Element> = {
  features: <FeaturesSection />,
  content: <ContentSection />,
  stats: <StatsSection />,
  pricing: <PricingSection />,
  faqs: <FAQsSection />,
};

export default function LandingPageRoute({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const SelectedSection = sections[id];

  if (!SelectedSection) {
    notFound();
  }
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen w-full items-center justify-center bg-transparent">
        {SelectedSection}
      </div>
    </>
  );
}
