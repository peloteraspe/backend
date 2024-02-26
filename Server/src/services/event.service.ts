import { supabase } from "../app";

const getUsernameByEventIdService = async (eventId: string) => {
  const { data: userId } = await supabase
    .from("event")
    .select("created_by_id")
    .eq("id", eventId)
    .single();

  if (!userId) throw new Error("El id ingresado no existe");
  return userId;
};
export { getUsernameByEventIdService };
