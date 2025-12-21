// ThemeOptions.ts
import type { ThemeOption } from "./ThemeGallery";

export const themeOptions: ThemeOption[] = [
  // Default theme (no background)
  {
    id: "none",
    name: "None",
    light: { className: "bg-white", preview: "" },
    dark: { className: "bg-gray-900", preview: "" },
  },

  /* ===== LIGHT THEMES ===== */
  {
    id: "cute_fox",
    name: "Cute Fox",
    light: {
      className:
        "bg-[url('/image_background/light2.png')] bg-cover bg-center bg-scroll",
      preview: "/image_background/light2.png",
    },
    dark: null, // This theme is not available in dark mode
  },
  {
    id: "galaxy",
    name: "Galaxy",
    light: {
      className:
        "bg-[url('/image_background/star.gif')] bg-cover bg-center bg-fixed",
      preview: "/image_background/star.gif",
    },
    dark: null, // This theme is not available in dark mode
  },
  {
    id: "fish",
    name: "Fish",
    light: {
      className:
        " bg-[url('/image_background/fish.gif')] bg-fixed bg-cover bg-center",
      preview: "/image_background/fish.gif",
    },
    dark: null, // This theme is not available in dark mode
  },
  {
    id: "cat",
    name: "Cat",
    light: {
      className:
        "bg-[url('/image_background/cat.gif')] bg-cover bg-center bg-fixed ",
      preview: "/image_background/cat.gif",
    },
    dark: null,
  },
  {
    id: "waterflow",
    name: "Waterflow",
    light: {
      className:
        " bg-[url('/image_background/waterflow.gif')] bg-cover bg-center",
      preview: "/image_background/waterflow.gif",
    },
    dark: null, // This theme is not available in dark mode
  },

  // Add more light themes here with the same structure
  // {
  //   id: "another_light_theme",
  //   name: "Another Light Theme",
  //   light: {
  //     className: "bg-[url('/path/to/light-image.png')] bg-cover bg-center",
  //     preview: "/path/to/light-image.png",
  //   },
  //   dark: {
  //     className: "bg-gray-900",
  //     preview: "/path/to/light-image.png"
  //   },
  // },

  /* ===== DARK THEMES ===== */
  {
    id: "night_city",
    name: "Night City",
    dark: {
      className: "bg-[url('/image_background/light4.png')] bg-cover bg-center ",
      preview: "/image_background/light4.png",
    },
    light: null, // This theme is not available in light mode
  },
  {
    id: "starry_night",
    name: "Starry Night",
    dark: {
      className:
        "bg-[url('/image_background/night.png')] bg-cover bg-center bg-scroll",
      preview: "/image_background/night.png",
    },
    light: null,
  },
  // Add more dark themes here with the same structure
  // {
  //   id: "another_dark_theme",
  //   name: "Another Dark Theme",
  //   dark: {
  //     className: "bg-[url('/path/to/dark-image.png')] bg-cover bg-center",
  //     preview: "/path/to/dark-image.png",
  //   },
  //   light: {
  //     className: "bg-white",
  //     preview: "/path/to/dark-image.png"
  //   },
  // },
];
