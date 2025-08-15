import { Elysia } from "elysia";
import {Auth} from "./Auth";

const app = new Elysia()
.get('/',()=>{
  return 'hello salah'
})
.use(Auth);
app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
