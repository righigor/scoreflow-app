import { Skeleton } from "../ui/skeleton";


export default function SkeletonItem() {
  return (
    <div>
      <Skeleton className="h-18 w-full mb-2" />
      <Skeleton className="h-18 w-full mb-2" />
      <Skeleton className="h-18 w-full mb-2" />
    </div>
  );
}
