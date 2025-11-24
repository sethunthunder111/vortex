// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Animation
gsap.from(".hero h1", {
  y: 100,
  opacity: 0,
  duration: 1,
  ease: "power4.out",
  delay: 0.2,
});

gsap.from(".hero p", {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power4.out",
  delay: 0.4,
});

gsap.from(".hero-btns", {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power4.out",
  delay: 0.6,
});

// Feature Cards Animation
gsap.utils.toArray(".feature-card").forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    delay: i * 0.1,
  });
});

// Stats Animation
gsap.utils.toArray(".stat-item").forEach((stat, i) => {
  gsap.from(stat, {
    scrollTrigger: {
      trigger: ".benchmarks",
      start: "top 75%",
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    delay: i * 0.2,
  });
});
