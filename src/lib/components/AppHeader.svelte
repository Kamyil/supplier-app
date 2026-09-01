<script lang="ts">
  import { RefreshCw } from 'lucide-svelte';
  let { title = 'Opakowania zwrotne', onrefresh }: { title?: string; onrefresh?: () => void } = $props();
  let refreshing = $state(false);

  async function refresh() {
    refreshing = true;
    await new Promise((resolve) => setTimeout(resolve, 650));
    refreshing = false;
    onrefresh?.();
  }
</script>

<header class="sticky top-0 z-30 bg-chespa text-white shadow-lg shadow-chespa-deep/25">
  <div class="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
    <img src="/images/St-logo.png" alt="Chespa ST" class="h-9 w-auto rounded-lg bg-white px-1.5 py-1.5" />
    <div class="min-w-0 flex-1 border-l border-white/15 pl-3">
      <p class="truncate text-sm font-semibold leading-tight">{title}</p>
      <p class="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-white/60">
        <span class="relative flex h-1.5 w-1.5">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none"></span>
          <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
        </span>
        Impuls ERP połączony
      </p>
    </div>
    <button onclick={refresh} aria-label="Odśwież dane" class="grid h-10 w-10 place-items-center rounded-xl bg-white/10 transition hover:bg-white/20 active:scale-95">
      <RefreshCw size={18} class={refreshing ? 'animate-spin' : ''} />
    </button>
    <div class="hidden items-center gap-2.5 rounded-xl bg-white/10 py-1.5 pl-1.5 pr-3.5 sm:flex">
      <span class="grid h-7 w-7 place-items-center rounded-lg bg-signal text-[11px] font-bold text-white">MK</span>
      <span class="leading-tight">
        <span class="block text-xs font-semibold">Marek Kowalski</span>
        <span class="block text-[10px] text-white/55">Magazynier · M01</span>
      </span>
    </div>
  </div>
  <div class="h-[3px] bg-signal"></div>
</header>
