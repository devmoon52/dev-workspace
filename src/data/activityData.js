import { getLocalTimeFormat } from "../utils/calculateDate";

export const activities = [
  // Day 1 (Today)
  {
    type: "reminder",
    log: `A welcome reminder was created for ${getLocalTimeFormat(Date.now())}.`,
    day: 1,
  },

  // Day 2
  {
    type: "project",
    log: "2 projects were marked as completed.",
    day: 2,
  },
  {
    type: "member",
    log: "1 inactive member was removed from the team.",
    day: 2,
  },
  {
    type: "message",
    log: "Received a new message from client Michael Carter.",
    day: 2,
  },
  {
    type: "asset",
    log: "Revenue increased by $250.",
    day: 2,
  },
  {
    type: "project",
    log: "A new project was added to the pending board.",
    day: 2,
  },

  // Day 3
  {
    type: "project",
    log: "5 completed projects were archived.",
    day: 3,
  },
  {
    type: "message",
    log: "Sent project delivery confirmation to Olivia Wilson.",
    day: 3,
  },
  {
    type: "reminder",
    log: "Created a reminder for project deadline review.",
    day: 3,
  },
  {
    type: "member",
    log: "1 member was assigned to a new project.",
    day: 3,
  },
  {
    type: "setting",
    log: "Notification preferences were updated.",
    day: 3,
  },
  {
    type: "asset",
    log: "Assets increased to $1,200.",
    day: 3,
  },

  // Day 4
  {
    type: "project",
    log: "4 projects moved from pending to running.",
    day: 4,
  },
  {
    type: "message",
    log: "Received feedback from client Emma Thompson.",
    day: 4,
  },
  {
    type: "member",
    log: "A member account was temporarily blocked.",
    day: 4,
  },
  {
    type: "project",
    log: "1 overdue project was reassigned.",
    day: 4,
  },
  {
    type: "asset",
    log: "A withdrawal of $75 was sent to a card account.",
    day: 4,
  },

  // Day 5
  {
    type: "message",
    log: "Started a conversation with client Daniel Harris.",
    day: 5,
  },
  {
    type: "project",
    log: "3 projects were completed successfully.",
    day: 5,
  },
  {
    type: "member",
    log: "3 new members joined the team.",
    day: 5,
  },
  {
    type: "reminder",
    log: "Created a reminder for weekly team meeting.",
    day: 5,
  },
  {
    type: "asset",
    log: "Revenue crossed $3,500.",
    day: 5,
  },
  {
    type: "setting",
    log: "Theme settings were updated.",
    day: 5,
  },

  // Day 6
  {
    type: "project",
    log: "2 projects were moved back to pending for revisions.",
    day: 6,
  },
  {
    type: "message",
    log: "Received project requirements from Ava Johnson.",
    day: 6,
  },
  {
    type: "asset",
    log: "Assets dropped by $150 after withdrawals.",
    day: 6,
  },
  {
    type: "member",
    log: "1 member was marked as inactive.",
    day: 6,
  },
  {
    type: "reminder",
    log: "Created a reminder for client follow-up.",
    day: 6,
  },

  // Day 7
  {
    type: "project",
    log: "6 projects were completed and delivered.",
    day: 7,
  },
  {
    type: "message",
    log: "Received appreciation feedback from Sophia Bennett.",
    day: 7,
  },
  {
    type: "member",
    log: "A blocked member account was restored.",
    day: 7,
  },
  {
    type: "asset",
    log: "A withdrawal of $200 was processed successfully.",
    day: 7,
  },
  {
    type: "setting",
    log: "Payroll settings were reviewed and saved.",
    day: 7,
  },
  {
    type: "reminder",
    log: "Completed a scheduled reminder task.",
    day: 7,
  },
];
