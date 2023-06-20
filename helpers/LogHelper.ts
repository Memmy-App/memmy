import * as FileSystem from "react-native-fs";
import * as MailComposer from "expo-mail-composer";
import { getReadableVersion } from "react-native-device-info";
import moment from "moment";

const logFile = `${FileSystem.DocumentDirectoryPath}lemmy-debug.log`;

const writeToLog = (text: string) => {
  console.log(text);

  const time = moment().utc(true);
  FileSystem.appendFile(logFile, `[${time}] ${text}`).then();
};

const readLog = async (): Promise<string> => FileSystem.readFile(logFile);

const deleteLog = (): void => {
  FileSystem.exists(logFile).then((r) => {
    if (!r) return;

    FileSystem.unlink(logFile).then();
  });
};

const sendLog = async () => {
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

export { writeToLog, readLog, deleteLog, sendLog };
