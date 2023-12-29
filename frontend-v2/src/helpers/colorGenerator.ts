import hash from 'src/helpers/syncHash';
const defaultColors = {
  themeColors: [
    'rgb(var(--color-primary))',
    'rgb(var(--color-secondary))',
    'rgb(var(--color-tertiary))',
    'rgb(var(--color-white))',
    'rgb(var(--color-default))',
  ],
  defaultThemeColors: [
    '#5540c6',
    'f5f7fb',
    '#e5e7eb',
    '#ffffff',
    '#202124',
    'transparent',
  ],
  otherColors: [
    "#f8fafc",
    "#f1f5f9",
    "#e2e8f0",
    "#cbd5e1",
    "#94a3b8",
    "#64748b",
    "#475569",
    "#334155",
    "#1e293b",
    "#0f172a",
    "#020617",
    "#f9fafb",
    "#f3f4f6",
    "#e5e7eb",
    "#d1d5db",
    "#9ca3af",
    "#6b7280",
    "#4b5563",
    "#374151",
    "#1f2937",
    "#111827",
    "#030712",
    "#fafafa",
    "#f4f4f5",
    "#e4e4e7",
    "#d4d4d8",
    "#a1a1aa",
    "#71717a",
    "#52525b",
    "#3f3f46",
    "#27272a",
    "#18181b",
    "#09090b",
    "#fafafa",
    "#f5f5f5",
    "#e5e5e5",
    "#d4d4d4",
    "#a3a3a3",
    "#737373",
    "#525252",
    "#404040",
    "#262626",
    "#171717",
    "#0a0a0a",
    "#fafaf9",
    "#f5f5f4",
    "#e7e5e4",
    "#d6d3d1",
    "#a8a29e",
    "#78716c",
    "#57534e",
    "#44403c",
    "#292524",
    "#1c1917",
    "#0c0a09",
    "#fef2f2",
    "#fee2e2",
    "#fecaca",
    "#fca5a5",
    "#f87171",
    "#ef4444",
    "#dc2626",
    "#b91c1c",
    "#991b1b",
    "#7f1d1d",
    "#450a0a",
    "#fff7ed",
    "#ffedd5",
    "#fed7aa",
    "#fdba74",
    "#fb923c",
    "#f97316",
    "#ea580c",
    "#c2410c",
    "#9a3412",
    "#7c2d12",
    "#431407",
    "#fffbeb",
    "#fef3c7",
    "#fde68a",
    "#fcd34d",
    "#fbbf24",
    "#f59e0b",
    "#d97706",
    "#b45309",
    "#92400e",
    "#78350f",
    "#451a03",
    "#fefce8",
    "#fef9c3",
    "#fef08a",
    "#fde047",
    "#facc15",
    "#eab308",
    "#ca8a04",
    "#a16207",
    "#854d0e",
    "#713f12",
    "#422006",
    "#f7fee7",
    "#ecfccb",
    "#d9f99d",
    "#bef264",
    "#a3e635",
    "#84cc16",
    "#65a30d",
    "#4d7c0f",
    "#3f6212",
    "#365314",
    "#1a2e05",
    "#f0fdf4",
    "#dcfce7",
    "#bbf7d0",
    "#86efac",
    "#4ade80",
    "#22c55e",
    "#16a34a",
    "#15803d",
    "#166534",
    "#14532d",
    "#052e16",
    "#ecfdf5",
    "#d1fae5",
    "#a7f3d0",
    "#6ee7b7",
    "#34d399",
    "#10b981",
    "#059669",
    "#047857",
    "#065f46",
    "#064e3b",
    "#022c22",
    "#f0fdfa",
    "#ccfbf1",
    "#99f6e4",
    "#5eead4",
    "#2dd4bf",
    "#14b8a6",
    "#0d9488",
    "#0f766e",
    "#115e59",
    "#134e4a",
    "#042f2e",
    "#ecfeff",
    "#cffafe",
    "#a5f3fc",
    "#67e8f9",
    "#22d3ee",
    "#06b6d4",
    "#0891b2",
    "#0e7490",
    "#155e75",
    "#164e63",
    "#083344",
    "#f0f9ff",
    "#e0f2fe",
    "#bae6fd",
    "#7dd3fc",
    "#38bdf8",
    "#0ea5e9",
    "#0284c7",
    "#0369a1",
    "#075985",
    "#0c4a6e",
    "#082f49",
    "#eff6ff",
    "#dbeafe",
    "#bfdbfe",
    "#93c5fd",
    "#60a5fa",
    "#3b82f6",
    "#2563eb",
    "#1d4ed8",
    "#1e40af",
    "#1e3a8a",
    "#172554",
    "#eef2ff",
    "#e0e7ff",
    "#c7d2fe",
    "#a5b4fc",
    "#818cf8",
    "#6366f1",
    "#4f46e5",
    "#4338ca",
    "#3730a3",
    "#312e81",
    "#1e1b4b",
    "#f5f3ff",
    "#ede9fe",
    "#ddd6fe",
    "#c4b5fd",
    "#a78bfa",
    "#8b5cf6",
    "#7c3aed",
    "#6d28d9",
    "#5b21b6",
    "#4c1d95",
    "#2e1065",
    "#faf5ff",
    "#f3e8ff",
    "#e9d5ff",
    "#d8b4fe",
    "#c084fc",
    "#a855f7",
    "#9333ea",
    "#7e22ce",
    "#6b21a8",
    "#581c87",
    "#3b0764",
    "#fdf4ff",
    "#fae8ff",
    "#f5d0fe",
    "#f0abfc",
    "#e879f9",
    "#d946ef",
    "#c026d3",
    "#a21caf",
    "#86198f",
    "#701a75",
    "#4a044e",
    "#fdf2f8",
    "#fce7f3",
    "#fbcfe8",
    "#f9a8d4",
    "#f472b6",
    "#ec4899",
    "#db2777",
    "#be185d",
    "#9d174d",
    "#831843",
    "#500724",
    "#fff1f2",
    "#ffe4e6",
    "#fecdd3",
    "#fda4af",
    "#fb7185",
    "#f43f5e",
    "#e11d48",
    "#be123c",
    "#9f1239",
    "#881337",
    "#4c0519"
  ],

};

