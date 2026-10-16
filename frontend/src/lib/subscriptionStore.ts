import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { SubscriptionLevel } from '@/types/subscription';

type SubscriptionRecord = { level: SubscriptionLevel; updatedAt: string };
type SubscriptionRecords = Record<string, SubscriptionRecord>;

const dataFile = path.join(process.cwd(), 'data', 'subscriptions.json');
let pendingWrite: Promise<unknown> = Promise.resolve();

export async function readSubscriptions(): Promise<SubscriptionRecords> {
  try {
    const parsed: unknown = JSON.parse(await readFile(dataFile, 'utf8'));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed as SubscriptionRecords;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {};
    throw error;
  }
}

export async function saveSubscription(profileId: string, level: SubscriptionLevel) {
  const write = pendingWrite.then(async () => {
    const records = await readSubscriptions();
    records[profileId] = { level, updatedAt: new Date().toISOString() };
    await mkdir(path.dirname(dataFile), { recursive: true });
    await writeFile(dataFile, JSON.stringify(records, null, 2), 'utf8');
  });
  pendingWrite = write.catch(() => undefined);
  await write;
}
