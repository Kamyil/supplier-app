<script lang="ts">
  import { RefreshCw, Wifi } from 'lucide-svelte';
  let { title = 'Opakowania zwrotne', onrefresh }: { title?: string; onrefresh?: () => void } = $props();
  let refreshing = $state(false);

  async function refresh() {
    refreshing = true;
    await new Promise((resolve) => setTimeout(resolve, 650));
    refreshing = false;
    onrefresh?.();
  }
</script>

<header class="sticky top-0 z-30 bg-chespa text-white shadow-lg shadow-slate-900/10">
  <div class="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
    <img src="/images/St-logo.png" alt="Chespa" class="h-8 w-auto rounded bg-white px-1.5 py-1" />
    <div class="min-w-0 flex-1 border-l border-white/20 pl-3">
      <p class="truncate text-sm font-semibold leading-tight">{title}</p>
      <p class="mt-0.5 flex items-center gap-1 text-[10px] text-white/65"><Wifi size={11} /> Impuls ERP połączony</p>
    </div>
    <button onclick={refresh} aria-label="Odśwież dane" class="grid h-10 w-10 place-items-center rounded-xl bg-white/10 hover:bg-white/15">
      <RefreshCw size={19} class={refreshing ? 'animate-spin' : ''} />
    </button>
    <div class="hidden text-right sm:block">
      <p class="text-xs font-semibold">Marek Kowalski</p>
      <p class="text-[10px] text-white/60">Magazynier · M01</p>
    </div>
  </div>
  <div class="h-1 bg-signal"></div>
</header>
