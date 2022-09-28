const DiscordStrategy = require("passport-discord").Strategy;
const passport = require("passport");
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["query"] });

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_OAUTH_SECRET,
      callbackURL: process.env.CLIENT_REDIRECT,
      scope: ["identify"],
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const users = await prisma.user.findMany({});
    }
  )
);
