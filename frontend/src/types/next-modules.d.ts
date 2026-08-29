import React from 'react';

declare module 'next/server' {
  export class NextResponse extends Response {
    static json<T>(data: T, init?: ResponseInit): NextResponse;
  }
  export class NextRequest extends Request {
    nextUrl: URL;
  }
}



declare module 'next' {
  export type Metadata = Record<string, any>;
}
