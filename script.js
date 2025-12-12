/* =========================================================
   ED Assistant - script.js (drop-in)
   Includes:
   - goBack() with safe fallback
   - Fullscreen image overlay (tap background to close)
   - ESC to close
   - Scroll lock while overlay open
   - Fade in/out animation
   - Optional: auto-wire images with data-fullscreen="true"
   ========================================================= */

(function () {
  "use strict";

  // ---------- Back button (safe fallback) ----------
  window.goBack = function goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/index.html";
    }
  };

  // ---------- Fullscreen image ----------
  const OVERLAY_ID = "fullscreen-image-overlay";
  const SHOW_CLASS = "show";
  const FADE_MS = 150;

  function lockScroll(lock) {
    if (lock) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  }

  function handleEscClose(e) {
    if (e.key === "Escape") window.toggleFullscreenImage(null);
  }

  function ensureOverlayStyles() {
    // Only inject if your CSS doesn't already handle it.
    // This avoids breaking your existing genralPages.css theme.
    if (document.getElementById("fullscreen-overlay-style")) return;

    const style = document.createElement("style");
    style.id = "fullscreen-overlay-style";
    style.textContent = `
      body.general-page #${OVERLAY_ID}.fullscreen-image-overlay{
        opacity: 0;
        transition: opacity ${FADE_MS}ms ease;
      }
      body.general-page #${OVERLAY_ID}.fullscreen-image-overlay.${SHOW_CLASS}{
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }

  window.toggleFullscreenImage = function toggleFullscreenImage(src) {
    const existing = document.getElementById(OVERLAY_ID);

    // CLOSE
    if (existing) {
      existing.classList.remove(SHOW_CLASS);
      lockScroll(false);
      document.removeEventListener("keydown", handleEscClose);

      // allow fade-out animation
      window.setTimeout(() => {
        if (existing && existing.parentNode) existing.remove();
      }, FADE_MS);

      return;
    }

    // OPEN (only if valid src)
    if (!src) return;

    ensureOverlayStyles();

    const overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    overlay.className = "fullscreen-image-overlay";

    const img = document.createElement("img");
    img.src = src;
    img.alt = "Full-size image";

    overlay.appendChild(img);

    // Close if user taps the background (not the image)
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) window.toggleFullscreenImage(null);
    });

    document.body.appendChild(overlay);

    lockScroll(true);
    document.addEventListener("keydown", handleEscClose);

    // Fade in
    requestAnimationFrame(() => overlay.classList.add(SHOW_CLASS));
  };

  // ---------- Optional auto-wiring for images ----------
  // Add data-fullscreen="true" to any <img> you want to expand.
  // Example: <img class="image" data-fullscreen="true" src="..." />
  document.addEventListener("DOMContentLoaded", () => {
    const imgs = document.querySelectorAll('img[data-fullscreen="true"]');
    imgs.forEach((img) => {
      img.style.cursor = img.style.cursor || "zoom-in";
      img.addEventListener("click", () => {
        const src = img.currentSrc || img.src;
        window.toggleFullscreenImage(src);
      });
    });
  });
})();
