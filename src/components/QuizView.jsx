"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  Brain,
  Award,
  RefreshCw,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import Loader from "./Loader";

const QuizView = () => {
  const { topic, nodeText } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchQuiz = async (forceRefresh = false) => {
    if (!user || !topic || !nodeText) return;

    try {
      setLoading(true);

      if (forceRefresh) {
        // Generate new quiz if refresh is requested
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/quiz/generate`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              googleId: user.googleId,
              topic,
              nodeText,
              parentContext: topic,
              forceRefresh: true,
            }),
          }
        );
        const data = await response.json();
        setQuiz(data);
        resetQuiz();
      } else {
        // Try to get existing quiz
        let response = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/quiz/${
            user.googleId
          }/${encodeURIComponent(topic)}/${encodeURIComponent(nodeText)}`
        );

        if (response.status === 404) {
          // Generate new quiz if not found
          response = await fetch(
            `${import.meta.env.VITE_SERVER_URI}/api/quiz/generate`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                googleId: user.googleId,
                topic,
                nodeText,
                parentContext: topic,
              }),
            }
          );
        }

        const data = await response.json();
        setQuiz(data);
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [user, topic, nodeText]);

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedOption === quiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setShowExplanation(false);
    setSelectedOption(null);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleCheckAnswer = () => {
    setShowExplanation(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const refreshQuiz = async () => {
    setRefreshing(true);
    await fetchQuiz(true);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Loader />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div
        className="bg-background p-8"
        style={{
          height: "calc(100vh-6[rem])",
        }}
      >
        <Card className="glass-card border-white/10 max-w-3xl mx-auto">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
                No Quiz Available
              </h2>
              <p className="text-gray-400 mb-6">
                We couldn't find or generate a quiz for this topic.
              </p>
              <Button
                onClick={() => navigate(-1)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <ArrowLeft className="mr-2 w-4 h-4" /> Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 border-white/10 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {!quizCompleted && quiz && (
            <Button
              variant="outline"
              onClick={refreshQuiz}
              disabled={refreshing}
              className="flex items-center gap-1 border-white/10 text-white hover:bg-white/10"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Updating..." : "New Questions"}
            </Button>
          )}
        </div>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-2 border-b border-white/10">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Quiz: {nodeText}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quizCompleted ? (
              <div className="text-center py-8">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary/30 to-yellow-400/30 opacity-70 blur-lg animate-pulse"></div>
                  <Award className="w-24 h-24 text-yellow-400 relative" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-white">
                  Quiz Completed!
                </h2>
                <p className="text-lg mb-4 text-gray-300">
                  Your score: {score} out of {quiz.questions.length} (
                  {Math.round((score / quiz.questions.length) * 100)}%)
                </p>
                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    onClick={resetQuiz}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Try Again
                  </Button>
                  {/* <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="border-white/10 text-white hover:bg-white/10"
                  >
                    Back to Learning Path
                  </Button> */}
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    Question {currentQuestion + 1} of {quiz.questions.length}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    Score: {score}
                  </span>
                </div>

                <h3 className="text-lg font-medium mb-4 text-white">
                  {quiz.questions[currentQuestion].question}
                </h3>

                <div className="space-y-3 mb-6">
                  {quiz.questions[currentQuestion].options.map(
                    (option, idx) => (
                      <div
                        key={idx}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedOption === idx
                            ? "border-primary bg-primary/10"
                            : "border-white/10 hover:border-white/30"
                        } ${
                          showExplanation &&
                          idx === quiz.questions[currentQuestion].correctAnswer
                            ? "border-green-500 bg-green-500/10"
                            : ""
                        } ${
                          showExplanation &&
                          selectedOption === idx &&
                          idx !== quiz.questions[currentQuestion].correctAnswer
                            ? "border-red-500 bg-red-500/10"
                            : ""
                        }`}
                        onClick={() =>
                          !showExplanation && handleOptionSelect(idx)
                        }
                      >
                        <div className="flex items-start">
                          <div className="mr-3 mt-0.5">
                            {showExplanation &&
                            idx ===
                              quiz.questions[currentQuestion].correctAnswer ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : showExplanation && selectedOption === idx ? (
                              <XCircle className="w-5 h-5 text-red-500" />
                            ) : (
                              <div
                                className={`w-5 h-5 rounded-full border ${
                                  selectedOption === idx
                                    ? "border-primary bg-primary"
                                    : "border-white/30"
                                }`}
                              />
                            )}
                          </div>
                          <div className="text-gray-300">{option}</div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {showExplanation && (
                  <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="font-medium mb-1 text-white flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-400" />
                      Explanation:
                    </h4>
                    <p className="text-gray-300">
                      {quiz.questions[currentQuestion].explanation}
                    </p>
                  </div>
                )}

                <div className="flex justify-end">
                  {!showExplanation ? (
                    <Button
                      onClick={handleCheckAnswer}
                      disabled={selectedOption === null}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      Check Answer
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuestion}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      {currentQuestion < quiz.questions.length - 1
                        ? "Next Question"
                        : "Finish Quiz"}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizView;
