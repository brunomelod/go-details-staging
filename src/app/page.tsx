import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Hero } from "@/components/sections/Hero";
import { ResultsMarquee } from "@/components/sections/ResultsMarquee";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { StatsBar } from "@/components/sections/StatsBar";
import { WhyGoDetailsSection } from "@/components/sections/WhyGoDetailsSection";
import { SiteContactForm } from "@/components/site/SiteContactForm";
import { siteImages } from "@/data/site-images";

export default function HomePage() {
  return (
    <>
      <div className="relative">
        <Header />
        <Hero />
      </div>
      <main>
        <StatsBar />
        <ServicesPreview />
        <WhyGoDetailsSection />
        <CtaBanner
          image={siteImages.ctaDeepClean}
          title="Need a Deep, Detailed Clean?"
          description="Get a fast, transparent quote and let our team handle every detail."
        />
        <ResultsMarquee />
        <ReviewsSection />
        <CtaBanner
          image={siteImages.ctaInstantQuotes}
          title="Instant Quotes. No Surprises."
          description="Know your cost upfront and enjoy results you'll love."
        />
        <SiteContactForm />
      </main>
      <Footer />
    </>
  );
}
