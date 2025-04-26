"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Search, ArrowLeft, Info } from "lucide-react";
import LogCard from "@/components/logs/LogCard";
import { RoastLog } from "@/lib/types";
import * as api from "@/lib/api";
import Notification from "@/components/ui/Notification";

export default function LogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<RoastLog[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const fetchedLogs = await api.getRoastLogs();
        setLogs(fetchedLogs);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
        setError("Failed to load roast logs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Filter logs based on search term
  const filteredLogs = searchTerm
    ? logs.filter(
        (log) =>
          log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.profile.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (log.notes &&
            log.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : logs;

  const handleSelectLog = (log: RoastLog) => {
    // In a full implementation, you'd navigate to a log detail page
    // or load this log into the roaster
    router.push(`/logs/${log.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-100 p-4">
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1 text-stone-600 hover:text-stone-800"
          >
            <ArrowLeft size={20} /> Back to Home
          </button>
          <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
            <ClipboardList size={24} /> Roast Logs
          </h1>
          <div></div> {/* Empty div for flex alignment */}
        </div>
      </header>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search roasts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 bg-white border border-stone-300 rounded-lg shadow-sm"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400"
          />
        </div>
      </div>

      {/* Error Notification */}
      {error && (
        <div className="mb-6">
          <Notification
            notification={{ type: "warning", message: error }}
            onClose={() => setError(null)}
          />
        </div>
      )}

      {/* Logs List */}
      <div className="flex-grow">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700 mx-auto mb-4"></div>
            <p className="text-stone-600">Loading roast logs...</p>
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLogs.map((log) => (
              <LogCard key={log.id} log={log} onClick={handleSelectLog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Info size={48} className="text-stone-400 mx-auto mb-4" />
            <p className="text-stone-600">No roast logs found</p>
            <p className="text-stone-500 text-sm">
              {searchTerm
                ? "Try a different search term"
                : "Start a new roast to create your log history"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
