export const roles = ["cliente", "pt", "nutrizionista", "admin"] as const;

export type Role = (typeof roles)[number];

export const roleLabels: Record<Role, string> = {
  cliente: "Cliente",
  pt: "Personal trainer",
  nutrizionista: "Nutrizionista",
  admin: "Amministratore",
};

export function dashboardPath(role: Role): string {
  if (role === "pt") return "/pt";
  if (role === "nutrizionista") return "/nutrizionista";
  return "/cliente";
}
