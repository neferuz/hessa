import Hero from "@/components/Hero";
import TickerBanner from "@/components/TickerBanner";
import Benefits from "@/components/Benefits";
import DifferenceCarousel from "@/components/DifferenceCarousel";
import NewArrivals from "@/components/NewArrivals";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

import * as motion from "framer-motion/client";

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <Hero />

        <motion.div
          className={styles.contentWrapper}
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Benefits />
          <DifferenceCarousel />
          <NewArrivals />
          <FAQ />
          <Newsletter />
          <TickerBanner />
          <Footer />
        </motion.div>
      </main>
    </>
  );
}
