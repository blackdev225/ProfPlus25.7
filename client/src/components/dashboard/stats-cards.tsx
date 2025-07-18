import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, BarChart3 } from "lucide-react";

interface StatsCardsProps {
  stats?: {
    timeSpent: number;
    exercisesCompleted: number;
    pointsEarned: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const averageScore = stats?.exercisesCompleted 
    ? Math.round((stats.pointsEarned / (stats.exercisesCompleted * 10)) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Clock className="text-primary w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Temps aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(stats?.timeSpent || 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600 w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Exercices terminés</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.exercisesCompleted || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="text-secondary w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Score moyen</p>
              <p className="text-2xl font-bold text-gray-900">
                {averageScore}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
