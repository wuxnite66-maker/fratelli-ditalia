import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Story from "@/components/Story";
import SignatureDishes from "@/components/SignatureDishes";
import MenuExperience from "@/components/MenuExperience";
import Atmosphere from "@/components/Atmosphere";
import Reviews from "@/components/Reviews";
import LocationHours from "@/components/LocationHours";
import Footer from "@/components/Footer";
import ChefChat from "@/components/ChefChat";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Marquee />
      <Story />
      <SignatureDishes />
      <MenuExperience />
      <Atmosphere />
      <Reviews />
      <LocationHours />
      <Footer />
      <ChefChat />
    </main>
  );
}
