export function getDateRange(
  duration: string,
  searchParams?: Record<string, string>
) {
  const now = new Date();
  let start: Date;
  let end: Date;

  switch (duration) {
    case "this-month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = now;
      break;

    case "last-month":
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
      break;

    case "this-year":
      start = new Date(now.getFullYear(), 0, 1);
      end = now;
      break;

    case "last-year":
      start = new Date(now.getFullYear() - 1, 0, 1);
      end = new Date(now.getFullYear() - 1, 11, 31);
      break;

    case "custom":
      if (!searchParams?.start || !searchParams?.end)
        throw new Error("Custom duration requires start and end date");

      start = new Date(searchParams.start);
      end = new Date(searchParams.end);
      break;

    default:
      throw new Error("Invalid duration parameter");
  }

  return { start, end };
}
