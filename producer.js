import { readFile } from "fs";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

const SQS_QUEUE_URL = "https://sqs.ap-south-1.amazonaws.com/301550180011/test";
const client = new SQSClient({ region: "ap-south-1" });

const main = async () => {
  try {
    const fileData = await readFile("msg.json", "utf-8");
    const messages = JSON.parse(fileData);

    for (const message of messages) {
      const command = new SendMessageCommand({
        QueueUrl: SQS_QUEUE_URL,
        DelaySeconds: 0,
        MessageAttributes: {
          Title: {
            DataType: "String",
            StringValue: message.Title,
          },
        },
        MessageBody: message.MessageBody,
      });

      const response = await client.send(command);
      // console.log(response)
      console.log(`Sent msg:- ${message.Title}`);
    }

    console.log("All messages sent");
  } catch (error) {
    console.error( error);
  }
};

main();
