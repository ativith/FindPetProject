import React, { createContext, useState } from "react";

export const FilterContext = createContext({
  filters: {},
  setFilters: () => {},
});

function FilterHandler({ children }) {
  const [filters, setFilters] = useState({});
  const value = {
    filters,
    setFilters,
  };
  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}

export default FilterHandler;
