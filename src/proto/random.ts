import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { RamdomClient as _randomPackage_RamdomClient, RamdomDefinition as _randomPackage_RamdomDefinition } from './randomPackage/Ramdom';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  randomPackage: {
    NumberRequest: MessageTypeDefinition
    NumberResponse: MessageTypeDefinition
    PingRequest: MessageTypeDefinition
    PongResponse: MessageTypeDefinition
    Ramdom: SubtypeConstructor<typeof grpc.Client, _randomPackage_RamdomClient> & { service: _randomPackage_RamdomDefinition }
  }
}

