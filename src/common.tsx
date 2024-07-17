import swal from "sweetalert";

export const PrimaryColor  = '#ff7c04';
export const SecondaryColor = '#34656D';
export const TertiaryColor = '#FF5733';
export const QuaternaryColor = '#50C878';
export const Color1 = '#28565D';
export const ColorRed = '#dc3545';
export const ColorBlue = '#0d6efd';
export const ColorSkyBlue = '#0dcaf0';
export const ColorYellow='#ffc107';
export const ColorGray = '#DEDFDF';
export const mail="info@gna.energy";

export const volumeBar = "#E0E0E0";
export const volumeBarLegend = "rgb(159, 159, 159)";

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
    header= {},
    customUrl
    
  }:
  {
    endpoint?: string,
    method?: string,
    body?: any,
    header?: any
    customUrl?: string
  }
){
  // convert body to form data
  const formData = new FormData();
  Object.keys(body).forEach(key => formData.append(key, body[key]));
  const response = await fetch(endpoint != null ? buildUrl(endpoint) : customUrl != null ? customUrl: ""  , {
    method: method,
    headers: {
      ...header
    },
    body: formData
  });
  return await response.json();
}

export const formatDMY = (date: string): string => {
  // input date format as yyyy-mm-dd, output date format as dd-mm-yyyy
  try{
   return date.split("-").reverse().join("-");}
   catch{
    return date;
   }
  }