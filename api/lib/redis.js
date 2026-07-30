const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(command, ...args) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    throw new Error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN env vars');
  }
  const res = await fetch(`${UPSTASH_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([command, ...args]),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

export async function getMonitors() {
  try {
    const raw = await redis('GET', 'pingpulse:monitors');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Redis GET error:', err.message);
    return [];
  }
}

export async function saveMonitors(monitors) {
  await redis('SET', 'pingpulse:monitors', JSON.stringify(monitors));
}
