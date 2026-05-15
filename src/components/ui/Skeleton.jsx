import { cn } from "@/lib/utils";

export default function Skeleton({ className }) {
  return <div className={cn("skeleton rounded", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="border border-border rounded-lg p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-5 w-14 rounded" />
        <Skeleton className="h-5 w-18 rounded" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 w-full rounded-lg" />
      <div className="flex items-end gap-4 -mt-10 px-4">
        <Skeleton className="h-20 w-20 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}
