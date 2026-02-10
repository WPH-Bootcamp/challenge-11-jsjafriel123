export function pictureToUrl(picture: {
  data: number[];
  format: string;
}): string {
  const byteArray = new Uint8Array(picture.data);
  const blob = new Blob([byteArray], { type: picture.format });
  return URL.createObjectURL(blob);
}
