import { supabase } from "../app";

const getUsernameByEventIdService = async (eventId: string) => {
  const response = await supabase
    .from("event")
    .select("created_by_id")
    .eq("id", eventId)
    .single();

  if (response.error) {
    throw new Error("El id ingresado no existe");
  } else {
    const createdById = response.data.created_by_id;
    const { data: userId } = await supabase
      .from("profile")
      .select("username")
      .eq("user", createdById)
      .single();
    return userId;
  }
};
export { getUsernameByEventIdService };
