import { ReceiveMessageCommand, DeleteMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

const client = new SQSClient({ region: "ap-south-1" });
// const SQS_QUEUE_URL = "https://sqs.ap-south-1.amazonaws.com/301550180011/test";
const SQS_QUEUE_URL = "https://sqs.ap-south-1.amazonaws.com/301550180011/test.fifo";

const receiveMessage = async (queueUrl) => {
  const response = await client.send(
    new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 5,
      VisibilityTimeout: 20,
      MessageAttributeNames: ["All"],
    })
  );
  console.log(response);
  if(response.Messages){
    return response.Messages 
  }
  else{
    return [];
  }
};

const deleteMessage = async (queueUrl, receiptHandle) => {
  await client.send(
    new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    })
  );
};

const main = async () => {

  setInterval(async () => {
    const messages = await receiveMessage(SQS_QUEUE_URL);

    if (messages.length === 0) {
      console.log("No new messages.");
      return ;
    }

    console.log(`Received ${messages.length} messages`);

    for (let i = 0; i < messages.length; i++) {
        // console.log(messages[i]);
      console.log(`Message : ${messages[i].Body}`);
      
      await deleteMessage(SQS_QUEUE_URL, messages[i].ReceiptHandle);
    }
  }, 2000);  
};

main();
