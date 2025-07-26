export function normalizeCategory(category: string): string {
    const normalized = category.toLowerCase().replace(/\s+/g, '');
    if (normalized.includes('софтскил') || normalized.includes('софт-скил')) return 'soft';
    if (normalized.includes('хардскил') || normalized.includes('хард-скил')) return 'hard';
    if (normalized.includes('другое')) return 'other';
    if (normalized.includes('дополнительное')) return 'additional';
    if (normalized.includes('кнопка')) return 'button';
    return 'other';
}