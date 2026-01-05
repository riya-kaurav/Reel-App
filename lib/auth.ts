import { NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User  from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions : NextAuthOptions = {
    providers: [
        CredentialsProvider({
          name : "Credentials",
            credentials : {
                email : { label : "Email" , type : "text" , placeholder : "Enter your email"},
                password : { label : "Password" , type : "password" , placeholder : "Enter your password"}
            },
            async authorize(credemtials){
                if(!credemtials?.email || !credemtials?.password) {
                    throw new Error("Please provide email and password");
                }

                try {
                    await connectToDatabase();
                    const user = await User.findOne({ email : credemtials.email});
                    if(!user) {
                        throw new Error("Invalid email or password");
                    }
                    const isPasswordCorrect = await  bcrypt.compare(credemtials.password , user.password);
                    if(!isPasswordCorrect) {
                        throw new Error("Invalid email or password");
                    }
                    return {
                        id : user._id.toString(),
                        email : user.email
                    };
                }
             catch(error) {
                throw new Error("Login failed. Please try again.");
            }
            }

        }),
 
         
    ],
    callbacks: {
        async jwt({token , user}) {
            if(user) {
               token.id = user.id
            }
            return token
        },
        async session({session, token}) {
             if(session.user) {
                session.user.id = token.id as string
             }
            
            return session
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"

    },
    session: {
        strategy : "jwt",
        maxAge: 30* 24* 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
};