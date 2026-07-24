(() => {
  "use strict";

  const ITEMLOG_LABEL_RE = /\bitem[\s-]?log\b/i;
  const ITEMLOG_SELECTORS = [
    "#itemlogWorkspaceTab",
    "[data-workspace-view='itemlog']",
    "[data-catalog-view='itemlog']",
    "[data-sidebar-view='itemlog']",
  ].join(",");

  let overlay = null;
  let closeButton = null;
  let focusReturn = null;
  let redirecting = false;

  function isItemlogTarget(node) {
    const target = node?.closest?.("button, a, [role='tab'], [data-workspace-view], [data-catalog-view], [data-sidebar-view]");
    if (!target || target.closest("#itemlogMaintenanceOverlay")) return null;
    if (target.matches(ITEMLOG_SELECTORS)) return target;

    const accessibleText = [
      target.textContent,
      target.getAttribute("aria-label"),
      target.getAttribute("title"),
      target.getAttribute("href"),
    ].filter(Boolean).join(" ");

    return ITEMLOG_LABEL_RE.test(accessibleText) ? target : null;
  }

  function ensureDialog() {
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = "itemlogMaintenanceOverlay";
    overlay.className = "settings-overlay itemlog-maintenance-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
      <section class="settings-dialog itemlog-maintenance-dialog" data-itemlog-maintenance-dialog role="dialog" aria-modal="true" aria-labelledby="itemlogMaintenanceTitle" aria-describedby="itemlogMaintenanceDescription">
        <div class="settings-dialog-heading">
          <h2 id="itemlogMaintenanceTitle">Item-log is under maintenance</h2>
          <button class="settings-close-button" type="button" data-itemlog-maintenance-close aria-label="Close Item-log maintenance notice">&times;</button>
        </div>
        <div class="itemlog-maintenance-copy">
          <p id="itemlogMaintenanceDescription">The Item-log is currently under maintenance.</p>
        </div>
        <div class="itemlog-maintenance-actions">
          <button class="settings-reset-button itemlog-maintenance-close" type="button" data-itemlog-maintenance-close>Close</button>
        </div>
      </section>
    `;
    document.body.append(overlay);
    closeButton = overlay.querySelector("[data-itemlog-maintenance-close]");

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay || event.target.closest("[data-itemlog-maintenance-close]")) {
        closeNotice();
      }
    });
    return overlay;
  }

  function showNotice(source = null) {
    ensureDialog();
    focusReturn = source instanceof HTMLElement ? source : document.activeElement;
    overlay.hidden = false;
    closeButton?.focus();
  }

  function closeNotice() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    if (focusReturn instanceof HTMLElement && focusReturn.isConnected) focusReturn.focus();
    focusReturn = null;
  }

  function markTargets(root = document) {
    const candidates = new Set();
    if (root instanceof Element) {
      const target = isItemlogTarget(root);
      if (target) candidates.add(target);
    }
    root.querySelectorAll?.("button, a, [role='tab'], [data-workspace-view], [data-catalog-view], [data-sidebar-view]")
      .forEach((node) => {
        const target = isItemlogTarget(node);
        if (target) candidates.add(target);
      });

    candidates.forEach((target) => {
      target.classList.add("itemlog-maintenance-target");
      target.setAttribute("aria-disabled", "true");
      target.dataset.maintenanceReason = "itemlog";
      if (target.id === "itemlogWorkspaceTab") {
        target.title = "Item-log is under maintenance";
        target.setAttribute("aria-label", "Item-log - under maintenance");
      }
    });
  }

  function restoreMapIfNeeded({ announce = true } = {}) {
    const itemlogTab = document.querySelector("#itemlogWorkspaceTab");
    if (redirecting || itemlogTab?.getAttribute("aria-selected") !== "true") return;
    const mapTab = document.querySelector("#mapWorkspaceTab");
    if (!mapTab) return;

    redirecting = true;
    mapTab.click();
    queueMicrotask(() => {
      redirecting = false;
      if (announce) showNotice(itemlogTab);
    });
  }

  document.addEventListener("click", (event) => {
    const target = isItemlogTarget(event.target);
    if (!target) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showNotice(target);
  }, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay && !overlay.hidden) {
      event.preventDefault();
      closeNotice();
      return;
    }

    const target = isItemlogTarget(event.target);
    if (!target || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showNotice(target);
  }, true);

  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === "attributes") {
        markTargets(record.target);
        return;
      }
      record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) markTargets(node);
      });
    });
    restoreMapIfNeeded();
  });

  function initialize() {
    ensureDialog();
    markTargets();
    restoreMapIfNeeded();
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-selected"],
    });
  }

  window.showItemlogMaintenance = showNotice;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
