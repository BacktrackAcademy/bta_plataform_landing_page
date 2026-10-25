/**
 * Ajuste suave entre secciones de la landing (versión aprobada): solo cuando el scroll se detiene cerca del inicio
 * de una sección (≤ 20 % de la pantalla, máx. 180 px) y en la dirección del desplazamiento. Lejos de los límites
 * —leyendo una sección larga o las preguntas frecuentes— el scroll es libre.
 * No interviene tras un clic, al girar el dispositivo, con el menú abierto, escribiendo, con flechas del teclado
 * ni con `prefers-reduced-motion`.
 */
export function useSectionSnap() {
  let cleanup: (() => void) | undefined
  onBeforeUnmount(() => cleanup?.())
  onMounted(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let lastY = window.scrollY
    let dir = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    let settling = false
    let touching = false
    let releaseAt = 0
    let quietUntil = 0
    let arrows = false

    const tops = () => {
      const h = document.querySelector('.bta-l .hdr')?.getBoundingClientRect().height ?? 0
      return [...document.querySelectorAll<HTMLElement>('.bta-l #inicio, .bta-l section.sec, .bta-l footer.foot')]
        .map(el => Math.round(el.getBoundingClientRect().top + window.scrollY - (el.id === 'inicio' ? 0 : h)))
    }
    const menuOpen = () => !!document.querySelector('.bta-l .mnav')

    function settle() {
      timer = undefined
      if (settling || touching || reduce.matches || menuOpen() || arrows || Date.now() < quietUntil)
        return
      const a = document.activeElement
      if (a && /^(?:INPUT|TEXTAREA|SELECT)$/.test(a.tagName))
        return
      const y = window.scrollY
      const vh = window.innerHeight
      const max = document.documentElement.scrollHeight - vh
      if (y <= 2 || y >= max - 2 || !dir)
        return
      const zone = Math.min(vh * 0.2, 180)
      let best: number | null = null
      for (const b of tops()) {
        const d = b - y
        if (Math.abs(d) < 3 || Math.abs(d) > zone || b < 0 || b > max)
          continue
        if ((dir > 0 && d < 0) || (dir < 0 && d > 0))
          continue
        if (best === null || Math.abs(d) < Math.abs(best - y))
          best = b
      }
      if (best === null)
        return
      settling = true
      releaseAt = Date.now() + 900
      window.scrollTo({ top: best, behavior: 'smooth' })
    }
    const schedule = (ms: number) => {
      clearTimeout(timer)
      timer = setTimeout(settle, ms)
    }

    const onScroll = () => {
      const y = window.scrollY
      if (settling) {
        if (Date.now() > releaseAt) {
          settling = false
        }
        else {
          lastY = y
          return
        }
      }
      if (y !== lastY)
        dir = y > lastY ? 1 : -1
      lastY = y
      schedule(180)
    }
    const onEnd = () => {
      if (settling) {
        settling = false
        lastY = window.scrollY
      }
    }
    const onWheel = () => {
      settling = false
      arrows = false
    }
    const onKey = (e: KeyboardEvent) => {
      settling = false
      arrows = e.key === 'ArrowDown' || e.key === 'ArrowUp'
    }
    // Mientras alguien interactúa (abrir una pregunta, usar pestañas, seguir un enlace) no se mueve la página.
    const onClick = () => {
      quietUntil = Date.now() + 2500
      settling = false
      clearTimeout(timer)
    }
    // Al girar el dispositivo o redimensionar, el navegador reajusta el scroll: no se interviene.
    const onResize = () => {
      quietUntil = Date.now() + 1000
      settling = false
      clearTimeout(timer)
      lastY = window.scrollY
      dir = 0
    }
    const onTouchStart = () => {
      touching = true
      settling = false
      clearTimeout(timer)
    }
    const onTouchEnd = () => {
      touching = false
      schedule(220)
    }

    const opts = { passive: true } as const
    window.addEventListener('scroll', onScroll, opts)
    window.addEventListener('scrollend', onEnd)
    window.addEventListener('wheel', onWheel, opts)
    window.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick, true)
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    window.addEventListener('touchstart', onTouchStart, opts)
    window.addEventListener('touchend', onTouchEnd, opts)

    cleanup = () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scrollend', onEnd)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      clearTimeout(timer)
    }
  })
}
