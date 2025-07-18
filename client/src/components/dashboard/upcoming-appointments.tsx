import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Video, MessageSquare } from "lucide-react";
import { 
  Calculator, 
  Feather, 
  Atom, 
  FlaskConical, 
  Landmark, 
  Globe 
} from "lucide-react";

interface Appointment {
  id: number;
  subjectId: number;
  teacherName: string;
  title: string;
  scheduledAt: string;
  type: string;
}

interface Subject {
  id: number;
  name: string;
  color: string;
  icon: string;
}

interface UpcomingAppointmentsProps {
  appointments?: Appointment[];
  subjects?: Subject[];
  loading?: boolean;
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  
  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  
  if (isToday) {
    return `Aujourd'hui ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (isTomorrow) {
    return `Demain ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
};

export function UpcomingAppointments({ appointments, subjects, loading }: UpcomingAppointmentsProps) {
  if (loading) {
    return (
      <div className="mt-8">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Prochains rendez-vous
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getSubject = (subjectId: number) => {
    return subjects?.find(s => s.id === subjectId);
  };

  return (
    <div className="mt-8">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Prochains rendez-vous
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments?.map((appointment) => {
              const subject = getSubject(appointment.subjectId);
              const IconComponent = subject ? getSubjectIcon(subject.icon) : Calculator;
              const isVideo = appointment.type === "video";

              return (
                <div 
                  key={appointment.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ 
                          backgroundColor: subject?.color ? `${subject.color}15` : '#f3f4f6',
                          color: subject?.color || '#6b7280'
                        }}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {subject?.name || "Matière"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.teacherName}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary"
                      className={`flex items-center space-x-1 ${
                        isVideo 
                          ? "bg-primary/10 text-primary" 
                          : "bg-secondary/10 text-secondary"
                      }`}
                    >
                      {isVideo ? (
                        <Video className="w-3 h-3" />
                      ) : (
                        <MessageSquare className="w-3 h-3" />
                      )}
                      <span className="text-xs">
                        {isVideo ? "Visioconférence" : "Chat"}
                      </span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(appointment.scheduledAt)}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
