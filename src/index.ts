import { Elysia } from "elysia";
import {Auth} from "./Auth";
import { cors } from '@elysiajs/cors'
import { generateRoadmap } from "./ roadmapAgent";



const app = new Elysia()
.get('/',()=>{
  return 'hello salah'
})

.use(cors({ origin: "http://localhost:3000", credentials: true }))
.use(Auth)
.post("/roadmap", async ({ body }) => {
  const { sentence } = body as { sentence: string };

  if (!sentence) {
    return {
      success: false,
      message: "Please provide a sentence to generate a roadmap",
    };
  }

  const roadmap = await generateRoadmap(sentence);
  return {
    success: true,
    roadmap,
  };
});
















app.listen(5000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
