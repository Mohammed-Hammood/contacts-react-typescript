export const convertToLocalDate = (date_?: string) => {
    if(date_===undefined || date_ === null)return "";
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(date_);
    const year=  date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const display = (number:number)=> {return ((number < 10)?'0'+number:number);}
    const fullDate = display(hours) + ':' + 
    display(minutes) + ", " + months[month] + " " + display(day) + ", " + year ;
    return fullDate; 
  }