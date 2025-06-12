import { Badge } from "../ui/badge";

interface EventProps {
  date: Date;
  title: string;
  tag?: string;
}

export default function EventRow({ date, title, tag }: EventProps) {
  return (
    <div
      key="event-id"
      className="p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground mt-1">
            {date.toLocaleString()}
            {/* {date.toLocaleDateString()} at 1:00 */}
          </p>
        </div>
        {tag ? (
          <Badge
            variant="secondary"
            className={`text-xs bg-blue-100 text-blue-800`}
          >
            {tag}
          </Badge>
        ) : null}
      </div>
    </div>
  );
}
