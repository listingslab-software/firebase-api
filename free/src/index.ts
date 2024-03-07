import * as firebase from "firebase/app";
import cors from "cors";
import moment from "moment";
import {onRequest} from "firebase-functions/v2/https";
import {HostShape} from "./types";
import express, {Request, Response} from "express";
import {nodemailRoutes} from "./nodemail";
import {growspyRoutes} from "./growspy";

const appName = "prOapi";
const version = "2.5.7";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const app = express();
app.use(cors({credentials: true}));

const respond = (req: Request, res: Response, data: any) => {
  const {output} = data;
  const unixEpoch = Date.now();
  const api = {
    app: appName,
    version: `${version}`,
    time: moment(unixEpoch).add(2, "hours").format("MMMM Do YYYY, h:mm:ssa"),
    response: output,
  };
  res.json(api);
};

nodemailRoutes(app, respond, firebaseApp);
growspyRoutes(app, respond, firebaseApp);

app.all("/", async (req, res) => {
  // const h:any = host(req);
  respond(req, res, {
    output: {
      code: "200",
      status: "success",
      message: "Hello sir.",
      // baseUrl: h.baseUrl,
    },
  });
});

app.all("/ping", async (req, res) => {
  const h:any = host(req);
  respond(req, res, {
    output: {
      code: "418",
      status: "info",
      message: "I'm a teapot",
      data: {
        home: h.baseUrl,
      },
    },
  });
});

app.all("**", async (req, res) => {
  const h:any = host(req);
  respond(req, res, {
    output: {
      code: "404",
      status: "error",
      message: "Not found, sir.",
      data: {
        home: h.baseUrl,
      },
    },
  });
});

export const api = onRequest(app);

export const host = (req: any) => {
  const {hostname} = req;
  const prod: HostShape = {
    env: "PROD", hostname,
    baseUrl: "https://api-wbm3djlf2a-uc.a.run.app",
  };
  const dev: HostShape = {
    env: "DEV", hostname,
    baseUrl: "http://127.0.0.1:5001/goldlabelpro/us-central1/api",
  };
  if (hostname === "127.0.0.1") return dev;
  return prod;
};
