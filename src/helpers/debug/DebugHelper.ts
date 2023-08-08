import * as FileSystem from "react-native-fs";
import * as MailComposer from "expo-mail-composer";
import { getReadableVersion } from "react-native-device-info";
import dayjs from "dayjs";

const logFile = `${FileSystem.LibraryDirectoryPath}/lemmy-debug.log`;

const createIfDontExist = async (): Promise<void> => {
  if (!(await FileSystem.exists(logFile))) {
    await FileSystem.touch(logFile)
      .then()
      // eslint-disable-next-line no-console
      .catch((e) => console.log(e.toString()));
  }
};

const writeToLog = (text: string): void => {
  // eslint-disable-next-line no-console
  if (__DEV__) console.log(text);

  // @ts-ignore
  const time = dayjs().utc(true);
  FileSystem.appendFile(logFile, `\n[${time}] ${text}`).then();
};

const readLog = async (): Promise<string> => FileSystem.readFile(logFile);

const deleteLog = (): void => {
  FileSystem.exists(logFile).then((r) => {
    if (!r) return;

    FileSystem.unlink(logFile).then();
  });
};

const sendLog = async (): Promise<void> => {
  const exists = await FileSystem.exists(logFile);

  if (!exists) throw Error("no_file");

  const version = getReadableVersion();

  const options = {
    subject: `Memmy App ${version} Debug File`,
    recipients: ["me@gkasdorf.com"],
    body: "Please enter any other information that you would like to send with your debug file:",
    attachments: [logFile],
  };

  MailComposer.composeAsync(options).then();
};

export { createIfDontExist, writeToLog, readLog, deleteLog, sendLog };
