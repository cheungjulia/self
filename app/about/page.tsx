import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />
      <Image
        src="/teahouse_hk.jpg"
        alt="Hong Kong teahouse"
        width={640}
        height={427}
        style={{
          width: "100%",
          height: "auto",
          marginBottom: "24px",
          opacity: 0.9,
        }}
      />

<h2
        style={{
          fontFamily: "var(--font-noto-serif-hk), var(--font-playfair), Georgia, serif",
          fontWeight: 400,
          fontSize: "20px",
          margin: "0 0 15px 0",
          color: "var(--foreground)",
          letterSpacing: "0.02em",
        }}
      >
        julia, 1999
      </h2>
      

      <div 
        className="post-content fade-up"
        style={{ maxWidth: "100%" }}
      >
        <p 
          style={{ 
            marginBottom: "1.2em",
            color: "var(--foreground-muted)",
            lineHeight: 1.85,
          }}
        >
          - hong kong born, lived in US, thailand, prague<br />
          - discovered a moth species when in the amazons<br />
          - data scientist-ish, ai engineer-ish<br />
          - easily hangry<br />
          - avid documenter, but hasnt figured out the best way to do it
        </p>

        <p 
          style={{ 
            marginBottom: "1.2em",
            color: "var(--foreground-muted)",
            lineHeight: 1.85,
          }}
        >
          you can probably reach me on X @creaturewai. no promises tho.
        </p>
      </div>
    </main>
  )
}
