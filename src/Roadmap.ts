import {supabase} from "./connection"
 async function insertRoadmap(userId: string, data: any) {
    // 1. Insert roadmap
    const { data: roadmap, error: roadmapError } = await supabase
      .from('roadmaps')
      .insert({
        user_id: userId,
        title: data.title,
        description: data.description,
        domain: data.domain,
        estimated_duration: data.estimated_duration,
        created_at: data.created_at || new Date().toISOString()
      })
      .select()
      .single();
  
    if (roadmapError) throw roadmapError;
  
    // 2. Insert sections
    for (const section of data.sections) {
      const { data: sectionData, error: sectionError } = await supabase
        .from('sections')
        .insert({
          roadmap_id: roadmap.id,
          title: section.title,
          summary: section.summary,
          order: section.order
        })
        .select()
        .single();
  
      if (sectionError) throw sectionError;
  
      // 3. Insert steps
      for (const step of section.steps) {
        const { data: stepData, error: stepError } = await supabase
          .from('steps')
          .insert({
            section_id: sectionData.id,
            title: step.title,
            description: step.description,
            duration: step.duration
          })
          .select()
          .single();
  
        if (stepError) throw stepError;
  
        // 4. Insert resources
        for (const resource of step.resources) {
          const { error: resourceError } = await supabase.from('resources').insert({
            step_id: stepData.id,
            type: resource.type,
            title: resource.title,
            url: resource.url
          });
  
          if (resourceError) throw resourceError;
        }
      }
    }
  
    return { success: true, roadmapId: roadmap.id };
  }
  export default insertRoadmap;