import type { ReactNode } from 'react';

export type Post = {
  slug: string;
  title: string;
  summary: string;
  content: () => ReactNode;
};

export const posts: Post[] = [
  {
    slug: 'benchmarking-claude-prompting-approaches',
    title: 'I benchmarked Claude with two different prompting approaches.',
    summary:
      'I tried using technical language with Claude and it used 32% less of my subscription.',
    content: () => (
      <div className="space-y-6 text-[1.0625rem] leading-7 text-paper/80 font-normal">
        <p className="text-[1.25rem] sm:text-[1.35rem] leading-8 font-medium text-paper tracking-[-0.015em]">
          I tried using technical language with Claude and it used 32% less of my subscription
        </p>

        <p>
          I recently did a small experiment with Claude. I wanted to test something I&apos;ve been thinking about for a while.
        </p>

        <p className="text-paper font-medium">
          Does the way we communicate with AI actually affect how much usage it consumes?
        </p>

        <p>
          So I took two separate Claude accounts, both on the $20 Pro plan, and gave them the same task. Building a landing page with some custom components.
        </p>

        <p>
          Both accounts started with an empty project. Same model (Sonnet 5.5), same medium effort, same requirements and pretty much the same expected end result.
        </p>

        <div className="my-6 rounded-lg border border-paper/[0.08] bg-paper/[0.02] p-5 space-y-3 text-[0.9375rem] leading-7">
          <p>
            <strong className="text-paper font-medium">Account 1:</strong> I used normal everyday language. Basically the way a non-technical person would explain what they want from a designer. I described how things should look and behave without using much technical terminology.
          </p>
          <p>
            <strong className="text-paper font-medium">Account 2:</strong> I used proper technical language wherever possible. I explained things using technical terms and was more specific about what I wanted.
          </p>
        </div>

        <p className="text-paper text-[1.125rem] font-medium leading-7">
          Account 2 used 32% less of my Claude subscription usage.
        </p>

        <p>
          I also checked the difference at high effort. There, the gap was around 28% instead of 32%.
        </p>

        <p>
          Both results came pretty close to each other. I was even a little more satisfied with the result from account 2.
        </p>

        <p>
          Now obviously this is just one experiment with one landing page. I&apos;m not claiming technical prompting will always save 32% or that this applies to every task.
        </p>

        <p>
          I think we often focus too much on what model we&apos;re using and not enough on how we&apos;re communicating with it.
        </p>

        <p>
          Longer prompts aren&apos;t necessarily worse, and shorter prompts aren&apos;t necessarily better. Sometimes being more specific and speaking the language of the task can save a lot of unnecessary back and forth.
        </p>

        <p>
          I&apos;ve definitely started using more technical terms when working with AI, wherever possible.
        </p>

        {/* Clean, quiet sign-off */}
        <div className="mt-14 pt-8 border-t border-paper/[0.08]">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/40">
            Thanks for reading.
          </p>
        </div>
      </div>
    ),
  },
];
