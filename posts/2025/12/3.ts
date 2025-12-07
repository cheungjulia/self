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
  followups: [
    {
      date: "December 8, 2025",
      content: `
      From Google's Nested Learning paper
      https://abehrouz.github.io/files/NL.pdf

      <i>Limitations of LLM/transformer models as how they represent the brain:</i>
- <b>Lack of multi-timescale processing:</b> Brainwaves are the results of the brain coordinating its computations in different timescales and frequency of updates. In deep learning models, however, the weights of the architectures are fixed at test time and also it is common in pre-training to use the same update rate for all the blocks/layers in the model. Later, in Section 6, however, we show that in-context learning provides an extreme case of this design and in fact, Transformer architectures are based on two extreme frequencies of update: i.e., ∞ and 0 for attention and MLP blocks, respectively
- <b>Brain's neuroplasticity:</b> can change itself in response to new memories, knowledge, and even damage 
- <b>Human brain not as an isolated system of specific areas, but rather distributed:</b> The modern deep learning architectures in recent years, however, at least on the surface, seem to be heterogeneous and are based on a combination of a subset of self-attention variants (Vaswani et al. 2017), modern recurrent neural networks (Katharopoulos et al. 2020; Schlag et al. 2021; Behrouz et al. 2025c; Peng et al. 2025b), canon layers (Allen-Zhu 2025), global convolutions (Hasani et al. 2023; Poli et al. 2023), and MLP blocks (Shazeer 2020).

<i>Paradigm shift: unification of architecture and optimisation using Nested Learning</i>
A model is viewed as a hierarchy of interconnected learning modules, each with its own:
- Typical deep learning built on a simple hierarchy, you have the model, you have an optimiser (the training rule), you have data -- treating them as separate entities
- Nested learning says that the division is artificial, model and optimiser are both learning systems, just operating at different levels of abstraction
- Each has its own internal flow of information, or what the authors call “context flow.” When you zoom out, training isn’t one process, it’s a stack of interconnected optimization problems nested inside one another, each updating at a different rate (update frequency how often it adapts)
- These modules form nested or parallel optimization loops, enabling multi-level learning within a single system.
      `,
      sources: [
        "https://evoailabs.medium.com/nested-learning-new-research-from-google-6ae0ae38656f",
        "https://www.reddit.com/r/singularity/comments/1or265r/google_introducing_nested_learning_a_new_ml/",
        "https://medium.com/data-science-in-your-pocket/what-is-google-nested-learning-34385df5c40b"
      ],
    },
  ],
}
