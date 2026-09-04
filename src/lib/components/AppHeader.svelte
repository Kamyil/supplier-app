<script lang="ts">
  import { Barcode, LogOut, RefreshCw } from 'lucide-svelte';
  let {
    title = 'Opakowania zwrotne',
    user = null,
    onrefresh
  }: {
    title?: string;
    user?: { name: string; role: string } | null;
    onrefresh?: () => void;
  } = $props();

  let refreshing = $state(false);

  const initials = $derived((user?.name ?? 'Administrator ST')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase());
  async function refresh() {
    refreshing = true;
    await new Promise((resolve) => setTimeout(resolve, 650));
    refreshing = false;
    onrefresh?.();
  }
</script>

<header class="sticky top-0 z-30 bg-navy text-white shadow-lg shadow-navy-deep/25">
  <div class="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
    <div class="flex h-9 items-center gap-2 rounded-lg bg-white px-2.5 text-navy"><Barcode size={18} /><span class="text-xs font-bold tracking-[.16em]">DEMO</span></div>
    <div class="min-w-0 flex-1 border-l border-white/15 pl-3">
      <p class="truncate text-sm font-semibold leading-tight">{title}</p>
    </div>
    <button onclick={refresh} aria-label="Odśwież dane" class="grid h-10 w-10 place-items-center rounded-xl bg-white/10 transition hover:bg-white/20 active:scale-95">
      <RefreshCw size={18} class={refreshing ? 'animate-spin' : ''} />
    </button>
    <form method="POST" action="/logout">
      <button aria-label="Wyloguj się" title="Wyloguj się" class="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white/85 transition hover:bg-red-500/80 hover:text-white active:scale-95">
        <LogOut size={17} />
      </button>
    </form>
    <div class="hidden items-center gap-2.5 rounded-xl bg-white/10 py-1.5 pl-1.5 pr-3.5 sm:flex">
      <span class="grid h-7 w-7 place-items-center rounded-lg bg-signal font-mono text-[11px] font-bold text-white">{initials}</span>
      <span class="leading-tight">
        <span class="block text-xs font-semibold">{user?.name ?? 'Administrator ST'}</span>
        <span class="block text-[10px] text-white/55">{user?.role ?? 'Magazynier · M01'}</span>
      </span>
    </div>
  </div>
  <div class="h-[3px] bg-signal"></div>
</header>
