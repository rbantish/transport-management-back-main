// Convert ISO 8601 format to MySQL-compatible format with time set to 09:00
export function formatDateWithTime(dateString: string): string {
    const date = new Date(dateString);
    // Set the time to 09:00
    date.setHours(9, 0, 0, 0);
    return date.toISOString().slice(0, 19).replace('T', ' ');
};


/**
 * Formats a datetime string to a MySQL-compatible format with the given time unchanged.
 * @param datetimeString 
 * @returns The formatted datetime string in MySQL-compatible format, keeping the original time.
 */
export function formatDateKeepTime(datetimeString: string): string {
    const date = new Date(datetimeString);
    const formattedDate = date.toISOString().slice(0, 10); // Extract 'YYYY-MM-DD'
    const time = datetimeString.slice(11, 19); // Extract 'HH:MM:SS'
    return `${formattedDate} ${time}`; // Combine 'YYYY-MM-DD' and 'HH:MM:SS'
};