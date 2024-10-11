import path from "path";
import * as gRPC from "@grpc/grpc-js";
import * as protoloader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/random";
import { RamdomHandlers } from "./proto/randomPackage/Ramdom";
const PORT = 8082;
const PROTO_FILE = "./proto/random.proto";
const packageDef = protoloader.loadSync(path.resolve(__dirname, PROTO_FILE));
const grpcObj = gRPC.loadPackageDefinition(
  packageDef
) as unknown as ProtoGrpcType;

const randomPackage = grpcObj.randomPackage;

function main() {
  const server = getServer();
  server.bindAsync(
    `0.0.0.0:${PORT}`,
    gRPC.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(err);
        return;
      } else {
        console.log("started", port);
      }
    }
  );
}

function getServer(): gRPC.Server {
  const server = new gRPC.Server();
  server.addService(randomPackage.Ramdom.service, {
    PingPong: (req, res) => {
      console.log("PingPong");
      console.log(req.request);
      res(null, { message: "Pong" });
    },
  } as RamdomHandlers);
  return server;
}

main();
