import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import MenuPreview from "@/components/MenuPreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <MenuPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
