/* Shared lightweight behaviors for all pages (no framework). */

(function () {
  function setupMobileNav() {
    const btn = document.getElementById("mobile-nav-button");
    const panel = document.getElementById("mobile-nav");
    if (!btn || !panel) return;

    function open() {
      panel.classList.remove("hidden");
      btn.setAttribute("aria-expanded", "true");
      document.documentElement.classList.add("overflow-hidden");
    }
    function close() {
      panel.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
      document.documentElement.classList.remove("overflow-hidden");
    }

    btn.addEventListener("click", function () {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      expanded ? close() : open();
    });
    panel.addEventListener("click", function (e) {
      const t = e.target;
      if (t && t.getAttribute && t.getAttribute("data-close") === "mobile-nav") close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  function setupRfqMailto() {
    const form = document.getElementById("rfq-form");
    if (!form) return;

    function field(name) {
      const el = form.elements[name];
      return el && typeof el.value === "string" ? el.value.trim() : "";
    }

    function showError(text) {
      const msg = document.createElement("div");
      msg.className = "mt-4 p-4 rounded-lg bg-error-container text-on-error-container text-sm font-medium";
      msg.textContent = text;
      form.appendChild(msg);
      setTimeout(() => msg.remove(), 6000);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const requiredNames = ["productCategory", "applicationType", "fullName", "company", "email"];
      const missing = requiredNames.filter((n) => !field(n));
      if (missing.length) {
        showError("Please fill the required fields: " + missing.join(", "));
        return;
      }

      const subject = "RFQ - " + field("productCategory") + " (" + field("company") + ")";
      const bodyLines = [
        "RFQ Details",
        "-------------------------",
        "Product Category: " + field("productCategory"),
        "Application Type: " + field("applicationType"),
        "",
        "Dimensions",
        "Width (mm): " + field("widthMm"),
        "Height (mm): " + field("heightMm"),
        "Operating Temp (°C): " + field("operatingTempC"),
        "",
        "Engineering Notes:",
        field("engineeringNotes"),
        "",
        "Contact",
        "Name: " + field("fullName"),
        "Company: " + field("company"),
        "Email: " + field("email"),
        "Phone/WhatsApp: " + field("phone"),
        "Location: " + field("location"),
        "",
        "Specs/Drawings Link:",
        field("attachmentsLink"),
      ];

      const mailto =
        "mailto:engineering@ventasdampers.com" +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(bodyLines.join("\n"));

      window.location.href = mailto;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setupMobileNav();
      setupRfqMailto();
    });
  } else {
    setupMobileNav();
    setupRfqMailto();
  }
})();

