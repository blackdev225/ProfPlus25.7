import { useQuery } from "@tanstack/react-query";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, MessageCircle, User, Plus } from "lucide-react";
import { format, isToday, isTomorrow, isThisWeek } from "date-fns";
import { fr } from "date-fns/locale";

export default function Schedule() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ["/api/user", user?.id, "appointments"],
    enabled: !!user?.id,
  });

  const { data: subjects } = useQuery({
    queryKey: ["/api/subjects"],
  });

  const isLoading = userLoading || appointmentsLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidebarNav user={user} />
        <div className="flex-1 ml-64 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getSubjectName = (subjectId: number) => {
    return subjects?.find(s => s.id === subjectId)?.name || "Matière inconnue";
  };

  const getSubjectColor = (subjectId: number) => {
    return subjects?.find(s => s.id === subjectId)?.color || "#6B7280";
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Aujourd'hui";
    if (isTomorrow(date)) return "Demain";
    if (isThisWeek(date)) return format(date, "EEEE", { locale: fr });
    return format(date, "dd MMMM yyyy", { locale: fr });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Programmé';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav user={user} />
      
      <div className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Mon Planning</h1>
              <p className="text-sm lg:text-base text-gray-600 mt-1">
                Gérez vos rendez-vous et sessions d'étude
              </p>
            </div>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nouveau rendez-vous</span>
            </Button>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Calendar Widget */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Calendrier</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Vue calendrier</p>
                  <p className="text-sm text-gray-500">Bientôt disponible</p>
                </div>
              </CardContent>
            </Card>

            {/* Appointments List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Prochains rendez-vous</h2>
                <Badge variant="secondary">
                  {appointments?.length || 0} rendez-vous
                </Badge>
              </div>

              {appointments?.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun rendez-vous programmé
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Planifiez une session avec un professeur pour améliorer vos résultats
                    </p>
                    <Button>Planifier un rendez-vous</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {appointments?.map((appointment) => {
                    const appointmentDate = new Date(appointment.scheduledAt);
                    return (
                      <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div 
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                                style={{ backgroundColor: getSubjectColor(appointment.subjectId) }}
                              >
                                {appointment.type === 'video' ? (
                                  <Video className="w-5 h-5" />
                                ) : (
                                  <MessageCircle className="w-5 h-5" />
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900">
                                  {appointment.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {getSubjectName(appointment.subjectId)}
                                </p>
                                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <User className="w-4 h-4" />
                                    <span>{appointment.teacherName}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{format(appointmentDate, "HH:mm")}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="text-right space-y-2">
                              <Badge className={getStatusColor(appointment.status || 'scheduled')}>
                                {getStatusText(appointment.status || 'scheduled')}
                              </Badge>
                              <p className="text-sm text-gray-600">
                                {getDateLabel(appointmentDate)}
                              </p>
                              {appointment.status === 'scheduled' && (
                                <Button size="sm" className="w-full">
                                  Rejoindre
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}