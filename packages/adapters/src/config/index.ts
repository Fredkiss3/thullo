import * as dotenv from "dotenv";

export const config = () => {
  if (process.env.NODE_ENV !== "production") {
    dotenv.config({
      path: `${__dirname}/config/.env.local`,
    });
  }
};

