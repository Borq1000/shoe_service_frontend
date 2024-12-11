import React, { useState, useRef } from "react";

interface StreetAutocompleteProps {
  city: string;
  value: string;
  onChange: (
    value: string,
    latitude: number | null,
    longitude: number | null
  ) => void;
}

const StreetAutocomplete: React.FC<StreetAutocompleteProps> = ({
  city,
  value,
  onChange,
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const API_KEY = "07aa32baff66a4622cc081f9f4b887e2fe7e433a";
  const autocompleteRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = async (query: string) => {
    if (!city) return;

    const response = await fetch(
      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${API_KEY}`,
        },
        body: JSON.stringify({
          query,
          from_bound: { value: "street" },
          to_bound: { value: "street" },
          locations: [{ city }],
        }),
      }
    );

    const data = await response.json();
    setSuggestions(data.suggestions);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue, null, null);

    if (newValue) {
      fetchSuggestions(newValue);
    } else {
      setSuggestions([]);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (relatedTarget && autocompleteRef.current?.contains(relatedTarget)) {
      return;
    }
    setIsFocused(false);
    setSuggestions([]);
  };

  const cleanStreetName = (suggestion: any, city: string) => {
    // Извлекаем только название улицы без города и префиксов
    const rawStreet = suggestion.data.street_with_type || suggestion.value;
    const patternsToRemove = [`г ${city}`, city];
    let cleanedName = rawStreet;

    patternsToRemove.forEach((pattern) => {
      const regex = new RegExp(`^${pattern},?`, "i");
      cleanedName = cleanedName.replace(regex, "").trim();
    });

    return cleanedName;
  };

  const handleSuggestionClick = (suggestion: any) => {
    const lat = parseFloat(suggestion.data.geo_lat || null);
    const lon = parseFloat(suggestion.data.geo_lon || null);
    const cleanedStreet = cleanStreetName(suggestion, city);

    onChange(cleanedStreet, lat, lon);
    setSuggestions([]);
    setIsFocused(false);
  };

  return (
    <div
      className="relative"
      ref={autocompleteRef}
      onBlur={handleBlur}
      onFocus={handleFocus}
    >
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder="Введите улицу"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded-md mt-1 max-h-40 overflow-auto w-full">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-blue-100"
              onMouseDown={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StreetAutocomplete;
