import type { RawPost } from "@/lib/blog-data"

export const post: RawPost = {
  title: "language is not intelligence",
  time: "9:23 AM", 
  location: "at home, meta-analysing the tokens popping up in my mind",
  content: `
  it's true that language encodes many forms of our intelligence. and it's quite magical. think about it: <b>words need to be boundless but also structured.</b> language is a formulation of syntax and semantics ("colourless green ideas sleep furiously"), embued with micro-worlds and meaning only through human interaction and context. <b>a lot of what is perceived to distinguish humans from other animals is intimiately bound with our linguistic abilities.</b> 

  but what i think we often mistaken when interacting with LLMs, is that language = intelligence. <b>language presents a tool for us to represent and communicate our worlds to one another.</b> judith fan gives a good example -- describe a specific bookshelf to another person. 
  - angle 1: "it's a bookshelf"
  - angle 2: "it's a place where you can store books"
  - angle 3: "it has 8 cubic holes for storing reading material"
  - angle 4: "30x30x30cm wooden planks, multiple that by 8 times, place them together in a rectangular shape, store these items that have many 30x50cm pages, all composed of words into binders...etc, etc."
  language layers abstraction over abstraction, formatting our experiences in a way that's both efficient and mutually understood between two people.

  so, while yes, language encodes 'core intelligence' in a sense, it is not purely intelligence itself. <b>words are spoken and heard and thought, but what we're lacking include the other sensory inputs of the world: sight, touch, and even time -- evolution and continual learning and building of linguistical blocks on how we got from line to bookshelf. </b> this bleeds into fei-fei li and yann lecun's work on world models. but that's for another day.
  `,
  sources: [
    "https://www.theverge.com/ai-artificial-intelligence/827820/large-language-models-ai-intelligence-neuroscience-problems",
    "https://www.youtube.com/watch?v=GcyAXVND3u8",
    "https://www.youtube.com/watch?v=AF3XJT9YKpM&t=451s",
    "https://en.wikipedia.org/wiki/Colorless_green_ideas_sleep_furiously",
    "im obssessed with these: http://archives.conlang.info/ga/farzhi/shiarweilwoen.html"
  ],
}
