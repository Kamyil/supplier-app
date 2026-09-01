<script lang="ts">
  import {
    ArrowLeft, ArrowRight, Barcode, Boxes, Check, CheckCircle2, ChevronDown, ChevronRight,
    CirclePlus, ClipboardList, Container, FileCheck2, History, Info, PackageCheck, Plus,
    Search, Trash2, TriangleAlert, Warehouse, X
  } from 'lucide-svelte';
  import AppHeader from '$lib/components/AppHeader.svelte';
  import Button from '$lib/components/Button.svelte';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import { initialReturns, scanPool, suppliers, type ScannedContainer } from '$lib/mock-data';

  type View = 'home' | 'stocks' | 'returns' | 'return-detail';
  let view = $state<View>('home');
  let search = $state('');
  let scanCode = $state('');
  let supplierId = $state('');
  let scanned = $state<ScannedContainer[]>([]);
  let scanError = $state('');
  let showReceive = $state(false);
  let showFinish = $state(false);
  let showSuccess = $state(false);
  let toast = $state('');
  let expandedSupplier = $state<string | null>('nordchem');

  let activeSupplier = $derived(suppliers.find((item) => item.id === supplierId));
  let filteredSuppliers = $derived(suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(search.toLowerCase()) || supplier.code.toLowerCase().includes(search.toLowerCase())
  ));

  const titles: Record<View, string> = {
    home: 'Opakowania zwrotne', stocks: 'Stany opakowań', returns: 'Zwroty do dostawców', 'return-detail': 'Nowe wydanie'
  };

  function navigate(next: View) {
    view = next;
    search = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startReturn(id = '') {
    supplierId = id;
    scanned = id === 'nordchem' ? [scanPool['IBC-NC-240018'], scanPool['BEC-NC-008419']] : [];
    scanError = '';
    navigate('return-detail');
  }

  function addScan() {
    const normalized = scanCode.trim().toUpperCase();
    if (!normalized) return;
    const container = scanPool[normalized];
    if (!container) {
      scanError = 'Nie znaleziono pojemnika w stanach Impuls. Sprawdź numer i spróbuj ponownie.';
      return;
    }
    if (!supplierId) supplierId = 'nordchem';
    if (supplierId !== 'nordchem') {
      scanError = 'Ten pojemnik należy do NordChem Polska. Nie można go dodać do bieżącego wydania.';
      return;
    }
    if (scanned.some((item) => item.serial === container.serial)) {
      scanError = 'Ten pojemnik jest już na liście wydania.';
      return;
    }
    scanned = [container, ...scanned];
    scanCode = '';
    scanError = '';
    toast = `Dodano ${container.serial}`;
    setTimeout(() => toast = '', 1800);
  }

  function removeScan(serial: string) {
    scanned = scanned.filter((item) => item.serial !== serial);
  }

  function finishReturn() {
    showFinish = false;
    showSuccess = true;
  }

  function resetReturn() {
    showSuccess = false;
    supplierId = '';
    scanned = [];
    navigate('returns');
  }

  function refreshMessage() {
    toast = 'Dane zsynchronizowane z Impuls ERP';
    setTimeout(() => toast = '', 1800);
  }
</script>

<svelte:head>
  <title>Chespa ST · Opakowania zwrotne</title>
  <meta name="description" content="Makieta obsługi opakowań zwrotnych dostawców" />
</svelte:head>

<div class="min-h-screen bg-paper pb-24">
  <AppHeader title={titles[view]} onrefresh={refreshMessage} />

  {#if view === 'home'}
    <main class="enter mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <section class="mb-6 overflow-hidden rounded-2xl bg-chespa text-white shadow-xl shadow-slate-900/10">
        <div class="relative px-5 py-6 sm:px-8 sm:py-8">
          <div class="absolute right-0 top-0 h-full w-28 opacity-10" style="background: repeating-linear-gradient(90deg, transparent 0 8px, white 8px 10px);"></div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-orange-300">Magazyn M01 · Zmiana poranna</p>
          <h1 class="max-w-lg text-2xl font-bold leading-tight sm:text-3xl">Co chcesz teraz zrobić?</h1>
          <p class="mt-2 max-w-xl text-sm leading-relaxed text-white/65">Stany i dokumenty pochodzą z Impuls ERP. Skanujesz fizyczne pojemniki, system pilnuje dostawcy i numeru serii.</p>
        </div>
      </section>

      <div class="grid gap-4 md:grid-cols-2">
        <button onclick={() => navigate('stocks')} class="group relative min-h-48 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
          <span class="mb-8 grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-chespa"><Warehouse size={25} /></span>
          <span class="block text-xl font-bold text-chespa">Stany opakowań</span>
          <span class="mt-1 block text-sm text-slate-500">53 pojemniki u 4 dostawców</span>
          <span class="absolute bottom-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-chespa transition group-hover:bg-chespa group-hover:text-white"><ArrowRight size={19} /></span>
        </button>

        <button onclick={() => navigate('returns')} class="group relative min-h-48 overflow-hidden rounded-2xl bg-signal p-5 text-left text-white shadow-lg shadow-orange-900/15 transition hover:-translate-y-0.5 hover:shadow-xl">
          <span class="mb-8 grid h-12 w-12 place-items-center rounded-xl bg-white/15"><ClipboardList size={25} /></span>
          <span class="block text-xl font-bold">Zwroty do dostawców</span>
          <span class="mt-1 block text-sm text-white/75">2 otwarte wydania wymagają obsługi</span>
          <span class="absolute bottom-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-white text-signal"><ArrowRight size={19} /></span>
        </button>
      </div>

      <section class="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <div class="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={21} /></div>
          <div class="min-w-0 flex-1"><p class="text-sm font-semibold text-slate-800">Synchronizacja działa poprawnie</p><p class="text-xs text-slate-500">Ostatnie pobranie stanów: dzisiaj, 09:16</p></div>
          <span class="hidden rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 sm:block">Online</span>
        </div>
      </section>
    </main>
  {:else if view === 'stocks'}
    <main class="enter mx-auto max-w-5xl px-4 py-5 sm:py-8">
      <button onclick={() => navigate('home')} class="mb-4 flex items-center gap-2 text-sm font-semibold text-chespa hover:text-signal"><ArrowLeft size={18} /> Pulpit</button>
      <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p class="text-xs font-semibold uppercase tracking-[.14em] text-signal">Stan na teraz</p><h1 class="mt-1 text-2xl font-bold text-chespa">Opakowania według dostawców</h1><p class="mt-1 text-sm text-slate-500">Widoczni są tylko dostawcy, których pojemniki znajdują się na magazynach Chespa.</p></div>
        <div class="flex items-baseline gap-2 rounded-xl bg-chespa px-4 py-3 text-white"><span class="text-2xl font-bold">53</span><span class="text-xs text-white/65">pojemniki łącznie</span></div>
      </div>
      <label class="mb-4 flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 shadow-sm focus-within:border-signal">
        <Search size={19} class="text-slate-400" /><input bind:value={search} class="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm outline-none focus:ring-0" placeholder="Szukaj dostawcy lub kodu" />
      </label>
      <div class="space-y-3">
        {#each filteredSuppliers as supplier}
          <article class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button onclick={() => expandedSupplier = expandedSupplier === supplier.id ? null : supplier.id} class="flex w-full items-center gap-3 p-4 text-left sm:p-5">
              <div class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 font-bold text-chespa">{supplier.name.slice(0, 2).toUpperCase()}</div>
              <div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-slate-900 sm:text-base">{supplier.name}</p><p class="mt-0.5 text-xs text-slate-400">{supplier.code} · {supplier.types.length} {supplier.types.length === 1 ? 'rodzaj' : 'rodzaje'}</p></div>
              <div class="text-right"><p class="text-xl font-bold text-chespa">{supplier.total}</p><p class="text-[10px] text-slate-400">szt.</p></div>
              <ChevronDown size={19} class={`ml-1 text-slate-400 transition ${expandedSupplier === supplier.id ? 'rotate-180' : ''}`} />
            </button>
            {#if expandedSupplier === supplier.id}
              <div class="border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5">
                {#each supplier.types as type}
                  <div class="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0">
                    <Container size={18} class="text-slate-400" /><div class="min-w-0 flex-1"><p class="text-sm font-medium text-slate-700">{type.name}</p><p class="font-mono text-[10px] text-slate-400">{type.index}</p></div><span class="rounded-lg bg-white px-2.5 py-1 text-sm font-bold text-chespa ring-1 ring-slate-200">{type.count}</span>
                  </div>
                {/each}
                <Button variant="ghost" class="mt-3 w-full" onclick={() => startReturn(supplier.id)}>Rozpocznij zwrot dla tego dostawcy</Button>
              </div>
            {/if}
          </article>
        {/each}
      </div>
    </main>
  {:else if view === 'returns'}
    <main class="enter mx-auto max-w-6xl px-4 py-5 sm:py-8">
      <button onclick={() => navigate('home')} class="mb-4 flex items-center gap-2 text-sm font-semibold text-chespa hover:text-signal"><ArrowLeft size={18} /> Pulpit</button>
      <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><p class="text-xs font-semibold uppercase tracking-[.14em] text-signal">Dokumenty ZD</p><h1 class="mt-1 text-2xl font-bold text-chespa">Zwroty do dostawców</h1><p class="mt-1 text-sm text-slate-500">Możesz wrócić do otwartego wydania albo rozpocząć nowe.</p></div>
        <Button onclick={() => startReturn()}><span class="flex items-center justify-center gap-2"><CirclePlus size={19} /> Nowe wydanie</span></Button>
      </div>
      <div class="grid gap-3">
        {#each initialReturns as document}
          <button onclick={() => document.status !== 'completed' && startReturn(document.supplierId)} class="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md disabled:cursor-default sm:p-5">
            <div class="flex items-start gap-3">
              <div class={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${document.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-signal'}`}><FileCheck2 size={22} /></div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2"><p class="font-semibold text-slate-900">{document.supplier}</p><StatusBadge status={document.status} /></div>
                <p class="mt-1 text-xs text-slate-400">{document.createdAt}{document.document ? ` · ${document.document}` : ''}</p>
                <div class="mt-3 flex items-center gap-4 text-xs text-slate-600"><span class="flex items-center gap-1.5"><Boxes size={15} /> {document.containers} pojemników</span>{#if document.status === 'open'}<span class="font-semibold text-signal">Kontynuuj wydanie</span>{/if}</div>
              </div>
              {#if document.status !== 'completed'}<ChevronRight size={20} class="mt-2 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-signal" />{/if}
            </div>
          </button>
        {/each}
      </div>
      <Button variant="ghost" class="mt-4 w-full sm:w-auto" onclick={() => showReceive = true}><span class="flex items-center justify-center gap-2"><PackageCheck size={18} /> Przyjmij pojemnik</span></Button>
    </main>
  {:else}
    <main class="enter mx-auto max-w-5xl px-4 py-5 sm:py-8">
      <button onclick={() => navigate('returns')} class="mb-4 flex items-center gap-2 text-sm font-semibold text-chespa hover:text-signal"><ArrowLeft size={18} /> Lista zwrotów</button>
      <div class="mb-5"><p class="text-xs font-semibold uppercase tracking-[.14em] text-signal">Bufor dokumentu ZD</p><h1 class="mt-1 text-2xl font-bold text-chespa">{activeSupplier ? activeSupplier.name : 'Nowe wydanie'}</h1></div>

      <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div class="space-y-4">
          <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div class="mb-3 flex items-center justify-between"><div><p class="text-sm font-semibold text-slate-900">1. Dostawca</p><p class="text-xs text-slate-400">Wybierz ręcznie albo zeskanuj pierwszy pojemnik</p></div>{#if activeSupplier}<span class="flex items-center gap-1 text-xs font-semibold text-emerald-600"><Check size={15} /> Ustalony</span>{/if}</div>
            <select bind:value={supplierId} disabled={scanned.length > 0} class="h-12 w-full rounded-xl border-slate-200 bg-white text-sm focus:border-signal focus:ring-signal disabled:bg-slate-100 disabled:text-slate-500">
              <option value="">Wybierz dostawcę</option>{#each suppliers as supplier}<option value={supplier.id}>{supplier.name}</option>{/each}
            </select>
            {#if scanned.length > 0}<p class="mt-2 flex items-center gap-1.5 text-xs text-slate-500"><Info size={14} /> Dostawca został zablokowany po dodaniu pierwszego pojemnika.</p>{/if}
          </section>

          <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-100 p-4 sm:p-5"><p class="text-sm font-semibold text-slate-900">2. Skanuj pojemniki</p><p class="text-xs text-slate-400">Zebra wprowadzi kod w aktywne pole. Możesz też wpisać numer ręcznie.</p></div>
            <form onsubmit={(event) => { event.preventDefault(); addScan(); }} class="bg-chespa p-4 sm:p-5">
              <label class="flex min-h-14 items-center gap-3 rounded-xl bg-white px-4 shadow-inner">
                <Barcode size={24} class="shrink-0 text-signal" />
                <input bind:value={scanCode} class="min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-base font-semibold uppercase outline-none focus:ring-0" placeholder="Zeskanuj lub wpisz kod" />
                <button type="submit" class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-signal text-white"><Plus size={21} /></button>
              </label>
              <p class="mt-2 text-[11px] text-white/55">Kod demonstracyjny: IBC-NC-240021 lub PAL-NC-000774</p>
            </form>
            {#if scanError}<div class="flex gap-2 border-b border-red-100 bg-red-50 px-4 py-3 text-xs text-red-700"><TriangleAlert size={17} class="shrink-0" />{scanError}</div>{/if}
            <div class="p-4 sm:p-5">
              <div class="mb-3 flex items-center justify-between"><p class="text-sm font-semibold text-slate-700">Dodane pojemniki</p><span class="rounded-full bg-chespa px-2.5 py-1 text-xs font-bold text-white">{scanned.length}</span></div>
              {#if scanned.length === 0}
                <div class="grid min-h-32 place-items-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center"><div><Barcode size={26} class="mx-auto mb-2 text-slate-300" /><p class="text-sm font-medium text-slate-500">Lista jest pusta</p><p class="text-xs text-slate-400">Zeskanuj pierwszy pojemnik</p></div></div>
              {:else}
                <div class="space-y-2">
                  {#each scanned as item, index}
                    <div class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-xs font-bold text-slate-400 ring-1 ring-slate-200">{index + 1}</span>
                      <div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-slate-800">{item.name}</p><p class="truncate font-mono text-[10px] text-slate-400">{item.serial} · {item.index} · mag. {item.warehouse}</p></div>
                      <button onclick={() => removeScan(item.serial)} aria-label={`Usuń ${item.serial}`} class="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={17} /></button>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          </section>
        </div>

        <aside class="h-fit rounded-2xl bg-chespa p-5 text-white shadow-xl shadow-slate-900/10 lg:sticky lg:top-24">
          <p class="text-xs font-semibold uppercase tracking-[.14em] text-white/50">Podsumowanie wydania</p>
          <p class="mt-3 text-4xl font-bold">{scanned.length}</p><p class="text-sm text-white/60">pojemników w buforze</p>
          <div class="my-5 h-px bg-white/10"></div>
          <div class="space-y-3 text-xs"><div class="flex justify-between gap-3"><span class="text-white/50">Dostawca</span><span class="truncate text-right font-semibold">{activeSupplier?.name ?? 'Nie wybrano'}</span></div><div class="flex justify-between"><span class="text-white/50">Dokument</span><span class="font-semibold">ZD · wersja robocza</span></div><div class="flex justify-between"><span class="text-white/50">Magazyn docelowy</span><span class="font-semibold">M-ZWROTY</span></div></div>
          <Button class="mt-6 w-full" disabled={!activeSupplier || scanned.length === 0} onclick={() => showFinish = true}>Zamknij wydanie</Button>
          <button onclick={() => { toast = 'Wydanie zapisane. Możesz wrócić do niego później.'; setTimeout(() => toast = '', 2200); }} class="mt-3 w-full text-center text-xs font-semibold text-white/65 hover:text-white">Zapisz i dokończ później</button>
        </aside>
      </div>
    </main>
  {/if}

  <nav class="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 pt-2 shadow-[0_-6px_24px_rgba(15,23,42,.08)] backdrop-blur">
    <div class="mx-auto grid max-w-md grid-cols-3">
      <button onclick={() => navigate('home')} class={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold ${view === 'home' ? 'text-signal' : 'text-slate-400'}`}><Boxes size={20} /> Pulpit</button>
      <button onclick={() => navigate('stocks')} class={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold ${view === 'stocks' ? 'text-signal' : 'text-slate-400'}`}><Warehouse size={20} /> Stany</button>
      <button onclick={() => navigate('returns')} class={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold ${view === 'returns' || view === 'return-detail' ? 'text-signal' : 'text-slate-400'}`}><History size={20} /> Zwroty</button>
    </div>
  </nav>

  {#if toast}<div class="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-center text-xs font-semibold text-white shadow-xl">{toast}</div>{/if}

  {#if showReceive}
    <div class="fixed inset-0 z-50 grid place-items-end bg-slate-950/45 p-0 sm:place-items-center sm:p-4" role="presentation">
      <section class="w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-2xl">
        <div class="mb-5 flex items-start justify-between"><div><p class="text-lg font-bold text-chespa">Przyjmij pojemnik</p><p class="text-xs text-slate-500">Dodatkowa ewidencja w aplikacji, bez dokumentu w Impuls.</p></div><button onclick={() => showReceive = false} class="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-500"><X size={18} /></button></div>
        <div class="space-y-4"><label class="block text-xs font-semibold text-slate-600">Dostawca<select class="mt-1.5 h-12 w-full rounded-xl border-slate-200 text-sm focus:border-signal focus:ring-signal"><option>NordChem Polska Sp. z o.o.</option><option>Coloris Industrial GmbH</option></select></label><label class="block text-xs font-semibold text-slate-600">Numer pojemnika<input value="IBC-NC-240031" class="mt-1.5 h-12 w-full rounded-xl border-slate-200 font-mono text-sm focus:border-signal focus:ring-signal" /></label></div>
        <Button class="mt-5 w-full" onclick={() => { showReceive = false; toast = 'Pojemnik przyjęty do ewidencji'; setTimeout(() => toast = '', 1800); }}>Przyjmij pojemnik</Button>
      </section>
    </div>
  {/if}

  {#if showFinish}
    <div class="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <section class="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <div class="grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-signal"><FileCheck2 size={25} /></div>
        <h2 class="mt-4 text-xl font-bold text-chespa">Zamknąć wydanie?</h2>
        <p class="mt-2 text-sm leading-relaxed text-slate-500">System sprawdzi magazyny, utworzy potrzebne przesunięcia MM i zapisze dokument ZD dla {activeSupplier?.name}.</p>
        <div class="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600"><div class="flex justify-between"><span>Pojemniki</span><strong>{scanned.length} szt.</strong></div><div class="mt-2 flex justify-between"><span>Pozostanie na stanie dostawcy</span><strong>{Math.max((activeSupplier?.total ?? 0) - scanned.length, 0)} szt.</strong></div></div>
        <div class="mt-5 grid grid-cols-2 gap-3"><Button variant="ghost" onclick={() => showFinish = false}>Wróć</Button><Button onclick={finishReturn}>Zamknij wydanie</Button></div>
      </section>
    </div>
  {/if}

  {#if showSuccess}
    <div class="fixed inset-0 z-50 grid place-items-center bg-chespa p-5 text-white">
      <section class="w-full max-w-md text-center"><div class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-400 text-chespa"><Check size={42} strokeWidth={3} /></div><p class="mt-6 text-xs font-semibold uppercase tracking-[.16em] text-emerald-300">Impuls ERP</p><h2 class="mt-2 text-2xl font-bold">Wydanie zakończone</h2><p class="mt-2 text-sm text-white/65">Utworzono dokument ZD/004836/26. Wszystkie pojemniki zostały zdjęte ze stanów magazynowych.</p><div class="mt-6 rounded-2xl bg-white/10 p-4 text-left text-sm"><div class="flex justify-between"><span class="text-white/55">Dokument</span><strong>ZD/004836/26</strong></div><div class="mt-3 flex justify-between"><span class="text-white/55">Liczba pojemników</span><strong>{scanned.length} szt.</strong></div></div><Button class="mt-6 w-full" onclick={resetReturn}>Wróć do listy zwrotów</Button></section>
    </div>
  {/if}
</div>
