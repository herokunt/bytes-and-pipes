import path from "path";
import dotenv from "dotenv";
// import { ConfigurationInterface } from '../interfaces';

dotenv.config();

const config = {
  //MONGODB SETTINGS
  MONGODB_URI: process.env.MONGODB_URI,

  //FILE UPLOAD/DOWNLOAD SETTINGS
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 1024 * 1024 * 1024,
  PUBLIC_DIR: process.env.PUBLIC_DIR || path.resolve(__dirname, "public"),
  UPLOAD_LOCATION:
    process.env.UPLOAD_LOCATION || path.resolve(__dirname, "uploads"),

  //NODE.JS PROCESS
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || "0.0.0.0",

  //APP SETTINGS
  DOMAIN: process.env.DOMAIN || "localhost",
  LOG_LEVEL: process.env.LOG_LEVEL || "debug",
  LOG_NAME: process.env.LOG_NAME || "Bytes And Pipes [Development]",
};

export default config;
