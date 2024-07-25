export function formatDateUserFriendly(dateString: string): string {
    const months = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
  
    const [day, month, year] = dateString.split('-');
    const monthIndex = parseInt(month) - 1;
    const formattedYear = year.slice(-2);
  
    return `${parseInt(day)} ${months[monthIndex]} ${formattedYear}`;
  }
  
// input - 2024-01-01 output - January 1
export function formatDateMD(dateString: string): string {
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const [day, month, year] = dateString.split('-');
  const monthIndex = parseInt(month) - 1;

  return `${months[monthIndex]} ${parseInt(day)}`;
}
