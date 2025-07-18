import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User, Settings, Shield, Award, Trophy, Calendar } from "lucide-react";

export default function Profile() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: activities } = useQuery({
    queryKey: ["/api/user", user?.id, "activity"],
    enabled: !!user?.id,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    grade: user?.grade || "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PATCH", `/api/user/${user?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (userLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidebarNav user={user} />
        <div className="flex-1 ml-64 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const userInitials = user ? `${user.firstName[0]}${user.lastName[0]}` : "U";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav user={user} />
      
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
              <p className="text-gray-600 mt-1">
                Gérez vos informations personnelles et vos préférences
              </p>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview */}
            <Card className="lg:col-span-1">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarFallback className="text-2xl font-bold bg-blue-500 text-white">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-600">{user?.grade}</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    Étudiant actif
                  </Badge>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Points totaux</span>
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">{user?.totalPoints || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Série actuelle</span>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4 text-orange-500" />
                      <span className="font-semibold">{user?.streak || 0} jours</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Membre depuis</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="personal" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
                  <TabsTrigger value="activity">Activité récente</TabsTrigger>
                  <TabsTrigger value="settings">Paramètres</TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <User className="w-5 h-5" />
                          <span>Informations personnelles</span>
                        </CardTitle>
                        {!isEditing && (
                          <Button variant="outline" onClick={() => setIsEditing(true)}>
                            Modifier
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">Prénom</Label>
                              <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Nom</Label>
                              <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="grade">Classe</Label>
                            <Input
                              id="grade"
                              value={formData.grade}
                              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                              required
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button type="submit" disabled={updateMutation.isPending}>
                              {updateMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsEditing(false);
                                setFormData({
                                  firstName: user?.firstName || "",
                                  lastName: user?.lastName || "",
                                  grade: user?.grade || "",
                                });
                              }}
                            >
                              Annuler
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm text-gray-600">Prénom</Label>
                              <p className="font-medium">{user?.firstName}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-gray-600">Nom</Label>
                              <p className="font-medium">{user?.lastName}</p>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600">Classe</Label>
                            <p className="font-medium">{user?.grade}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600">Nom d'utilisateur</Label>
                            <p className="font-medium">{user?.username}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity">
                  <Card>
                    <CardHeader>
                      <CardTitle>Activité récente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {activities?.length === 0 ? (
                        <div className="text-center py-8">
                          <Trophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Aucune activité récente
                          </h3>
                          <p className="text-gray-600">
                            Commencez à faire des exercices pour voir votre activité ici
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {activities?.map((activity, index) => (
                            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Trophy className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">Exercice terminé</p>
                                <p className="text-sm text-gray-600">
                                  Score: {activity.score}/{activity.maxScore}
                                </p>
                              </div>
                              <Badge variant="secondary">
                                +{Math.round((activity.score / activity.maxScore) * 20)} pts
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Settings className="w-5 h-5" />
                        <span>Paramètres</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-3">Notifications</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Rappels d'exercices</p>
                                <p className="text-sm text-gray-600">Recevoir des rappels pour faire vos exercices</p>
                              </div>
                              <Button variant="outline" size="sm">Activé</Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Résultats d'exercices</p>
                                <p className="text-sm text-gray-600">Notifications quand vous terminez un exercice</p>
                              </div>
                              <Button variant="outline" size="sm">Activé</Button>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-medium mb-3">Confidentialité</h3>
                          <div className="flex items-center space-x-2">
                            <Shield className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-gray-600">
                              Vos données sont protégées et ne sont jamais partagées
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}