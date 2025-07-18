import { useQuery } from "@tanstack/react-query";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Award, Calendar, Clock, BookOpen } from "lucide-react";

export default function ProgressPage() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: subjects } = useQuery({
    queryKey: ["/api/subjects"],
  });

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/user", user?.id, "progress"],
    enabled: !!user?.id,
  });

  const today = new Date().toISOString().split('T')[0];
  const { data: dailyStats } = useQuery({
    queryKey: ["/api/user", user?.id, "stats", today],
    enabled: !!user?.id,
  });

  const { data: activities } = useQuery({
    queryKey: ["/api/user", user?.id, "activity"],
    enabled: !!user?.id,
  });

  const isLoading = userLoading || progressLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidebarNav user={user} />
        <div className="flex-1 ml-64 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Préparer les données pour les graphiques
  const progressData = progress?.map(p => {
    const subject = subjects?.find(s => s.id === p.subjectId);
    return {
      name: subject?.name || 'Inconnu',
      progress: p.progress,
      color: subject?.color || '#6B7280'
    };
  }) || [];

  // Données simulées pour les graphiques temporels
  const weeklyData = [
    { day: 'Lun', time: 45, exercises: 3, points: 25 },
    { day: 'Mar', time: 60, exercises: 4, points: 35 },
    { day: 'Mer', time: 30, exercises: 2, points: 20 },
    { day: 'Jeu', time: 75, exercises: 5, points: 40 },
    { day: 'Ven', time: 90, exercises: 6, points: 50 },
    { day: 'Sam', time: 45, exercises: 3, points: 30 },
    { day: 'Dim', time: 30, exercises: 2, points: 15 }
  ];

  const averageProgress = progressData.reduce((acc, curr) => acc + curr.progress, 0) / progressData.length || 0;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav user={user} />
      
      <div className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Ma Progression</h1>
              <p className="text-sm lg:text-base text-gray-600 mt-1">
                Suivez votre évolution et vos performances
              </p>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Progression moyenne</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(averageProgress)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Points totaux</p>
                    <p className="text-2xl font-bold text-gray-900">{user?.totalPoints || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Award className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Série actuelle</p>
                    <p className="text-2xl font-bold text-gray-900">{user?.streak || 0} jours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Temps aujourd'hui</p>
                    <p className="text-2xl font-bold text-gray-900">{dailyStats?.timeSpent || 0}min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="subjects" className="space-y-4">
            <TabsList>
              <TabsTrigger value="subjects">Par matière</TabsTrigger>
              <TabsTrigger value="weekly">Activité hebdomadaire</TabsTrigger>
              <TabsTrigger value="achievements">Réalisations</TabsTrigger>
            </TabsList>

            <TabsContent value="subjects" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Progress by Subject */}
                <Card>
                  <CardHeader>
                    <CardTitle>Progression par matière</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {progressData.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{item.name}</span>
                            <Badge variant="secondary">{item.progress}%</Badge>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition des progrès</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={progressData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="progress"
                          label={({ name, progress }) => `${name}: ${progress}%`}
                        >
                          {progressData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Temps d'étude hebdomadaire</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="time" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Points gagnés cette semaine</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="points" stroke="#10B981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Premier pas</h3>
                    <p className="text-sm text-gray-600">Terminer votre premier exercice</p>
                    <Badge className="mt-2 bg-green-100 text-green-800">Débloqué</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Étudiant assidu</h3>
                    <p className="text-sm text-gray-600">7 jours consécutifs d'étude</p>
                    <Badge className="mt-2 bg-green-100 text-green-800">Débloqué</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Expert en Histoire</h3>
                    <p className="text-sm text-gray-600">Terminer le cours UE/ACP</p>
                    <Badge className="mt-2 bg-gray-100 text-gray-800">En cours</Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}