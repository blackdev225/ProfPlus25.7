import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calculator, 
  Feather, 
  Atom, 
  FlaskConical, 
  Landmark, 
  Globe 
} from "lucide-react";

interface RecentActivityProps {
  userId?: number;
}

const getSubjectIcon = (subjectId: number) => {
  const icons = {
    1: Calculator, // Math
    2: Feather,    // French
    3: Atom,       // Physics
    4: FlaskConical,      // Chemistry
    5: Landmark,   // History
    6: Globe,      // English
  };
  return icons[subjectId as keyof typeof icons] || Calculator;
};

const getSubjectColor = (subjectId: number) => {
  const colors = {
    1: "hsl(0, 72%, 51%)",     // Math - red
    2: "hsl(258, 90%, 66%)",   // French - purple
    3: "hsl(45, 93%, 47%)",    // Physics - yellow
    4: "hsl(142, 71%, 45%)",   // Chemistry - green
    5: "hsl(25, 95%, 53%)",    // History - orange
    6: "hsl(217, 91%, 60%)",   // English - blue
  };
  return colors[subjectId as keyof typeof colors] || "hsl(0, 72%, 51%)";
};

const getSubjectName = (subjectId: number) => {
  const names = {
    1: "Mathématiques",
    2: "Français", 
    3: "Physique",
    4: "Chimie",
    5: "Histoire",
    6: "Anglais",
  };
  return names[subjectId as keyof typeof names] || "Matière";
};

const getActivityType = (score: number, maxScore: number) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return "Exercice terminé";
  if (percentage >= 60) return "Devoir corrigé";
  return "Cours consulté";
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "À l'instant";
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}j`;
};

export function RecentActivity({ userId }: RecentActivityProps) {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/user", userId, "activity"],
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Activité récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-3 w-8" />
                  <Skeleton className="h-3 w-6" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock some recent activities if no real data
  const mockActivities = [
    {
      id: 1,
      subjectId: 1,
      activityType: "Exercice terminé",
      score: 85,
      maxScore: 100,
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
    },
    {
      id: 2,
      subjectId: 2,
      activityType: "Cours consulté",
      score: 0,
      maxScore: 0,
      completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: 3,
      subjectId: 3,
      activityType: "Devoir corrigé",
      score: 78,
      maxScore: 100,
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  ];

  const displayActivities = activities?.length ? activities : mockActivities;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Activité récente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.slice(0, 3).map((activity: any) => {
            const IconComponent = getSubjectIcon(activity.subjectId);
            const subjectColor = getSubjectColor(activity.subjectId);
            const subjectName = getSubjectName(activity.subjectId);
            const activityType = activity.activityType || getActivityType(activity.score, activity.maxScore);
            const timeAgo = formatTimeAgo(new Date(activity.completedAt));
            const percentage = activity.maxScore > 0 ? Math.round((activity.score / activity.maxScore) * 100) : null;

            return (
              <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${subjectColor}15`,
                    color: subjectColor 
                  }}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{subjectName}</p>
                  <p className="text-sm text-gray-600">{activityType}</p>
                </div>
                <div className="text-right">
                  {percentage !== null && (
                    <p className="text-sm font-medium text-green-600">
                      {percentage}%
                    </p>
                  )}
                  <p className="text-xs text-gray-500">{timeAgo}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
