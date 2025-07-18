import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Trophy } from "lucide-react";

export default function Subjects() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ["/api/subjects"],
  });

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/user", user?.id, "progress"],
    enabled: !!user?.id,
  });

  const isLoading = userLoading || subjectsLoading || progressLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidebarNav user={user} />
        <div className="flex-1 ml-64 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getSubjectProgress = (subjectId: number) => {
    return progress?.find(p => p.subjectId === subjectId)?.progress || 0;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav user={user} />
      
      <div className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Mes Matières</h1>
              <p className="text-sm lg:text-base text-gray-600 mt-1">
                Explorez tous vos cours et suivez votre progression
              </p>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {subjects?.map((subject) => {
              const subjectProgress = getSubjectProgress(subject.id);
              const progressColor = subjectProgress >= 75 ? 'text-green-600' : 
                                  subjectProgress >= 50 ? 'text-yellow-600' : 'text-red-600';
              
              return (
                <Card key={subject.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: subject.color }}
                      >
                        <i className={`fas fa-${subject.icon} text-lg`}></i>
                      </div>
                      <Badge variant="secondary" className={progressColor}>
                        {subjectProgress}%
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {subject.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {subject.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progression</span>
                        <span className={`font-medium ${progressColor}`}>
                          {subjectProgress}%
                        </span>
                      </div>
                      <Progress value={subjectProgress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>5 cours</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>2h 30min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-4 h-4" />
                        <span>150 pts</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      {subject.slug === 'history' ? (
                        <Link href="/courses/relations-ue-acp">
                          <Button className="w-full" size="sm">
                            Continuer le cours
                          </Button>
                        </Link>
                      ) : (
                        <Button className="w-full" size="sm" variant="outline" disabled>
                          Bientôt disponible
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}