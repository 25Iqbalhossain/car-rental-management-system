import React from 'react';

declare module 'next/server' {
  export class NextResponse extends Response {
    static json<T>(data: T, init?: ResponseInit): NextResponse;
  }
  export class NextRequest extends Request {
    nextUrl: URL;
  }
}

declare module 'next/image' {
  export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    priority?: boolean;
    unoptimized?: boolean;
  }
  const Image: React.FC<ImageProps>;
  export default Image;
}

declare module 'next' {
  export type Metadata = Record<string, any>;
}
