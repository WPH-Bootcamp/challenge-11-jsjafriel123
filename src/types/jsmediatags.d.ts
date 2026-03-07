declare module "jsmediatags/dist/jsmediatags.min.js" {
  export interface PictureTag {
    data: number[];
    format: string;
  }

  export interface Tags {
    title?: string;
    artist?: string;
    album?: string;
    year?: string;
    genre?: string;
    picture?: PictureTag;
    [key: string]: any;
  }

  export interface ReadSuccess {
    tags: Tags;
  }

  export interface ReadError {
    type: string;
    info: string;
  }

  const jsmediatags: {
    read(
      file: File | Blob,
      options: {
        onSuccess: (data: ReadSuccess) => void;
        onError: (error: ReadError) => void;
      },
    ): void;
  };

  export default jsmediatags;
}
