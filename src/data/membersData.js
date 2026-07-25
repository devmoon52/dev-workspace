import { calculateDate } from "../utils/calculateDate";

export const teamMembers = [
  {
    mid: 2020201,
    isActive: true,
    name: "John Doe",
    isBlocked: false,
    role: [
      {
        project: "AI Dashboard Integration",
        projectID: 101098,
        status: "completed",
        isOverdue: true,
        deadline: calculateDate(1, "-"),
      },
      {
        project: "Realtime Chat System",
        projectID: 101099,
        status: "pending",
        deadline: calculateDate(1, "+"),
      },
    ],
    oldProjects: [101011, 101076, 101075, 101074, 101073],
  },
  {
    mid: 2020202,
    isActive: true,
    name: "David Miller",
    isBlocked: false,
    role: [
      {
        project: "Payment Gateway UI",
        projectID: 101100,
        status: "completed",
        isOverdue: true,
        deadline: calculateDate(1, "-"),
      },
    ],
    oldProjects: [
      101012, 101072, 101071, 101070, 101069, 101068, 101027, 101026, 101025,
      101024, 101023, 101022, 101021,
    ],
  },
  {
    mid: 2020203,
    isActive: true,
    name: "Michael Scott",
    isBlocked: false,
    role: [
      {
        project: "Analytics Graph System",
        projectID: 101101,
        status: "pending",
        deadline: calculateDate(0, "+"),
      },
      {
        project: "Role Management UI",
        projectID: 101102,
        status: "progress",
        deadline: calculateDate(0, "+"),
      },
    ],
    oldProjects: [101013, 101067, 101066, 101065],
  },
  {
    mid: 2020204,
    isActive: true,
    name: "Daniel Wilson",
    isBlocked: false,
    role: [
      {
        project: "Email Service Integration",
        projectID: 101103,
        status: "progress",
        deadline: calculateDate(1, "+"),
      },
      {
        project: "Notification Backend UI",
        projectID: 101104,
        status: "completed",
        deadline: calculateDate(2, "+"),
      },
    ],
    oldProjects: [
      101014, 101015, 101016, 101064, 101063, 101062, 101061, 101060, 101059,
      101058, 101057,
    ],
  },
  {
    mid: 2020205,
    isActive: true,
    name: "James Anderson",
    isBlocked: false,
    role: [
      {
        project: "Search Optimization System",
        projectID: 101105,
        status: "completed",
        deadline: calculateDate(1, "+"),
      },
    ],
    oldProjects: [
      101017, 101018, 101019, 101020, 101056, 101055, 101054, 101053, 101052,
      101051, 101050, 101049, 101048, 101047,
    ],
  },
  {
    // inactive members
    mid: 2020206,
    isActive: false,
    name: "Robert Brown",
    role: [],
    oldProjects: [101046, 101045, 101044, 101043, 101042, 101041, 101040],
  },
  {
    mid: 2020207,
    isActive: false,
    name: "William Clark",
    role: [],
    oldProjects: [101039, 101038, 101037, 101036, 101035, 101034],
  },
  {
    mid: 2020208,
    isActive: false,
    name: "Thomas Lee",
    role: [],
    oldProjects: [101033, 101032, 101031, 101030, 101029, 101028],
  },
  {
    // available members
    mid: 2020209,
    name: "Ethan Walker",
    isNew: true,
    isBlocked: false,
  },
  {
    mid: 2020210,
    name: "Ryan Mitchell",
    isNew: true,
    isBlocked: false,
  },
  {
    mid: 2020211,
    name: "Kevin Turner",
    isNew: true,
    isBlocked: false,
  },
  {
    mid: 2020212,
    name: "Andrew Carter",
    isNew: true,
    isBlocked: false,
  },
  {
    mid: 2020213,
    name: "Nathan Brooks",
    isNew: true,
    isBlocked: false,
  },
  {
    mid: 2020214,
    name: "Jason Reed",
    isNew: true,
    isBlocked: false,
  },
  {
    mid: 2020215,
    name: "Christopher Evans",
    isNew: true,
    isBlocked: false,
  },
  {
    mid: 2020216,
    name: "Brandon Hughes",
    isNew: true,
    isBlocked: false,
  },
  {
    mid: 2020217,
    name: "Lucas Bennett",
    isNew: true,
    isBlocked: false,
  },
  {
    mid: 2020218,
    name: "Benjamin Cooper",
    isNew: true,
    isBlocked: false,
  },
  {
    mid: 2020219,
    name: "Matthew Foster",
    isNew: true,
    isBlocked: false,
  },
];
