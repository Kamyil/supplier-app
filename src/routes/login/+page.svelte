<script lang="ts">
  import { Barcode, TriangleAlert } from 'lucide-svelte';
  import Button from '$lib/components/Button.svelte';

  let { form }: { form?: { error?: string; login?: string } | null } = $props();
</script>

<svelte:head>
  <title>Chespa ST · Logowanie</title>
  <meta name="description" content="Logowanie do obsługi opakowań zwrotnych dostawców" />
</svelte:head>

<div class="grid min-h-screen place-items-center bg-paper px-4 py-10">
  <div class="w-full max-w-sm">
    <div class="mb-6 text-center">
      <img src="/images/St-logo.png" alt="Chespa ST" class="mx-auto h-14 w-auto rounded-xl bg-white px-2.5 py-2.5 shadow-sm ring-1 ring-steel" />
      <p class="mt-4 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[.18em] text-signal"><Barcode size={14} /> Chespa ST</p>
      <h1 class="mt-1.5 text-xl font-bold tracking-tight text-ink">Opakowania zwrotne</h1>
    </div>

    <form method="POST" class="rounded-2xl border border-steel bg-white p-5 shadow-sm">
      <label class="block text-xs font-semibold text-slate-600">Login
        <input name="login" value={form?.login ?? ''} autocomplete="username" required class="mt-1.5 h-12 w-full min-w-0 rounded-xl border border-steel bg-surface-2 px-3.5 text-sm text-ink transition focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/25" />
      </label>
      <label class="mt-4 block text-xs font-semibold text-slate-600">Hasło
        <input type="password" name="password" autocomplete="current-password" required class="mt-1.5 h-12 w-full min-w-0 rounded-xl border border-steel bg-surface-2 px-3.5 text-sm text-ink transition focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/25" placeholder="••••••••" />
      </label>
      {#if form?.error}
        <p class="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-3 text-xs leading-relaxed text-red-700"><TriangleAlert size={15} class="mt-0.5 shrink-0" />{form.error}</p>
      {/if}
      <Button type="submit" class="mt-5 w-full">Zaloguj się</Button>
    </form>

    <div class="ticks mx-auto mt-4 h-4 w-36 text-ink/15"></div>
  </div>
</div>
