import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />

      <h2
        style={{
          fontFamily: "var(--font-noto-serif-hk), var(--font-playfair), Georgia, serif",
          fontWeight: 400,
          fontSize: "20px",
          margin: "0 0 24px 0",
          color: "var(--foreground)",
          letterSpacing: "0.02em",
        }}
      >
        me
      </h2>

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
          - hong kong born, lived in US, thailand, prague.<br />
          - sometimes obsessive. too overthinky.<br />
          - no clue what the meaning of life is and is ok with it mostly.<br />
          - discovered a moth species when in the amazons.<br />
          - easily hangry.
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
