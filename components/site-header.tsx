import Link from "next/link"

export function SiteHeader() {
  return (
    <header style={{ marginBottom: "48px" }}>
      <h1
        style={{
          fontFamily: "var(--font-noto-serif-hk), var(--font-playfair), Georgia, serif",
          fontWeight: 400,
          fontSize: "26px",
          margin: "0 0 8px 0",
          letterSpacing: "0.02em",
          color: "var(--foreground)",
        }}
      >
        <Link 
          href="/" 
          style={{ 
            textDecoration: "none", 
            color: "inherit",
            transition: "opacity 0.2s ease",
          }}
        >
          elevator convos with 慧慧
        </Link>
      </h1>
      
      <p
        style={{
          fontSize: "12px",
          color: "var(--foreground-subtle)",
          margin: "0 0 16px 0",
          fontFamily: "'Courier New', Courier, monospace",
          letterSpacing: "0.08em",
        }}
      >
        i blunder words and overthink
      </p>
      
      <nav 
        style={{ 
          fontSize: "13px",
          display: "flex",
          gap: "24px",
          alignItems: "center",
        }}
      >
        <Link href="/" className="nav-link">home</Link>
        <span style={{ color: "var(--foreground-subtle)", opacity: 0.4 }}>·</span>
        <Link href="/archive" className="nav-link">archive</Link>
        <span style={{ color: "var(--foreground-subtle)", opacity: 0.4 }}>·</span>
        <Link href="/about" className="nav-link">about</Link>
      </nav>
      
      <hr style={{ marginTop: "24px" }} />
    </header>
  )
}
