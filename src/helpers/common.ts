export function formatDateToYYYYMMDD(dateObject: any) {
    if(!dateObject) return ''
    const year = dateObject.$y
    const month = (dateObject.$M + 1).toString().padStart(2, '0')
    const day = dateObject.$D.toString().padStart(2, '0')
    const formattedDate: string = `${year}${month}${day}`
    return formattedDate
}

export function formatPhoneNumber (value:any) {
    if (!value) return null
    const phoneNumber = value?.replace(/[^\d]/g, '')
    const phoneNumberLength = phoneNumber.length
    if (phoneNumberLength < 4) return phoneNumber
    if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
}

export function formatSSN(ssn: string): string {
    if (!ssn) return '';
    const cleanedSSN = ssn.replace(/[^\d]/g, ''); // Remove non-digit characters
    const limitedSSN = cleanedSSN.slice(0, 9); // Limit to 9 digits
    const ssnLength = limitedSSN.length;

    // Format SSN based on length
    if (ssnLength < 4) {
        return limitedSSN;
    } else if (ssnLength < 6) {
        return `${limitedSSN.slice(0, 3)}${limitedSSN.slice(3)}`;
    } else {
        return `${limitedSSN.slice(0, 3)}${limitedSSN.slice(3, 5)}${limitedSSN.slice(5)}`;
    }
}


