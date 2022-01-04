
module.exports = {

date_formatter:  timestamp  => {

        const   month = [];
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

        const d = new Date( timestamp );
        let month_name = month[d.getMonth()];
        let hour;

        // check for 24-hr time
        if (d.getHours() > 12) {
            hour = Math.floor(d.getHours() / 2);
        } else {
            hour = d.getHours();
        }

        // if midnight, change hour to 12
        if (hour === 0) { hour = 12; }

        let minutes = d.getMinutes();

        // add a '0' to precede minute when less than 10.
        if (minutes < 10) {  minutes = '0'+ minutes; } 
        
        let AMorPM;
        (d.getHours() >= 12)? AMorPM = 'pm' : AMorPM = 'am';

        // Build formatted timestamp
        return `${d.getDate()}-${month_name}-${d.getFullYear()} at ${hour}:${minutes}${AMorPM}`;
    }
    
};