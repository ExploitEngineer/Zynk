import type { UserPlan } from "@/components/nav-user";

export interface User {
  name: string;
  plan: UserPlan;
  avatar: string;
  email: string;
}
