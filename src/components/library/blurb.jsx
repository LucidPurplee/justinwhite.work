import React from 'react';

const Blurb = ({ Header, Body }) => {
  return (
    <div className="mt-2 px-2 rounded-lg">
        <h3 className="font-semibold text-base opacity-80">{Header}</h3>
        <p className="text-sm opacity-50">{Body}</p>
  </div>
  );
};

export default Blurb;