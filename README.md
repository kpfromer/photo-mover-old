# photo-mover

## Description

This is an example project that shows how images can be seperated into sub folders based on their dates.

## Usage

See `src/main.ts` for an example of its usage.

```typescript
import { moveFolderOfImagesBasedOnDates } from './file-manager';

const run = async () => {

  const fileDir = './images/';

  const folderToMoveTo = './sorted/';

  await moveFolderOfImagesBasedOnDates(fileDir, folderToMoveTo);
};

run();
```