"use client"

export function setupAnimations() {
  if (typeof window === "undefined") return

  const animateOnScroll = () => {
    const elements = document.querySelectorAll(".animate-on-scroll")

    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const elementBottom = element.getBoundingClientRect().bottom

      if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
        element.classList.add("animated")
      }
    })
  }

  window.addEventListener("scroll", animateOnScroll)
  window.addEventListener("resize", animateOnScroll)
  window.addEventListener("load", animateOnScroll)

  // Initial check
  setTimeout(animateOnScroll, 100)

  return () => {
    window.removeEventListener("scroll", animateOnScroll)
    window.removeEventListener("resize", animateOnScroll)
    window.removeEventListener("load", animateOnScroll)
  }
}

