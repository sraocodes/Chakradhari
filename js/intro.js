const companyLines = [
  "CHAKRADHARI",
  "COMPUTATIONAL",
  "TECHNOLOGIES PVT LTD"
];

window.addEventListener("load", () => {
  const logo = document.querySelector(".logo");
  const textContainer = document.querySelector(".company-text");
  const mainContent = document.getElementById("main-content");
  const intro = document.getElementById("intro");

  // Create a timeline for better control and synchronization
  const tl = gsap.timeline({
    defaults: { ease: "power2.out" }
  });

  // Step 1: Logo fade with scale for more impact
  tl.fromTo(logo, 
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1, duration: 0.3 }
  )
  // Step 2: Logo slide with text reveal simultaneously
  .to(logo, {
    x: "-8vw",
    duration: 0.4,
    ease: "expo.out"
  })
  .add(() => revealText(companyLines, textContainer), "-=0.2"); // Start text slightly before logo finishes

  // Modern text reveal with stagger effect
  function revealText(lines, element) {
    element.style.opacity = 1;
    
    // Create all lines at once but hidden
    lines.forEach((line, index) => {
      const lineEl = document.createElement("div");
      lineEl.className = "company-line";
      lineEl.textContent = line;
      lineEl.style.cssText = `
        opacity: 0;
        transform: translateY(20px);
        will-change: transform, opacity;
      `;
      element.appendChild(lineEl);
    });

    // Animate all lines with stagger
    gsap.to(".company-line", {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.08, // Quick succession
      ease: "back.out(1.5)",
      onComplete: () => {
        // Add a subtle glow effect after text appears
        gsap.to(".company-line", {
          textShadow: "0 0 20px rgba(0, 150, 255, 0.3)",
          duration: 0.5,
          stagger: 0.05
        });
        
        // Transition to main content
        setTimeout(transitionToMain, 800); // Reduced wait time
      }
    });

    // Optional: Add character-by-character reveal for the first line only
    // This gives a "computing" feel without slowing everything down
    const firstLine = element.querySelector(".company-line");
    if (firstLine) {
      const text = firstLine.textContent;
      firstLine.textContent = "";
      firstLine.style.opacity = 1;
      firstLine.style.transform = "translateY(0)";
      
      [...text].forEach((char, i) => {
        setTimeout(() => {
          firstLine.textContent += char;
        }, i * 20); // Very fast typing
      });
    }
  }

  // Smooth parallel transition
  function transitionToMain() {
    const tl = gsap.timeline();
    
    // Fade and scale intro away
    tl.to("#intro", {
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.inOut"
    })
    // Simultaneously prepare main content
    .set(mainContent, { display: "block", opacity: 0 }, "-=0.15")
    .fromTo(mainContent, 
      { 
        opacity: 0, 
        y: 30,
        filter: "blur(10px)"
      },
      { 
        opacity: 1, 
        y: 0,
        filter: "blur(0px)",
        duration: 0.5,
        ease: "expo.out"
      }
    )
    .set(intro, { display: "none" });
  }

  // Optional: Add loading optimization
  // Preload main content images while intro plays
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Preload critical resources for main page
      const images = mainContent.querySelectorAll('img[data-src]');
      images.forEach(img => {
        img.src = img.dataset.src;
      });
    });
  }
});

// Additional enhancement: Add CSS for smoother rendering
const style = document.createElement('style');
style.textContent = `
  .company-line {
    font-weight: 700;
    letter-spacing: 0.05em;
    line-height: 1.2;
    position: relative;
  }
  
  .company-line:nth-child(1) {
    font-size: clamp(2rem, 5vw, 3.5rem);
  }
  
  .company-line:nth-child(2) {
    font-size: clamp(1.8rem, 4.5vw, 3.2rem);
    color: #0096ff;
  }
  
  .company-line:nth-child(3) {
    font-size: clamp(1.2rem, 3vw, 2rem);
    opacity: 0.9;
  }
  
  /* GPU acceleration */
  #intro, #main-content {
    transform: translateZ(0);
    backface-visibility: hidden;
  }
`;
document.head.appendChild(style);