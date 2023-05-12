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