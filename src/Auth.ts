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

.post("/login", async ({body}) => {
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

    return {
      success: true,
      // data: data,
      user:data.user,
      token:data.session,
      message: "User logged in successfully."
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




