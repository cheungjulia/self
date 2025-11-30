import type { RawPost } from "@/lib/blog-data"

export const post: RawPost = {
  title: "robots in the wild",
  location: "on a taxi in shenzhen heading back to hk through futian",
  content: `massive traffic, and my dad chuckles to himself and says "must be a self driving car glitching out up front". he turns to my mum: "with the way you drive, maybe it's trained on your data".

thinking about the "long tail" of edge cases that self driving cars need to be trained on and the success it can have in china:
- with the way folks drive in shenzhen + traffic rules (more likely not followed than followed), it feels too "unpredictable" for an automated system to navigate
- even if successful, the government may not be extremely open to mass deployment as it takes economic jobs in an already high unemployment market. [3, 5, 6]
- chinese autonomous vehicle market with baidu's apollo go, weride, pony ai, all in testing phase but on international roads: singapore, abu dhabi, dubai. why not chinese roads? too difficult to learn, or additional regulations? [2]

other robot things:
- humanoid vs non-humanoid: make humanoid robots as most of society is shaped by the human form. but it's inefficient. why build a humanoid robot to drive a car when you can just build a self-driving car?
- imo china will just dominate. anything that requires hardware and materials, china just has such a strong competitive advantage with the manufacturing base.
`,
sources: ["learning through putting robots into the wild: https://x.com/iliraliu_/status/1994482263031992778?s=46&t=8ZG-I97lF81q1B3TVPOpgw",
"https://www.theguardian.com/technology/2025/nov/10/waymo-baidu-apollo-go-china-elon-musk-tesla",
"'Waymo has quickly captured more than 10% of the SF ride-sharing market': https://x.com/stefanfschubert/status/1994087153626743267?s=46&t=8ZG-I97lF81q1B3TVPOpgw",
"https://x.com/waymo/status/1991989888778973280?s=46&t=8ZG-I97lF81q1B3TVPOpgw",
"https://www.youtube.com/watch?v=Qqyp00JPJZI",
"'2024, the number of licensed ride-hailing drivers nationwide had reached 7.48 million — a figure roughly equal to the entire population of Hong Kong': https://www.beijingscroll.com/p/inside-chinas-748-million-ride-hailing",
"'77% of drivers entered the ride-hailing sector after being unemployed':https://hr.asia/top-news/china/ride-hailing-drivers-are-second-highest-earners-among-chinese-blue-collar-workers/"]
}