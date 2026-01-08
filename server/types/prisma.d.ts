// Type definitions for @prisma/client
declare module '@prisma/client' {
  export interface PrismaClient {}
  export class PrismaClient {
    constructor(options?: any);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    user: any;
    donor: any;
    donation: any;
    campaign: any;
    task: any;
  }
}
