import { supabase } from "./connection";

export async function getRoadmapById(roadmapId: string) {
  const { data, error } = await supabase
    .from("roadmaps")
    .select(`
      id,
      title,
      description,
      domain,
      estimated_duration,
      created_at,
      sections (
        id,
        title,
        summary,
        order,
        steps (
          id,
          title,
          description,
          duration,
          resources (
            id,
            type,
            title,
            url
          )
        )
      )
    `)
    .eq("id", roadmapId) // filter by roadmap id
    .single(); // 👈 ensures you get a single object instead of an array

  if (error) {
    console.error("Error fetching roadmap:", error);
    throw error;
  }

  return {
    success: true,
    data,
    error
  };
}
