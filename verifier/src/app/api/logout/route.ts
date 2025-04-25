import { NextResponse } from 'next/server';

export async function GET() {
    const response = NextResponse.redirect('/');
    response.cookies.set({
        name: 'sessionToken',
        value: '',
        path: '/',
        maxAge: 0,
    });

    return response;
}
