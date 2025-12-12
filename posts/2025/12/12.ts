import type { RawPost } from "@/lib/blog-data"

export const post: RawPost = {
  title: "agi-ers and their deniers",
  time: "9:04 AM", 
  location: "at home and on x, clearly the most reliable source ever",
  content: `
  will we reach agi or is it an illusion? on x i float between the agi-bulls and agi-bears, and convos stretch from the most abstract and philosophical (e.g. what even is consciousness? what is human?) to technical (e.g. scaling laws, GPUs, computation). reading just a few hairs off of the wide scalp of the space, here are a few strands of thoughts.

  <b>definition and scope of "general intelligence": what is AGI?</b> think this as the philosophical backbone -- defining human consciousness, intelligence, human distinctiveness. themes such as materialism, anthropomorphism, researching other forms of consciousness such as animal. what are the capabilities and behavious agi should have? as PMs like to say: what is the definition of done? 
  - <b>moving the goalposts:</b> first AI was defined as being able to perform functional tasks, like computing numbers,but now we're asking for reasoning, introspecting, learning
  - <b>tendency of the human to anthropomorphise:</b> intelligence doesn't have to look like us. but also when talking to LLMs that are essentially next-token prediction, folks interact with it like a fellow human.
  - <b>david chalmer's hard problem:</b> brain processes and how they surface first-person experience.
  - <b>emergence as a challenge to materialism:</b> complex systems can behave in surprising and exceptional ways that we have yet to understand (e.g. the mind), yet not-understanding doesn't dispute with the fact that we consider ourselves "intelligent"
  - <b>richard dawkins:</b> "the illusion that we are a unit and not a colony”


  <b>building the "artificial": how do we get to agi?</b> convos around scaling laws, compute, computational representations of the mind. e.g. LLMs, agentic architectures, world models and embodied AI. memory systems, continual learning, self-reflection. exploring <i> how </i> agi can surface.
  - <b>identifying constraints:</b> based on 1 and 2, what can we do now/soon? can GPUs/TPUs keep up? do we have enough data (e.g. real world robots), are our algos efficient enough? this gets more into the mathematical and technical. 
  - <b>scaling laws vs downsizing:</b> yes we can scale more, make compute more efficient, but also we're limited by energy, data availability, budget etc. for those in the downsizing camp, deciding how to downsize is the challenge -- data quality? what sources? how to implement a pruning / forgeting mechanism? 
  - <b>current frontier model limitations:</b> the "jagged" edge of LLM performance. yes it can solve math olympiad problems, but it can't set a table. it doesn't extrapolate well nor understand "basic human things", e.g. object permanence and continuity. a lot of what it can do it has to learn ("fine-tune"). also, lacks continual learning. 
  `,
  sources: [
    "i enjoyed this book: https://clereviewofbooks.com/meghan-ogieblyn-god-human-animal-machine/",
    "you'd think this was 2x speed, but it's not: https://www.youtube.com/watch?v=lXUZvyajciY", 
    "https://www.youtube.com/watch?v=21EYKqUsPfg",
    "https://www.youtube.com/watch?v=CJxJxCyoJO4&t=5724s",
    "https://timdettmers.com/2025/12/10/why-agi-will-not-happen",
    "good summary of research to date on scaling laws: https://research.aimultiple.com/llm-scaling-laws/",
    "https://www.jasonwei.net/blog/emergence",
    "https://x.com/_jasonwei/status/1939762496757539297",
  ],
}
