
const date = new Date('2025-11-30T15:43:55+07:00'); // Simulating user's current time
console.log('Current Date:', date.toString());

const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

console.log('First Day:', firstDay.toString());
console.log('Last Day:', lastDay.toString());

const formatLocalDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

console.log('Formatted First Day:', formatLocalDate(firstDay));
console.log('Formatted Last Day:', formatLocalDate(lastDay));
