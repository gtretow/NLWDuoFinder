const router = require("express").Router();
import { Request, Response } from "express";
const passport = require("passport");

router.get("/", passport.authenticate("discoord"));
router.get(
  "/discord/redirect",
  passport.authenticate("discord", {
    failureRedirect: "/forbidden",
  }),
  (req: Request, res: Response) => {
    res.send(200);
  }
);

/* router.get("/discord/redirect", (req: Request, res: Response) => {
  res.send(200);
}); */

module.exports = router;
