import HeroSection from "@/components/sections/hero-section"
import ChatSection from "@/components/sections/chat-section"
import HowItWorksSection from "@/components/sections/how-it-works-section"
import SuggestionsSection from "@/components/sections/suggestions-section"
import FinalCtaSection from "@/components/sections/final-cta-section"
import LibrarySection from "@/components/sections/library-section"

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <HowItWorksSection />
            <LibrarySection />
            <ChatSection />
            <SuggestionsSection />
            <FinalCtaSection />
        </>
    )
}