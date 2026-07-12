import { cookies } from "next/headers";
import type { Lang } from "./translations";

const VALID: Lang[] = ["es", "en", "fr", "pt"];

export async function getServerLang(): Promise<Lang> {
    const cookieStore = await cookies();
    const lang = cookieStore.get("lang")?.value as Lang | undefined;
    return lang && (VALID as string[]).includes(lang) ? lang : "es";
}
