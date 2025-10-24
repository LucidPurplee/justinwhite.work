import React, { useState } from "react";
import { TbChevronUp, TbChevronDown } from "react-icons/tb";

// 1. Create a wrapper component (unchanged)
const CardContentWrapper = ({ link, linkCreatesTab = true, children }) => {
  if (link) {
    // If a link exists, render an <a> tag
    return (
      <a 
        href={link} 
        target={linkCreatesTab ? "_blank" : "_self"}
        rel={linkCreatesTab ? "noopener noreferrer" : undefined}
        className="flex items-start justify-between p-2 rounded-lg"
      >
        {children}
      </a>
    );
  }
  // If no link, render a div
  return (
    <div className="flex items-start justify-between">
      {children}
    </div>
  );
};

const Card = ({
  className = "",
  title = "Name or Title",
  subtitle, // optional
  chips = [], // optional
  image, // optional
  link, // URL for the primary card content
  linkCreatesTab = true, // if true link will open a new tab, otherwise it won't
  visibleChildren = 0, // Children visible at the top
  visibleChildrenBottom = 0, // NEW PROP: Children visible at the bottom
  children, // Children are treated as sections
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Convert children to array
  const sections = React.Children.toArray(children);
  const totalSections = sections.length;
  
  // --- Section Index Calculation ---
  
  // 1. Top visible sections
  const sectionsAlwaysVisibleTop = Math.min(
    Math.max(0, visibleChildren),
    totalSections
  );
  
  // 2. Bottom visible sections (must leave space for top sections)
  // Ensure we don't count the same children as top and bottom
  const maxBottom = totalSections - sectionsAlwaysVisibleTop;
  const sectionsAlwaysVisibleBottom = Math.min(
    Math.max(0, visibleChildrenBottom),
    maxBottom
  );
  
  // 3. Collapsible sections (the rest)
  const collapsibleSectionsCount = 
    totalSections - sectionsAlwaysVisibleTop - sectionsAlwaysVisibleBottom;

  // Indices for slicing
  const topEndIndex = sectionsAlwaysVisibleTop;
  const bottomStartIndex = totalSections - sectionsAlwaysVisibleBottom;
  const collapsibleStartIndex = topEndIndex;
  const collapsibleEndIndex = bottomStartIndex;

  // Only allow toggle if there are hidden sections to show AND no primary link is set.
  const canToggle = collapsibleSectionsCount > 0 && !link;

  const toggleExpand = () => {
    // Prevent the toggle if the component is acting as a primary link
    if (canToggle) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    // Applied base styling and padding for the card wrapper (unchanged)
    <div
      className={`
      p-2 rounded-xl transition-all duration-400 ease-in-out
      w-full max-w-full border border-white/10 hover:border-white/20
      inset-shadow-[1px_1px_2px_-1px_rgba(255,255,255,.72)]
      ${className}
      `}
    >
      
      {/* 2. Primary Card Content/Link Area (unchanged) */}
      <CardContentWrapper link={link} linkCreatesTab={linkCreatesTab}>
        <div className="flex items-center gap-4">
          {image && (
            <div className="flex-shrink-0">
              <div className="h-12 w-12 aspect-square aspect-w-1 aspect-h-1 rounded-lg overflow-hidden drop-shadow-[0_2px_0.25rem_rgba(255,255,255,0.2)]">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/48x48/f3f4f6/374151?text=IMG";
                  }}
                />
              </div>
            </div>
          )}
          <div className="">
            <h1 className="text-base font-semibold leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm opacity-60">{subtitle}</p>
            )}
            {chips && chips.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {chips.map((chip, index) => (
                  <span
                    key={index}
                    className="badge badge-sm border border-white/20 inset-shadow-[1px_1px_2px_-1px_rgba(255,255,255,.72)]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      
        {/* 3. Conditional Toggle Button (Only if no link and sections are collapsible) */}
        {canToggle && ( // Use the new 'canToggle' logic
          <button
            onClick={toggleExpand}
            className="btn btn-circle transition-colors duration-400 flex-shrink-0"
            aria-expanded={isExpanded}
            aria-controls="rich-card-sections"
            aria-label = "toggle accordian"
          >
            {isExpanded ? <TbChevronUp /> : <TbChevronDown />}
          </button>
        )}
      </CardContentWrapper>

      {/* --- 4. Content Sections --- */}
      
      {/* Always Visible Children (TOP) */}
      {sectionsAlwaysVisibleTop > 0 && (
        <div className="mt-4 space-y-2"> {/* Added space-y-2 for spacing between sections */}
          {sections.slice(0, topEndIndex).map((section, index) => (
            <div key={`visible-top-${index}`} className="">
              {React.isValidElement(section)
                ? React.cloneElement(section, { sectionIndex: index })
                : section}
            </div>
          ))}
        </div>
      )}

      {/* Collapsible Sections Content (MIDDLE) */}
      {collapsibleSectionsCount > 0 && !link && (
        <div
          id="rich-card-sections"
          className="overflow-hidden transition-all duration-200 ease-in-out"
          style={{
            maxHeight: isExpanded ? "500px" : "0px", // Simplified maxHeight transition
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <div className="space-y-2"> {/* Added space-y-2 for spacing between sections */}
            {sections
              .slice(collapsibleStartIndex, collapsibleEndIndex)
              .map((section, index) => {
                const originalIndex = collapsibleStartIndex + index;
                
                return (
                  <div
                    key={originalIndex}
                    data-section-index={originalIndex}
                    className="transition-all duration-600 ease-in-out"
                    style={{
                      opacity: isExpanded ? 1 : 0,
                      transform: isExpanded ? "translateY(0)" : "translateY(-24px)",
                      transitionDelay: isExpanded ? `${index * 60}ms` : "0ms",
                    }}
                  >
                    <div className="">
                      {React.isValidElement(section)
                        ? React.cloneElement(section, { sectionIndex: originalIndex })
                        : section}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
      
      {/* Always Visible Children (BOTTOM) */}
      {sectionsAlwaysVisibleBottom > 0 && (
        <div 
          className="mt-2 space-y-2"
        >
          {/* Note: This map starts from 'bottomStartIndex' */}
          {sections.slice(bottomStartIndex).map((section, index) => {
            const originalIndex = bottomStartIndex + index;
            return (
              <div key={`visible-bottom-${originalIndex}`} className="">
                {React.isValidElement(section)
                  ? React.cloneElement(section, { sectionIndex: originalIndex })
                  : section}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Card;