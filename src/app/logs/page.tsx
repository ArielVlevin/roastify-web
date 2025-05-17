"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowLeft, Info, Coffee } from "lucide-react";
import LogCard from "@/components/logs/LogCard";
import type { RoastLog } from "@/lib/types";
import * as api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

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

        console.log("logs: ", fetchedLogs);

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
          //log.profile.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (log.notes &&
            log.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : logs;

  const handleSelectLog = (log: RoastLog) => {
    router.push(`/logs/${log.id}`);
  };

  return (
    <div className="flex flex-col p-4 sm:p-6">
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground px-0 sm:px-4"
          >
            <ArrowLeft size={18} /> Back to Home
          </Button>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Coffee size={24} className="text-primary" /> Roast Logs
          </h1>
          <div className="w-[100px]"></div> {/* Empty div for flex alignment */}
        </div>
      </header>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="text"
          placeholder="Search roasts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 bg-background border-input"
        />
      </div>

      {/* Error Notification */}
      {error && (
        <div className="mb-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Logs List */}
      <div className="flex-grow">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading roast logs...</p>
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredLogs.map((log) => (
              <LogCard key={log.id} log={log} onClick={handleSelectLog} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-border bg-background">
            <CardContent className="text-center py-12">
              <Info size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">
                No roast logs found
              </p>
              <p className="text-muted-foreground text-sm">
                {searchTerm
                  ? "Try a different search term"
                  : "Start a new roast to create your log history"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => router.push("/roast")}
                  className="mt-6 bg-primary hover:bg-primary-dark text-primary-foreground"
                >
                  Start a New Roast
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
