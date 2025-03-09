"use client";

import { motion } from "framer-motion";
import { Crown, BookOpen, Lightbulb } from "lucide-react";

const ExplanationCard = ({ node, explanation }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative glass-card rounded-xl overflow-hidden"
    >
      <div className="p-4 bg-gradient-to-r from-primary/20 to-purple-400/20 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/20">
            <Crown className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-white truncate break-words whitespace-pre-wrap flex-1">
            {node}
          </h3>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="flex gap-3">
          <div className="p-2 rounded-full bg-blue-500/20 flex-shrink-0 h-fit">
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-sm text-gray-300 break-words whitespace-pre-wrap flex-1">
            {explanation.briefExplanation}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="p-2 rounded-full bg-purple-500/20 flex-shrink-0 h-fit">
            <Lightbulb className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-300 break-words whitespace-pre-wrap">
              <strong className="text-purple-400 font-medium">Example: </strong>
              {explanation.example}
            </div>
          </div>
        </div>

        <div className="text-sm bg-blue-500/10 backdrop-blur-sm p-4 rounded-lg border-l-2 border-blue-400">
          <div className="break-words whitespace-pre-wrap">
            <strong className="text-blue-400 font-medium">
              Key Takeaway:{" "}
            </strong>
            {explanation.keyTakeaway}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExplanationCard;
