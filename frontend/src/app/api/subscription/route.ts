import { saveSubscription } from '@/lib/subscriptionStore';
import type { SubscriptionLevel } from '@/types/subscription';

export async function POST(request: Request) {
  try {
    if (Number(request.headers.get('content-length')) > 1024) return Response.json({ error: 'ข้อมูลมีขนาดใหญ่เกินไป' }, { status: 413 });
    const body = await request.text();
    if (new TextEncoder().encode(body).length > 1024) return Response.json({ error: 'ข้อมูลมีขนาดใหญ่เกินไป' }, { status: 413 });
    let input: unknown;
    try {
      input = JSON.parse(body);
    } catch {
      return Response.json({ error: 'รูปแบบข้อมูลไม่ถูกต้อง' }, { status: 400 });
    }
    if (!input || typeof input !== 'object') return Response.json({ error: 'รูปแบบข้อมูลไม่ถูกต้อง' }, { status: 400 });
    const { profileId, level } = input as { profileId?: unknown; level?: unknown };
    if (typeof profileId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(profileId) ||
        (level !== 0 && level !== 1 && level !== 2)) {
      return Response.json({ error: 'ข้อมูลระดับสมาชิกไม่ถูกต้อง' }, { status: 400 });
    }
    await saveSubscription(profileId, level as SubscriptionLevel);
    return Response.json({ level });
  } catch {
    return Response.json({ error: 'ไม่สามารถบันทึกระดับสมาชิกได้' }, { status: 500 });
  }
}
