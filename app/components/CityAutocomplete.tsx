"use client";

import { useState } from "react";

interface CityAutocompleteProps {
  value: string;
  onChange: (city: string) => void;
}

export default function CityAutocomplete({
  value,
  onChange,
}: CityAutocompleteProps) {
  const cities = ["Москва", "Санкт-Петербург"]; // Можно расширить список

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
    >
      {cities.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  );
}
