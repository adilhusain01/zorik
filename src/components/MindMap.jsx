"use client";

import { useState, useEffect } from "react";
import mermaid from "mermaid";
import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  Loader2,
  Download,
  ChevronRight,
  MessageCircle,
  Trash2,
  Search,
  Info,
  HelpCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ExplanationCard from "./ExplanationCard";
import { useAuth } from "../contexts/AuthContext";
import LearningPathView from "./LearningPathView";

const MindMap = () => {
  const [topic, setTopic] = useState("");
  const [mermaidCode, setMermaidCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [explanations, setExplanations] = useState([]);
  const { user, login } = useAuth();
  const [userMindmaps, setUserMindmaps] = useState([]);
  const [clickedNodes, setClickedNodes] = useState(new Set());
  const [showLearningPath, setShowLearningPath] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      fetchUserMindmaps();
    }
  }, [user]);

  const fetchUserMindmaps = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URI}/api/user-mindmaps/${user.googleId}`
      );
      const data = await response.json();
      setUserMindmaps(data);
    } catch (error) {
      console.error("Error fetching mindmaps:", error);
    }
  };

  useEffect(() => {
    const fetchClickedNodes = async () => {
      if (user && topic) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_SERVER_URI}/api/clicked-nodes/${
              user.googleId
            }/${encodeURIComponent(topic)}`
          );
          const data = await response.json();
          setClickedNodes(new Set(data.map((node) => node.nodeText)));
        } catch (error) {
          console.error("Error fetching clicked nodes:", error);
        }
      }
    };

    fetchClickedNodes();
  }, [user, topic]);

  const generateMindmap = async () => {
    if (!user) {
      // Handle not logged in state
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URI}/api/mindmap/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, googleId: user.googleId }),
        }
      );
      const data = await response.json();
      console.log(data);
      setMermaidCode(data.mermaidCode);
      if (data.isNew) {
        fetchUserMindmaps();
      }
    } catch (error) {
      console.error("Error generating mindmap:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      securityLevel: "loose",
      mindmap: {
        padding: 16,
        curve: "basis",
      },
    });
  }, []);

  useEffect(() => {
    if (mermaidCode) {
      mermaid.render("mindmap", mermaidCode).then(({ svg }) => {
        const container = document.getElementById("diagram-container");
        if (container) {
          container.innerHTML = svg;

          const textElements = container.querySelectorAll(".mindmap-node text");
          textElements.forEach((textEl) => {
            const parentG = textEl.closest("g");
            if (parentG) {
              parentG.style.cursor = "pointer";
              const nodeText = textEl.textContent.trim();
              const cleanNodeText = nodeText.replace(/['"()]/g, "");

              // Add checkmark if node is clicked
              if (clickedNodes.has(cleanNodeText)) {
                const checkmark = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "text"
                );
                checkmark.textContent = "✓";
                checkmark.setAttribute(
                  "x",
                  Number.parseFloat(textEl.getAttribute("x")) +
                    textEl.getComputedTextLength() +
                    5
                );
                checkmark.setAttribute("y", textEl.getAttribute("y"));
                checkmark.setAttribute("fill", "#22c55e");
                checkmark.setAttribute("class", "checkmark");
                parentG.appendChild(checkmark);
              }

              parentG.onclick = (e) => {
                e.stopPropagation();
                handleNodeClick(cleanNodeText, topic);
              };

              parentG.onmouseenter = () => {
                textEl.style.fontWeight = "bold";
                textEl.style.transform = "scale(1.05)";
                textEl.style.transition = "all 0.2s ease";
                parentG
                  .querySelector("path")
                  ?.setAttribute("fill-opacity", "0.9");
              };

              parentG.onmouseleave = () => {
                textEl.style.fontWeight = "normal";
                textEl.style.transform = "scale(1)";
                parentG
                  .querySelector("path")
                  ?.setAttribute("fill-opacity", "1");
              };
            }
          });

          const svgElement = container.querySelector("svg");
          if (svgElement) {
            svgElement.style.width = "100%";
            svgElement.style.height = "auto";
            svgElement.style.minHeight = "600px";
            svgElement.style.filter =
              "drop-shadow(0 0 10px rgba(139, 92, 246, 0.3))";

            if (!svgElement.getAttribute("viewBox")) {
              const bbox = svgElement.getBBox();
              svgElement.setAttribute(
                "viewBox",
                `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`
              );
            }
          }
        }
      });
    }
  }, [mermaidCode, topic, clickedNodes]);

  const handleSelectTopic = async (selectedTopic) => {
    setIsLoadingContent(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URI}/api/mindmap/${
          user.googleId
        }/${encodeURIComponent(selectedTopic)}`
      );
      const data = await response.json();
      console.log(data);
      setTopic(selectedTopic);
      setMermaidCode(data.mermaidCode);
      setExplanations([]);
    } catch (error) {
      console.error("Error fetching mindmap:", error);
    }
    setIsLoadingContent(false);
  };

  const handleNodeClick = async (nodeText, parentContext) => {
    try {
      // First, track the click
      await fetch(`${import.meta.env.VITE_SERVER_URI}/api/track-node-click`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleId: user.googleId,
          topic,
          nodeText,
        }),
      });

      // Update local state
      setClickedNodes((prev) => new Set([...prev, nodeText]));

      // Get node info as before
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URI}/api/get-node-info`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nodeText,
            parentContext,
            googleId: user.googleId,
          }),
        }
      );
      const data = await response.json();

      setExplanations((prev) => [
        {
          node: nodeText,
          explanation: data.explanation,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const downloadDiagram = () => {
    const svgElement = document.querySelector("#diagram-container svg");
    if (svgElement) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${topic}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDeleteMindmap = async (topicToDelete) => {
    try {
      await fetch(
        `${import.meta.env.VITE_SERVER_URI}/api/delete-mindmap/${
          user.googleId
        }/${encodeURIComponent(topicToDelete)}`,
        {
          method: "DELETE",
        }
      );
      setUserMindmaps((prevMindmaps) =>
        prevMindmaps.filter((mindmap) => mindmap.topic !== topicToDelete)
      );
      if (topic === topicToDelete) {
        setTopic("");
        setMermaidCode("");
        setExplanations([]);
      }
    } catch (error) {
      console.error("Error deleting mindmap:", error);
    }
  };

  const filteredMindmaps = userMindmaps.filter((mindmap) =>
    mindmap.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Card className="glass-card text-center p-8 max-w-md w-full">
          <div className="mb-6">
            <Brain className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome to ConceptBridge
            </h2>
            <p className="text-gray-400 mb-6">
              Please login with Google to create and view mindmaps.
            </p>
          </div>
          <Button
            onClick={() => login()}
            className="w-full bg-gradient-to-r from-primary to-purple-400 hover:from-primary/90 hover:to-purple-500 text-white py-2"
          >
            Login with Google
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen bg-background"
      style={{ height: "calc(100vh - 6rem)" }}
    >
      {/* Left Sidebar */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 glass-nav border-r border-white/10 flex flex-col"
      >
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold text-white">Mind Maps</h1>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search maps..."
              className="pl-9 bg-white/5 border-white/10 focus:border-primary text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
          <div className="space-y-1 py-2">
            {filteredMindmaps.length > 0 ? (
              filteredMindmaps.map((mindmap) => (
                <article
                  key={mindmap.topic}
                  className="flex flex-row items-center justify-between w-full group"
                >
                  <Button
                    variant={topic === mindmap.topic ? "secondary" : "ghost"}
                    className={`flex-1 justify-start text-left rounded-lg ${
                      topic === mindmap.topic
                        ? "bg-primary/20 text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    } flex flex-row`}
                    onClick={() => handleSelectTopic(mindmap.topic)}
                  >
                    <ChevronRight
                      className={`w-4 h-4 ${
                        topic === mindmap.topic
                          ? "text-primary"
                          : "text-gray-400"
                      }`}
                    />
                    <span className="truncate overflow-hidden text-ellipsis">
                      {mindmap.topic.length > 15
                        ? `${mindmap.topic.substring(0, 15)}...`
                        : mindmap.topic}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => handleDeleteMindmap(mindmap.topic)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </article>
              ))
            ) : searchTerm ? (
              <div className="text-center py-4 text-gray-400">
                No mind maps found
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                <p>Create your first mind map using the input below</p>
              </div>
            )}
          </div>
        </div>
        {mermaidCode && (
          <div className="p-4 border-t border-white/10">
            <Button
              onClick={() => setShowLearningPath(!showLearningPath)}
              className="w-full bg-gradient-to-r from-primary to-purple-400 hover:from-primary/90 hover:to-purple-500 text-white"
            >
              {showLearningPath ? "Hide Learning Path" : "Show Learning Path"}
            </Button>
          </div>
        )}
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-auto p-6 relative custom-scrollbar">
          {isLoadingContent ? (
            <div className="flex items-center justify-center h-full">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-purple-400/30 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <Loader2 className="w-12 h-12 text-primary animate-spin relative" />
              </div>
            </div>
          ) : mermaidCode ? (
            <div id="diagram-container" className="w-full min-h-[600px]" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <Brain className="w-16 h-16 text-primary/50 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Create a Mind Map
                </h2>
                <p className="text-gray-400 mb-6">
                  Enter a topic below to generate an interactive mind map
                  powered by AI.
                </p>
              </div>
            </div>
          )}
          <div className="absolute top-6 right-6 flex gap-2">
            {mermaidCode && (
              <Button
                onClick={downloadDiagram}
                className="bg-white/10 hover:bg-white/20 text-white flex flex-row"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 glass-nav border-t border-white/10">
          <div className="max-w-3xl mx-auto flex gap-3">
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="eg. Indian Tax System"
              className="px-4 flex-1 bg-white/5 border-white/10 focus:border-primary text-white"
            />
            <Button
              onClick={generateMindmap}
              disabled={loading || !topic}
              className="bg-gradient-to-r from-primary to-purple-400 hover:from-primary/90 hover:to-purple-500 text-white shadow-lg flex flex-row"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Generate
            </Button>
          </div>
        </div>

        {/* Add Learning Path overlay */}
        {showLearningPath && mermaidCode && (
          <div className="absolute inset-0 bg-background/95 backdrop-blur-md z-10 p-6">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Learning Path: {topic}
                </h2>
                <Button
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/10"
                  onClick={() => setShowLearningPath(false)}
                >
                  Back to Mindmap
                </Button>
              </div>
              <LearningPathView topic={topic} />
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-96 glass-card border border-white/10 shadow-xl flex flex-col"
      >
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-primary" />
            <h2 className="font-semibold text-white">Explanations</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-4">
            {explanations.length > 0 ? (
              explanations.map((item) => (
                <ExplanationCard
                  key={item.timestamp}
                  node={item.node}
                  explanation={item.explanation}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <Info className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No explanations yet
                </h3>
                <p className="text-gray-400">
                  Click on any node in the mind map to see detailed explanations
                  here.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MindMap;
