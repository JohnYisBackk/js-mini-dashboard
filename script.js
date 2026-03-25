// =============================================
// 1. SELECT DOM ELEMENTS
// =============================================

const metricsGrid = document.getElementById("metricsGrid");
const activityStream = document.getElementById("activityStream");
const overviewStack = document.getElementById("overviewStack");

const exportBtn = document.querySelector(".topbar__action");
const analyticsBtn = document.querySelector(".spotlight__btn--primary");
const manageDataBtn = document.querySelector(".spotlight__btn--ghost");

// =============================================
// 2. DATA / STATE
// =============================================
let overviewStats = [
  {
    label: "Bounce Rate",
    value: 32,
  },
  {
    label: "Engagement",
    value: 74,
  },
  {
    label: "Retention",
    value: 61,
  },
  {
    label: "Goal Progress",
    value: 88,
  },
];

let recentEvents = [
  {
    id: 1,
    title: "New order received",
    description: "Order #2048 was placed by a returning customer.",
    time: "2m ago",
    type: "blue",
  },
  {
    id: 2,
    title: "Subscription upgraded",
    description: "A user switched from Starter to Pro plan.",
    time: "18m ago",
    type: "green",
  },
  {
    id: 3,
    title: "Performance spike detected",
    description: "Traffic increased by 22% in the last hour.",
    time: "1h ago",
    type: "violet",
  },
  {
    id: 4,
    title: "Payout completed",
    description: "Monthly payout was successfully processed.",
    time: "3h ago",
    type: "orange",
  },
];

let dashboardStats = [
  {
    title: "Revenue",
    value: "$24,580",
    change: "+8.2%",
    trend: "up",
    note: "Compared to last month",
  },
  {
    title: "Users",
    value: "12,450",
    change: "+3.9%",
    trend: "up",
    note: "Active users this week",
  },
  {
    title: "Orders",
    value: "1,284",
    change: "-1.4%",
    trend: "down",
    note: "Processed in the last 7 days",
  },
  {
    title: "Conversion",
    value: "6.8%",
    change: "+5.1%",
    trend: "up",
    note: "Average conversion rate",
  },
];

let selectedFilter = "weekly";

// =============================================
// 3. STORAGE KEY
// =============================================

const storageKey = "mini-dashboard-data";

// =============================================
// 4. SAVE DATA TO LOCAL STORAGE
// =============================================

function saveData() {
  const dataToSave = {
    dashboardStats: dashboardStats,
    recentEvents: recentEvents,
    overviewStats: overviewStats,
    selectedFilter: selectedFilter,
  };
  localStorage.setItem(storageKey, JSON.stringify(dataToSave));
}

// =============================================
// 5. LOAD DATA FROM LOCAL STORAGE
// =============================================

function loadData() {
  let savedData = localStorage.getItem(storageKey);

  if (!savedData) return;

  const parsedData = JSON.parse(savedData);

  dashboardStats = parsedData.dashboardStats || [];
  recentEvents = parsedData.recentEvents || [];
  overviewStats = parsedData.overviewStats || [];
  selectedFilter = parsedData.selectedFilter || "weekly";
}

// =============================================
// 6. RENDER SUMMARY CARDS
// =============================================

function renderSummaryCards() {
  metricsGrid.innerHTML = "";

  dashboardStats.forEach(function (stat, index) {
    const directionClass = index % 2 === 0 ? "reveal-left" : "reveal-right";

    const cardHTML = `
    <article class="metric-tile reveal ${directionClass}">
        <div class="metric-tile__top">
          <span class="metric-tile__name">${stat.title}</span>
          <span class="metric-tile__trend metric-tile__trend--${stat.trend}">
            ${stat.change}
          </span>
        </div>
        <h3 class="metric-tile__value">${stat.value}</h3>
        <p class="metric-tile__note">${stat.note}</p>
      </article>
    `;

    metricsGrid.insertAdjacentHTML("beforeend", cardHTML);
  });
}

// =============================================
// 7. RENDER RECENT ACTIVITY
// =============================================

function renderRecentActivity() {
  activityStream.innerHTML = "";

  recentEvents.forEach(function (event, index) {
    const directionClass = index % 2 === 0 ? "reveal-left" : "reveal-right";

    const activityHTML = `
      <div class="activity-row reveal ${directionClass}">
        <div class="activity-row__dot activity-row__dot--${event.type}"></div>
        <div class="activity-row__content">
          <h4 class="activity-row__title">${event.title}</h4>
          <p class="activity-row__text">${event.description}</p>
        </div>
        <span class="activity-row__time">${event.time}</span>
      </div>
    `;

    activityStream.insertAdjacentHTML("beforeend", activityHTML);
  });
}

// =============================================
// 8. RENDER OVERVIEW / PROGRESS BARS
// =============================================

function renderOverview() {
  overviewStack.innerHTML = "";

  overviewStats.forEach(function (item, index) {
    const directionClass = index % 2 === 0 ? "reveal-left" : "reveal-right";

    const overviewHTML = `
     <div class="overview-item reveal ${directionClass}">
        <div class="overview-item__meta">
          <span>${item.label}</span>
          <strong>${item.value}%</strong>
        </div>
        <div class="overview-item__track">
          <div class="overview-item__fill" style="width: ${item.value}%"></div>
        </div>
      </div>
    `;

    overviewStack.insertAdjacentHTML("beforeend", overviewHTML);
  });
}

