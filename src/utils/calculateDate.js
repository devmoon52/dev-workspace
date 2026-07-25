export const calculateDate = (value, direction) => {
  const now = new Date();
  let targetDate;

  if (direction === "-") {
    targetDate = new Date(now.getTime() - value * 24 * 60 * 60 * 1000);
  } else {
    targetDate = new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
  }

  const day = targetDate.getDate();
  const month = targetDate.getMonth() + 1;

  return `${day}/${month}`;
};

export const checkDeadline = (deadline) => {
  const [d, m] = deadline.split("/").map(Number);
  const now = new Date();

  const deadlineDate = new Date(now.getFullYear(), m - 1, d);
  const diff = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

  return diff;
};

// Get local time - time (DAY - Date)
export const getLocalTimeFormat = (rawTime) => {
  const current = new Date(rawTime);

  const time = current.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const day = current.toLocaleDateString("en-US", {
    weekday: "short",
  });

  const formattedDate = current.toLocaleDateString("en-GB");

  return `${time} (${day.toUpperCase()} ${formattedDate})`;
};

// Get Avg Deadlines
export function getAvgDeadline(projects) {
  let count = 0;
  let totalTime = 0;
  const now = new Date();

  for (const p of projects) {
    const [day, month] = p.deadline.split("/").map(Number);

    const date = new Date(now.getFullYear(), month - 1, day);
    totalTime += date.getTime();
    count++;
  }

  let avgDeadline = "0/0";
  if (count > 0) {
    const avgTime = totalTime / count;
    const avgDate = new Date(avgTime);

    const day = avgDate.getDate();
    const month = avgDate.getMonth() + 1;

    avgDeadline = `${day}/${month}`;
  }

  return avgDeadline;
}

// get month and day format
export const getMonthAndDay = (deadline) => {
  const [day, month] = deadline.split("/").map(Number);
  const currentYear = new Date().getFullYear();

  const format = new Date(currentYear, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return format
};