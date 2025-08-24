import { Elysia } from "elysia";
import {Auth} from "./Auth";
import { cors } from '@elysiajs/cors'
import { generateRoadmap } from "./ roadmapAgent";
// import {insertRoadmap} from './ roadmapAgent'
import { supabase } from "./connection";
import insertRoadmap  from "./Roadmap";
import { getUserRoadmaps } from "./getUserRoadmaps";
import { getRoadmapById } from "./getroadmap";


const app = new Elysia()
.get('/hello',()=>{
  return 'hello salah'
})

.use(cors({ origin: "http://localhost:3000", credentials: true }))
.use(Auth)


.post("/roadmap", async ({ body , headers,set}) => {
  const { sentence , userid } = body as { sentence: string , userid:string};
   
  if (!sentence) {
    return { success: false, message: "Please provide a sentence to generate a roadmap" };
  }

  try {
    const roadmap = await generateRoadmap(sentence);
    let insertedRoadmap = null;

    if(roadmap){
      insertedRoadmap = await insertRoadmap(userid, roadmap);
    }

    return { success: true, roadmap: insertedRoadmap || roadmap };
  } catch (e) {
    return { success: false, message: e.message || "Error inserting roadmap" };
  }
})

.get('/me', async ({ headers, set }) => {
  const authHeader = headers['authorization'];
  if (!authHeader) {
    set.status = 401;
    return { success: false, message: 'No token provided' };
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"

  // Verify the token and get user info
  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    set.status = 401;
    return { success: false, message: error.message };
  }

  return { success: true, user: data.user };
})


.post("/getuser", async ({ body, set }) => {
  const { user_id } = body as { user_id?: string };
  if (!user_id) {
    set.status = 400;
    return { success: false, message: "user_id is required" };
  }

  try {
    const {data,success,error} = await getUserRoadmaps (user_id);

    if(success){
      set.status=200;
      return {
        data,
      };
    }
   console.log(error)
   return false;
  } catch (error) {
    set.status = 500;
    const message = error instanceof Error ? error.message : "Failed to fetch user roadmaps";
    return { success: false, message };
  }
})

.delete('/deletuser/:id', async ({params,set})=>{
  const { id } = params;

  if (!id) {
    set.status = 400;
    return { success: false, message: 'Roadmap ID is required' };
  }

  try {
    const { data, error } = await supabase.from('roadmaps').delete().eq('id', id);

    if (error) {
      set.status = 500;
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (err) {
    set.status = 500;
    return { success: false, message: err instanceof Error ? err.message : 'Unknown error' };
  }
})

.post("/getroadmap/:id", async ({params,set})=>{
  try{
    const {id}=params

    if (!id) {
      set.status = 400;
      return { success: false, message: 'Roadmap ID is required' };
    }
      const {data,error}= await getRoadmapById(id)
  
      if (error) {
        set.status = 500;
        return { success: false, message: error };
      }
  
      return {
        success:true,
        data,
        error
      }
  }catch (err: any) {
    console.error("Server error:", err);
    set.status = 500;
    return {
      success: false,
      message: "Internal server error",
      error: err.message || err,
    };
  }
})








export default app;
