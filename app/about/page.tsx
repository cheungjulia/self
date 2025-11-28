import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function AboutPage() {
  return (
    <main style={{ maxWidth: "600px", margin: "0 auto" }}>
      <SiteHeader />

      <h2
        style={{
          fontWeight: "normal",
          fontSize: "18px",
          margin: "0 0 20px 0",
        }}
      >
        me
      </h2>

      <div style={{ maxWidth: "65ch" }}>
        <p style={{ marginBottom: "15px" }}>
          - hong kong born, lived in US, thailand, prague.<br />
          - sometimes obsessive. too overthinky.<br />
          - no clue what the meaning of life is and is ok with it mostly.<br />
          - discovered a moth species when in the amazons.<br />
          - easily hangry.<br />
        </p>

        <p style={{ marginBottom: "15px" }}>
          you can probably reach me on X @creaturewai. no promises tho.
        </p>

        <p
          style={{
            fontSize: "12px",
            color: "#666666",
            fontFamily: "'Courier New', Courier, monospace",
          }}
        >
        </p>
      </div>

      <SiteFooter />
    </main>
  )
}
