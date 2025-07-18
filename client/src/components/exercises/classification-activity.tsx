import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Exercise {
  id: number;
  title: string;
  content: {
    instruction: string;
    countries: Array<{
      name: string;
      type: "eu" | "acp";
    }>;
  };
  points: number;
}

interface ClassificationActivityProps {
  exercise: Exercise;
  onClose: () => void;
}

export function ClassificationActivity({ exercise, onClose }: ClassificationActivityProps) {
  const [availableCountries, setAvailableCountries] = useState(
    [...exercise.content.countries].sort(() => Math.random() - 0.5)
  );
  const [euCountries, setEuCountries] = useState<typeof exercise.content.countries>([]);
  const [acpCountries, setAcpCountries] = useState<typeof exercise.content.countries>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: async (result: { score: number; maxScore: number; answers: any }) => {
      return apiRequest("POST", `/api/exercises/${exercise.id}/submit`, {
        userId: 1, // Fixed user ID for demo
        score: result.score,
        maxScore: result.maxScore,
        answers: result.answers
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Exercice soumis !",
        description: "Votre progression a été sauvegardée.",
      });
    },
  });

  const moveToEU = (country: typeof exercise.content.countries[0]) => {
    setAvailableCountries(prev => prev.filter(c => c.name !== country.name));
    setEuCountries(prev => [...prev, country]);
  };

  const moveToACP = (country: typeof exercise.content.countries[0]) => {
    setAvailableCountries(prev => prev.filter(c => c.name !== country.name));
    setAcpCountries(prev => [...prev, country]);
  };

  const removeFromCategory = (country: typeof exercise.content.countries[0]) => {
    setEuCountries(prev => prev.filter(c => c.name !== country.name));
    setAcpCountries(prev => prev.filter(c => c.name !== country.name));
    setAvailableCountries(prev => [...prev, country]);
  };

  const checkAnswers = () => {
    let correct = 0;
    const total = euCountries.length + acpCountries.length;

    // Check EU countries
    euCountries.forEach(country => {
      if (country.type === "eu") correct++;
    });

    // Check ACP countries
    acpCountries.forEach(country => {
      if (country.type === "acp") correct++;
    });

    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    setScore(percentage);
    setIsCompleted(true);

    // Submit result
    submitMutation.mutate({
      score: correct,
      maxScore: total,
      answers: {
        eu: euCountries.map(c => c.name),
        acp: acpCountries.map(c => c.name)
      }
    });
  };

  const reset = () => {
    setAvailableCountries([...exercise.content.countries].sort(() => Math.random() - 0.5));
    setEuCountries([]);
    setAcpCountries([]);
    setIsCompleted(false);
    setScore(null);
  };

  const getCountryStatus = (country: typeof exercise.content.countries[0], placement: "eu" | "acp") => {
    if (!isCompleted) return null;
    return country.type === placement ? "correct" : "incorrect";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl p-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={onClose} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au cours
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-gray-900">
                    {exercise.title}
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    {exercise.content.instruction}
                  </p>
                </div>
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>{exercise.points} points</span>
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Available Countries */}
        {availableCountries.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Pays à classer :</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableCountries.map((country) => (
                  <div key={country.name} className="space-y-2">
                    <div className="p-3 bg-gray-100 rounded-lg text-center border-2 border-dashed border-gray-300">
                      <p className="font-medium text-gray-900">{country.name}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveToEU(country)}
                        className="flex-1 text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        → UE
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveToACP(country)}
                        className="flex-1 text-xs border-orange-300 text-orange-700 hover:bg-orange-50"
                      >
                        → ACP
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Classification Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* EU Countries */}
          <Card className="border-2 border-blue-300">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-center text-blue-900">PAYS UE</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[200px] p-4">
              <div className="space-y-2">
                {euCountries.map((country) => {
                  const status = getCountryStatus(country, "eu");
                  return (
                    <div
                      key={country.name}
                      className={`p-3 rounded border-2 flex items-center justify-between ${
                        status === "correct"
                          ? "bg-green-50 border-green-300"
                          : status === "incorrect"
                          ? "bg-red-50 border-red-300"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <span className="font-medium">{country.name}</span>
                      <div className="flex items-center space-x-2">
                        {isCompleted && (
                          <div>
                            {status === "correct" ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <X className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                        )}
                        {!isCompleted && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCategory(country)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {euCountries.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    Glissez ici les pays de l'Union Européenne
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ACP Countries */}
          <Card className="border-2 border-orange-300">
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-center text-orange-900">PAYS ACP</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[200px] p-4">
              <div className="space-y-2">
                {acpCountries.map((country) => {
                  const status = getCountryStatus(country, "acp");
                  return (
                    <div
                      key={country.name}
                      className={`p-3 rounded border-2 flex items-center justify-between ${
                        status === "correct"
                          ? "bg-green-50 border-green-300"
                          : status === "incorrect"
                          ? "bg-red-50 border-red-300"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <span className="font-medium">{country.name}</span>
                      <div className="flex items-center space-x-2">
                        {isCompleted && (
                          <div>
                            {status === "correct" ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <X className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                        )}
                        {!isCompleted && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCategory(country)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {acpCountries.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    Glissez ici les pays ACP (Afrique, Caraïbes, Pacifique)
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {!isCompleted ? (
            <Button
              onClick={checkAnswers}
              disabled={euCountries.length === 0 && acpCountries.length === 0}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Vérifier mes réponses
            </Button>
          ) : (
            <div className="text-center space-y-4">
              <div className="p-6 bg-white rounded-lg border">
                <h3 className="text-xl font-semibold mb-2">
                  Résultat : {score}%
                </h3>
                <p className="text-gray-600 mb-4">
                  {score >= 70 
                    ? "🎉 Excellent travail ! Vous maîtrisez bien la classification des pays UE/ACP."
                    : "📚 Continuez vos efforts ! Relisez le cours pour mieux comprendre les différences."
                  }
                </p>
                <Button
                  onClick={reset}
                  variant="outline"
                  className="mr-4"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Recommencer
                </Button>
                <Button onClick={onClose}>
                  Retour au cours
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
