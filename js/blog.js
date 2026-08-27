/* ============================================================
   BLOG.JS — Blog-specific JavaScript
   Handles: category tab filtering, search, empty state
   Loaded on: blog/index.html, blog/blog-post-*.html
   Depends on: script.js (loaded first for theme + nav)
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  // ── Category Tabs ──────────────────────────────────────
  const tabs    = document.querySelectorAll(".blog-tab");
  const posts   = document.querySelectorAll("#blogPostsGrid .blog-card");
  const emptyMsg = document.getElementById("blogEmpty");

  function filterPosts(filter) {
    let visible = 0;
    posts.forEach(function (post) {
      const match = filter === "all" || post.dataset.category === filter;
      post.style.display = match ? "" : "none";
      if (match) visible++;
    });
    if (emptyMsg) emptyMsg.classList.toggle("hidden", visible > 0);
  }

  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        // Reset active state
        tabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");

        // Clear search when switching tabs
        if (searchInput) searchInput.value = "";
        if (searchClear) searchClear.classList.add("hidden");
        if (searchCount) searchCount.textContent = "";

        filterPosts(tab.dataset.filter);
      });
    });
  }

  // ── Blog Search ────────────────────────────────────────
  const searchInput = document.getElementById("blogSearch");
  const searchClear = document.getElementById("searchClear");
  const searchCount = document.getElementById("searchCount");

  function runSearch(query) {
    const q = query.toLowerCase().trim();
    let visible = 0;

    posts.forEach(function (card) {
      const match = !q || card.innerText.toLowerCase().includes(q);
      card.style.display = match ? "" : "none";
      if (match) visible++;
    });

    if (searchCount) {
      searchCount.textContent = q
        ? visible + " result" + (visible !== 1 ? "s" : "")
        : "";
    }
    if (searchClear) searchClear.classList.toggle("hidden", !q);
    if (emptyMsg)    emptyMsg.classList.toggle("hidden", visible > 0);
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      // When typing, reset tabs to "All"
      tabs.forEach(function (t) { t.classList.remove("active"); });
      const allTab = document.querySelector('.blog-tab[data-filter="all"]');
      if (allTab) allTab.classList.add("active");
      posts.forEach(function (p) { p.style.display = ""; });

      runSearch(searchInput.value);
    });
  }

  if (searchClear) {
    searchClear.addEventListener("click", function () {
      searchInput.value = "";
      runSearch("");
      searchInput.focus();
    });
  }

});
