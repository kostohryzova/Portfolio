document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector("header");
  const headerHeight = header ? header.offsetHeight : 0;
  const defaultOffset = headerHeight + 40;
  const noOffsetSections = ["project-section", "poklady-section"];

  function smoothScroll(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const offset = noOffsetSections.includes(targetId)
      ? headerHeight
      : defaultOffset;
    const targetPosition = target.offsetTop - offset;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = Math.min(Math.max(Math.abs(distance) / 1.5, 800), 1800);
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      window.scrollTo({
        top: startPosition + distance * easeInOutCubic(progress),
        behavior: "instant",
      });

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    requestAnimationFrame(animation);
  }

  function scrollToSectionInstant(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const offset = noOffsetSections.includes(targetId)
      ? headerHeight
      : defaultOffset;

    window.scrollTo({
      top: target.offsetTop - offset,
      behavior: "instant",
    });
  }

  // ✅ Kliknutí v menu – plynulé scrollování (stejná stránka)
  document.querySelectorAll("nav a, .footer-menu a").forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (
        !href ||
        href.startsWith("http") ||
        href.endsWith(".pdf") ||
        href.includes("?section=")
      )
        return;

      e.preventDefault();
      const targetId = href.split("#")[1];
      if (targetId) {
        smoothScroll(targetId);
      }
    });
  });

  // ✅ Přesměrování ze stránky projekty.html rovnou na sekci (bez mezikroku)
  const urlParams = new URLSearchParams(window.location.search);
  const sectionParam = urlParams.get("section");

  if (sectionParam) {
    history.replaceState(null, null, window.location.pathname);
    setTimeout(() => {
      scrollToSectionInstant(sectionParam);
    }, 0);
  }

  //* scrol z boxíkú *//

  document.querySelector(".hero-box.project").addEventListener("click", () => {
    smoothScroll("project-section");
  });

  document.querySelector(".hero-box.skills").addEventListener("click", () => {
    smoothScroll("skills-section");
  });

  document.querySelector(".hero-box.more").addEventListener("click", () => {
    smoothScroll("poklady-section");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const contactBox = document.getElementById("contacts");

  // Funkce pro aktivaci animace
  function triggerBlinkEffect() {
    setTimeout(() => {
      contactBox.classList.add("blink-effect");

      setTimeout(() => {
        contactBox.classList.remove("blink-effect");
      }, 2400);
    }, 700);
  }

  // 1️⃣ Existující kontrola hashe (#contacts)
  if (window.location.hash === "#contacts") {
    triggerBlinkEffect();
  }

  // 2️⃣ Nová kontrola URL parametru (?section=contacts)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("section") === "contacts") {
    triggerBlinkEffect();
  }

  // 3️⃣ Kliknutí na "Kontakty" v menu první stránky
  const contactLink = document.querySelector("a[href='#contacts']");
  if (contactLink && contactBox) {
    contactLink.addEventListener("click", function (e) {
      e.preventDefault();

      const headerHeight = document.querySelector("header").offsetHeight;
      const targetPosition = contactBox.offsetTop - headerHeight - 40;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      triggerBlinkEffect();
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const briefContainer = document.querySelector(".brief-container");
  const sipka = document.querySelector(".sipka");
  const moodboard = document.querySelector(".moodboard");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(briefContainer);
  observer.observe(sipka);
  observer.observe(moodboard);
});

document.addEventListener("DOMContentLoaded", function () {
  const skillsSection = document.querySelector("#skills-section");
  const iconBoxes = document.querySelectorAll(".icon-box");

  function showIcons() {
    console.log("🚀 Funkce showIcons() byla spuštěna!");
    const iconBoxes = document.querySelectorAll(".icon-box");

    iconBoxes.forEach((box, index) => {
      setTimeout(() => {
        box.style.opacity = "1";
        box.style.transform = "translateY(0) scale(1)";
      }, (index + 1) * 300); // Zpomalené pořadí
    });
  }

  // **IntersectionObserver sleduje celou sekci, ne jen jednotlivé ikonky**
  const observer = new IntersectionObserver(
    (entries, observer) => {
      if (entries[0].isIntersecting) {
        showIcons();
        observer.disconnect(); // Odpojíme, aby se animace spustila jen jednou
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(skillsSection);

  // **Kliknutí na odkaz v menu / hlavním boxu**
  document.querySelectorAll("a[href='#skills-section']").forEach((link) => {
    link.addEventListener("click", () => {
      setTimeout(showIcons, 500); // Počkej 500ms a pak spusť animaci
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const pokladyLogo = document.querySelector(".poklady-logo");

  function showLogo() {
    if (pokladyLogo) {
      pokladyLogo.classList.add("show");
    }
  }

  // **IntersectionObserver pro normální scroll**
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          showLogo();
          observer.disconnect(); // Zabrání opakovanému spouštění
        }
      });
    },
    { threshold: 0.3 }
  );

  if (pokladyLogo) observer.observe(pokladyLogo);

  // **Spuštění animace při prokliku z menu / jiných částí stránky**
  document.querySelectorAll("a[href='#poklady-section']").forEach((link) => {
    link.addEventListener("click", (e) => {
      setTimeout(showLogo, 500); // Počkej půl sekundy a pak spusť animaci
    });
  });
});

function openModal(imgElement) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");

  modal.style.display = "flex";
  setTimeout(() => modal.classList.add("show"), 10); // Přidá třídu .show po 10ms
  modalImg.src = imgElement.src;
}

// Funkce pro zavření modalu s jemným efektem
function closeModal() {
  const modal = document.getElementById("imageModal");

  modal.classList.remove("show"); // Odebere třídu .show pro plynulé schování
  setTimeout(() => {
    modal.style.display = "none";
  }, 400); // Počká, až skončí animace, než modal zmizí
}

document.addEventListener("DOMContentLoaded", function () {
  const boxes = document.querySelectorAll(".poklady-row");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target); // Zabráníme opakovanému spuštění
        }
      });
    },
    { threshold: 0.6 } // Box se aktivuje, když je z 60 % vidět
  );

  boxes.forEach((box) => observer.observe(box));
});

document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll(".vizitka-img-wrapper img");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Nastavíme každému obrázku jinou dobu zpoždění
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * 400); // Každý obrázek se objeví o 400ms později než předchozí

          observer.unobserve(entry.target); // Přestaneme sledovat už zobrazené
        }
      });
    },
    { threshold: 0.2 } // Aktivuje se, když je 20% obrázku viditelné
  );

  images.forEach((image) => observer.observe(image));
});

document.addEventListener("DOMContentLoaded", function () {
  const wireframeImg = document.querySelector(".wireframe-img");

  function revealOnScroll() {
    const rect = wireframeImg.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight * 0.9) {
      wireframeImg.classList.add("visible");
      window.removeEventListener("scroll", revealOnScroll); // Animace jen jednou
    }
  }

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // Spustí se i hned po načtení
});
