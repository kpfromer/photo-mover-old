import * as mkdirp from 'mkdirp';
import { promisify } from 'util';
import * as moment from 'moment';
import { ExifTool } from 'exiftool-vendored';
import { get } from 'lodash';
import { basename, dirname, join } from 'path';
import * as fs from 'fs';

const exiftool = new ExifTool();

const makeAllDirsInPath = promisify(mkdirp);

export const getAllFiles = (dir: string, ignore: string[] = []) => {
  return fs.readdirSync(dir).reduce((files, file) => {
    // if (junk.not(file)) {
      const name = join(dir, file);
      const isDirectory = fs.statSync(name).isDirectory();
      return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
    // } else {
    //   return [...files];
    // }
  }, []);
};

export const removeEndingSlash = (string: string): string => string.endsWith('/') ? string.slice(0, -1) : string;

export const copyToLocation = async (fileToCopyLoc: string, newLoc: string): Promise<void> => {

  const finalLocation = removeEndingSlash(newLoc);

  const dirsLeadUpTo = dirname(finalLocation);

  await makeAllDirsInPath(dirsLeadUpTo);

  fs.createReadStream(fileToCopyLoc).pipe(fs.createWriteStream(newLoc));
};

const moveFileBasedOnDate = async (fileLoc: string, folderDestination: string, folderStructure: string) => {

  const metadata = await exiftool.read(fileLoc);

  if (!get(metadata, 'DateTimeOriginal', false)) {
    return;
  }

  let date: string = get(metadata, 'DateTimeOriginal');
  const parsed = moment(date);

  const fileName = basename(fileLoc);

  await copyToLocation(fileLoc, join(folderDestination, parsed.format(folderStructure), fileName))
};

export const moveFolderOfImagesBasedOnDates = async (imageDir: string, finalDest: string, folderStructure: string = 'YYYY/MM/DD'): Promise<void> => {
  await getAllFiles(imageDir).forEach(async image => await moveFileBasedOnDate(image, finalDest, folderStructure));
};