
export const createUrl = (endpoint: string) => {
    return `${process.env.SERVER_URL}${endpoint}`;
}