import HeroSection from "@/components/landing-page/hero-section";
import FeaturesSection from "@/components/landing-page/features-section";
import ContentSection from "@/components/landing-page/content";
import StatsSection from "@/components/landing-page/stats";
import TestimonialsSection from "@/components/landing-page/testimonials";
import PricingSection from "@/components/landing-page/pricing";
import FAQsSection from "@/components/landing-page/faqs";
import FooterSection from "@/components/landing-page/footer";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <ContentSection />
      <StatsSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQsSection />
      <FooterSection />
    </div>
  );
}
