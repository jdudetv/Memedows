import axios from "axios";
import { createRoot, createSignal } from "solid-js";
import { supabase } from "./supabase";
import { InferQueryOutput, trpcClient } from "./trpc";

const [data, setUser] = createRoot(() =>
  createSignal<InferQueryOutput<"user"> | null | undefined>(
    supabase.auth.session() ? undefined : null
  )
);

export const user = data;

supabase.auth.onAuthStateChange(async (event, session) => {
  await axios.post(
    "/api/auth/set-cookie",
    {
      event,
      session,
    },
    { withCredentials: true }
  );

  if (session) {
    const user = await trpcClient.query("user");

    setUser(user);
  } else setUser(null);
});
