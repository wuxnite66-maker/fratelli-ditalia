import Navbar from "@/components/Navbar";
import ScrollStage from "@/components/ScrollStage";
import Marquee from "@/components/Marquee";
import SignatureDishes from "@/components/SignatureDishes";
import MenuExperience from "@/components/MenuExperience";
import ReservationSection from "@/components/ReservationSection";
import Story from "@/components/Story";
import Atmosphere from "@/components/Atmosphere";
import Reviews from "@/components/Reviews";
import LocationHours from "@/components/LocationHours";
import Footer from "@/components/Footer";
import ChefChat from "@/components/ChefChat";
import StickyActions from "@/components/StickyActions";

export default function Home() {
  return (
    <main>
      <Navbar />
      <ScrollStage />
      <Marquee />
      <SignatureDishes />
      <MenuExperience />
      <ReservationSection />
      <Story />
      <Atmosphere />
      <Reviews />
      <LocationHours />
      <Footer />
      <ChefChat />
      <StickyActions />
    </main>
  );
}
