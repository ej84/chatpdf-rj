// example.ts


import { DynamoDB } from "@aws-sdk/client-dynamodb";

const region = "us-east-2";
const client = new DynamoDB({ region });
client.listTables({}, (err, data) => {
  if (err) console.log(err, err.stack);
  else console.log(data);
});