export const limitWords = (text: string, limit: number) => {
    const words = text.split(/\s+/);
    return words.length > limit ? `${words.slice(0, limit).join(' ')}...` : text;
}