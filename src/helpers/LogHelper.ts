import * as FileSystem from 'react-native-fs';
import * as MailComposer from 'expo-mail-composer';
import { getReadableVersion } from 'react-native-device-info';
import dayjs from 'dayjs';

const logFile = `${FileSystem.LibraryDirectoryPath}/lemmy-debug.log`;

export const createIfDontExist = async (): Promise<void> => {
  if (!(await FileSystem.exists(logFile))) {
    await FileSystem.touch(logFile)
      .then()
      // eslint-disable-next-line no-console
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(e.toString()); // We should be able to log here
      });
  }
};

export const writeToLog = (text: string): void => {
  // eslint-disable-next-line no-console
  if (__DEV__) console.log(text);

  const time = dayjs().unix();
  void FileSystem.appendFile(logFile, `\n[${time}] ${text}`).then();
};

export const readLog = async (): Promise<string> =>
  await FileSystem.readFile(logFile);

export const deleteLog = (): void => {
  void FileSystem.exists(logFile).then((r) => {
    if (!r) return;

    void FileSystem.unlink(logFile).then();
  });
};

export const sendLog = async (): Promise<void> => {
  const exists = await FileSystem.exists(logFile);

  if (!exists) throw Error('no_file');

  const version = getReadableVersion();

  const options = {
    subject: `Memmy App ${version} Debug File`,
    recipients: ['me@gkasdorf.com'],
    body: 'Please enter any other information that you would like to send with your debug file:',
    attachments: [logFile],
  };

  void MailComposer.composeAsync(options).then();
};
