const fs = require('fs');
const content = fs.readFileSync('src/components/FarmersDashboard.tsx', 'utf-8');

// Replace the setActiveTab to just scroll
let updated = content.replace(
  /setActiveTab\(tab\.id as any\);/,
  `setActiveTab(tab.id as any);
              const el = document.getElementById("section-" + tab.id);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }`
);

// Remove the AnimatePresence modal wrapper start
updated = updated.replace(
  /<AnimatePresence mode="wait">[\s\S]*?\{\/\* Scrollable Content \*\/\}\s*<div className="overflow-y-auto p-4 sm:p-6 hide-scrollbar flex-1 relative">/,
  `<div className="flex flex-col gap-12 mt-8">`
);

// Remove the activeTab conditionals for rendering
updated = updated.replace(/\{activeTab === "weather" && \(/g, '{true && (');
updated = updated.replace(/\{activeTab === "prices" && \(/g, '{true && (');
updated = updated.replace(/\{activeTab === "assess" && \(/g, '{true && (');
updated = updated.replace(/\{activeTab === "diagnose" && \(/g, '{true && (');
updated = updated.replace(/\{activeTab === "list" && \(/g, '{true && (');

// Remove the modal wrapper end
updated = updated.replace(
  /<\/div><\/motion\.div><\/div>\)\}<\/AnimatePresence>/g,
  '</div>'
);

// We need to fix the ID targets. Let's make sure each section has an ID.
// Let's replace 'id="section-weather-tab"' with 'id="section-weather"', same for prices.
updated = updated.replace(/id="section-weather-tab"/g, 'id="section-weather"');
updated = updated.replace(/id="section-prices-tab"/g, 'id="section-prices"');

fs.writeFileSync('src/components/FarmersDashboard.tsx', updated);
console.log('Done reverting modal');
