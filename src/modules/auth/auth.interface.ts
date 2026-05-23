import type { ROLES } from "../../types";

export interface ISingupUser {
  name: string;
  email: string;
  password: string;
  role: ROLES;
}
