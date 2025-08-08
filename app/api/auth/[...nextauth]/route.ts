import NextAuth from "next-auth";
import { getAuthOptions } from "@/lib/auth";

async function auth(req: any, res: any) {
  const authOptions = await getAuthOptions();
  return NextAuth(authOptions)(req, res);
}

export { auth as GET, auth as POST };
