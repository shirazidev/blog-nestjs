import { Request } from 'express';
import { mkdirSync } from 'fs';
import { extname, join } from 'path';
export type CallbackDestination = (
  error: Error | null,
  destination: string,
) => void;
export type CallbackFileName = (
  error: Error | null,
  destination: string,
) => void;
export type multerFile = Express.Multer.File;
export function multerFilename(
  req: Request,
  file: multerFile,
  callback: CallbackFileName,
): void {
  {
    const ext = extname(file.originalname)
    const filename = `${Date.now()}${ext}`;
    callback(null, filename);
  }
}
export function multerDestination(fieldName: string) {
  return function (
    req: Request,
    file: multerFile,
    callback: CallbackDestination,
  ): void {
    let path = join('public', 'uploads', fieldName);
    mkdirSync(path, { recursive: true });
    callback(null, path);
  };
}
