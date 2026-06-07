"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownUp,
  Bitcoin,
  CandlestickChart,
  ChevronRight,
  CircleDollarSign,
  Gauge,
  Landmark,
  Layers3,
  LineChart,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const btcPrice = 104250;
const wallet = {
  btc: 2.4286,
  bile: 126840,
  collateralRatio: 1.42,
  health: 94,
  pendingYield: 1842.22,
};

const yieldApy = 9.84;

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatToken(value: number, digits = 2) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ElementType;
}) {
  return (
    <Card className="bg-card/80 backdrop-blur">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardDescription>{label}</CardDescription>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

function PositionVisualization({ mintAmount }: { mintAmount: number }) {
  const spot = mintAmount * 0.58;
  const perp = mintAmount * 0.42;
  const hedgeQuality = Math.min(99, 86 + mintAmount / 1800);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-border bg-background/50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">BTC spot collateral</span>
            <span>{formatUsd(spot)}</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: "58%" }} />
          </div>
        </div>
        <div className="rounded-md border border-border bg-background/50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Hyperliquid short hedge</span>
            <span>{formatUsd(perp)}</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-accent" style={{ width: "42%" }} />
          </div>
        </div>
      </div>

      <div className="rounded-md border border-border bg-background/50 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Delta-neutral envelope</p>
            <p className="text-xs text-muted-foreground">Mock exposure balanced across BTC spot and short perps</p>
          </div>
          <span className="rounded bg-primary/15 px-2 py-1 text-xs text-primary">{hedgeQuality.toFixed(1)}% hedged</span>
        </div>
        <div className="relative h-36 overflow-hidden rounded bg-secondary/50">
          <div className="absolute inset-x-6 top-1/2 h-px bg-border" />
          <div className="absolute left-6 right-6 top-[46%] h-10 rounded-full border border-primary/60 bg-primary/10" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 144" preserveAspectRatio="none">
            <path
              d="M0 72 C80 25 138 112 210 72 S350 46 520 72"
              fill="none"
              stroke="rgb(58 212 168)"
              strokeWidth="3"
            />
            <path
              d="M0 72 C90 116 140 34 220 72 S360 102 520 72"
              fill="none"
              stroke="rgb(14 165 233)"
              strokeWidth="3"
              opacity="0.85"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function YieldCounter() {
  const [earned, setEarned] = useState(wallet.pendingYield);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setEarned((current) => current + 0.037);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <Card className="border-primary/30 bg-primary/10">
      <CardHeader>
        <CardDescription>Real-time protocol yield</CardDescription>
        <CardTitle className="text-3xl tabular-nums text-primary">{formatToken(earned, 3)} BILE</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Current APY</p>
            <p className="text-lg font-semibold">{yieldApy}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Epoch</p>
            <p className="text-lg font-semibold">14h 22m</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Source</p>
            <p className="text-lg font-semibold">Mock HLP</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [btcToMint, setBtcToMint] = useState(0.35);
  const [redeemAmount, setRedeemAmount] = useState(15000);
  const mintAmount = useMemo(() => btcToMint * btcPrice * 0.92, [btcToMint]);
  const remainingBtc = wallet.btc - btcToMint;
  const redeemBtc = redeemAmount / btcPrice;
  const fee = redeemAmount * 0.0015;

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-background/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#landing" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">BILE</p>
              <p className="text-xs text-muted-foreground">BTC-backed stablecoin</p>
            </div>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {["Dashboard", "Mint", "Yield", "Redeem"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="rounded px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
                {item}
              </a>
            ))}
          </nav>
          <Button size="sm">
            <Wallet className="h-4 w-4" />
            Mock Wallet
          </Button>
        </div>
      </header>

      <section id="landing" className="mx-auto grid min-h-[82vh] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
            <ShieldCheck className="h-4 w-4" />
            Institutional-grade DeFi protocol on Hyperliquid rails
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-normal text-balance sm:text-6xl lg:text-7xl">
            BILE Stablecoin
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Mint a BTC-collateralized stablecoin, watch the mock hedge engine balance exposure, and simulate yield and redemption flows in a clean DeFi operations console.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => document.getElementById("mint")?.scrollIntoView()}>
              Mint BILE
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => document.getElementById("dashboard")?.scrollIntoView()}>
              View Dashboard
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card/70 p-5 shadow-2xl backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Protocol TVL</p>
              <p className="text-3xl font-semibold">$486.2M</p>
            </div>
            <Activity className="h-7 w-7 text-primary" />
          </div>
          <div className="grid grid-cols-12 items-end gap-2 h-56">
            {[42, 58, 51, 74, 69, 88, 80, 96, 91, 103, 112, 126].map((height, index) => (
              <div key={index} className="rounded-t bg-primary/80" style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md bg-secondary p-3">
              <p className="text-xs text-muted-foreground">Peg</p>
              <p className="font-semibold">$1.0004</p>
            </div>
            <div className="rounded-md bg-secondary p-3">
              <p className="text-xs text-muted-foreground">Collateral</p>
              <p className="font-semibold">142%</p>
            </div>
            <div className="rounded-md bg-secondary p-3">
              <p className="text-xs text-muted-foreground">Hedge</p>
              <p className="font-semibold">96.8%</p>
            </div>
          </div>
        </div>
      </section>

      <section id="dashboard" className="border-y border-border bg-background/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm uppercase text-primary">Wallet dashboard</p>
              <h2 className="mt-2 text-3xl font-semibold">Portfolio command center</h2>
            </div>
            <div className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">
              Mock BTC price: <span className="text-foreground">{formatUsd(btcPrice)}</span>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard label="BTC balance" value={`${formatToken(wallet.btc, 4)} BTC`} detail={formatUsd(wallet.btc * btcPrice)} icon={Bitcoin} />
            <StatCard label="BILE balance" value={`${formatToken(wallet.bile, 0)} BILE`} detail="Mock wallet holdings" icon={CircleDollarSign} />
            <StatCard label="Collateral ratio" value={`${(wallet.collateralRatio * 100).toFixed(0)}%`} detail="Above internal risk threshold" icon={Gauge} />
            <StatCard label="Account health" value={`${wallet.health}%`} detail="No live wallet connected" icon={LockKeyhole} />
          </div>
        </div>
      </section>

      <section id="mint" className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
        <Card className="bg-card/80">
          <CardHeader>
            <CardDescription>Mint BILE page</CardDescription>
            <CardTitle>Mint from BTC collateral</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-muted-foreground">BTC deposit</label>
              <Input value={btcToMint} onChange={(event) => setBtcToMint(Number(event.target.value) || 0)} type="number" min="0" max={wallet.btc} step="0.01" />
            </div>
            <Slider value={[btcToMint]} min={0.05} max={wallet.btc} step={0.01} onValueChange={([value]) => setBtcToMint(value)} />
            <div className="rounded-md border border-border bg-background/50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">You mint</span>
                <span className="font-semibold">{formatToken(mintAmount, 0)} BILE</span>
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining BTC</span>
                <span>{formatToken(Math.max(remainingBtc, 0), 4)} BTC</span>
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-muted-foreground">Mint LTV</span>
                <span>92%</span>
              </div>
            </div>
            <Button className="w-full">
              <Layers3 className="h-4 w-4" />
              Simulate Mint
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <CardDescription>Delta-neutral position visualization</CardDescription>
            <CardTitle>BTC collateral, Hyperliquid hedge</CardTitle>
          </CardHeader>
          <CardContent>
            <PositionVisualization mintAmount={mintAmount} />
          </CardContent>
        </Card>
      </section>

      <section id="yield" className="border-y border-border bg-background/50 py-12">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div>
            <p className="text-sm uppercase text-primary">Yield dashboard</p>
            <h2 className="mt-2 text-3xl font-semibold">Funding, basis, and treasury rewards</h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              The counter and allocations are animated mock data. They model a protocol dashboard without connecting to Hyperliquid or any live blockchain endpoint.
            </p>
          </div>
          <YieldCounter />
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Yield allocation</CardTitle>
              <CardDescription>Mock breakdown of strategy income</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="funding">
                <TabsList>
                  <TabsTrigger value="funding">Funding</TabsTrigger>
                  <TabsTrigger value="basis">Basis</TabsTrigger>
                  <TabsTrigger value="treasury">Treasury</TabsTrigger>
                </TabsList>
                <TabsContent value="funding" className="grid gap-4 md:grid-cols-3">
                  <StatCard label="Funding capture" value="61%" detail="Perp funding spread" icon={CandlestickChart} />
                  <StatCard label="Avg interval" value="8h" detail="Mock settlement cycle" icon={RefreshCw} />
                  <StatCard label="Risk score" value="Low" detail="Synthetic view" icon={ShieldCheck} />
                </TabsContent>
                <TabsContent value="basis" className="grid gap-4 md:grid-cols-3">
                  <StatCard label="Basis share" value="27%" detail="Spot-perp basis" icon={LineChart} />
                  <StatCard label="Drift" value="0.04%" detail="Net delta estimate" icon={Activity} />
                  <StatCard label="Rebalance" value="Auto" detail="Mock engine state" icon={ArrowDownUp} />
                </TabsContent>
                <TabsContent value="treasury" className="grid gap-4 md:grid-cols-3">
                  <StatCard label="Treasury share" value="12%" detail="Protocol reserve" icon={Landmark} />
                  <StatCard label="Buffer" value="$18.4M" detail="Mock insurance pool" icon={LockKeyhole} />
                  <StatCard label="Utilization" value="74%" detail="Capital deployed" icon={Gauge} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="redeem" className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <Card>
          <CardHeader>
            <CardDescription>Redeem page</CardDescription>
            <CardTitle>Redeem BILE to BTC</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-muted-foreground">BILE amount</label>
              <Input value={redeemAmount} onChange={(event) => setRedeemAmount(Number(event.target.value) || 0)} type="number" min="0" max={wallet.bile} step="500" />
            </div>
            <Slider value={[redeemAmount]} min={1000} max={wallet.bile} step={500} onValueChange={([value]) => setRedeemAmount(value)} />
            <Button className="w-full">
              <Bitcoin className="h-4 w-4" />
              Simulate Redeem
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Redemption simulation</CardDescription>
            <CardTitle>Settlement preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-border bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">Estimated BTC out</p>
                <p className="mt-2 text-2xl font-semibold">{formatToken(redeemBtc, 6)} BTC</p>
              </div>
              <div className="rounded-md border border-border bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">Protocol fee</p>
                <p className="mt-2 text-2xl font-semibold">{formatToken(fee, 2)} BILE</p>
              </div>
              <div className="rounded-md border border-border bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">Settlement path</p>
                <p className="mt-2 font-semibold">Burn BILE -&gt; Unwind hedge -&gt; Release BTC</p>
              </div>
              <div className="rounded-md border border-border bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">Completion</p>
                <p className="mt-2 font-semibold">Instant mock receipt</p>
              </div>
            </div>
            <div className="mt-5 rounded-md bg-secondary p-4 text-sm text-muted-foreground">
              This demo uses only local mock values. No wallet transaction, blockchain call, or smart contract deployment occurs.
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
