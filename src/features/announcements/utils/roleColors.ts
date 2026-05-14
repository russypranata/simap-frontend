import type { TargetRole } from "../types/announcement";

const ROLE_BADGE = "bg-blue-800 text-white";

export function getRoleBadgeClass(_role: TargetRole): string {
  return ROLE_BADGE;
}
