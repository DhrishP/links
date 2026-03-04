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
    <>
      <header className="mb-6 sm:mb-8 shrink-0 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl text-foreground transition-colors duration-300">
          {activeTab === "links" ? "Links" : "Agent Skills"}
        </h1>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground font-medium max-w-2xl mx-auto transition-colors duration-300">
          {activeTab === "links"
            ? "A curated collection of interesting bookmarks, powerful tools, and resources collected during my time on the internet."
            : "A collection of modular agent skills, system prompts, and AI instructions."}
        </p>
      </header>

      <div className="flex-1 flex flex-col min-h-0 items-center w-full">
        <div className="relative shrink-0 flex p-1.5 space-x-1 glass rounded-2xl mb-8 w-full max-w-sm mx-auto z-10">
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
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute inset-0 bg-background rounded-xl border border-border shadow-sm"
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

        <div className="w-full flex-1 min-h-0 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full h-full absolute top-0 left-0 overflow-y-auto overflow-x-hidden pb-8 scrollbar-hide"
            >
              {activeTab === "links" ? linksComponent : agentsComponent}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
