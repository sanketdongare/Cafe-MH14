import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const items = db.getMenu();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const newItem = db.addMenuItem({
      name: body.name,
      description: body.description || '',
      price: parseFloat(body.price),
      category: body.category,
      image: body.image || 'linear-gradient(135deg, #10b981, #064e3b)',
      available: body.available ?? true,
      options: body.options || []
    });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Missing item ID' }, { status: 400 });
    }
    const updated = db.updateMenuItem(body.id, body.updatedFields);
    if (!updated) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}
