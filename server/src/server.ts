require("dotenv").config();

import express from "express";
import cors from "cors";
const session = require("express-session");
const passport = require("passport");

import { PrismaClient } from "@prisma/client";
import { converHourStringToMinutes } from "./utils/convert-hour-to-minute";
import { convertMinuteToHourString } from "./utils/convert-minute-tohour";

const app = express();
const authRoute = require("./routes/auth");
const discordStrategy = require("./strategies/discordstrategy");

app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "random secret",
    cookie: {
      maxAge: 60000 * 60 * 24,
    },
    saveUnitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);

const prisma = new PrismaClient({
  log: ["query"],
});

app.get("/games", async (request, response) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        },
      },
    },
  });

  return response.json(games);
});

app.post("/games/:id/ads", async (request, response) => {
  const gameId = request.params.id;
  const body: any = request.body;

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(","),
      hourStart: converHourStringToMinutes(body.hourStart),
      hourEnd: converHourStringToMinutes(body.hourEnd),
      useVoiceChannel: body.useVoiceChannel,
    },
  });

  return response.status(201).json(ad);
});

app.get("/games/:id/ads", async (request, response) => {
  const gameId = request.params.id;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true,
    },
    where: { gameId },
    orderBy: {
      createdAt: "desc",
    },
  });

  return response.json(
    ads.map((ad: any) => {
      return {
        ...ad,
        weekDays: ad.weekDays.split(","),
        hourStart: convertMinuteToHourString(ad.hourStart),
        hourEnd: convertMinuteToHourString(ad.hourEnd),
      };
    })
  );
});

app.get("/ads/:id/discord", async (request, response) => {
  const adId = request.params.id;
  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId,
    },
  });

  return response.json({
    discord: ad.discord,
  });
});

app.listen(3333);
