"use client";

import { useState, useEffect } from "react";

interface StreetAutocompleteProps {
  city: string;
  value: string;
  onChange: (street: string) => void;
}

export default function StreetAutocomplete({
  city,
  value,
  onChange,
}: StreetAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSearch = async (query: string) => {
    if (query.length < 3) return;

    const API_KEY = "07aa32baff66a4622cc081f9f4b887e2fe7e433a";
    try {
      const response = await fetch(
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${API_KEY}`,
          },
          body: JSON.stringify({
            query: `${city}, ${query}`,
            count: 5,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(
          data.suggestions.map((s: any) => s.data.street_with_type || s.value)
        );
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          handleSearch(e.target.value);
        }}
        placeholder="Введите улицу"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion}
              onClick={() => {
                onChange(suggestion);
                setSuggestions([]);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
