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
    highlight: true,

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
    inset-shadow-[1px_1px_2px_-1px_rgba(255,255,255,.72)]
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

  const renderItem = (item, depth = 0, isLastChild = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isChild = depth > 0;

    return (
      <Card
        key={item.id}
        title={item.name}
        chips={item.chips}
        image={item.icon}
        link={item.link}
        linkCreatesTab={false}
        className={
          isChild && isLastChild
            ? "transition-all duration-200 ease-in-out border-0 border-b-0 !rounded-none inset-shadow-none text-base-content/80 w-full m-0 p-0 mt-4 shadow-[inset_0_-20px_20px_-10px_rgba(255,255,255,0)] hover:shadow-[inset_0_-20px_20px_-10px_rgba(255,255,255,0.15)]" // Last child styling
            : isChild
              ? "transition-all duration-200 ease-in-out border-0 border-b-1 !rounded-none inset-shadow-none text-base-content/80 w-full m-0 p-0 mt-4 shadow-[inset_0_0px_0px_-10px_rgba(255,255,255,0)] hover:shadow-[inset_0_-20px_20px_-10px_rgba(255,255,255,0.15)]" // Child styling
              : item.highlight
                ? "bg-base-content/4 text-base-content p-4 mt-2 mb-2 w-full"
                : "bg-transparent text-base-content mt-2 w-full"
        }
      >
        {hasChildren &&
          item.children.map((child, index, array) => {
            const isLastChild = index === array.length - 1;
            return renderItem(child, depth + 1, isLastChild);
          })}
      </Card>
    );
  };

  return (
    <div className="w-full">
      <div className="card w-full max-w-4xl mx-auto">
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mt-4">
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
        <div className="grid">
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
