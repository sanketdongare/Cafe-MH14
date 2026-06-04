import fs from 'fs';
import path from 'path';
import { MenuItem, Order, OrderItem } from './types';

interface DBState {
  menu: MenuItem[];
  orders: Order[];
  orderCounter: number;
}

const dbFilePath = path.join(process.cwd(), 'src/lib/db.json');

class MockDatabase {
  private readState(): DBState {
    try {
      if (fs.existsSync(dbFilePath)) {
        const fileContent = fs.readFileSync(dbFilePath, 'utf8');
        return JSON.parse(fileContent);
      }
    } catch (error) {
      console.error('Error reading JSON DB file:', error);
    }
    return { menu: [], orders: [], orderCounter: 1001 };
  }

  private writeState(state: DBState): void {
    try {
      fs.writeFileSync(dbFilePath, JSON.stringify(state, null, 2), 'utf8');
    } catch (error) {
      console.error('Error writing to JSON DB file:', error);
    }
  }

  // Menu Methods
  getMenu(): MenuItem[] {
    return this.readState().menu;
  }

  getMenuItem(id: string): MenuItem | undefined {
    return this.readState().menu.find((item) => item.id === id);
  }

  addMenuItem(item: Omit<MenuItem, 'id'>): MenuItem {
    const state = this.readState();
    const newItem: MenuItem = {
      ...item,
      id: `m${state.menu.length + 1}`
    };
    state.menu.push(newItem);
    this.writeState(state);
    return newItem;
  }

  updateMenuItem(id: string, updatedFields: Partial<MenuItem>): MenuItem | undefined {
    const state = this.readState();
    const idx = state.menu.findIndex((item) => item.id === id);
    if (idx === -1) return undefined;
    state.menu[idx] = { ...state.menu[idx], ...updatedFields };
    this.writeState(state);
    return state.menu[idx];
  }

  deleteMenuItem(id: string): boolean {
    const state = this.readState();
    const idx = state.menu.findIndex((item) => item.id === id);
    if (idx === -1) return false;
    state.menu.splice(idx, 1);
    this.writeState(state);
    return true;
  }

  // Order Methods
  getOrders(): Order[] {
    return this.readState().orders;
  }

  getOrder(id: string): Order | undefined {
    return this.readState().orders.find((order) => order.id.toLowerCase() === id.toLowerCase());
  }

  createOrder(order: { customerName: string; items: OrderItem[]; notes?: string }): Order {
    const state = this.readState();
    const id = `CF-${state.orderCounter++}`;
    const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder: Order = {
      id,
      customerName: order.customerName,
      items: order.items,
      total: parseFloat(total.toFixed(2)),
      notes: order.notes,
      status: 'Received',
      createdAt: new Date().toISOString()
    };
    state.orders.push(newOrder);
    this.writeState(state);
    return newOrder;
  }

  updateOrderStatus(id: string, status: Order['status']): Order | undefined {
    const state = this.readState();
    const idx = state.orders.findIndex((o) => o.id === id);
    if (idx === -1) return undefined;
    state.orders[idx].status = status;
    this.writeState(state);
    return state.orders[idx];
  }
}

// Global declaration to prevent hot-reload wipes
declare global {
  // eslint-disable-next-line no-var
  var __mockDb: MockDatabase | undefined;
}

if (!global.__mockDb) {
  global.__mockDb = new MockDatabase();
}

export const db = global.__mockDb;
export { type MenuItem, type Order, type OrderItem };
