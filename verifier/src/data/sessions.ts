// Simple in-memory session store (probably redis/db in prod)
const sessions = new Map<string, { status: 'pending' | 'authenticated'; createdAt: number }>();
export { sessions }