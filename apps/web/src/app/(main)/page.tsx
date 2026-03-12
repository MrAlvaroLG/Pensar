import HeroSection from "@/components/sections/hero-section"
import ChatSection from "@/components/sections/chat-section"
import LibrarySection from "../../components/sections/library-section"

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <LibrarySection />
            <ChatSection />
        </>
    )
}