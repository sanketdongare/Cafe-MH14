import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const inventory = db.getInventory();
    return NextResponse.json(inventory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || body.stock === undefined) {
      return NextResponse.json({ error: 'Missing required fields (id, stock)' }, { status: 400 });
    }

    const stockNum = parseFloat(body.stock);
    if (isNaN(stockNum) || stockNum < 0) {
      return NextResponse.json({ error: 'Stock must be a non-negative number' }, { status: 400 });
    }

    const updated = db.updateInventoryItem(body.id, stockNum);
    if (!updated) {
      return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}