// =============================================
// 9. ADD NEW ACTIVITY ITEM
// =============================================

function addActivityItem(activityData) {
  const newActivity = {
    id: Date.now(),
    title: activityData.title,
    description: activityData.description,
    time: activityData.time,
    type: activityData.type,
  };

  recentEvents.unshift(newActivity);
  saveData();
  renderRecentActivity();
  refreshRevealAnimations();
}

// =============================================
// 10. UPDATE DASHBOARD VALUES
// =============================================

function updateDashboardStats(updatedStats) {
  dashboardStats = updatedStats;
  saveData();
  renderSummaryCards();
  refreshRevealAnimations();
}

// =============================================
// 11. BUTTON EVENTS
// =============================================

exportBtn.addEventListener("click", function () {
  const dataToExport = {
    dashboardStats,
    recentEvents,
    overviewStats,
    selectedFilter,
  };

  const jsonData = JSON.stringify(dataToExport, null, 2);

  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "dashboard-data.json";
  link.click();

  URL.revokeObjectURL(url);
});

analyticsBtn.addEventListener("click", function () {
  document.querySelector(".content-grid").scrollIntoView({
    behavior: "smooth",
  });
});

manageDataBtn.addEventListener("click", function () {
  alert("Manage date feature coming soon...");
});

// =============================================
// 12. FILTER / RANGE SWITCHING
// =============================================

function handleRangeChange(range) {
  selectedFilter = range;

  if (range === "daily") {
    dashboardStats = [
      {
        title: "Revenue",
        value: "$3,200",
        change: "+1.2%",
        trend: "up",
        note: "Compared to yesterday",
      },
      {
        title: "Users",
        value: "1,120",
        change: "+0.8%",
        trend: "up",
        note: "Active users today",
      },
      {
        title: "Orders",
        value: "98",
        change: "-0.5%",
        trend: "down",
        note: "Processed today",
      },
      {
        title: "Conversion",
        value: "5.9%",
        change: "+0.4%",
        trend: "up",
        note: "Today conversion rate",
      },
    ];
  }

  if (range === "weekly") {
    dashboardStats = defaultStats;
  }

  if (range === "monthly") {
    dashboardStats = [
      {
        title: "Revenue",
        value: "$102,400",
        change: "+12.3%",
        trend: "up",
        note: "Compared to last month",
      },
      {
        title: "Users",
        value: "48,200",
        change: "+6.1%",
        trend: "up",
        note: "Monthly active users",
      },
      {
        title: "Orders",
        value: "5,420",
        change: "-1.8%",
        trend: "down",
        note: "Processed this month",
      },
      {
        title: "Conversion",
        value: "7.4%",
        change: "+1.1%",
        trend: "up",
        note: "Monthly conversion rate",
      },
    ];
  }

  saveData();
  renderSummaryCards();
  refreshRevealAnimations();
}

// =============================================
// 14. SETUP REVEAL ANIMATIONS
// =============================================

function setupRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  revealElements.forEach(function (element, index) {
    element.classList.remove(
      "reveal-delay-1",
      "reveal-delay-2",
      "reveal-delay-3",
      "reveal-delay-4",
    );

    if (index % 4 === 0) {
      element.classList.add("reveal-delay-1");
    } else if (index % 4 === 1) {
      element.classList.add("reveal-delay-2");
    } else if (index % 4 === 2) {
      element.classList.add("reveal-delay-3");
    } else {
      element.classList.add("reveal-delay-4");
    }
  });

  function handleRevealScroll() {
    revealElements.forEach(function (element) {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const isVisible =
        rect.top < windowHeight * 0.82 && rect.bottom > windowHeight * 0.18;

      if (isVisible) {
        element.classList.add("is-visible");
      } else {
        element.classList.remove("is-visible");
      }
    });
  }

  handleRevealScroll();

  window.addEventListener("scroll", handleRevealScroll);
  window.addEventListener("resize", handleRevealScroll);
}

// =============================================
// 16. REFRESH REVEAL ANIMATIONS
// =============================================

function refreshRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  revealElements.forEach(function (element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const isVisible =
      rect.top < windowHeight * 0.82 && rect.bottom > windowHeight * 0.18;

    if (isVisible) {
      element.classList.add("is-visible");
    } else {
      element.classList.remove("is-visible");
    }
  });
}

// =============================================
// 17. INITIALIZE APP
// =============================================

const defaultStats = [...dashboardStats];
const defaultEvents = [...recentEvents];
const defaultOverview = [...overviewStats];

function initDashboard() {
  loadData();

  if (dashboardStats.length === 0) {
    dashboardStats = defaultStats;
  }

  if (recentEvents.length === 0) {
    recentEvents = defaultEvents;
  }

  if (overviewStats.length === 0) {
    overviewStats = defaultOverview;
  }

  renderSummaryCards();
  renderRecentActivity();
  renderOverview();
  setupRevealAnimations();
}

initDashboard();
