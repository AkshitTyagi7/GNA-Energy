// Menu.tsx
import React, { useState } from 'react';

interface SubfilterProps {
  subfilter: string;
}

const Subfilter: React.FC<SubfilterProps> = ({ subfilter }) => (
  <li className="pl-4">{subfilter}</li>
);

interface FilterProps {
  filter: { name: string; subfilters: string[] };
  onClick: () => void;
}

const Filter: React.FC<FilterProps> = ({ filter, onClick }) => (
  <li
    className="cursor-pointer hover:bg-gray-200 transition duration-300"
    onClick={onClick}
  >
    {filter.name}
  </li>
);

interface MenuProps {
  data: { filters: { name: string; subfilters: string[] }[] };
}

const Menu: React.FC<MenuProps> = ({ data }) => {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const handleFilterClick = (filterName: string) => {
    setSelectedFilter(filterName === selectedFilter ? null : filterName);
  };

  return (
    <div className="w-64 border-r border-gray-300">
      <ul>
        {data.filters.map((filter) => (
          <Filter
            key={filter.name}
            filter={filter}
            onClick={() => handleFilterClick(filter.name)}
          />
        ))}
      </ul>
      {selectedFilter && (
        <div className="ml-4 mt-2">
          <h2 className="text-lg font-semibold">{selectedFilter}</h2>
          <ul>
            {data.filters
              .find((filter) => filter.name === selectedFilter)
              ?.subfilters.map((subfilter) => (
                <Subfilter key={subfilter} subfilter={subfilter} />
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Menu;
