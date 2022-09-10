import { supabase } from "@memedows/api";

export default function (req: any, res: any) {
  supabase.auth.api.setAuthCookie(req, res);
}
