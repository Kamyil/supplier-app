<script lang="ts">
  let { status }: { status: 'open' | 'ready' | 'completed' } = $props();
  const config = {
    open: { label: 'W trakcie', style: 'bg-amber-50 text-amber-700 ring-amber-200' },
    ready: { label: 'Gotowe do zamknięcia', style: 'bg-blue-50 text-blue-700 ring-blue-200' },
    completed: { label: 'Zakończone', style: 'bg-emerald-50 text-emerald-700 ring-emerald-200' }
  };
</script>

<span class={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${config[status].style}`}>
  {config[status].label}
</span>
