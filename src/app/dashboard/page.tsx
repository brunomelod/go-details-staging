"use client";

import { ProtectedGate } from "@/components/auth/ProtectedGate";
import { AgentInbox } from "@/components/dashboard/AgentInbox";

export default function DashboardPage() {
  return (
    <ProtectedGate>
      <AgentInbox />
    </ProtectedGate>
  );
}
