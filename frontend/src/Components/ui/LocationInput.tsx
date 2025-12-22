import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

interface LocationSuggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder = "Enter location...",
  className = "",
  id,
  name,
  required = false,
}) => {
  const { darkMode } = useTheme();
  // Default Cambodian cities to show on focus when input is empty
  const defaultCambodianCities = [
    "Phnom Penh, Cambodia",
    "Siem Reap, Cambodia",
    "Sihanoukville, Cambodia",
    "Battambang, Cambodia",
    "Kampong Cham, Cambodia",
    "Kampong Speu, Cambodia",
    "Kampot, Cambodia",
    "Takeo, Cambodia",
    "Kandal, Cambodia",
  ];
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const debounceTimerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const mapDefaultCitiesToSuggestions = (cities: string[]) =>
    cities.map((c, i) => ({
      place_id: `default-${i}`,
      display_name: c,
      lat: "",
      lon: "",
    }));

  const fetchLocationSuggestions = async (query: string) => {
    if (query.length < 1) {
      // don't return empty; keep suggestions handling to focus handler.
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      // First try restricting to Cambodia (country code: kh)
      const khUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1&limit=8&countrycodes=kh&dedupe=1`;

      let response = await fetch(khUrl, {
        headers: { "User-Agent": "QuestifyApp/1.0" },
      });

      let data: LocationSuggestion[] = [];
      if (response.ok) {
        data = await response.json();
      }

      // If no Cambodian results, fallback to global results
      if (!data || data.length === 0) {
        const globalUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&addressdetails=1&limit=8&dedupe=1`;
        response = await fetch(globalUrl, {
          headers: { "User-Agent": "QuestifyApp/1.0" },
        });
        if (response.ok) {
          data = await response.json();
        }
      }

      // Format display name to "City, Country" where possible
      const formattedSuggestions = data.map((item) => ({
        ...item,
        display_name: formatLocationName(item.display_name),
      }));

      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatLocationName = (fullName: string): string => {
    // Prefer "City, Country" format and ensure Cambodia is shown for KH results
    const parts = fullName.split(",").map((p) => p.trim());
    if (parts.length >= 2) {
      const city = parts[0];
      const country = parts[parts.length - 1];
      return `${city}, ${country}`;
    }
    // fallback: append Cambodia if user likely searching in Cambodia
    return fullName;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setShowSuggestions(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      fetchLocationSuggestions(newValue);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    // Set the input value to the selected suggestion
    const formattedLocation = suggestion.display_name;
    setInputValue(formattedLocation);
    onChange(formattedLocation);

    // Focus input so keyboard interactions still work.
    inputRef.current?.focus();

    // Close suggestions after selection
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleInputFocus = () => {
    // If user focuses and input is empty, show default Cambodian city list
    if (!inputValue || inputValue.trim().length === 0) {
      setSuggestions(mapDefaultCitiesToSuggestions(defaultCambodianCities));
      setShowSuggestions(true);
      return;
    }

    // If there are existing suggestions, show them; otherwise fetch for current value
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    } else {
      fetchLocationSuggestions(inputValue);
    }
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget as Node)) {
        setShowSuggestions(false);
      }
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative"
      // ensure clicks anywhere in the control focus the input and open suggestions
      onClick={() => {
        inputRef.current?.focus();
        handleInputFocus();
      }}
    >
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onClick={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          className={`${className} ${isLoading ? "pr-10" : ""}`}
          autoComplete="off"
        />

        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className={`absolute z-50 w-full mt-1 rounded-xl shadow-lg max-h-60 overflow-y-auto border ${
            darkMode
              ? "bg-[#1d2942] border-[#2a3f5f] text-white"
              : "bg-white border-2 border-gray-200 text-gray-900"
          }`}
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              type="button"
              className={`w-full px-4 py-3 text-left hover:bg-blue-50 hover:text-blue-700 focus:outline-none transition-colors ${
                darkMode
                  ? "hover:bg-[#253548] hover:text-white"
                  : "border-b border-gray-100 last:border-b-0"
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking
            >
              <div className="flex items-center space-x-2">
                <svg
                  className={`w-4 h-4 ${
                    darkMode ? "text-gray-300" : "text-gray-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-white" : ""
                  }`}
                >
                  {suggestion.display_name}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
