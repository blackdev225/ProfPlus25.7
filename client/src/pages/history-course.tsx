import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, BookOpen, Trophy } from "lucide-react";
import { ClassificationActivity } from "@/components/exercises/classification-activity";
import { QCMExercise } from "@/components/exercises/qcm-exercise";
import { useState } from "react";

export default function HistoryCourse() {
  const [, params] = useRoute("/courses/:slug");
  const [, setLocation] = useLocation();
  const [activeExercise, setActiveExercise] = useState<number | null>(null);

  const { data: course, isLoading } = useQuery({
    queryKey: ["/api/courses", params?.slug],
    enabled: !!params?.slug,
  });

  const { data: exercises } = useQuery({
    queryKey: ["/api/courses", course?.id, "exercises"],
    enabled: !!course?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-300 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600">Cours non trouvé</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const classificationExercise = exercises?.find(ex => ex.type === "classification");
  const qcmExercise = exercises?.find(ex => ex.type === "qcm");

  if (activeExercise) {
    const exercise = exercises?.find(ex => ex.id === activeExercise);
    if (!exercise) return null;

    if (exercise.type === "classification") {
      return (
        <ClassificationActivity 
          exercise={exercise}
          onClose={() => setActiveExercise(null)}
        />
      );
    } else if (exercise.type === "qcm") {
      return (
        <QCMExercise 
          exercise={exercise}
          onClose={() => setActiveExercise(null)}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </Button>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl lg:text-2xl text-gray-900">
                    {course.title}
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    Un exemple de coopération Nord-Sud
                  </p>
                </div>
                <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{course.estimatedTime} min</span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <BookOpen className="w-3 h-3" />
                    <span className="capitalize">{course.difficulty}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Exercises Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-orange-600" />
              <span>Exercices disponibles</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classificationExercise && (
                <Card className="border-blue-200 hover:border-blue-300 transition-colors cursor-pointer"
                      onClick={() => setActiveExercise(classificationExercise.id)}>
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-list text-blue-600"></i>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {classificationExercise.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {classificationExercise.points} points
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      Classez les pays selon leur appartenance UE ou ACP
                    </p>
                  </CardContent>
                </Card>
              )}

              {qcmExercise && (
                <Card className="border-green-200 hover:border-green-300 transition-colors cursor-pointer"
                      onClick={() => setActiveExercise(qcmExercise.id)}>
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-question-circle text-green-600"></i>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {qcmExercise.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {qcmExercise.points} points
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      10 questions à choix multiples
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Course Content */}
        <Card>
          <CardHeader>
            <CardTitle>Contenu du cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {/* Introduction */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Introduction
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {course.content.introduction}
                </p>
              </div>

              {/* Sections */}
              {course.content.sections.map((section: any, index: number) => (
                <div key={index} className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {index + 1}. {section.title}
                  </h3>
                  
                  {section.subsections.map((subsection: any, subIndex: number) => (
                    <div key={subIndex} className="mb-6">
                      <h4 className="text-lg font-medium text-gray-800 mb-3">
                        {subsection.title}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {subsection.content}
                      </p>
                    </div>
                  ))}
                  
                  {index < course.content.sections.length - 1 && (
                    <Separator className="my-6" />
                  )}
                </div>
              ))}

              {/* Conclusion */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-900 mb-4">
                  <i className="fas fa-lightbulb mr-2"></i>
                  Conclusion
                </h3>
                <p className="text-green-800 leading-relaxed">
                  {course.content.conclusion}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
