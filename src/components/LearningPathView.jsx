"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Circle,
  ArrowRight,
  BookOpen,
  ExternalLink,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import Loader from "./Loader";

const LearningPathView = ({ topic }) => {
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLearningPath = async () => {
      if (!user || !topic) return;

      try {
        setLoading(true);

        // Try to get existing learning path
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/learning-path/${
            user.googleId
          }/${encodeURIComponent(topic)}`
        );

        if (response.status === 404) {
          // Generate new learning path if not found
          const createResponse = await fetch(
            `${import.meta.env.VITE_SERVER_URI}/api/learning-path/generate`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ googleId: user.googleId, topic }),
            }
          );
          const data = await createResponse.json();
          setLearningPath(data);
        } else {
          const data = await response.json();
          setLearningPath(data);
        }
      } catch (error) {
        console.error("Error fetching learning path:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPath();
  }, [user, topic]);

  const updateNodeStatus = async (nodeText, status) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URI}/api/learning-path/update-status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            googleId: user.googleId,
            topic,
            nodeText,
            status,
          }),
        }
      );

      const updatedPath = await response.json();
      setLearningPath(updatedPath);
    } catch (error) {
      console.error("Error updating node status:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "mastered":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "in_progress":
        return (
          <Circle className="w-5 h-5 text-yellow-400 fill-yellow-400/50" />
        );
      default:
        return <Circle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "not_started":
        return "in_progress";
      case "in_progress":
        return "mastered";
      case "mastered":
        return "not_started";
      default:
        return "in_progress";
    }
  };

  const refreshLearningPath = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URI}/api/learning-path/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ googleId: user.googleId, topic }),
        }
      );
      const data = await response.json();
      setLearningPath(data);
    } catch (error) {
      console.error("Error refreshing learning path:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!learningPath) {
    return (
      <Card className="glass-card border-white/10">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">
              No learning path available for this topic.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort nodes by priority (highest first)
  const sortedNodes = [...learningPath.nodes].sort(
    (a, b) => b.priority - a.priority
  );

  // Calculate progress
  const totalNodes = sortedNodes.length;
  const masteredNodes = sortedNodes.filter(
    (node) => node.status === "mastered"
  ).length;
  const inProgressNodes = sortedNodes.filter(
    (node) => node.status === "in_progress"
  ).length;
  const progressPercentage =
    totalNodes > 0 ? Math.round((masteredNodes / totalNodes) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <Card className="glass-card border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <svg
                  className="w-16 h-16 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-gray-700"
                    strokeWidth="2"
                  ></circle>
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-primary"
                    strokeWidth="2"
                    strokeDasharray={`${progressPercentage} 100`}
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {progressPercentage}%
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Your Progress</h3>
                <p className="text-gray-400">
                  {masteredNodes} mastered · {inProgressNodes} in progress
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshLearningPath}
              disabled={refreshing}
              className="flex items-center gap-1 border-white/10 text-white hover:bg-white/10"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Updating..." : "Refresh"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Learning Path */}
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-2 border-b border-white/10">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 py-4">
            {sortedNodes.map((node, index) => (
              <div
                key={node.nodeText}
                className="glass-effect rounded-lg p-4 transition-all hover:bg-white/5"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() =>
                        updateNodeStatus(
                          node.nodeText,
                          getNextStatus(node.status)
                        )
                      }
                      className="mt-1 transition-transform hover:scale-110"
                    >
                      {getStatusIcon(node.status)}
                    </button>
                    <div>
                      <h3 className="font-medium text-lg text-white">
                        {node.nodeText}
                      </h3>
                      <Badge className="mt-1 bg-primary/20 text-primary hover:bg-primary/30">
                        Priority: {node.priority}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `/quiz/${encodeURIComponent(
                          topic
                        )}/${encodeURIComponent(node.nodeText)}`,
                        "_blank"
                      )
                    }
                    className="text-primary hover:text-white hover:bg-primary/20"
                  >
                    Take Quiz <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>

                {node.recommendedResources &&
                  node.recommendedResources.length > 0 && (
                    <div className="mt-3 pl-10">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">
                        Recommended Resources:
                      </h4>
                      <ul className="space-y-1">
                        {node.recommendedResources.map((resource, idx) => (
                          <li
                            key={idx}
                            className="text-sm flex items-center text-primary"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            <a
                              href={
                                resource.startsWith("http")
                                  ? resource
                                  : `https://www.google.com/search?q=${encodeURIComponent(
                                      resource
                                    )}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {resource}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningPathView;
