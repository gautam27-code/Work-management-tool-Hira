import { formatDistanceToNow } from "date-fns";

function ActivityFeed({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-[#94a3b8] text-sm text-center py-4">
        No recent activity
      </div>
    );
  }

  const getActionColor = (action) => {
    if (action.includes("created") || action.includes("added")) return "text-[#10b981]";
    if (action.includes("deleted") || action.includes("removed")) return "text-[#ef4444]";
    return "text-[#6366f1]";
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity._id} className="flex gap-3 text-sm animate-fade-in border-b border-[#334155] pb-3 last:border-0 last:pb-0">
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#ec4899] flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white text-xs font-semibold">
                {activity.user?.name ? activity.user.name.charAt(0).toUpperCase() : "?"}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-[#f1f5f9]">
              <span className="font-semibold">{activity.user?.name || "Someone"}</span>{" "}
              <span className={getActionColor(activity.action)}>
                {activity.details}
              </span>
            </p>
            <p className="text-xs text-[#64748b] mt-0.5">
              {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ActivityFeed;
