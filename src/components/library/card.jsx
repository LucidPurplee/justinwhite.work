import React, { useState } from "react";
import { TbChevronUp, TbChevronDown } from "react-icons/tb";

// 1. Create a wrapper component
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
  link, // NEW PROP: URL for the primary card content
  linkCreatesTab = true, // if true link will open a new tab, otherwise it won't
  visibleChildren = 0,
  children, // Children are treated as collapsible sections
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Convert children to array and check if we have sections
  const sections = React.Children.toArray(children);
  const totalSections = sections.length;
  const hasSections = totalSections > 0;

  // Determine how many children should be visible when collapsed
  const sectionsAlwaysVisible = Math.min(
    Math.max(0, visibleChildren),
    totalSections
  );

  // The number of sections that are collapsible (hidden when collapsed)
  const collapsibleSectionsCount = totalSections - sectionsAlwaysVisible;

  // Only allow toggle if there are hidden sections to show AND no primary link is set.
  // We should NOT allow the expand action if the card is a clickable link.
  const canToggle = collapsibleSectionsCount > 0 && !link;

  const toggleExpand = () => {
    // Prevent the toggle if the component is acting as a primary link
    if (canToggle) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    // Applied base styling and padding for the card wrapper
    <div
      className={`
      p-2 rounded-xl transition-all duration-400 ease-in-out
      w-full max-w-full border border-white/10 hover:border-white/20
      inset-shadow-[1px_1px_2px_-.8px_rgba(255,255,255,.72)]
      ${className}
      `}
    >
      
      {/* 2. Use the wrapper component */}
      <CardContentWrapper link={link} linkCreatesTab={linkCreatesTab}>
        {/* Everything inside here is the clickable/primary content area */}
        <div className="flex items-center gap-4">
          {image && (
            <div className="flex-shrink-0">
              <div className="h-12 rounded-lg overflow-hidden">
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
                    className="badge badge-sm border border-white/20 inset-shadow-[1px_1px_2px_-.8px_rgba(255,255,255,.72)]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      
        {/* 3. Conditional Toggle Button (Only if no link) */}
        {collapsibleSectionsCount > 0 && !link && (
          <button
            onClick={toggleExpand}
            className="btn btn-circle transition-colors duration-400 flex-shrink-0"
            aria-expanded={isExpanded}
            aria-controls="rich-card-sections"
          >
            {isExpanded ? <TbChevronUp /> : <TbChevronDown />}
          </button>
        )}
      </CardContentWrapper>

      {/* 4. The rest of the card structure remains the same */}

      {/* Always Visible Children (sectionsAlwaysVisible > 0) */}
      {sectionsAlwaysVisible > 0 && (
        <div className="pt-2">
          {sections.slice(0, sectionsAlwaysVisible).map((section, index) => (
            <div key={`visible-${index}`} className="pb-0">
              {React.isValidElement(section)
                ? React.cloneElement(section, { sectionIndex: index })
                : section}
            </div>
          ))}
        </div>
      )}

      {/* Collapsible Sections Content */}
      {collapsibleSectionsCount > 0 && !link && (
        <div
          id="rich-card-sections"
          className="overflow-hidden transition-all duration-200 ease-in-out"
          style={{
            maxHeight: isExpanded ? "500px" : "0px",
            paddingTop: isExpanded ? "8px" : "0px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <div className="">
            {sections
              .slice(sectionsAlwaysVisible)
              .map((section, index) => {
                const originalIndex = sectionsAlwaysVisible + index;
                
                return (
                  <div
                    key={originalIndex}
                    data-section-index={originalIndex}
                    className="transition-all duration-600 ease-in-out mb-2"
                    style={{
                      opacity: isExpanded ? 1 : 0,
                      transform: isExpanded ? "translateY(0)" : "translateY(-24px)",
                      transitionDelay: isExpanded ? `${index * 60}ms` : "0ms",
                    }}
                  >
                    <div className="pb-0">
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
    </div>
  );
};

export default Card;