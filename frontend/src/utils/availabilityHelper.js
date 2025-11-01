export const getAvailabilityStatus = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'Presque complet';
    if (percentage >= 75) return 'Peu de places';
    return 'Disponible';
};