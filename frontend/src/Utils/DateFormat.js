const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);

    // Use Intl.DateTimeFormat for Romanian locale
    const formatter = new Intl.DateTimeFormat("ro-RO", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    // Get formatted parts
    const parts = formatter.formatToParts(date);
    const day = parts.find((part) => part.type === "day").value;
    const month = parts.find((part) => part.type === "month").value;
    const year = parts.find((part) => part.type === "year").value;
    const hour = parts.find((part) => part.type === "hour").value;
    const minute = parts.find((part) => part.type === "minute").value;

    // Assemble final string
    return `${day} ${month} ${year}, ora ${hour}:${minute}`;
}

export default formatDateTime;