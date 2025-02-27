export function truncateText(text, char) {
    if (text.length > 30) {
        const truncatedText = text.substring(0, char);
        return truncatedText + '...';
    } else {
        return text;
    }
}


export const swalConfig = {
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer:3000
 };
 