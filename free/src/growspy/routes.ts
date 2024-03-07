import * as functions from "firebase-functions";
import {
  latest,
  newReading,
} from "./";

const routes = (
  app: any,
  respond: any,
  firebaseApp: any,
) => {
  app.get("/growspy", async (req: functions.https.Request, res: any) => {
    const result = await latest(req, firebaseApp);
    respond(req, res, {output: {
      ...result,
    }});
  });
  app.post("/growspy", async (req: functions.https.Request, res: any) => {
    const result = await newReading(req, firebaseApp);
    respond(req, res, {output: {
      ...result,
    }});
  });
};
export default routes;
