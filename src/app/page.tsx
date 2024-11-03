import Image from "next/image";
import { Programs } from "@/components/Programs";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <Image
          className="dark:invert"
          src="/pw.png"
          alt="ProgramWatch logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-4xl font-bold">ProgramWatch</h1>
        <Programs />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <div className="grid grid-cols-2">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://t.me/programwatch"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="p-4">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-[#229ED9] hover:scale-110 transition-transform cursor-pointer"
                fill="currentColor"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.198-.054-.308-.346-.11l-6.4 4.03-2.773-.907c-.6-.187-.612-.6.125-.89l10.833-4.17c.504-.187.95.118.77.89z" />
              </svg>
            </div>
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://x.com/programwatch"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="p-4">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-black hover:scale-110 transition-transform cursor-pointer"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
          </a>
        </div>

        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://metasal.xyz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          metasal.xyz
        </a>
      </footer>
    </div>
  );
}
