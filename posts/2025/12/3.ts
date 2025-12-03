/**
 * Template for new blog posts
 * 
 * To create a new post:
 * 1. Copy this file to posts/YYYY/MM/DD.ts (e.g., posts/2025/11/28.ts)
 * 2. Fill in title, location, content
 * 3. Add time (recommended) - if omitted, falls back to file mtime (unreliable on Vercel)
 * 4. Run `npm run dev` - id and date are auto-generated from the file path!
 * 
 * Follow-ups: Add follow-up thoughts later - they only show on individual post page
 */

import type { RawPost } from "@/lib/blog-data"

export const post: RawPost = {
  title: "memory",
  location: "back at home, reading google's nested memory paper",
  content: `
  we've been trying to solve memory in neural architectures since the 50s, starting from symbolic memory (SOAR architecture) to RNNs and LSTMs with gates to control information flow, then the legendary "Attention is all you need" paper in 2017 introducing a context window as memory (-> context rot, lost in the middle), and now finally external memory  banks (RAG, graphs, scratch pads). catastrophic forgetting continues. labs rush to solve it.
	- <b>memory is not a bag of facts, it's layered control</b>: it's not just about storing information, it's about being selective about what to remember and what to forget. pruning and forgetting are equally important when it comes to memory
  - <b>memory != continual learning</b>: learning isnt just remembering and is never static ofc. LLMs are static post-pretraining and limited to in-context learning, lacking the ability for adaptation and "neuroplasticity"
  - <b>formation of long-term memory involves two consolidation processes</b>: online (synaptic) consolidation soon after learning where new info is stabilised and being transferred from ST to LT storage, then offline (systems) consolidation, replaying recently encoded patterns with sharp-wave ripples in the hippocampus
  `,
  sources: [
    "SOAR: https://arxiv.org/pdf/2205.03854",
    "LSTM: https://ieeexplore.ieee.org/abstract/document/6795963",
    "attention is all you need: https://arxiv.org/pdf/1706.03762",
    "memory from then to now: https://huggingface.co/blog/Kseniase/memory",
    "nested learning: https://research.google/blog/introducing-nested-learning-a-new-ml-paradigm-for-continual-learning/"
  ],
}
