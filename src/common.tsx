import swal from "sweetalert";

export const PrimaryColor  = '#ff7c04';
export const SecondaryColor = '#34656D';
export const TertiaryColor = '#FF5733';
export const QuaternaryColor = '#50C878';
export const Color1 = '#28565D';
export const ColorRed = '#dc3545';
export const ColorBlue = '#0d6efd';
export const ColorYellow='#ffc107';

export const mail="info@gna.energy";

const baseUri = 'https://datahub.gna.energy';

export function buildUrl(path: string) {
  return `${baseUri}/${path}`;
}

const ErrorAlert = ({title='', message}: {title?: string, message: string}) => {
  swal({
    title: title,
    text: message,
});
}
export async function buildHttpReq(
  {
    endpoint, 
    method = 'GET',
    body = null,
    header= {}
  }:
  {
    endpoint: string,
    method?: string,
    body?: any,
    header?: any
  }
){
  // convert body to form data
  const formData = new FormData();
  Object.keys(body).forEach(key => formData.append(key, body[key]));
  const response = await fetch(buildUrl(endpoint), {
    method: method,
    headers: {
      ...header
    },
    body: formData
  });
  return await response.json();
}