import React from 'react';

const Blurb = ({ Header, Body, link, linkOpensTab }) => {
  const content = (
    <div className="mt-2 px-2 rounded-lg block no-underline text-inherit">
      <h3 className="font-semibold text-base opacity-80">{Header}</h3>
      <p className="text-sm opacity-50">{Body}</p>
    </div>
  );

  if (link) {
    return (
      <a
        href={link}
        target={linkOpensTab ? '_blank' : '_self'}
        rel={linkOpensTab ? 'noopener noreferrer' : undefined}
        className="block hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer no-underline text-inherit"
      >
        {content}
      </a>
    );
  }

  return content;
};

export default Blurb;
