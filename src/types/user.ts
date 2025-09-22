import type { UserPlan } from "@/components/nav-user";

export interface User {
  name: string;
  plan: UserPlan;
  image?: string | null;
  email: string;
}
