import type { RawPost } from "@/lib/blog-data"

export const post: RawPost = {
  title: "hivemind, the converging behavioural basin of LLMs",
  time: "8:57 AM", 
  location: "at home, neurips",
  content: `
  im sure youve felt it too -- talking to any LLM, responses tend to be quite generic, no?

  https://arxiv.org/pdf/2510.22954
  <b>"Artificial Hivemind: The Open-Ended Homogeneity of Language Models (and Beyond)"</b>. this paper systematicised the evaluation of all the models to show that model results are converging (same prompt -> very similar responses)
  <img src="/2025-12-13.png" alt="hivemind" />
  - <b>new dataset, "INFINITY-CHAT":</b> a large-scale dataset of 26K real-world open-ended queries spanning diverse, naturally occurring prompts
  - <b>the Artificial Hivemind effect:</b> (1) intra-model repetition, where a single model repeatedly generates similar outputs, and, more critically, (2) inter-model homogeneity, where different models independently converge on similar ideas with minor variations in phrasing. this is not just a matter of LLM "tuning" to the dataset, but a more fundamental property of the models.
  - <b>what's causing this?</b> training on synthetic data, insufficient diversity in training data

  implications:
  - <b>model selection:</b> if it's true that we are seeing some sort of ensembling / collapsing of model choices, it may imply it matters less to base model picks on its "general quality of responses" (obv there are still differentiators like speed, model size, use case and context, tone etc.)
  - <b>edge computing, specialised use cases:</b> yes these foundational AI companies want "AGI", "general" intelligence -- but for industry applications imo, folks want specialised models (e.g. healthcare keywords, SWE trained models). to me it sounds like opportunity to train context-specific models, even your own mini-local one with your own data.
  - <b> lack of creativity, bias, responsible ai, etc.</b>: all encoding similar biases, all representing a majority voice, all thinking the same way. cliches from head to tail.
  `,
  sources: [
    "https://neurips.cc/virtual/2025/awards_detail",
    "https://github.com/liweijiang/artificial-hivemind",
    "https://openreview.net/forum?id=saDOrrnNTz",
    "totally not that relevant research, will talk more about this another day but it's funny that models are nondeterministic mathematically but somehow we're getting the same vibe of results. honestly totally makes sense, meets statistical expectation but =! ideal behaviour: https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/"
  ],
}
