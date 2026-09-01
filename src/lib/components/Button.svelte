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
    primary: 'bg-signal text-white shadow-[0_7px_18px_rgba(243,111,42,.22)] hover:bg-[#dd5e20]',
    secondary: 'bg-chespa text-white hover:bg-chespa-deep',
    ghost: 'border border-slate-200 bg-white text-chespa hover:bg-slate-50',
    danger: 'bg-red-50 text-red-700 hover:bg-red-100'
  };
</script>

<button {type} {disabled} {onclick} class={`min-h-12 rounded-xl px-5 py-3 text-sm font-semibold transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-45 ${styles[variant]} ${className}`}>
  {@render children()}
</button>
