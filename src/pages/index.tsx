import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

export default function Home() {
  return (
    <Main
      meta={
        <Meta title="Fetcch Wallet" description="Homepage for Fetcch Wallet" />
      }
    >
      <h1 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-5xl md:text-6xl">
        Fetcch Wallet
      </h1>
    </Main>
  );
}
