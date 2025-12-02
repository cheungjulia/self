import type { RawPost } from "@/lib/blog-data"

export const post: RawPost = {
  title: "what should last?",
  time: "10:43 PM",
  location: "causeway bay at deskone",
  content: `
  i enjoyed this article whilst having my morning coffee:
  https://lil.law.harvard.edu/century-scale-storage/
  - 'Fragility, and the culture it creates, can be an asset in inspiring the sort of care necessary for the long term. A system that seeks the indestructible or infallible has the potential to encourage overconfidence, nonchalance, and the ultimate enemy of all archives, neglect.'
  - 'The success of century-scale storage comes down to the same thing that storage and preservation of any duration does: maintenance. The everyday work of a human being caring for something. [...] How it is stored will evolve or change as it is maintained, but if there are maintainers, it will persist.'

  as someone who likes to document everything, but rarely goes back to read it, i often question what the value of saving something is. search requires you to remember what to search for. scrolling requires time. id be curious to fine-tune an LLM with all my journal entries, notes, images, thoughts, to see whether it can evolve into a mini-me.
  `,
  sources: [
    "https://killedbygoogle.com/",
  ],
}
