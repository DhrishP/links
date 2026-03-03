"use client";

import { useState } from "react";
import { Link as LinkIcon, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientTabs({
  linksComponent,
  agentsComponent,
}: {
  linksComponent: React.ReactNode;
  agentsComponent: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<"links" | "agents">("links");

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative flex p-1.5 space-x-1 bg-zinc-100/80 dark:bg-zinc-800/50 backdrop-blur-md rounded-2xl mb-12 w-full max-w-sm mx-auto shadow-inner border border-white/20 dark:border-zinc-700/50">
        {[
          { id: "links", label: "Links", icon: LinkIcon },
          { id: "agents", label: "Agent Skills", icon: Cpu },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "links" | "agents")}
              className={`relative flex items-center justify-center w-full py-2.5 text-sm font-medium rounded-xl transition-colors duration-300 z-10 ${
                isActive
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute inset-0 bg-white dark:bg-zinc-700 rounded-xl shadow-sm border border-black/4 dark:border-white/4"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-20 flex items-center">
                <Icon
                  className={`w-4 h-4 mr-2 transition-transform duration-300 ${
                    isActive ? "scale-110" : ""
                  }`}
                />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="w-full relative min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full absolute top-0 left-0"
          >
            {activeTab === "links" ? linksComponent : agentsComponent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
