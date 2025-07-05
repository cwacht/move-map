import React, { createContext, useState } from 'react';

const SpotLocationContext = createContext(null);

const SpotLocationProvider = ({ children }) => {
  const [spotLocation, setSpotLocation] = useState({});

  return (
    <SpotLocationContext.Provider value={{ spotLocation, setSpotLocation }}>
      {children}
    </SpotLocationContext.Provider>
  );
};

export { SpotLocationContext, SpotLocationProvider };
