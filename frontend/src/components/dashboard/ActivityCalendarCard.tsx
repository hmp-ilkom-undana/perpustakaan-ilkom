import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

interface ActivityCalendarCardProps {
  date: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  taskDates: Date[];
}

export function ActivityCalendarCard({
  date,
  onSelectDate,
  taskDates,
}: ActivityCalendarCardProps) {
  const modifiers = {
    hasTask: taskDates,
  };

  const modifiersStyles = {
    hasTask: {
      fontWeight: "900",
      backgroundColor: "#f59e0b",
      color: "#1e3a8a",
      border: "2px solid #1e3a8a",
      boxShadow: "2px 2px 0px #1e3a8a",
      borderRadius: "6px",
    },
  };

  return (
    <Card>
      <CardContent className="p-3 sm:p-4 flex flex-col items-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelectDate}
          className="rounded-md mx-auto"
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
        />
      </CardContent>
    </Card>
  );
}
