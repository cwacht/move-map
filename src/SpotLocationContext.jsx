// UserContext.js
import React, { createContext, useState } from 'react';

// Create the context
const SpotLocationContext = createContext(null);

// Create a provider component
const SpotLocationProvider = ({ children }) => {
  const [spotLocation, setSpotLocation] = useState({}); // Initial state

  // You can add functions to update the user state here
  const login = (username) => {
    setSpotLocation({ name: username });
  };

  const logout = () => {
    setSpotLocation({ name: 'Guest' });
  };

  const setNewSpotLocation = (location) => {
    setSpotLocation({ location: location });
  };

  return (
    <SpotLocationContext.Provider value={{ spotLocation, setNewSpotLocation, login, logout }}>
      {children}
    </SpotLocationContext.Provider>
  );
};

export { SpotLocationContext, SpotLocationProvider };
