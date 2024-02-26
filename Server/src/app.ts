import express from "express";
import cors from "cors";
import "dotenv/config";
import { router } from "./routes/event.router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.API_URL as string,
  process.env.API_KEY as string
);

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(router);
app.listen(PORT, () => console.log(`server listening on port: ${PORT}`));

export { supabase };
