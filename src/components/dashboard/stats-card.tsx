"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  tooltip?: string;
  className?: string; // Add className property
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  color = "text-gray-900",
  tooltip,
  className, // Accept className as a prop
}: StatsCardProps) {
  // Default tooltip if none provided
  const tooltipText = tooltip || `This represents the ${title.toLowerCase()} tracked in our system. ${description}`;

  // Map color classes properly for Tailwind
  const colorMap: Record<string, { bg: string; ring: string; iconBg: string }> = {
    "text-blue-600": { bg: "bg-blue-50", ring: "ring-blue-100", iconBg: "bg-blue-100" },
    "text-red-600": { bg: "bg-red-50", ring: "ring-red-100", iconBg: "bg-red-100" },
    "text-green-600": { bg: "bg-green-50", ring: "ring-green-100", iconBg: "bg-green-100" },
    "text-yellow-600": { bg: "bg-yellow-50", ring: "ring-yellow-100", iconBg: "bg-yellow-100" },
    "text-purple-600": { bg: "bg-purple-50", ring: "ring-purple-100", iconBg: "bg-purple-100" },
    "text-indigo-600": { bg: "bg-indigo-50", ring: "ring-indigo-100", iconBg: "bg-indigo-100" },
    "text-pink-600": { bg: "bg-pink-50", ring: "ring-pink-100", iconBg: "bg-pink-100" },
    "text-gray-900": { bg: "bg-gray-50", ring: "ring-gray-100", iconBg: "bg-gray-100" },
  };

  const colors = colorMap[color] || colorMap["text-gray-900"];
  const bgClass = colors.bg;
  const ringClass = colors.ring;
  const iconBgClass = colors.iconBg;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card
              className={cn(
                "relative overflow-hidden p-6 transition-all",
                "hover:shadow-lg hover:ring-2",
                ringClass,
                bgClass,
                className // Apply the className prop
              )}
            >
              {/* Background Decoration */}
              <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full opacity-10 bg-gradient-to-br from-current to-transparent" />

              {/* Icon Container */}
              <div
                className={cn(
                  "mb-4 inline-flex items-center justify-center rounded-lg p-3",
                  iconBgClass,
                  "transition-transform duration-200 ease-in-out"
                )}
              >
                <Icon className={cn("h-6 w-6", color)} />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-600">{title}</h3>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className={cn("text-3xl font-bold tracking-tight", color)}>
                    {value}
                  </span>
                </div>

                <p className="text-sm text-gray-600">{description}</p>
              </div>

              {/* Interactive Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 transform translate-x-[-100%] hover:translate-x-[100%]" />
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="max-w-xs p-4 text-sm bg-white shadow-xl rounded-lg border"
        >
          <div className="space-y-2">
            <p className="font-medium text-gray-900">{title}</p>
            <p className="text-gray-600">{tooltipText}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
