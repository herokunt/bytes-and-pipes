import bunyan from 'bunyan';
import fs from 'fs';

export interface ConfigurationInterface {
  MONGODB_URI: string;
  SG_API_KEY: string;
  MAX_FILE_SIZE: string | number;
  PUBLIC_DIR: string;
  UPLOAD_LOCATION: string;
  PORT: string | number;
  HOST: string;
  DOMAIN: string;
  JWT_SECRET: string;
  LOG_LEVEL: bunyan.LogLevel | string | number | undefined;
  LOG_NAME: string;
}

export interface FileInterface {
  name?: string;
  encryptedMetadata?: Buffer;
  directory?: fs.PathLike | string;
  size?: number;
  expired?: boolean;
  createdAt?: Date;
}