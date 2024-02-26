import { Request, Response } from "express";
import { getUsernameByEventIdService } from "../services/event.service";

const getUsernameByEventIdController = async (req: Request, res: Response) => {
  const eventId = req.params.eventId;

  try {
    const result = await getUsernameByEventIdService(eventId);
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send({ error: (error as Error).message });
  }
};

export { getUsernameByEventIdController };
