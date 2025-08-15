import type csIndex from "../cs";

import auth from "./auth";
import common from "./common";
import app from "./app";
import landing from "./landing";


export default { 
  auth,
  common,
  app,
  landing
} satisfies typeof csIndex;