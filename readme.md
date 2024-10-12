# gRPC TypeScript Example

This project demonstrates a basic gRPC server in TypeScript using the @grpc/grpc-js library and Protocol Buffers (proto3). It includes two gRPC methods: PingPong for a simple ping-pong message exchange and RandomNumbers, a streaming RPC that returns random numbers.

## Prerequisites

## Node.js installed (version 12 or higher recommended)

- npm or yarn
- gRPC with @grpc/grpc-js package
- Protocol Buffers installed

install all dependencies

```bash
npm i
```

## Generate TypeScript Definitions:

You’ll need to generate the TypeScript types from the proto file. This project uses proto-loader to load .proto files dynamically, so no manual generation is required.

to do this in the package.json i have created script

```bash
npm run protogen
```

this command will call a protogen.sh file on the root of the project that has the command to take the proto file into a typescript definition.

```bash
#!/bin/bash
npx proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=./src/proto/ ./src/proto/*.proto
exit 0
```

## start the server

```bash
npm run start:server
```

## start the client

```bash
npm run start:client
```

# Project Structure

- src/client.ts: Contains the client-side code that connects to the gRPC server and calls the available methods.
- src/server.ts: Contains the server implementation for the PingPong and RandomNumbers services.
- proto/random.proto: Protocol Buffer (.proto) file defining the service and message structure.

## gRPC Methods

1. PingPong

- Request: Takes a PingRequest message with a message field (string).
- Response: Returns a PongResponse message with a message field (string).

```proto
message PingRequest {
  string message = 1;
}

message PongResponse {
  string message = 1;
}

service Ramdom {
  rpc PingPong (PingRequest) returns (PongResponse);
}
```

2. RandomNumbers

- Request: Streams NumberRequest messages, each with an int32 field maxVal.
- Response: Streams NumberResponse messages, each with an int32 field num, which is a random number less than maxVal.

```proto
message NumberRequest {
  int32 maxVal = 1;
}

message NumberResponse {
  int32 num = 1;
}

service Ramdom {
  rpc RandomNumbers (stream NumberRequest) returns (stream NumberResponse);
}
```

# Running the client

```typescript
import * as grpc from "@grpc/grpc-js";
import { ProtoGrpcType } from "./proto/random";
import * as protoloader from "@grpc/proto-loader";
import path from "path";

const PORT = 8082;
const PROTO_FILE = "./proto/random.proto";

const packageDef = protoloader.loadSync(path.resolve(__dirname, PROTO_FILE));
const grpcObj = grpc.loadPackageDefinition(
  packageDef
) as unknown as ProtoGrpcType;

const client = new grpcObj.randomPackage.Ramdom(
  `localhost:${PORT}`,
  grpc.credentials.createInsecure()
);

client.PingPong({ message: "Ping" }, (err, response) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(response.message);
});

const call = client.RandomNumbers();
call.write({ maxVal: 100 });
call.on("data", (response) => {
  console.log("Random number:", response.num);
});
call.on("end", () => {
  console.log("Stream ended");
});
```
