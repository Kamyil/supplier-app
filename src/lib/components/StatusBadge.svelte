<script lang="ts">
  let { status }: { status: 'open' | 'ready' | 'completed' } = $props();
  const config = {
    open: { label: 'W trakcie', dot: 'bg-amber-500', style: 'bg-amber-50 text-amber-800 ring-amber-200' },
    ready: { label: 'Gotowe do zamknięcia', dot: 'bg-sky-500', style: 'bg-sky-50 text-sky-800 ring-sky-200' },
    completed: { label: 'Zakończone', dot: 'bg-emerald-500', style: 'bg-emerald-50 text-emerald-800 ring-emerald-200' }
  };
</script>


<span class={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${config[status].style}`}>
  <span class={`h-1.5 w-1.5 rounded-full ${config[status].dot}`}></span>
  {config[status].label}
</span>
