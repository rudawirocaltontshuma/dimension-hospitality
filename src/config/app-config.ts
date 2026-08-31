import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Nexora Hospitality",
  version: packageJson.version,
  copyright: `© ${currentYear}, Nexora Hospitality.`,
  meta: {
    title: "Nexora Hospitality - Hotel & Hospitality Management Platform",
    description:
      "Nexora Hospitality is a frontend demonstration of a hotel and hospitality management platform covering reservations, front desk, housekeeping, billing, staff, and analytics with fictional data only.",
  },
};
