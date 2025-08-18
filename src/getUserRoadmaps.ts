import {supabase} from "./connection"
export async function getUserRoadmaps(userId:string) {
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
      .eq("user_id", userId); 
  
    if (error) {
      console.error("Error fetching roadmaps:", error);
      throw error;
    }
  
    return {
        success: true,
        data, 
        error
    };
  }
  