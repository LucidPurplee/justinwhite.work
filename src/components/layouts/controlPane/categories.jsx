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
    name: "Google IT Automation",
    chips: ["Google", "6 Courses", "Reflection"],
    categories: ["Education", "Highlights", "All"],
    highlight: true,

    // Children can be other items
    children: [
      {
        id: 1,
        name: "Course Reflection",
        link: "/document?source=googitpy/reflection",
        chips: ["Document"],
      },
      {
        id: 2,
        name: "Google IT Automation w/ python",
        link: "https://coursera.org/share/d3fceb0b01b3897d3fbeb883b92e71c5",
        linkCreatesTab: true,
        chips: ["External Link"],
      },
      {
        id: 3,
        name: "Troubleshooting and Debugging Techniques",
        link: "/preview?source=https://coursera.org/share/d6bddc5cbe5c8d9ec24c814c11e5c7ba",
        chips: ["Preview", "Completed"],
      },
      {
        id: 4,
        name: "Introduction to Git and GitHub",
        link: "/preview?source=https://coursera.org/share/77c807ce1cc6c4157591cf0a70369f36",
        chips: ["Preview", "Completed"],
      },
      {
        id: 5,
        name: "Using Python to Interact with the Operating System",
        link: "/preview?source=https://coursera.org/share/04178093d8192042941c48ba04cc4688",
        chips: ["Preview", "Completed"],
      },
      {
        id: 6,
        name: "Configuration Management and the Cloud",
        link: "/preview?source=https://coursera.org/share/e7ee6e07934d7b11db97e397310c72ec",
        chips: ["Preview", "Completed"],
      },
      {
        id: 7,
        name: "Crash Course on Python",
        link: "/preview?source=https://coursera.org/share/a9fba9e9dfd9ef6dcd4d24c573291705",
        chips: ["Preview", "Completed"],
      },
      {
        id: 8,
        name: "Automating Real-World Tasks with Python",
        link: "/preview?source=https://coursera.org/share/5696ba41d35619b957274b031b026d64",
        chips: ["Preview", "Completed"],
      },
    ],
  },

  {
    id: "google-itSupport",
    type: "container", // Special type for parent cards
    icon: "/icos/Google.png",
    name: "Google IT Support",
    chips: ["Google", "5 Courses"],
    categories: ["Education", "All"],
    highlight: false,

    // Children can be other items
    children: [
      {
        id: 1,
        name: "Technical Support Fundamentals",
        chips: ["Completed"],
      },
      {
        id: 2,
        name: "The Bits and Bytes of Computer Networking",
        chips: ["Completed"],
      },
      {
        id: 3,
        name: "Operating Systems and You: Becoming a Power User",
        chips: ["Incomplete"],
      },
      {
        id: 4,
        name: "System Administration and IT Infrastructure Services",
        chips: ["Incomplete"],
      },
      {
        id: 5,
        name: "IT Security: Defense against the digital dark arts",
        chips: ["Incomplete"],
      },
    ],
  },

  {
    id: "sprkde",
    type: "container", // Special type for parent cards
    icon: "/icos/SprkPurp.png",
    name: "Colorama",
    chips: ["Sparkade", "Game Development"],
    categories: ["Projects", "Highlights", "Experience", "All"],
    highlight: false,
    link: "https://www.roblox.com/communities/731176287/Sparkade",
    linkCreatesTab: true,

    // Children can be other items
    children: [
      
    ],
  },

  {
    id: "snhu",
    type: "container", // Special type for parent cards
    icon: "/icos/SNHU.png",
    name: "Computer Science",
    chips: ["SNHU", "Bachelor's degree"],
    categories: ["Highlights", "Education", "All"],
    highlight: false,

    // Children can be other items
    children: [
      
    ],
  },

  {
    id: "google-projectManagement",
    //type: "container", // Special type for parent cards
    icon: "/icos/Google.png",
    name: "Google Project Management",
    chips: ["Google", "6 Courses"],
    categories: ["Education", "Highlights", "All"],
    highlight: false,

    // Children can be other items
    children: [
      {
        id: 1,
        name: "Foundations of Project Management",
        chips: ["Completed"],
      },
      {
        id: 2,
        name: "Project Initiation: Starting a Successful Project",
        chips: ["Completed"],
      },
      {
        id: 3,
        name: "Project Planning: Putting It All Together",
        chips: ["Completed"],
      },
      {
        id: 4,
        name: "Project Execution: Running the Project",
        chips: ["Incomplete"],
      },
      {
        id: 5,
        name: "Agile Project Management",
        chips: ["Incomplete"],
      },
      {
        id: 6,
        name: "Capstone: Applying Project Management in the Real World",
        chips: ["Incomplete"],
      },
    ],
  },
];

const CATEGORIES = [
  { name: "Highlights", icon: TbGridDots },
  { name: "Education", icon: TbSchool },
  { name: "Projects", icon: TbBolt },
  { name: "Experience", icon: TbRss },
  { name: "All", icon: TbGridDots },
];

const FilterChip = ({ name, icon: Icon, isSelected, onClick }) => {
  const baseClasses = `
    badge badge flex items-center gap-2 px-2 cursor-pointer transition-all duration-200 select-none whitespace-nowrap
    shadow-[inset_0_-1px_2px_rgba(255,255,255,.3)]
    hover:shadow-[inset_0_-1px_4px_rgba(255,255,255,.6)]!
    outline-white/20
    outline-1
    outline-offset-[-1px]
    border-0
    flex-1
    hover:flex-2
    backdrop-blur-lg
  `;

  const selectedClasses = `
    bg-white/64 hover:bg-white/72 flex-4 text-base-100 badge border-transparent border-0! border-b-2! border-white/32! shadow-[inset_0_-2px_4px_rgba(255,255,255,.3)]! hover:shadow-[inset_0_-2px_6px_rgba(255,255,255,.6)]!
  `;
  const unselectedClasses = `
    badge-ghost bg-transparent
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
        linkCreatesTab={item.linkCreatesTab || false}
        className={
          isChild && isLastChild
            ? "outline-0! border-white/20 transition-all duration-200 ease-in-out border-0 border-b-0 !rounded-none inset-shadow-none text-base-content/80 w-full m-0 p-0 mt-4 shadow-[inset_0_-20px_20px_-10px_rgba(255,255,255,0)] hover:shadow-[inset_0_-20px_20px_-10px_rgba(255,255,255,0.15)]" // Last child styling
            : isChild
              ? "outline-0! border-white/20 transition-all duration-200 ease-in-out border-0 border-b-1 !rounded-none inset-shadow-none text-base-content/80 w-full m-0 p-0 mt-4 shadow-[inset_0_0px_0px_-10px_rgba(255,255,255,0)] hover:shadow-[inset_0_-20px_20px_-10px_rgba(255,255,255,0.15)]" // Child styling
              : item.highlight
                ? "text-base-content p-4 w-full backdrop-blur-xs"
                : "text-base-contentw-full backdrop-blur-xs "
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
    <div className="w-full overflow-auto mt-4 p-2">
      <div className="card w-full max-w-4xl mx-auto">
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
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
        <div className="grid gap-2 my-2">
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