const transposedColorArray = function() {
  const colors = [];
  for (let i = 7; i >= 0; i--) {
    for (let j = 21; j >= 0; j = j - 2) {
      colors.push(defaultColors.otherColors[i + j * 11])
    }
  }
  for (let i = 10; i >= 8; i--) {
    for (let j = 21; j >= 0; j--) {
      colors.push(defaultColors.otherColors[i + j * 11])
    }
  }
  return colors;
}();

const addTransparancy = function(color: string, opacity: number) {
  const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
};

const generateColors = function(n: number, darkOnly) {
  if (n <= 242) {
    if (darkOnly == undefined) {
      return defaultColors.otherColors.slice(0, n);
    }

    return transposedColorArray.filter((c) => {
      return darkOnly ? (autoTextColor(c) == 'white') : (autoTextColor(c) != 'white');
    }).slice(0, n);
  }
  const colors = [...defaultColors.otherColors];
  for (let j = 0; j < 6; j++) {
    for (let colorIndex = 0; colorIndex < 20; colorIndex++) {
      let color = defaultColors.otherColors[colorIndex];
      color = color.slice(1, color.length);
      const newColor = addTransparancy(color, 1 - 0.15 * (j + 1));
      colors.push('#' + newColor);
      if (colors.length === n) {
        return colors;
      }
    }
  }
};

const getComplementaryColor = (color = '') => {
  const colorPart = color.slice(1);
  const ind = parseInt(colorPart, 16);
  let iter = ((1 << (4 * colorPart.length)) - 1 - ind).toString(16);
  while (iter.length < colorPart.length) {
    iter = '0' + iter;
  }
  return '#' + iter;
};

const autoTextColor = function(bgColor) {
  const lightColor = 'white';
  const darkColor = 'rgb(32 33 36)';
  if (!bgColor) {
    return darkColor;
  }
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB
  const uicolors = [r / 255, g / 255, b / 255];
  const c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return L > 0.179 ? darkColor : lightColor;
};

const getRandomColor = function(value, darkOnly) {
  let colors = generateColors(242, darkOnly);
  if (darkOnly) {
    colors = colors.filter((c) => {
      return autoTextColor(c) == 'white';
    });
  }
  const sha = hash(value.toString());
  const index = Math.round(
    (colors.length * parseInt(sha, 16)) / Math.pow(16, sha.length)
  );
  return colors[index];
};
const rgbToHex = function(rgb) {
  // Extract the numbers from the string using regex
  const rgbValues = rgb.match(/\d+/g);

  // Convert each RGB value to a two-digit hexadecimal string
  const hex = rgbValues.map(value => {
    const hexValue = parseInt(value).toString(16);
    return hexValue.length === 1 ? '0' + hexValue : hexValue;
  }).join('');

  return '#' + hex;
}

export {
  generateColors,
  defaultColors,
  autoTextColor,
  getRandomColor,
  getComplementaryColor,
  rgbToHex,
};
