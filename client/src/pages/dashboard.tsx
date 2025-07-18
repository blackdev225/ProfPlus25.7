import { useQuery } from "@tanstack/react-query";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { SubjectProgress } from "@/components/dashboard/subject-progress";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
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

  const today = new Date().toISOString().split('T')[0];
  const { data: dailyStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/user", user?.id, "stats", today],
    enabled: !!user?.id,
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ["/api/user", user?.id, "appointments"],
    enabled: !!user?.id,
  });

  const isLoading = userLoading || subjectsLoading || progressLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <div className="w-64 bg-white shadow-lg border-r border-gray-200">
          <Skeleton className="h-full" />
        </div>
        <div className="flex-1 lg:ml-64 pt-16 lg:pt-0">
          <div className="p-4 lg:p-6 space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav user={user} />
      
      <div className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bonjour, {user?.firstName} ! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Continuons votre apprentissage aujourd'hui
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-fire text-green-600 text-sm"></i>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Série: {user?.streak || 0} jours
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-star text-yellow-600 text-sm"></i>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.totalPoints || 0} pts
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 lg:p-6">
          <StatsCards stats={dailyStats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mt-6 lg:mt-8">
            <SubjectProgress subjects={subjects} progress={progress} />
            <RecentActivity userId={user?.id} />
          </div>

          <UpcomingAppointments 
            appointments={appointments} 
            subjects={subjects}
            loading={appointmentsLoading}
          />
        </main>
      </div>
    </div>
  );
}
