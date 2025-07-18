import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, Trophy, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface Exercise {
  id: number;
  title: string;
  content: {
    instruction: string;
    questions: Question[];
  };
  points: number;
}

interface QCMExerciseProps {
  exercise: Exercise;
  onClose: () => void;
}

export function QCMExercise({ exercise, onClose }: QCMExerciseProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
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
        title: "QCM terminé !",
        description: "Votre score a été enregistré.",
      });
    },
  });

  const questions = exercise.content.questions;
  const totalQuestions = questions.length;

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQCM();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishQCM = () => {
    setIsCompleted(true);
    setShowResults(true);

    // Calculate score
    let correct = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct) {
        correct++;
      }
    });

    // Submit result
    submitMutation.mutate({
      score: correct,
      maxScore: totalQuestions,
      answers: userAnswers
    });
  };

  const restartQCM = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setIsCompleted(false);
    setShowResults(false);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct) {
        correct++;
      }
    });
    return { correct, total: totalQuestions, percentage: Math.round((correct / totalQuestions) * 100) };
  };

  if (showResults) {
    const { correct, total, percentage } = calculateScore();

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-4xl p-6">
          <div className="mb-6">
            <Button variant="ghost" onClick={onClose} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au cours
            </Button>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Trophy className="text-green-600 w-10 h-10" />
              </div>
              <CardTitle className="text-2xl text-gray-900">QCM Terminé !</CardTitle>
              <p className="text-lg text-gray-600">
                Votre score : {correct}/{total} ({percentage}%)
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Correction détaillée :</h4>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {questions.map((question, index) => {
                    const isCorrect = userAnswers[index] === question.correct;
                    const userAnswer = userAnswers[index];
                    
                    return (
                      <div
                        key={index}
                        className={`p-4 border rounded-lg ${
                          isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                        }`}
                      >
                        <p className="font-medium text-gray-900 mb-2">
                          {index + 1}. {question.question}
                        </p>
                        
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600">
                            <strong>Votre réponse :</strong>{" "}
                            {userAnswer !== undefined 
                              ? `${String.fromCharCode(65 + userAnswer)}. ${question.options[userAnswer]}`
                              : "Non répondu"
                            }
                            {isCorrect ? (
                              <Check className="inline w-4 h-4 text-green-600 ml-2" />
                            ) : (
                              <span className="text-red-600 ml-2">✗</span>
                            )}
                          </p>
                          
                          {!isCorrect && (
                            <p className="text-green-700">
                              <strong>Bonne réponse :</strong>{" "}
                              {String.fromCharCode(65 + question.correct)}. {question.options[question.correct]}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-center space-x-4 pt-6">
                  <Button onClick={restartQCM} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Recommencer
                  </Button>
                  <Button onClick={onClose}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour au cours
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-3xl p-6">
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
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    Question {currentQuestion + 1} / {totalQuestions}
                  </div>
                  <Badge variant="secondary">{exercise.points} points</Badge>
                </div>
              </div>
              <Progress value={progress} className="mt-4" />
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {currentQuestion + 1}. {currentQ.question}
              </h3>
              
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      userAnswers[currentQuestion] === index
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={index}
                      checked={userAnswers[currentQuestion] === index}
                      onChange={() => selectAnswer(index)}
                      className="mr-3 text-primary focus:ring-primary"
                    />
                    <span className="text-gray-700">
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>

          {/* Question indicators */}
          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentQuestion
                    ? "bg-primary"
                    : userAnswers[index] !== undefined
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextQuestion}
            disabled={userAnswers[currentQuestion] === undefined}
            className="bg-primary hover:bg-primary/90"
          >
            {currentQuestion === totalQuestions - 1 ? (
              <>
                Terminer
                <Check className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
