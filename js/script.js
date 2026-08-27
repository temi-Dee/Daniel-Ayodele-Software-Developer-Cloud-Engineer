/* ============================================================
   SCRIPT.JS — Main site JavaScript
   Handles: theme toggle, hamburger nav, navbar scroll,
            active nav on scroll, contact form
   Loaded on: index.html, contact.html, 404.html
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  // ── Light / Dark mode toggle ────────────────────────────
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  function applyTheme(mode) {
    if (mode === "light") {
      document.body.classList.add("light");
      if (themeIcon) {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
      }
    } else {
      document.body.classList.remove("light");
      if (themeIcon) {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
      }
    }
  }

  applyTheme(localStorage.getItem("theme") || "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next = document.body.classList.contains("light") ? "dark" : "light";
      localStorage.setItem("theme", next);
      applyTheme(next);
    });
  }

  // ── Hamburger menu ──────────────────────────────────────
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  function openMenu() {
    navLinks.classList.add("open");
    hamburger.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    navLinks.classList.remove("open");
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function (e) {
      e.stopPropagation();
      navLinks.classList.contains("open") ? closeMenu() : openMenu();
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", function (e) {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  // ── Navbar scroll shadow ────────────────────────────────
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener(
      "scroll",
      function () {
        navbar.style.boxShadow =
          window.scrollY > 20 ? "0 4px 30px rgba(0,0,0,0.5)" : "none";
      },
      { passive: true },
    );
  }

  // ── Active nav link on scroll (IntersectionObserver) ───
  const sections = document.querySelectorAll("section[id]");
  const navItems = Array.from(
    document.querySelectorAll(
      '.nav-links a[href^="#"], .nav-links a[href*="#"], .nav-links a[href="index.html"]',
    ),
  ).filter(function (a) {
    return !a.getAttribute("href").startsWith("blog");
  });

  function setActiveLink(id) {
    navItems.forEach(function (a) {
      a.classList.remove("nav-active");
    });
    navItems.forEach(function (a) {
      const href = a.getAttribute("href");
      if (href === "#" + id || href.endsWith("#" + id)) {
        a.classList.add("nav-active");
      }
    });
  }

  if (sections.length && navItems.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // ── Contact form ────────────────────────────────────────
  const form = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  if (!form) return;

  function showErr(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }

  function clearErrs() {
    [
      "firstNameErr",
      "lastNameErr",
      "emailErr",
      "topicErr",
      "messageErr",
    ].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.textContent = "";
    });
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrs();

    const firstName =
      (document.getElementById("firstName") || {}).value?.trim() || "";
    const lastName =
      (document.getElementById("lastName") || {}).value?.trim() || "";
    const email = (document.getElementById("email") || {}).value?.trim() || "";
    const topic = (document.getElementById("topic") || {}).value || "";
    const message =
      (document.getElementById("message") || {}).value?.trim() || "";

    let valid = true;
    if (!firstName) {
      showErr("firstNameErr", "First name is required.");
      valid = false;
    }
    if (!lastName) {
      showErr("lastNameErr", "Last name is required.");
      valid = false;
    }
    if (!email) {
      showErr("emailErr", "Email is required.");
      valid = false;
    } else if (!isValidEmail(email)) {
      showErr("emailErr", "Enter a valid email.");
      valid = false;
    }
    if (!topic) {
      showErr("topicErr", "Please select a topic.");
      valid = false;
    }
    if (!message) {
      showErr("messageErr", "Message cannot be empty.");
      valid = false;
    }
    if (!valid) return;

    const subject = encodeURIComponent(
      "Portfolio Contact: " + topic + " from " + firstName + " " + lastName,
    );
    const body = encodeURIComponent(
      "Name: " +
        firstName +
        " " +
        lastName +
        "\nEmail: " +
        email +
        "\nTopic: " +
        topic +
        "\n\nMessage:\n" +
        message,
    );

    window.open(
      "mailto:ayodeledaniel0240@gmail.com?subject=" + subject + "&body=" + body,
    );

    const waText = encodeURIComponent(
      "Hi Daniel! I reached out via your portfolio." +
        "\n\nName: " +
        firstName +
        " " +
        lastName +
        "\nEmail: " +
        email +
        "\nTopic: " +
        topic +
        "\n\nMessage: " +
        message,
    );
    window.open("https://wa.me/2349039062561?text=" + waText, "_blank");

    form.classList.add("hidden");
    if (formSuccess) {
      formSuccess.classList.remove("hidden");
      formSuccess.classList.add("visible");
    }
  });
});
