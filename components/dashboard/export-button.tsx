"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { Button } from "@/components/shared/button";

interface ExportButtonProps {
  clipId: string;
  className?: string;
}

export function ExportButton({ clipId, className }: ExportButtonProps) {
  const [status, setStatus] = useState<"idle" | "queued" | "generating" | "completed" | "failed">(
    "idle"
  );
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) {
        window.clearInterval(pollRef.current);
      }
    };
  }, []);

  function stopPolling() {
    if (pollRef.current) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  function startPolling(nextJobId: string) {
    stopPolling();
    pollRef.current = window.setInterval(async () => {
      const response = await fetch(`/api/export-jobs/${nextJobId}`);
      const result = await response.json();

      if (!response.ok) {
        setStatus("failed");
        stopPolling();
        return;
      }

      const nextStatus = result.job.status as typeof status;
      setStatus(nextStatus);

      if (nextStatus === "completed") {
        stopPolling();
        if (result.job.outputUrl) {
          window.location.href = result.job.outputUrl;
        }
      }

      if (nextStatus === "failed") {
        stopPolling();
      }
    }, 1500);
  }

  async function handleClick() {
    startTransition(async () => {
      setStatus("queued");
      const response = await fetch(`/api/clips/${clipId}/export`, {
        method: "POST"
      });
      const result = await response.json();

      if (!response.ok) {
        setStatus("failed");
        return;
      }

      setStatus(result.job.status);
      startPolling(result.job.id);
    });
  }

  return (
    <Button onClick={handleClick} className={className} disabled={status === "queued" || status === "generating"}>
      {status === "queued" || status === "generating" ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          {status === "queued" ? "Queued..." : "Rendering..."}
        </>
      ) : status === "completed" ? (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download MP4
        </>
      ) : status === "failed" ? (
        "Retry Export"
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Render & Download
        </>
      )}
    </Button>
  );
}
