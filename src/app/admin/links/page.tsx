import { checkApiAuth } from "@/app/api/auth/route";
import AdminLogin from "./admin-login";
import AdminDashboard from "./admin-dashboard";
import { db } from "@/server/db";
import { links, agentSkills } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "fallback_secret_key_change_in_prod";

export const dynamic = "force-dynamic";

async function isServerAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return false;
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export default async function AdminPage() {
  const isAuthenticated = await isServerAuthenticated();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 w-full">
        <AdminLogin />
      </div>
    );
  }

  const [allLinks, allSkills] = await Promise.all([
    db.select().from(links).orderBy(desc(links.createdAt)),
    db.select().from(agentSkills).orderBy(desc(agentSkills.createdAt)),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 w-full">
      <AdminDashboard links={allLinks} skills={allSkills} />
    </div>
  );
}
