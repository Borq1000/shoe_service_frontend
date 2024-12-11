import React, { useState, useRef } from "react";

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  value,
  onChange,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const API_KEY = "07aa32baff66a4622cc081f9f4b887e2fe7e433a";
  const autocompleteRef = useRef<HTMLDivElement>(null);

  const cleanCityName = (city: string) => {
    return city.replace(/^г\s+/i, "").trim(); // Удаляет префикс "г" и пробел
  };

  const fetchSuggestions = async (query: string) => {
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
          from_bound: { value: "city" },
          to_bound: { value: "city" },
        }),
      }
    );

    const data = await response.json();
    setSuggestions(data.suggestions.map((s: any) => s.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

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

  const handleSuggestionClick = (suggestion: string) => {
    const cleanedCity = cleanCityName(suggestion);
    onChange(cleanedCity); // Передаем очищенное название города
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
        placeholder="Введите город"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded-md mt-1 max-h-40 overflow-auto w-full">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-blue-100"
              onMouseDown={() => handleSuggestionClick(suggestion)} // Используем onMouseDown
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityAutocomplete;
