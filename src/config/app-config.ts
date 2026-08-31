import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Dimension Hospitality",
  version: packageJson.version,
  copyright: `© ${currentYear}, Dimension Hospitality.`,
  meta: {
    title: "Dimension Hospitality - Hotel & Hospitality Management Platform",
    description:
      "Dimension Hospitality is a frontend demonstration of a hotel and hospitality management platform covering reservations, front desk, housekeeping, billing, staff, and analytics with fictional data only.",
  },
};
