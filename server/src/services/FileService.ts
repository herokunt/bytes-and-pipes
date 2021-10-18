import fs from "fs";
import os from "os";
import path from "path";
import { promisify } from "util";
import File from '../models/file';
import { FileInterface } from '../interfaces';

const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const stat = promisify(fs.stat);

interface writeFileInterface {
  location: string;
  data: Buffer;
  contentParts: number;
  contentFileSize: number;
  currentChunk: string;
}

export default {
  async createTempDirectory(filename: string): Promise<string> {
    const location = path.resolve(os.tmpdir(), filename as string);
    await this.createDirectory(location);
    return location;
  },

  async createDirectory(filepath: fs.PathLike, recursive: boolean = true) {
    await mkdir(filepath, { recursive });
  },

  async removeDirectory(filepath: fs.PathLike) {
    await rmdir(filepath);
  },

  async readDirectory(filepath: fs.PathLike) {
    return await readdir(filepath);
  },

  readAsStream(filepath: fs.PathLike): fs.ReadStream {
    return fs.createReadStream(filepath);
  },

  writeFile({ location, data, contentParts, contentFileSize, currentChunk } : writeFileInterface) {
    return new Promise((resolve) => {
      const writer = fs.createWriteStream(path.join(location, currentChunk));
      writer.write(data);
      writer.on('close', async () => {
        const files = await this.readDirectory(location);

        if (files.length !== contentParts) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  },

  async deleteFile(filepath: fs.PathLike) {
    await unlink(filepath);
  },

  async reconstructRecord(record: FileInterface): Promise<fs.ReadStream[]> {
    const fileFragments = await this.readDirectory(record.directory!);

    return fileFragments
      .sort((a,b) => Number(a) + Number(b)) // read from last to first
      .map(fragment => fs.createReadStream(fragment));
  },

  async deleteRecord(id: string) {
    const file = await this.findFileById(id);
    file?.remove();
  },

  async getFileData(filepath: fs.PathLike) {
    return await stat(filepath);
  },

  async createRecord(data: FileInterface) {
    const file = new File(data);
    await file.save();
    return file;
  },

  async updateFileMetadata(id: string, updates: FileInterface) {
    // validate updates
    await File.findByIdAndUpdate(id, updates, { lean: true });
  },

  async findFileById(id: string) {
    return await File.findOne({ _id: id, expired: false });
  },
};
