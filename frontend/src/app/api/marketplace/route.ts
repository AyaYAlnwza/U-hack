import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { MARKETPLACE_CATEGORIES, SaleListing } from '@/types/marketplace';
import { readSubscriptions } from '@/lib/subscriptionStore';

const dataFile = path.join(process.cwd(), 'data', 'sale-listings.json');
let pendingWrite: Promise<unknown> = Promise.resolve();
type StoredListing = SaleListing & { ownerProfileId?: string };

async function readListings(): Promise<StoredListing[]> {
  try {
    const data = JSON.parse(await readFile(dataFile, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

export async function GET() {
  try {
    const [listings, subscriptions] = await Promise.all([readListings(), readSubscriptions()]);
    const publicListings = listings.map(({ ownerProfileId, ...listing }) => ({
      ...listing,
      isBoosted: Boolean(ownerProfileId && Number(subscriptions[ownerProfileId]?.level) > 0),
    }));
    publicListings.sort((a, b) => Number(b.isBoosted) - Number(a.isBoosted) || b.createdAt.localeCompare(a.createdAt));
    return Response.json(publicListings, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'ไม่สามารถโหลดประกาศได้' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (Number(request.headers.get('content-length')) > 10000) {
      return Response.json({ error: 'ข้อมูลมีขนาดใหญ่เกินไป' }, { status: 413 });
    }
    const body = await request.text();
    if (new TextEncoder().encode(body).length > 10000) {
      return Response.json({ error: 'ข้อมูลมีขนาดใหญ่เกินไป' }, { status: 413 });
    }
    let input: Record<string, unknown>;
    try {
      const parsed: unknown = JSON.parse(body);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid body');
      input = parsed as Record<string, unknown>;
    } catch {
      return Response.json({ error: 'รูปแบบข้อมูลไม่ถูกต้อง' }, { status: 400 });
    }
    const title = typeof input.title === 'string' ? input.title.trim() : '';
    const summary = typeof input.summary === 'string' ? input.summary.trim() : '';
    const sellerName = typeof input.sellerName === 'string' ? input.sellerName.trim() : '';
    const contactValue = typeof input.contactValue === 'string' ? input.contactValue.trim() : '';
    const category = input.category;
    const contactMethod = input.contactMethod;
    const ownerProfileId = typeof input.ownerProfileId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.ownerProfileId)
      ? input.ownerProfileId : undefined;
    const askingPrice = input.askingPrice === '' || input.askingPrice == null ? null : Number(input.askingPrice);

    if (!title || title.length > 100 || !summary || summary.length > 600 || !sellerName || sellerName.length > 80 ||
        !MARKETPLACE_CATEGORIES.includes(category as SaleListing['category']) ||
        (contactMethod !== 'email' && contactMethod !== 'line') ||
        (contactMethod === 'email' && (contactValue.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactValue))) ||
        (contactMethod === 'line' && !/^[A-Za-z0-9._-]{2,50}$/.test(contactValue)) ||
        (askingPrice !== null && (!Number.isInteger(askingPrice) || askingPrice <= 0 || askingPrice > 1_000_000_000))) {
      return Response.json({ error: 'กรุณาตรวจสอบข้อมูลประกาศและช่องทางติดต่อ' }, { status: 400 });
    }

    const listing: StoredListing = {
      id: randomUUID(), title, summary, sellerName,
      category: category as SaleListing['category'],
      contactMethod, contactValue, askingPrice, ownerProfileId,
      createdAt: new Date().toISOString(),
    };

    const write = pendingWrite.then(async () => {
      const listings = await readListings();
      await mkdir(path.dirname(dataFile), { recursive: true });
      await writeFile(dataFile, JSON.stringify([listing, ...listings], null, 2), 'utf8');
    });
    pendingWrite = write.catch(() => undefined);
    await write;
    const publicListing = { ...listing };
    delete publicListing.ownerProfileId;
    return Response.json(publicListing, { status: 201 });
  } catch {
    return Response.json({ error: 'ไม่สามารถบันทึกประกาศได้' }, { status: 500 });
  }
}
