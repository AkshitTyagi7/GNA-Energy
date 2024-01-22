export const PrimaryColor = '#ff7c04';
export const SecondaryColor = '#34656D';
export const TertiaryColor = '#FF5733';
export const QuaternaryColor = '#50C878';

const baseUri = 'http://13.233.117.192';

export function buildUri(path: string) {
  return `${baseUri}/${path}`;
}
