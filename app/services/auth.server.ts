// app/services/auth.server.ts
import { Authenticator } from "remix-auth";
import { sessionStorage } from "@/services/session.server";
import { GitHubStrategy } from "remix-auth-github";
import { db } from "@/utils/database.server";
import type { User } from "@prisma/client";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage);

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_SECRET) {
    throw new Error("The GITHUB_CLIENT_ID and GITHUB_SECRET environment variables are required");
}

let gitHubStrategy = new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: "http://localhost:3000/auth/github/callback",
    },
    async ({ accessToken, extraParams, profile }) => {
        // check if user exists in our db
        let user;
        user = await db.user.findFirst({
            where: {
                email: profile.emails[0].value,
            },
        });

        if (!user) {
            user = await db.user.create({ 
                data: {
                    email: profile.emails[0].value,
                    name: profile.displayName
                }
            });
        }
        
        return user;
    }
);

authenticator.use(gitHubStrategy);
