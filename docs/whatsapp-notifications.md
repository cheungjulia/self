# WhatsApp Notification System

A simple system to notify subscribers via WhatsApp when you publish new blog posts.

---

## How It Works

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           SUBSCRIBE FLOW                                  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   User clicks "subscribe"  →  Fills form (name + phone)                  │
│                                      │                                   │
│                                      ▼                                   │
│                            POST /api/subscribe                           │
│                                      │                                   │
│                                      ▼                                   │
│                         subscriberService.subscribe()                    │
│                                      │                                   │
│                                      ▼                                   │
│                     ┌────────────────────────────────┐                   │
│                     │        Upstash Redis           │                   │
│                     │  ┌──────────────────────────┐  │                   │
│                     │  │ subscribers:+1234567890  │  │ ← Hash (user data)│
│                     │  │ subscribers:list         │  │ ← Set (all phones)│
│                     │  └──────────────────────────┘  │                   │
│                     └────────────────────────────────┘                   │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                            NOTIFY FLOW                                    │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   You publish post  →  Run: pnpm notify 2025-12-08                       │
│                                      │                                   │
│                                      ▼                                   │
│                     scripts/notify-subscribers.js                        │
│                     (reads post title from file)                         │
│                                      │                                   │
│                                      ▼                                   │
│                       POST /api/notify (with auth)                       │
│                                      │                                   │
│                        ┌─────────────┴─────────────┐                     │
│                        ▼                           ▼                     │
│            subscriberService.getAll()    whatsappService.sendBulk()      │
│            (fetch all phones)            (send to each subscriber)       │
│                        │                           │                     │
│                        ▼                           ▼                     │
│                  Upstash Redis            Meta WhatsApp API              │
│                                                    │                     │
│                                                    ▼                     │
│                                          📱 Subscribers' WhatsApp        │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Setup

### 1. Upstash Redis (Subscriber Storage)

1. Go to https://console.upstash.com
2. Create a Redis database
3. Copy credentials to `.env.local`:

```bash
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxxx...
```

### 2. Meta WhatsApp Cloud API

1. Go to https://developers.facebook.com
2. Create App → Add WhatsApp product
3. In API Setup, get:
   - Phone Number ID
   - Access Token (generate temporary for testing)
4. Add test phone numbers under "Manage phone number list"
5. Add to `.env.local`:

```bash
WHATSAPP_PHONE_NUMBER_ID=123456789
WHATSAPP_ACCESS_TOKEN=EAAxxxx...
NOTIFY_SECRET=any-random-secret-string
SITE_URL=https://creaturewai.net
```

---

## Usage

### Publishing a new post

```bash
# 1. Create your post file
#    posts/2025/12/10.ts

# 2. Build and deploy
pnpm build
# (deploy to Vercel)

# 3. Notify subscribers
pnpm notify 2025-12-10
```

### Output

```
📝 Notifying subscribers about: "my post title"
   Post ID: 2025-12-10
   URL: https://creaturewai.net/post/2025-12-10

✅ Notifications sent!
   Sent: 5
   Failed: 0
   Total subscribers: 5
```

---

## File Structure

```
lib/
├── redis.ts          # Redis client singleton
├── subscribers.ts    # Subscriber CRUD operations
└── whatsapp.ts       # WhatsApp API wrapper

app/api/
├── subscribe/route.ts  # POST - add new subscriber
└── notify/route.ts     # POST - send notifications (protected)

scripts/
└── notify-subscribers.js  # CLI to trigger notifications

types/
└── subscriber.ts      # Type definitions
```

---

## Data Model

Each subscriber is stored as a Redis hash:

```
Key: subscribers:+14155551234

Value: {
  id: "uuid",
  phone: "+14155551234",
  name: "Julia",
  subscribedAt: "2025-12-10T09:00:00Z",
  metadata: {
    userAgent: "Mozilla/5.0...",
    locale: "en-US",
    referrer: "https://twitter.com/...",
    source: "/post/2025-12-08"
  }
}
```

A separate Set tracks all phone numbers for quick iteration:

```
Key: subscribers:list
Value: ["+14155551234", "+447700900000", ...]
```

---

## Costs

| Service | Free Tier |
|---------|-----------|
| Upstash Redis | 10,000 commands/day |
| WhatsApp Cloud API | 1,000 conversations/month |
| Vercel | Hobby tier |

For a personal blog, this is effectively **free**.

---

## Security

- `/api/notify` requires `Bearer {NOTIFY_SECRET}` header
- Only you can trigger notifications
- Phone numbers stored in your private Redis instance
- `.env.local` is gitignored

---

## Troubleshooting

### "Missing WhatsApp credentials"
→ Check `WHATSAPP_PHONE_NUMBER_ID` and `WHATSAPP_ACCESS_TOKEN` in `.env.local`

### "Unauthorized" on notify
→ Check `NOTIFY_SECRET` matches in `.env.local` and script

### Messages not delivering
→ Ensure recipient is added as test number in Meta Developer Console
→ Check WhatsApp Cloud API logs in Meta Developer Console

### "Invalid phone format"
→ Use international format with country code: `+1 234 567 8900`

