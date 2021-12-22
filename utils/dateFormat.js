
    const month = [];
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";


module.exports = {

    format_date: ( timestamp ) => {
    
        const d = new Date( timestamp );
        let month_name = month[d.getMonth()];
        let hour;

        // check for 24-hr time
        if (d.getHours > 12) {

            hour = Math.floor(d.getHours() / 2);

        } else {

            hour = d.getHours();

        }

        // if midnight, change hour to 12
        if (hour === 0) { hour = 12; }

        const minutes = d.getMinutes();
        
        let AMorPM;
        (dateObj.getHours() >= 12)? AMorPM = 'pm' : AMorPM = 'am';
    
        // Build formatted timestamp
        return `${new Date( timestamp ).getDate()}-${month_name}-${new Date(date).getFullYear()} at ${hour}:${minutes}${AMorPM}`;
    }
};