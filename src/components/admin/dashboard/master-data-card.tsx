import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface MasterDataCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export function MasterDataCard({
  title,
  description,
  icon,
  href,
}: MasterDataCardProps) {
  return (
    <Link to={href}>
      <Card className="transition-all hover:border-primary hover:shadow-sm cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">{icon}</div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
