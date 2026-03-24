/* =======================================================
   Djm events - Main JavaScript
   Handles: Navbar scroll, hamburger, animations,
            counter, form handling, particles
   ======================================================= */

"use strict";

// ===== NAVBAR: Scroll Behaviour =====
(function () {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      // Only remove 'scrolled' on home page (which starts transparent)
      if (
        !navbar.classList.contains("scrolled") ||
        document.body.classList.contains("home")
      ) {
        navbar.classList.remove("scrolled");
      }
    }
  }

  // Pages other than home always keep the scrolled style
  const isHomePage = document.querySelector(".hero") !== null;
  if (!isHomePage) {
    navbar.classList.add("scrolled");
  } else {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }
})();

// ===== HAMBURGER MENU =====
(function () {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open"); // For CSS animation
    hamburger.setAttribute("aria-expanded", isOpen);
    
    // Toggle overlay if exists
    const overlay = document.querySelector(".nav-overlay");
    if (overlay) overlay.classList.toggle("active", isOpen);
    
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Close when a nav link is clicked
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Close on outside click or overlay click
  document.addEventListener("click", function (e) {
    const overlay = document.querySelector(".nav-overlay");
    if (
      (!navLinks.contains(e.target) && !hamburger.contains(e.target)) ||
      e.target === overlay
    ) {
      closeMenu();
    }
  });

  function closeMenu() {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    const overlay = document.querySelector(".nav-overlay");
    if (overlay) overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
})();

// ===== INTERSECTION OBSERVER: Fade-in animations =====
(function () {
  const elements = document.querySelectorAll(".fade-in");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
})();

// ===== ANIMATED COUNTER (Home page stats) =====
(function () {
  const counters = document.querySelectorAll(".stat-number[data-target]");
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-target"), 10);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });
})();

// ===== HERO PARTICLES =====
(function () {
  const container = document.getElementById("particles");
  if (!container) return;

  const count = 28;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 20}%;
      width: ${size}px;
      height: ${size}px;
      --duration: ${Math.random() * 8 + 5}s;
      --delay: ${Math.random() * 6}s;
    `;
    container.appendChild(p);
  }
})();

// ===== CONTACT FORM HANDLING =====
(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const successMsg = document.getElementById("contactSuccess");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("contact-name");
    const email = document.getElementById("contact-email");
    const message = document.getElementById("contact-message");
    const btn = document.getElementById("contact-submit-btn");

    // Simple validation
    let valid = true;

    [name, email, message].forEach((field) => {
      if (!field.value.trim()) {
        field.style.borderColor = "#e05454";
        field.style.background = "rgba(224,84,84,0.05)";
        valid = false;
      } else {
        field.style.borderColor = "var(--gold)";
        field.style.background = "var(--white)";
      }
    });

    if (!valid) return;

    // Simulate submission
    btn.textContent = "Sending...";
    btn.disabled = true;
    btn.style.opacity = "0.75";

    setTimeout(function () {
      if (successMsg) {
        successMsg.style.display = "block";
        successMsg.style.animation = "fadeInUp 0.5s ease both";
      }
      form.reset();
      btn.textContent = "Send Message ✦";
      btn.disabled = false;
      btn.style.opacity = "";

      // Re-style inputs
      [name, email, message].forEach((f) => {
        f.style.borderColor = "";
        f.style.background = "";
      });
    }, 1400);
  });

  // Live field validation feedback
  ["contact-name", "contact-email", "contact-message"].forEach((id) => {
    const field = document.getElementById(id);
    if (!field) return;
    field.addEventListener("input", function () {
      if (this.value.trim()) {
        this.style.borderColor = "var(--gold)";
        this.style.background = "var(--white)";
      }
    });
  });
})();

// ===== BOOKING FORM HANDLING =====
(function () {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  const successMsg = document.getElementById("bookingSuccess");
  const progressFill = document.getElementById("progressFill");
  const steps = document.querySelectorAll(".booking-step");

  // Track progress on change
  const requiredFields = form.querySelectorAll("[required]");

  form.addEventListener("input", updateProgress);
  form.addEventListener("change", updateProgress);

  function updateProgress() {
    let filled = 0;
    requiredFields.forEach((field) => {
      if (field.type === "checkbox") {
        if (field.checked) filled++;
      } else if (field.value.trim()) {
        filled++;
      }
    });
    const pct = Math.round((filled / requiredFields.length) * 100);
    if (progressFill) progressFill.style.width = pct + "%";

    // Update step indicators
    if (steps.length >= 3) {
      steps[0].classList.toggle("active", pct >= 0);
      steps[1].classList.toggle("active", pct >= 40);
      steps[2].classList.toggle("active", pct >= 80);
    }
  }

  // Set minimum date to today
  const dateInput = document.getElementById("book-date");
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const btn = document.getElementById("booking-submit-btn");
    let valid = true;

    requiredFields.forEach((field) => {
      if (field.type === "checkbox") {
        if (!field.checked) {
          valid = false;
          field.style.outline = "2px solid #e05454";
        } else {
          field.style.outline = "";
        }
      } else if (!field.value.trim()) {
        field.style.borderColor = "#e05454";
        field.style.background = "rgba(224,84,84,0.05)";
        valid = false;
      } else {
        field.style.borderColor = "var(--gold)";
        field.style.background = "var(--white)";
      }
    });

    if (!valid) {
      const firstError = form.querySelector(
        '[required]:invalid, [style*="e05454"]',
      );
      if (firstError)
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Gather form data
    const fullName = document.getElementById("book-fullname").value;
    const email = document.getElementById("book-email").value;
    const phone = document.getElementById("book-phone").value;
    const eventType = document.getElementById("book-event-type").value;
    const date = document.getElementById("book-date").value;
    const location = document.getElementById("book-location").value;
    const guests = document.getElementById("book-guests").value;
    const requirements = document.getElementById("book-requirements").value;

    // Construct WhatsApp message
    const message = `*Booking Inquiry from Djm Events*\n` +
      `---------------------------------\n` +
      `👤 *Name:* ${fullName}\n` +
      `✉ *Email:* ${email}\n` +
      `📞 *Phone:* ${phone}\n` +
      `🎉 *Event:* ${eventType}\n` +
      `📅 *Date:* ${date}\n` +
      `📍 *Location:* ${location}\n` +
      `👥 *Guests:* ${guests || "Not specified"}\n` +
      `📝 *Requirements:* ${requirements || "No special requests"}`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919578380405?text=${encodedMessage}`;

    // Submit animation
    btn.textContent = "Redirecting to WhatsApp...";
    btn.disabled = true;
    btn.style.opacity = "0.75";
    if (progressFill) progressFill.style.width = "100%";

    setTimeout(function () {
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, "_blank");

      // Show success message and hide form
      form.style.display = "none";
      if (successMsg) {
        successMsg.style.display = "block";
        successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 1200);
  });
})();

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

// ===== DETAILS element: toggle + icon =====
document.querySelectorAll("details").forEach((det) => {
  const summary = det.querySelector("summary");
  const icon = summary ? summary.querySelector("span:last-child") : null;
  if (!icon) return;
  det.addEventListener("toggle", () => {
    icon.textContent = det.open ? "−" : "+";
  });
});
