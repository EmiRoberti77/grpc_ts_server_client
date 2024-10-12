import path from "path";
import * as gRPC from "@grpc/grpc-js";
import * as protoloader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/random";

const PORT = 8082;
const PROTO_FILE = "./proto/random.proto";
const packageDef = protoloader.loadSync(path.resolve(__dirname, PROTO_FILE));
const grpcObj = gRPC.loadPackageDefinition(
  packageDef
) as unknown as ProtoGrpcType;

const client = new grpcObj.randomPackage.Ramdom(
  `0.0.0.0:${PORT}`,
  gRPC.credentials.createInsecure()
);

const deadline = new Date();
deadline.setSeconds(deadline.getSeconds() + 5);
client.waitForReady(deadline, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  onClientReady();
});

function onClientReady() {
  client.PingPong(
    {
      message: "Ping",
    },
    (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(result);
    }
  );

  const metadata = new gRPC.Metadata();
  const call = client.RandomNumbers(metadata);

  call.write({ maxVal: 85 });
  call.write({ maxVal: 100 });
  call.write({ maxVal: 2 });
  //call.end();

  call.on("data", (chunk) => {
    console.log(chunk);
  });
  call.on("end", () => {
    console.log("comunication stopped");
    call.end();
  });
}
