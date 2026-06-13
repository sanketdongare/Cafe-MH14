import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const hasSession = cookieStore.has('admin_session');
    return NextResponse.json({ authenticated: hasSession });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify session' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Check credentials (username: sanket, password: Sanket@123)
    if (username && username.toLowerCase() === 'sanket' && password === 'Sanket@123') {
      const cookieStore = await cookies();
      cookieStore.set('admin_session', 'authenticated', {
        httpOnly: false, // Set false so client can easily read or double check if needed, but cookies are sent automatically
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day session
      });
      return NextResponse.json({ success: true, user: 'Sanket Dongare' });
    }

    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}
