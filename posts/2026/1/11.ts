import type { RawPost } from "@/lib/blog-data"

export const post: RawPost = {
  title: "silver-haired economics",
  time: "8:34 AM",  // e.g. "10:30 AM" - recommended to set explicitly
  location: "home",
  content: `
  recently my dad shared the term "silver-haired economics" with me: markets built around our beloved elders.

  'By 2035, more than 400 million Chinese citizens will be aged 60 or above. The Fudan Institute on Aging estimates that the silver economy could reach 19.1 trillion yuan (approximately USD 2.7 trillion), accounting for nearly 28% of national consumption.'

  i feel like in the US there's a lot of obssession to be at "the frontier". and yet china, whilst also there, also builds so much at the periphery -- electric wheelchairs (i saw a few in sz and they look so sleek!), granfluencers on tiktok growing a following, wearables for remote health tracking, robotic guiding dogs, smart beds, exoskeletons for walking, etc.
  `,
  sources: [
    "https://ashleydudarenok.com/technology-for-seniors/",
    "https://www.dayangyiliao.com/products-electric-wheelchair.html",
    "https://www.chinadaily.com.cn/a/202510/07/WS68e463cba310f735438b3ba3.html",
    "https://www.tiktok.com/tag/chineseelders",
    "https://global.chinadaily.com.cn/a/202512/25/WS694c8903a310d6866eb3054c.html"
  ],
}
