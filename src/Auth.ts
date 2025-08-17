import { Elysia } from "elysia";
import { supabase } from "./connection";

// Define the type for the signup request body
type SignupBody = {
  email: string;
  password: string;
}

export const Auth = new Elysia()
.post("/signup", async ({ body }) => {
  const { email, password } = body as SignupBody;
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: data,
      message: "User signed up successfully. Please check your email to confirm your account."
    };
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred during signup"
    };
  }
})

.post("/login", async ({body,set}) => {
  const { email, password } = body as SignupBody;
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }
    // set.headers["Set-Cookie"] = `token=${data.session.access_token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`;
    // set.headers["Set-Cookie"] = `token=${data.session.access_token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax; Domain=localhost`;
   


    return {
      success: true,
      // data: data,
      user:data.user,
      token:data.session.access_token,
      message: "U ser logged in successfully."
    };
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred during login"
    };
  }
})

  .get("/dashboard", async({headers,set})=>{
      const authheader = headers['authorization']
      const token = authheader?.split(' ')[1]
      // const cookie = await request.headers.get("cookie") ?? "";
      // const token = cookie.split("token=")[1]?.split(";")[0];
      // console.log("Cookie header:", request.headers.get("cookie"));
      if(!token){
        set.status = 401;
        return {
          success: false,
          message: 'No authorization token provided'
        }
      }

      try {
      
        // Verify the JWT token
        const { data, error } = await supabase.auth.getUser(token)
        
        if(error){
          set.status = 401;
          return {
            success: false,
            error: error.message
          }
        }
        
        return {
          success: true,
          profile: data.user
        }
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          error: 'An unexpected error occurred'
        }
      }
  })




