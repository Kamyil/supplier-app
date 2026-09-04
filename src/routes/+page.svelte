<script lang="ts">
  import {
    ArrowLeft, ArrowRight, Barcode, Boxes, Check, ChevronDown, ChevronRight,
    CirclePlus, ClipboardList, Container, FileCheck2, History, Info, PackageCheck, Plus,
    Search, Trash2, TriangleAlert, Warehouse, X
  } from 'lucide-svelte';
  import AppHeader from '$lib/components/AppHeader.svelte';
  import Button from '$lib/components/Button.svelte';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import { allContainers, initialReturns, scanPool, suppliers, type ScannedContainer } from '$lib/mock-data';

  let { data } = $props();
  type View = 'home' | 'stocks' | 'returns' | 'return-detail';
  type ReturnTab = 'scan' | 'list';
  let view = $state<View>('home');
  let returnTab = $state<ReturnTab>('scan');
  let search = $state('');
  let scanCode = $state('');
  let supplierId = $state('');
  let selectedExisting = $state<string[]>([]);
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
  let availableContainers = $derived(allContainers.filter((item) => item.supplierId === supplierId && !scanned.some((current) => current.serial === item.serial)));
  let availableContainerGroups = $derived(Object.values(
    availableContainers.reduce<Record<string, { index: string; name: string; items: ScannedContainer[] }>>((groups, item) => {
      const group = groups[item.index] ??= { index: item.index, name: item.name, items: [] };
      group.items.push(item);
      return groups;
    }, {})
  ));
  const titles: Record<View, string> = {
    home: 'Opakowania zwrotne', stocks: 'Stany opakowań', returns: 'Zwroty do dostawców', 'return-detail': 'Nowe wydanie'
  };
  function navigate(next: View) { view = next; search = ''; window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function startReturn(id = '') { supplierId = id; scanned = id === 'nordchem' ? [scanPool['IBC-NC-240018'], scanPool['BEC-NC-008419']] : []; selectedExisting = []; scanError = ''; navigate('return-detail'); }
  function addScan() {
    const normalized = scanCode.trim().toUpperCase(); if (!normalized) return;
    const container = scanPool[normalized];
    if (!container) { scanError = 'Nie znaleziono pojemnika na stanach magazynowych. Sprawdź numer i spróbuj ponownie.'; return; }
    if (!supplierId) supplierId = container.supplierId;
    if (container.supplierId !== supplierId) { scanError = 'Ten pojemnik należy do innego dostawcy. Nie można go dodać do bieżącego wydania.'; return; }
    if (scanned.some((item) => item.serial === container.serial)) { scanError = 'Ten pojemnik jest już na liście wydania.'; return; }
    scanned = [container, ...scanned]; scanCode = ''; scanError = ''; toast = `Dodano ${container.serial}`; setTimeout(() => toast = '', 1800);
  }
  function addSelected() {
    const additions = availableContainers.filter((item) => selectedExisting.includes(item.serial));
    if (additions.length) scanned = [...additions, ...scanned];
    selectedExisting = [];
  }
  function removeScan(serial: string) { scanned = scanned.filter((item) => item.serial !== serial); }
  function finishReturn() { showFinish = false; showSuccess = true; }
  function resetReturn() { showSuccess = false; supplierId = ''; scanned = []; navigate('returns'); }
  function refreshMessage() { toast = 'Dane zsynchronizowane z Impuls ERP'; setTimeout(() => toast = '', 1800); }
</script>

<svelte:head>
  <title>DEMO Dostawca· Opakowania zwrotne</title>
  <meta name="description" content="Makieta obsługi opakowań zwrotnych dostawców" />
</svelte:head>

<div class="min-h-screen bg-paper pb-24">
  <AppHeader title={titles[view]} user={data.user} onrefresh={refreshMessage} />

  {#if view === 'home'}
    <main class="enter mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <p class="text-[10px] font-semibold uppercase tracking-[.18em] text-signal">Magazyn M01 · zmiana poranna</p>
      <h1 class="mt-2 max-w-xl text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">Co chcesz teraz zrobić?</h1>
      <p class="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">Skanujesz fizyczne pojemniki, system pilnuje dostawcy i numeru serii.</p>

      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <button onclick={() => navigate('returns')} class="group relative min-h-48 overflow-hidden rounded-2xl bg-signal p-5 text-left text-white shadow-lg shadow-signal/25 transition hover:-translate-y-0.5 hover:shadow-xl">
          <span class="ticks pointer-events-none absolute -right-4 top-0 h-full w-40 text-black/20 [mask-image:linear-gradient(90deg,transparent,black_55%)]"></span>
          <span class="mb-8 grid h-12 w-12 place-items-center rounded-xl bg-black/15"><ClipboardList size={24} strokeWidth={1.9} /></span>
          <span class="block text-xl font-bold tracking-tight">Zwroty do dostawców</span>
          <span class="mt-1 block text-sm text-white/80">2 otwarte wydania wymagają obsługi</span>
          <span class="absolute bottom-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-white text-signal transition group-hover:translate-x-0.5"><ArrowRight size={19} /></span>
        </button>

        <button onclick={() => navigate('stocks')} class="group relative min-h-48 overflow-hidden rounded-2xl border border-steel bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
          <span class="mb-8 grid h-12 w-12 place-items-center rounded-xl bg-signal/10 text-signal"><Warehouse size={24} strokeWidth={1.9} /></span>
          <span class="block text-xl font-bold tracking-tight text-ink">Stany opakowań</span>
          <span class="mt-1 block text-sm text-slate-500">{allContainers.length} pojemników u 4 dostawców</span>
          <span class="absolute bottom-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-paper text-ink transition group-hover:bg-ink group-hover:text-white"><ArrowRight size={19} /></span>
        </button>
      </div>

      <section class="mt-4 rounded-2xl border border-steel bg-white px-4 py-3.5 sm:px-5">
        <div class="flex items-center gap-3">
          <span class="relative flex h-2 w-2 shrink-0">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <div class="min-w-0 flex-1"><p class="text-sm font-semibold text-ink">Synchronizacja działa poprawnie</p><p class="text-xs text-slate-400">Ostatnie pobranie stanów: <span class="font-mono text-[11px]">dzisiaj, 09:16</span></p></div>
          <span class="hidden rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200 sm:block">Online</span>
        </div>
      </section>
    </main>
  {:else if view === 'stocks'}
    <main class="enter mx-auto max-w-5xl px-4 py-5 sm:py-8">
      <button onclick={() => navigate('home')} class="mb-4 flex items-center gap-2 rounded-lg py-1 text-sm font-semibold text-ink transition hover:text-signal"><ArrowLeft size={17} /> Pulpit</button>
      <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-[10px] font-semibold uppercase tracking-[.18em] text-signal">Stan na teraz</p>
          <h1 class="mt-1.5 text-2xl font-bold tracking-tight text-ink">Opakowania według dostawców</h1>
          <p class="mt-1 max-w-md text-sm text-slate-500">Widoczni są tylko dostawcy, których pojemniki znajdują się na magazynach Chespa.</p>
        </div>
        <div class="flex w-fit items-baseline gap-2 rounded-xl bg-signal px-4 py-2.5 text-white"><span class="font-mono text-2xl font-bold leading-none">{allContainers.length}</span><span class="text-[11px] text-white/80">pojemników łącznie</span></div>
      </div>
      <label class="mb-4 flex h-12 items-center gap-3 rounded-xl border border-steel bg-white px-4 shadow-sm transition focus-within:border-signal focus-within:ring-2 focus-within:ring-signal/20">
        <Search size={18} class="shrink-0 text-slate-400" /><input bind:value={search} class="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-ink outline-none placeholder:text-slate-400" placeholder="Szukaj dostawcy lub kodu" />
      </label>
      <div class="space-y-3">
        {#each filteredSuppliers as supplier}
          <article class="overflow-hidden rounded-2xl border border-steel bg-white shadow-sm">
            <button onclick={() => expandedSupplier = expandedSupplier === supplier.id ? null : supplier.id} class="flex w-full items-center gap-3 p-4 text-left sm:p-5" aria-expanded={expandedSupplier === supplier.id}>
              <div class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink font-mono text-sm font-bold text-white">{supplier.name.slice(0, 2).toUpperCase()}</div>
              <div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-ink sm:text-base">{supplier.name}</p><p class="mt-0.5 truncate text-xs text-slate-400"><span class="font-mono text-[11px]">{supplier.code}</span> · {supplier.types.length} {supplier.types.length === 1 ? 'rodzaj' : 'rodzaje'}</p></div>
              <div class="text-right"><p class="font-mono text-xl font-bold leading-tight text-ink">{supplier.total}</p><p class="text-[10px] text-slate-400">szt.</p></div>
              <ChevronDown size={18} class={`ml-1 shrink-0 text-slate-400 transition ${expandedSupplier === supplier.id ? 'rotate-180' : ''}`} />
            </button>
            {#if expandedSupplier === supplier.id}
              <div class="border-t border-steel/70 bg-paper/60 px-4 py-3 sm:px-5">
                {#each supplier.types as type}
                  <div class="flex items-start gap-3 border-b border-steel/60 py-3 last:border-0">
                    <Container size={17} class="mt-1 shrink-0 text-slate-400" />
                    <div class="min-w-0 flex-1"><p class="truncate text-sm font-medium text-ink">{type.name}</p><p class="font-mono text-[10px] uppercase text-slate-400">{type.index}</p><div class="mt-2 grid gap-1 sm:grid-cols-2">{#each allContainers.filter((item) => item.supplierId === supplier.id && item.index === type.index) as item}<span class="font-mono text-[10px] text-slate-500">{item.serial} · {item.warehouse} · seria {item.series}</span>{/each}</div></div>
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
      <button onclick={() => navigate('home')} class="mb-4 flex items-center gap-2 rounded-lg py-1 text-sm font-semibold text-ink transition hover:text-signal"><ArrowLeft size={17} /> Pulpit</button>
      <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-[10px] font-semibold uppercase tracking-[.18em] text-signal">Dokumenty ZD</p>
          <h1 class="mt-1.5 text-2xl font-bold tracking-tight text-ink">Zwroty do dostawców</h1>
          <p class="mt-1 text-sm text-slate-500">Możesz wrócić do otwartego wydania albo rozpocząć nowe.</p>
        </div>
        <Button onclick={() => startReturn()}><CirclePlus size={19} /> Nowe wydanie</Button>
      </div>
      <div class="grid gap-3">
        {#each initialReturns as document}
          <button onclick={() => document.status !== 'completed' && startReturn(document.supplierId)} disabled={document.status === 'completed'} class="group rounded-2xl border border-steel bg-white p-4 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md disabled:cursor-default sm:p-5">
            <div class="flex items-start gap-3.5">
              <div class={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${document.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-signal/10 text-signal'}`}><FileCheck2 size={21} strokeWidth={1.9} /></div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2"><p class="font-semibold tracking-tight text-ink">{document.supplier}</p><StatusBadge status={document.status} /></div>
                <p class="mt-1 text-xs text-slate-400">{document.createdAt}{#if document.document} · <span class="font-mono text-[11px]">{document.document}</span>{/if}</p>
                <div class="mt-3 flex items-center gap-4 border-t border-steel/60 pt-3 text-xs text-slate-500"><span class="flex items-center gap-1.5"><Boxes size={14} /> <span class="font-mono font-semibold text-ink">{document.containers}</span> pojemników</span>{#if document.status === 'open'}<span class="font-semibold text-signal">Kontynuuj wydanie</span>{/if}</div>
              </div>
              {#if document.status !== 'completed'}<ChevronRight size={19} class="mt-2 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-signal" />{/if}
            </div>
          </button>
        {/each}
      </div>
      <Button variant="ghost" class="mt-4 w-full sm:w-auto" onclick={() => showReceive = true}><PackageCheck size={18} /> Przyjmij pojemnik</Button>
    </main>
  {:else}
    <main class="enter mx-auto max-w-5xl px-4 py-5 sm:py-8">
      <button onclick={() => navigate('returns')} class="mb-4 flex items-center gap-2 rounded-lg py-1 text-sm font-semibold text-ink transition hover:text-signal"><ArrowLeft size={17} /> Lista zwrotów</button>
      <div class="mb-5">
        <p class="text-[10px] font-semibold uppercase tracking-[.18em] text-signal">Bufor dokumentu ZD</p>
        <h1 class="mt-1.5 text-2xl font-bold tracking-tight text-ink">{activeSupplier ? activeSupplier.name : 'Nowe wydanie'}</h1>
      </div>

      <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div class="min-w-0 space-y-4">
          <section class="rounded-2xl border border-steel bg-white p-4 shadow-sm sm:p-5">
            <div class="mb-3 flex items-center gap-3">
              <span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-signal font-mono text-xs font-bold text-white">1</span>
              <div class="min-w-0 flex-1"><p class="text-sm font-semibold text-ink">Dostawca</p><p class="text-xs text-slate-400">Wybierz ręcznie albo zeskanuj pierwszy pojemnik</p></div>
              {#if activeSupplier}<span class="flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-600"><Check size={14} strokeWidth={2.5} /> Ustalony</span>{/if}
            </div>
            <select bind:value={supplierId} disabled={scanned.length > 0} class="h-12 w-full min-w-0 rounded-xl border border-steel bg-surface-2 px-3.5 text-sm text-ink transition focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/25 disabled:bg-paper disabled:text-slate-400">
              <option value="">Wybierz dostawcę</option>{#each suppliers as supplier}<option value={supplier.id}>{supplier.name}</option>{/each}
            </select>
            {#if scanned.length > 0}<p class="mt-2 flex items-center gap-1.5 text-xs text-slate-500"><Info size={14} class="shrink-0" /> Dostawca został zablokowany po dodaniu pierwszego pojemnika.</p>{/if}
          </section>

          <section class="rounded-2xl border border-steel bg-white p-4 shadow-sm sm:p-5">
            <div class="flex items-center gap-3">
              <span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-signal font-mono text-xs font-bold text-white">2</span>
              <div><p class="text-sm font-semibold text-ink">Dodaj pojemniki</p><p class="text-xs text-slate-400 mb-8">Skanuj kod albo wybierz dostępne pojemniki z listy.</p></div>
            </div>
            {#if supplierId}
              <div class="mt-4 grid grid-cols-2 rounded-xl bg-paper p-1 lg:hidden">
                <button onclick={() => returnTab = 'scan'} class={`min-h-10 rounded-lg text-xs font-semibold transition ${returnTab === 'scan' ? 'bg-white text-ink shadow-sm' : 'text-slate-500'}`}>Skanuj kod</button>
                <button onclick={() => returnTab = 'list'} class={`min-h-10 rounded-lg text-xs font-semibold transition ${returnTab === 'list' ? 'bg-white text-ink shadow-sm' : 'text-slate-500'}`}>Wybierz z listy</button>
              </div>
            {/if}

          <div class="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2">
            <section class={`relative overflow-hidden rounded-2xl bg-chespa-deep p-4 shadow-sm sm:p-5 lg:block ${supplierId ? '' : 'lg:col-span-2'} ${returnTab === 'scan' ? '' : 'hidden'}`}>
              <form onsubmit={(event) => { event.preventDefault(); addScan(); }}>
                <div class="scan-field flex min-h-14 items-center gap-3 rounded-xl bg-white px-4 shadow-inner">
                  <div class="scan-beam"></div>
                  <Barcode size={22} class="shrink-0 text-signal" />
                  <input bind:value={scanCode} class="min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-base font-semibold uppercase tracking-wide text-ink caret-signal outline-none placeholder:font-sans placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400" placeholder="Zeskanuj lub wpisz kod" aria-label="Kod pojemnika" />
                  <button type="submit" aria-label="Dodaj pojemnik" class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-signal text-white transition hover:bg-signal-deep active:scale-95"><Plus size={20} /></button>
                </div>
              </form>
              <p class="mt-2.5 font-mono text-[11px] text-white/45">Przykładowy kod: IBC-NC-240021</p>
            </section>

            {#if supplierId}
              <section class={`rounded-2xl border border-steel bg-white p-4 shadow-sm sm:p-5 lg:block ${returnTab === 'list' ? '' : 'hidden'}`}>
                <div class="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-semibold text-ink">Dostępne serie</p>
                    <p class="text-xs text-slate-400">{activeSupplier?.name} · pogrupowane według indeksu</p>
                  </div>
                  <span class="shrink-0 font-mono text-xs text-slate-500">{availableContainers.length} ser.</span>
                </div>
                {#if availableContainerGroups.length > 0}
                  <div class="max-h-72 space-y-3 overflow-y-auto pr-1">
                    {#each availableContainerGroups as group}
                      <div class="overflow-hidden rounded-xl border border-steel">
                        <div class="bg-surface-2 px-3 py-2.5">
                          <span class="block text-xs font-semibold text-ink">{group.name}</span>
                          <span class="mt-0.5 block font-mono text-[10px] text-slate-500">Indeks {group.index}</span>
                        </div>
                        <div class="divide-y divide-steel bg-white">
                          {#each group.items as item}
                            <label class="flex cursor-pointer items-center gap-3 px-3 py-2.5 transition has-[:checked]:bg-signal/5">
                              <input type="checkbox" value={item.serial} bind:group={selectedExisting} class="h-4 w-4 shrink-0 rounded border-steel text-signal focus:ring-signal" />
                              <span class="min-w-0 flex-1">
                                <span class="block font-mono text-xs font-semibold text-ink">Seria {item.series}</span>
                                <span class="block truncate text-[10px] text-slate-400">{item.serial} · mag. {item.warehouse}</span>
                              </span>
                            </label>
                          {/each}
                        </div>
                      </div>
                    {/each}
                  </div>
                  <Button class="mt-3 w-full" disabled={selectedExisting.length === 0} onclick={addSelected}>Dodaj zaznaczone serie ({selectedExisting.length})</Button>
                {:else}
                  <p class="rounded-xl border border-dashed border-steel p-4 text-center text-xs text-slate-400">Wszystkie dostępne serie są już dodane.</p>
                {/if}
              </section>
            {/if}
          </div>
          {#if scanError}<div class="flex gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-700"><TriangleAlert size={16} class="mt-0.5 shrink-0" />{scanError}</div>{/if}
          </section>
        </div>

        <aside class="h-fit min-w-0 rounded-2xl bg-chespa p-5 text-white shadow-xl shadow-ink/20 lg:sticky lg:top-24">
          <div class="flex items-start justify-between">
            <p class="text-[10px] font-semibold uppercase tracking-[.18em] text-white/50">Podsumowanie wydania</p>
            <Barcode size={16} class="text-white/30" />
          </div>
          <p class="mt-3 font-mono text-4xl font-bold leading-none">{scanned.length}</p>
          <p class="mt-1.5 text-sm text-white/60">pojemników w buforze</p>
          <div class="my-5 h-px bg-white/10"></div>
          <dl class="space-y-3 text-xs">
            <div class="flex justify-between gap-3"><dt class="text-white/50">Dostawca</dt><dd class="truncate text-right font-semibold">{activeSupplier?.name ?? 'Nie wybrano'}</dd></div>
            <div class="flex justify-between"><dt class="text-white/50">Dokument</dt><dd class="font-mono font-semibold">ZD · wersja robocza</dd></div>
            <div class="flex justify-between"><dt class="text-white/50">Magazyn źródłowy</dt><dd class="font-mono font-semibold">M-ZWROTY</dd></div>
          </dl>
          <Button class="mt-6 w-full" disabled={!activeSupplier || scanned.length === 0} onclick={() => showFinish = true}>Zamknij wydanie</Button>
          <button onclick={() => { toast = 'Wydanie zapisane. Możesz wrócić do niego później.'; setTimeout(() => toast = '', 2200); }} class="mt-3 w-full rounded-lg py-1.5 text-center text-xs font-semibold text-white/65 transition hover:text-white">Zapisz i dokończ później</button>

          <div class="mt-5 border-t border-white/10 pt-4">
            <div class="mb-3 flex items-center justify-between">
              <p class="text-sm font-semibold">Dodane pojemniki</p>
              <span class="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-xs font-bold text-white">{scanned.length}</span>
            </div>
            {#if scanned.length === 0}
              <div class="rounded-xl border border-dashed border-white/15 px-3 py-5 text-center"><Barcode size={22} class="mx-auto mb-2 text-white/25" /><p class="text-xs text-white/50">Dodaj pierwszy pojemnik</p></div>
            {:else}
              <ul class="space-y-2">
                {#each scanned as item, index}
                  <li class="pop flex items-center gap-3 rounded-xl bg-white/10 p-3">
                    <span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/10 font-mono text-[11px] font-bold text-white/65">{index + 1}</span>
                    <div class="min-w-0 flex-1"><p class="truncate text-xs font-semibold">{item.name}</p><p class="truncate font-mono text-[9px] uppercase text-white/45">{item.serial} · mag. {item.warehouse} · seria {item.series}</p></div>
                    <button onclick={() => removeScan(item.serial)} aria-label={`Usuń ${item.serial}`} class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/45 transition hover:bg-white/10 hover:text-white"><Trash2 size={15} /></button>
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
        </aside>
      </div>
    </main>
  {/if}

  <nav class="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-steel bg-white/95 px-3 backdrop-blur" aria-label="Nawigacja główna">
    <div class="mx-auto grid max-w-md grid-cols-3">
      <button onclick={() => navigate('home')} aria-current={view === 'home' ? 'page' : undefined} class={`relative flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] font-semibold transition ${view === 'home' ? 'text-signal' : 'text-slate-400 hover:text-slate-600'}`}>
        {#if view === 'home'}<span class="absolute top-0 h-[3px] w-8 rounded-full bg-signal"></span>{/if}
        <Boxes size={20} strokeWidth={view === 'home' ? 2.2 : 1.8} /> Pulpit
      </button>
      <button onclick={() => navigate('stocks')} aria-current={view === 'stocks' ? 'page' : undefined} class={`relative flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] font-semibold transition ${view === 'stocks' ? 'text-signal' : 'text-slate-400 hover:text-slate-600'}`}>
        {#if view === 'stocks'}<span class="absolute top-0 h-[3px] w-8 rounded-full bg-signal"></span>{/if}
        <Warehouse size={20} strokeWidth={view === 'stocks' ? 2.2 : 1.8} /> Stany
      </button>
      <button onclick={() => navigate('returns')} aria-current={view === 'returns' || view === 'return-detail' ? 'page' : undefined} class={`relative flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] font-semibold transition ${view === 'returns' || view === 'return-detail' ? 'text-signal' : 'text-slate-400 hover:text-slate-600'}`}>
        {#if view === 'returns' || view === 'return-detail'}<span class="absolute top-0 h-[3px] w-8 rounded-full bg-signal"></span>{/if}
        <History size={20} strokeWidth={view === 'returns' || view === 'return-detail' ? 2.2 : 1.8} /> Zwroty
      </button>
    </div>
  </nav>

  {#if toast}
    <div class="pop fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-ink px-4 py-3 text-center text-xs font-semibold text-white shadow-xl shadow-ink/40">{toast}</div>
  {/if}

  {#if showReceive}
    <div class="fixed inset-0 z-50 grid place-items-end bg-ink/45 p-0 backdrop-blur-[2px] sm:place-items-center sm:p-4" role="presentation">
      <section class="pop w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-2xl">
        <div class="mx-auto mb-4 h-1 w-10 rounded-full bg-steel sm:hidden"></div>
        <div class="mb-5 flex items-start justify-between gap-3">
          <div><p class="text-lg font-bold tracking-tight text-ink">Przyjmij pojemnik</p><p class="mt-0.5 text-xs text-slate-500">Dodatkowa ewidencja w aplikacji, bez dokumentu w systemie magazynowym.</p></div>
          <button onclick={() => showReceive = false} aria-label="Zamknij" class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-paper text-slate-500 transition hover:bg-steel hover:text-ink"><X size={17} /></button>
        </div>
        <div class="space-y-4">
          <label class="block text-xs font-semibold text-slate-300">Dostawca
            <select class="mt-1.5 h-12 w-full min-w-0 rounded-xl border border-steel bg-surface-2 px-3.5 text-sm text-ink focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/25"><option>NordChem Polska Sp. z o.o.</option><option>Coloris Industrial GmbH</option></select>
          </label>
          <label class="block text-xs font-semibold text-slate-600">Numer pojemnika
            <input value="IBC-NC-240031" class="mt-1.5 h-12 w-full rounded-xl border border-steel bg-surface-2 px-3.5 font-mono text-sm uppercase text-ink caret-signal focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/25" />
          </label>
        </div>
        <Button class="mt-5 w-full" onclick={() => { showReceive = false; toast = 'Pojemnik przyjęty do ewidencji'; setTimeout(() => toast = '', 1800); }}>Przyjmij pojemnik</Button>
      </section>
    </div>
  {/if}

  {#if showFinish}
    <div class="fixed inset-0 z-50 grid place-items-center bg-ink/45 p-4 backdrop-blur-[2px]">
      <section class="pop w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <div class="grid h-12 w-12 place-items-center rounded-xl bg-signal/10 text-signal"><FileCheck2 size={24} strokeWidth={1.9} /></div>
        <h2 class="mt-4 text-xl font-bold tracking-tight text-ink">Zamknąć wydanie?</h2>
        <p class="mt-2 text-sm leading-relaxed text-slate-500">System sprawdzi magazyny, utworzy potrzebne przesunięcia MM i zapisze dokument ZD dla {activeSupplier?.name}.</p>
        <div class="mt-4 rounded-xl bg-paper p-3.5 text-xs text-slate-600">
          <div class="flex justify-between"><span>Pojemniki</span><strong class="font-mono">{scanned.length} szt.</strong></div>
          <div class="mt-2 flex justify-between"><span>Pozostanie na stanie dostawcy</span><strong class="font-mono">{Math.max((activeSupplier?.total ?? 0) - scanned.length, 0)} szt.</strong></div>
        </div>
        <div class="mt-5 grid grid-cols-2 gap-3"><Button variant="ghost" onclick={() => showFinish = false}>Wróć</Button><Button onclick={finishReturn}>Zamknij wydanie</Button></div>
      </section>
    </div>
  {/if}

  {#if showSuccess}
    <div class="fixed inset-0 z-50 overflow-auto bg-chespa-deep p-5 text-white">
      <section class="pop mx-auto w-full max-w-md py-10 text-center sm:py-16">
        <div class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-400 text-chespa-deep shadow-[0_0_0_10px_rgba(52,211,153,.15)]"><Check size={42} strokeWidth={3} /></div>
        <p class="mt-6 text-[10px] font-semibold uppercase tracking-[.18em] text-emerald-300">Dokument ZD</p>
        <h2 class="mt-2 text-2xl font-bold tracking-tight">Wydanie zakończone</h2>
        <div class="ticks mx-auto mt-4 h-7 w-44 text-white/35"></div>
        <p class="mt-1 font-mono text-sm font-semibold tracking-widest text-white/85">ZD/004836/26</p>
        <p class="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-white/60">Utworzono dokument ZD/004836/26. Wszystkie pojemniki zostały zdjęte ze stanów magazynowych.</p>
        <div class="mt-6 rounded-2xl bg-white/10 p-4 text-left text-sm">
          <div class="flex justify-between"><span class="text-white/55">Dokument</span><strong class="font-mono">ZD/004836/26</strong></div>
          <div class="mt-3 flex justify-between"><span class="text-white/55">Liczba pojemników</span><strong class="font-mono">{scanned.length} szt.</strong></div>
        </div>
        <div class="mt-6 grid gap-3 sm:grid-cols-2">
          <button onclick={resetReturn} class="min-h-12 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Nowe wydanie</button>
          <Button onclick={resetReturn}>Wróć do listy zwrotów</Button>
        </div>
      </section>
    </div>
  {/if}
  <div class="fixed bottom-20 right-3 z-40 flex items-center gap-2 rounded-lg border border-steel/80 bg-white/90 px-3 py-2 shadow-sm backdrop-blur lg:bottom-3">
    <span class="text-[10px] font-medium text-slate-400">Powered by</span>
    <img src="/images/mccom-logo.png" alt="MCCOM" class="h-4 w-auto" />
  </div>
</div>
