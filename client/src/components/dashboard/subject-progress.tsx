import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  Calculator, 
  Feather, 
  Atom, 
  FlaskConical, 
  Landmark, 
  Globe 
} from "lucide-react";

interface Subject {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

interface UserProgress {
  subjectId: number;
  progress: number;
}

interface SubjectProgressProps {
  subjects?: Subject[];
  progress?: UserProgress[];
}

const getSubjectIcon = (iconName: string) => {
  const icons = {
    calculator: Calculator,
    feather: Feather,
    atom: Atom,
    flask: FlaskConical,
    landmark: Landmark,
    globe: Globe,
  };
  return icons[iconName as keyof typeof icons] || Calculator;
};

export function SubjectProgress({ subjects, progress }: SubjectProgressProps) {
  const [, setLocation] = useLocation();

  const getProgress = (subjectId: number) => {
    return progress?.find(p => p.subjectId === subjectId)?.progress || 0;
  };

  const handleSubjectClick = (subject: Subject) => {
    if (subject.slug === "history") {
      setLocation("/courses/relations-ue-acp");
    } else {
      // For other subjects, could navigate to subject page or show coming soon
      console.log(`Navigate to ${subject.name}`);
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Progression par matière
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subjects?.map((subject) => {
            const subjectProgress = getProgress(subject.id);
            const IconComponent = getSubjectIcon(subject.icon);
            
            return (
              <div key={subject.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${subject.color}15`,
                        color: subject.color 
                      }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {subject.name}
                      </span>
                      {subject.slug === "history" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSubjectClick(subject)}
                          className="text-xs h-6 px-2 border-orange-200 text-orange-700 hover:bg-orange-50"
                        >
                          Cours UE/ACP
                        </Button>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {subjectProgress}% terminé
                  </span>
                </div>
                <Progress 
                  value={subjectProgress} 
                  className="w-full h-2"
                  style={{ 
                    '--progress-background': subject.color 
                  } as any}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
