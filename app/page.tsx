import { dreams } from '@/content/site';
import { Dreams } from '@/components/dreams';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/hero';
import { Nav } from '@/components/nav';
import { Work } from '@/components/work';
import { Writing } from '@/components/writing';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <div className="page-enter">
        <main className="mx-auto w-full max-w-[46rem] px-5 sm:px-8">
          <Writing />
          <Work />
          <Dreams dreams={dreams} />
        </main>
        <Footer />
      </div>
    </>
  );
}
