interface ICompareDates {
    parsedDate: Date;
    postDate: Date;
}

const isSameDate = (parsedDate: Date, postDate: Date) => (
    parsedDate.getFullYear() === postDate.getFullYear() &&
    parsedDate.getMonth() === postDate.getMonth() &&
    parsedDate.getDate() === postDate.getDate()
);
  
export const isValidDate = ({parsedDate, postDate}: ICompareDates) => {
      // Check if the parsed date is before 05:00
    const isBefore5AM: boolean = parsedDate.getHours() < 5 ||
        (parsedDate.getHours() === 5 && parsedDate.getMinutes() < 1);
    
    // Check both conditions
    const isBefore5AMSameDate: boolean = isSameDate(parsedDate, postDate) && isBefore5AM;
    console.log(isBefore5AMSameDate)
    return isBefore5AMSameDate;
}

export const parseDate = (dateString: string): Date => {

    // Split the string into its components
    const [day, month, year, time] = dateString.split(" ");

    const dayWithoutDot = day.trim().slice(0, day.indexOf('.'));

    // Convert the month name to a number (0-based)
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthIndex = monthNames.indexOf(month.trim());

    // Combine everything into an ISO 8601 format without 'Z' to treat it as a local time
    const isoDateString = `${year}-${(monthIndex + 1).toString().padStart(2, '0')}-${dayWithoutDot.padStart(2, '0')}T${time}`;
    // Parse and return the date
    return new Date(isoDateString);
}

