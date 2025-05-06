"use client";

import {
  PlusCircle,
  FolderOpen,
  ClipboardList,
  LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ActionCard from "@/components/ui/app-ui/actionCard";

interface ActionItem {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  textColor: string;
  path: string;
  className?: string;
}

const actions: ActionItem[] = [
  {
    title: "New Roast",
    description: "Start a fresh roasting session",
    icon: PlusCircle,
    iconColor: "text-primary",
    iconBg: "bg-primary/20",
    textColor: "text-primary-foreground",
    path: "/roast",
  },
  {
    title: "Load Roast",
    description: "View and load previous roasts",
    icon: FolderOpen,
    iconColor: "text-secondary",
    iconBg: "bg-secondary/20",
    textColor: "text-secondary-foreground",
    path: "/logs",
  },
  {
    title: "Roast Logs",
    description: "Review your roast history",
    icon: ClipboardList,
    iconColor: "text-accent",
    iconBg: "bg-accent/20",
    textColor: "text-accent-foreground",
    path: "/logs",
    className:
      "sm:col-span-2 md:col-span-1 sm:mx-auto md:mx-0 sm:w-1/2 md:w-full",
  },
];

export default function HomeActionGrid() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-4xl">
      {actions.map(({ icon: Icon, ...action }) => (
        <ActionCard
          key={action.title}
          title={action.title}
          description={action.description}
          icon={<Icon size={28} className={action.iconColor} />}
          iconBgColor={action.iconBg}
          onClick={() => router.push(action.path)}
          className={`border-${action.iconColor}/20 hover:border-${
            action.iconColor
          }/40 transition-all ${action.className ?? ""}`}
          textColor={action.textColor}
          descriptionColor="text-muted-foreground"
        />
      ))}
    </div>
  );
}
