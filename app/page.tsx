import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { Work } from "@/components/Work";
import { getGitHubStats } from "@/lib/github";

export const revalidate = 3600;

export default async function Home() {
  const stats = await getGitHubStats();

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero stats={stats} />
        <Work />
        <Services />
        <Process />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
