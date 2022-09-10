import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://fkonnhsvtgmhywqvywoc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrb25uaHN2dGdtaHl3cXZ5d29jIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI4MDYwMzAsImV4cCI6MTk3ODM4MjAzMH0._IpLt9wYl-6Tz_iBa11s0QJo2JruNZFKtXOeT7N5u5Q"
);
