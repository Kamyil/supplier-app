<script lang="ts">
  import type { Snippet } from 'svelte';
  let {
    children,
    variant = 'primary',
    type = 'button',
    disabled = false,
    class: className = '',
    onclick
  }: {
    children: Snippet;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    type?: 'button' | 'submit';
    disabled?: boolean;
    class?: string;
    onclick?: (event: MouseEvent) => void;
  } = $props();

  const styles = {
    primary: 'bg-signal text-white shadow-[0_6px_16px_rgba(243,111,42,.28)] hover:bg-signal-deep',
    secondary: 'bg-chespa text-white hover:bg-chespa-deep',
    ghost: 'border border-steel bg-white text-chespa hover:border-slate-300 hover:bg-slate-50',
    danger: 'bg-red-50 text-red-700 hover:bg-red-100'
  };
</script>

<button {type} {disabled} {onclick} class={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold tracking-tight transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none ${styles[variant]} ${className}`}>
  {@render children()}
</button>
