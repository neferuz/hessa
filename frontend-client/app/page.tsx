import Hero from "@/components/Hero";
import TickerBanner from "@/components/TickerBanner";
import Benefits from "@/components/Benefits";
import DifferenceCarousel from "@/components/DifferenceCarousel";
import NewArrivals from "@/components/NewArrivals";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import styles from "./page.module.css";


export default function Home() {
  return (
    <>

      <main className={styles.main}>
        <Hero />
        <TickerBanner />
        <Benefits />
        <DifferenceCarousel />
        <NewArrivals />
        <FAQ />
        <Newsletter />
        <Footer />
      </main>
    </>
  );
}
