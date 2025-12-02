import type { RawPost } from "@/lib/blog-data"

export const post: RawPost = {
  title: "china-us decoupling, on the ground",
  time: "4:33 PM",
  location: "back in hk, a little existential",
  content: `
  i first heard the phrase "china-us decoupling" as a junior at berkeley [1]. that was 6 years ago. since then, the phrase has been tossed by media outlets and gnawed on by economists and friends [2,3 to show a few examples]. i never thought too much about it, but recently moving between hk/shenzhen and US, i feel like i have to adopt a new set of lingo, learn two separate UI flows, download two sets of apps, with each place:    
- <b>seeing double in my homescreen</b>: consumer apps like google maps vs gaode (alibaba), whatsapp/messenger vs wechat,  foundational AI (deepseek, kimi, doubao, openai, anthropic), electric cars and home products (biyadi, xiaomi, xiaopeng, weilai, lixiang, vs tesla/lucid). last year i came home and the roads were packed with teslas, now i see more biyadis. used to using google maps, the gaode flow felt confusing and awkward to me. i learnt to buy meituan coupons for discounts at restaurants before checking out, and topping up my weixin/alipay wallet.
- <b>consumer products:</b> i went to decathalon in shenzhen to buy protein bars and couldn’t find PhD, barbells, or any international brand, just local Chinese ones.
- <b>twin markets finding parity:</b> talking to my dad this morning, he shared alibaba's origin story, starting from replacing yellow books as a registrar, to becoming an ecommerce marketplace that started the same way amazon did, as a bookstore. on the flip side, saw on x that livestream sales in clothing stores beginning to grow in US, a trend started in china. two separate markets learning from each other. 
- <b>data decoupling, the beginnings</b>: alibaba is growing its cloud business, competing against AWS. many multinationals in china still use AWS, but with the decoupling of foundational LLM models and their training data, will we move up the chain to even decouple all that we store in the cloud?`,
  sources: [
    "The Great Decoupling and Sino-US Race for Technological Supremacy: https://www.youtube.com/watch?v=V-DbEcQkEtE. side note: only searching for this do i realise dan wang was one of the panelists!",
    "tyler cowen: https://marginalrevolution.com/marginalrevolution/2024/04/decoupling-from-china.html",
    "https://www.reuters.com/article/technology/tesla-cars-banned-from-chinas-military-complexes-on-security-concerns-sources-idUSKBN2BB18R/",
    "https://www.aspistrategist.org.au/us-and-chinese-tech-research-is-decoupling-aspis-critical-tech-tracker/"
  ],
}
