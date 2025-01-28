export function formatDateFromId(id: string): string {

  const year = parseInt(id.slice(0, 4), 10);
  const month = parseInt(id.slice(4, 6), 10) - 1; 
  const day = parseInt(id.slice(6, 8), 10);

  const date = new Date(Date.UTC(year, month, day)); 

  return date.toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric", 
    timeZone: "UTC" 
  });
}

