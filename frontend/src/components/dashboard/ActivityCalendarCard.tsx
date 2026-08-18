import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActivityCalendarCardProps {
  date: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  taskDates: Date[];
  className?: string;
}

export function ActivityCalendarCard({
  date,
  onSelectDate,
  taskDates,
  className,
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
    <Card className={cn("flex flex-col justify-between", className)}>
      <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center h-full">
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
