/**
 * Aparición suave al entrar al viewport. El contenido se renderiza visible (SSR / sin JS);
 * solo se oculta en el cliente si el elemento aún está fuera de pantalla, así no hay parpadeo.
 */
export function useReveal() {
  const el = ref<HTMLElement | null>(null)
  const visible = ref(true)

  onMounted(() => {
    const node = el.value
    if (!node || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return
    if (node.getBoundingClientRect().top < window.innerHeight)
      return
    visible.value = false
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        visible.value = true
        io.disconnect()
      }
    }, { rootMargin: '0px 0px -10% 0px' })
    io.observe(node)
    onBeforeUnmount(() => io.disconnect())
  })

  return { el, visible }
}
