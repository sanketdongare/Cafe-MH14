import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const reservations = db.getReservations();
    return NextResponse.json(reservations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.customerName || !body.email || !body.phone || !body.date || !body.time || !body.guests) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const guestsNum = parseInt(body.guests);
    if (isNaN(guestsNum) || guestsNum < 1 || guestsNum > 12) {
      return NextResponse.json({ error: 'Guests count must be between 1 and 12' }, { status: 400 });
    }

    const newRes = db.addReservation({
      customerName: body.customerName.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      date: body.date,
      time: body.time,
      guests: guestsNum,
      notes: body.notes?.trim() || ''
    });

    return NextResponse.json(newRes, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit reservation' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: 'Missing required fields (id, status)' }, { status: 400 });
    }

    const updated = db.updateReservationStatus(body.id, body.status);
    if (!updated) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
  }
}
