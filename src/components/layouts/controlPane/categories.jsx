import React, { useState, useMemo } from "react";
import {
  TbBolt,
  TbGridDots,
  TbSchool,
  TbSpeakerphone,
  TbRss,
} from "react-icons/tb";
import Card from "../../library/card.jsx";

// Define your data structure with nesting support
const ALL_ITEMS = [
  {
    id: "google-itAuto",
    type: "container", // Special type for parent cards
    icon: "/icos/Google.png",
    name: "Google IT Automation w/ python",
    chips: ["Google", "6 Courses", "complete"],
    categories: ["Education", "Highlights", "All"],
    highlight: false,
    // Children can be other items
    children: [
      {
        id: 1,
        name: "Troubleshooting and Debugging Techniques",
        link: "/preview?source=https://coursera.org/share/d6bddc5cbe5c8d9ec24c814c11e5c7ba",
        chips: ["Completed"],
      },
      {
        id: 2,
        name: "Introduction to Git and GitHub",
        link: "/preview?source=https://coursera.org/share/77c807ce1cc6c4157591cf0a70369f36",
        chips: ["Completed"],
      },
      {
        id: 3,
        name: "Using Python to Interact with the Operating System",
        link: "/preview?source=https://coursera.org/share/04178093d8192042941c48ba04cc4688",
        chips: ["Completed"],
      },
      {
        id: 4,
        name: "Configuration Management and the Cloud",
        link: "/preview?source=https://coursera.org/share/e7ee6e07934d7b11db97e397310c72ec",
        chips: ["Completed"],
      },
      {
        id: 5,
        name: "Crash Course on Python",
        link: "/preview?source=https://coursera.org/share/a9fba9e9dfd9ef6dcd4d24c573291705",
        chips: ["Completed"],
      },
      {
        id: 6,
        name: "Automating Real-World Tasks with Python",
        link: "/preview?source=https://coursera.org/share/5696ba41d35619b957274b031b026d64",
        chips: ["Completed"],
      },
    ],
  },

  {
    id: "google-itSupport",
    //type: "container", // Special type for parent cards
    icon: "/icos/Google.png",
    name: "Google IT Support",
    chips: ["Google", "5 Courses"],
    categories: ["Education", "Highlights", "All"],
    highlight: false,
  },

  {
    id: "google-dataAnalytics",
    //type: "container", // Special type for parent cards
    icon: "/icos/Google.png",
    name: "Google Data Analytics",
    chips: ["Google", "8 Courses"],
    categories: ["Education", "Highlights", "All"],
    highlight: false,
  },

  {
    id: "google-projectManagement",
    //type: "container", // Special type for parent cards
    icon: "/icos/Google.png",
    name: "Google Project Management",
    chips: ["Google", "6 Courses"],
    categories: ["Education", "Highlights", "All"],
    highlight: false,
  },
];

const CATEGORIES = [
  { name: "Highlights", icon: TbGridDots },
  { name: "Education", icon: TbSchool },
  { name: "Experience", icon: TbBolt },
  { name: "All", icon: TbGridDots },
];

const FilterChip = ({ name, icon: Icon, isSelected, onClick }) => {
  const baseClasses = `
    badge badge-lg flex items-center gap-2 px-2 cursor-pointer transition-all duration-200 select-none whitespace-nowrap border-white/20 
    inset-shadow-[1px_1px_2px_-.8px_rgba(255,255,255,.72)]
  `;

  const selectedClasses = `
    badge bg-white/84 text-base-100 border-transparent gap-4 px-4
  `;
  const unselectedClasses = `
    badge-ghost
  `;

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
      aria-pressed={isSelected}
    >
      <Icon className="w-4 h-4" />
      <span>{name}</span>
    </button>
  );
};

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState("Highlights");
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Filter items based on category - only check root level
  const filteredItems = useMemo(() => {
    return ALL_ITEMS.filter((item) => 
      item.categories.includes(selectedCategory)
    );
  }, [selectedCategory]);

  const renderItem = (item) => {
    const hasChildren = item.children && item.children.length > 0;

    return (
      <Card
        key={item.id}
        title={item.name}
        chips={item.chips}
        image={item.icon}
        link={item.link}
        linkCreatesTab={false}
        className={item.highlight ? "bg-white/2 text-base-content p-4" : "bg-base-100 text-base-content"}
      >
        {hasChildren && item.children.map((child) => renderItem(child))}
      </Card>
    );
  };

  return (
    <div className="w-full">
      <div className="card w-full max-w-4xl mx-auto">
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 sm:gap-1 mt-2 mb-2">
          {CATEGORIES.map((category) => (
            <FilterChip
              key={category.name}
              name={category.name}
              icon={category.icon}
              isSelected={selectedCategory === category.name}
              onClick={() => handleCategoryChange(category.name)}
            />
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid gap-2">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => renderItem(item))
          ) : (
            <div>No items found for the category "{selectedCategory}".</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;