import { Router } from "express";
import { getUsernameByEventIdController } from "../controllers/event.controller";

const router = Router();

router.get("/events/:eventId", getUsernameByEventIdController);

export { router };
