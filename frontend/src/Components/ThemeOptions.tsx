// ThemeOptions.ts
import type { ThemeOption } from "../Components/ThemeGallery";

export const themeOptions: ThemeOption[] = [
  // Default theme (no background)
  {
    id: "none",
    name: "None",
    light: { className: "bg-white", preview: "" },
    dark: { className: "bg-[#101828]", preview: "" },
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
    dark: null,
  },
  {
    id: "galaxy",
    name: "Galaxy",
    light: {
      className:
        "bg-[url('/image_background/star.gif')] bg-cover bg-center bg-fixed",
      preview: "/image_background/star.gif",
    },
    dark: null,
  },
  {
    id: "fish",
    name: "Fish",
    light: {
      className:
        " bg-[url('/image_background/fish.gif')] bg-fixed bg-cover bg-center",
      preview: "/image_background/fish.gif",
    },
    dark: null,
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
    dark: null,
  },

  /* ===== DARK THEMES ===== */
  {
    id: "night_city",
    name: "Night City",
    dark: {
      className: "bg-[url('/image_background/light4.png')] bg-cover bg-center ",
      preview: "/image_background/light4.png",
    },
    light: null,
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
];
