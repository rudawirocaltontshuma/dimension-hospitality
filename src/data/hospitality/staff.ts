import { EMAIL_DOMAINS, STAFF_FIRST_NAMES, STAFF_LAST_NAMES } from "./names";
import type { Rng } from "./rng";
import { daysFromToday, isoDate } from "./today";
import type { Department, Shift, StaffMember, StaffStatus } from "./types";

const DEPARTMENT_ROLES: Record<Department, string[]> = {
  "Front Desk": ["Front Desk Agent", "Front Desk Supervisor", "Night Auditor", "Guest Relations Officer"],
  Housekeeping: ["Housekeeper", "Housekeeping Supervisor", "Laundry Attendant"],
  Maintenance: ["Maintenance Technician", "Chief Engineer", "HVAC Specialist"],
  Restaurant: ["Server", "Line Cook", "Sous Chef", "Restaurant Manager", "Bartender"],
  Management: ["General Manager", "Assistant General Manager", "Revenue Manager", "HR Manager"],
};

const DEPARTMENT_HEADCOUNT: Record<Department, number> = {
  "Front Desk": 7,
  Housekeeping: 10,
  Maintenance: 6,
  Restaurant: 7,
  Management: 4,
};

const STATUS_WEIGHTS: [StaffStatus, number][] = [
  ["On Duty", 0.55],
  ["Off Duty", 0.38],
  ["On Leave", 0.07],
];

const SHIFTS: Shift[] = ["Morning", "Afternoon", "Night"];

export function generateStaff(rng: Rng): StaffMember[] {
  const staff: StaffMember[] = [];
  let counter = 1;

  for (const [department, headcount] of Object.entries(DEPARTMENT_HEADCOUNT) as [Department, number][]) {
    const roles = DEPARTMENT_ROLES[department];

    for (let i = 0; i < headcount; i++) {
      const firstName = rng.pick(STAFF_FIRST_NAMES);
      const lastName = rng.pick(STAFF_LAST_NAMES);
      const role = i === 0 ? roles[0] : rng.pick(roles);
      const domain = rng.pick(EMAIL_DOMAINS);

      staff.push({
        id: `staff-${String(counter).padStart(3, "0")}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@dimensionhospitality.${domain.split(".").at(-1)}`,
        department,
        role,
        shift: rng.pick(SHIFTS),
        status: rng.weightedPick(STATUS_WEIGHTS),
        performance: rng.int(72, 99),
        hireDate: isoDate(daysFromToday(-rng.int(60, 2600))),
        tasksCompleted: rng.int(20, 640),
      });

      counter++;
    }
  }

  return staff;
}
