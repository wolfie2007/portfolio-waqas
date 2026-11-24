import { dreams } from '@/content/site';
import { ComponentsShowcase } from '@/components/components-showcase';
import { Dreams } from '@/components/dreams';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/hero';
import { Projects } from '@/components/projects';
import { Writing } from '@/components/writing';

export default function Home() {
  return (
    <>
      <Hero />
      <div className="page-enter">
        <main className="mx-auto w-full max-w-[46rem] px-6 sm:px-8">
          <Writing />
          <ComponentsShowcase />
          <Projects />
          <Dreams dreams={dreams} />
        </main>
        <div className="mx-auto w-full max-w-[46rem] px-6 sm:px-8">
          <Footer />
        </div>
      </div>
    </>
  );
}
