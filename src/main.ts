import { moveFolderOfImagesBasedOnDates } from './file-manager';

const run = async () => {

  const fileDir = '/Users/kpfromer/Desktop/100KYLEP/';

  const folderToMoveTo = '/Users/kpfromer/Desktop/100KYLEP/sorted/';

  await moveFolderOfImagesBasedOnDates(fileDir, folderToMoveTo);
};

run();