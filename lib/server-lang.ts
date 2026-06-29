import { cookies } from "next/headers";
import type { Lang } from "./translations";

export async function getServerLang(): Promise<Lang> {
    const cookieStore = await cookies();
    const lang = cookieStore.get("lang")?.value;
    return lang === "en" ? "en" : "es";
}
