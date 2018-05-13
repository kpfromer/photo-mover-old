import * as mkdirp from 'mkdirp';
import * as fs from 'fs';
import { promisify } from 'util';
import * as moment from 'moment';
import { ExifTool } from 'exiftool-vendored';
import {get} from 'lodash';

const exiftool = new ExifTool();

const makeAllDirsInPath = promisify(mkdirp);
const readdir = promisify(fs.readdir);

export const getAllFilesInFolder = async (folderLoc: string): Promise<string[]> => {
  return await readdir(folderLoc);
};

export const removeEndingSlash = (string: string): string => string.endsWith('/') ? string.slice(0, -1) : string;

export const copyToLocation = async (fileToCopyLoc: string, newLoc: string): Promise<void> => {

  const finalLocation = removeEndingSlash(newLoc);

  const dirsLeadUpTo = finalLocation.split('/').slice(0, -1).reduce((prevString, currDir) => `${prevString}${currDir}/`, '');

  await makeAllDirsInPath(dirsLeadUpTo);

  fs.createReadStream(fileToCopyLoc).pipe(fs.createWriteStream(newLoc));
};

const moveFileBasedOnDate = async (fileLoc: string, folderDestination: string, folderStructure: string) => {

  console.log(fileLoc);

  const metadata = await exiftool.read(fileLoc);

  if (!get(metadata, 'DateTimeOriginal', false)) {
    return;
  }

  let date: string = get(metadata, 'DateTimeOriginal');
  const parsed = moment(date);

  const fileName = removeEndingSlash(fileLoc).split('/').slice(-1)[0];

  if (!folderDestination.endsWith('/')) {
    folderDestination += '/';
  }

  await copyToLocation(fileLoc, `${folderDestination}${parsed.format(folderStructure)}/${fileName}`)
};

export const moveFolderOfImagesBasedOnDates = async (imageDir: string, finalDest: string, folderStructure: string = 'YYYY/MM/DD'): Promise<void> => {

  for (const file of await this.getAllFilesInFolder(imageDir)) {
    await moveFileBasedOnDate(`${imageDir}${file}`, finalDest, folderStructure);
  }
};