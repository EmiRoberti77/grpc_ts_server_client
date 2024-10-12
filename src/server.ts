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
    PingPong: (req: any, res: any) => {
      console.log("PingPong");
      console.log(req.request);
      res(null, { message: "Pong" });
    },
    RandomNumbers: (call: any) => {
      call.on("data", (request: any) => {
        const { maxVal } = request; // Ensure maxVal exists in request
        if (typeof maxVal !== "undefined") {
          let counter = 0;
          const timerId = setInterval(() => {
            counter += 1;
            call.write({ num: Math.floor(Math.random() * maxVal) });
            if (counter >= 5) {
              clearInterval(timerId);
              call.end();
            }
          }, 500);
        } else {
          console.error("Received request without maxVal");
        }
      });

      call.on("end", () => {
        call.end();
      });
    },
  } as RamdomHandlers);

  // Return the server object, as the function signature promises
  return server;
}

main();
