import Link from "next/link"

export function SiteHeader() {
  return (
    <header style={{ marginBottom: "48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1
            style={{
              fontFamily: "var(--font-noto-serif-hk), var(--font-playfair), Georgia, serif",
              fontWeight: 400,
              fontSize: "26px",
              margin: "0 0 8px 0",
              letterSpacing: "0.02em",
              color: "var(--foreground)",
              lineHeight: 1,
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
              thoughts.txt [慧慧]
            </Link>
          </h1>
          
          <p
            style={{
              fontSize: "12px",
              color: "var(--foreground-subtle)",
              margin: 0,
              fontFamily: "'Courier New', Courier, monospace",
              letterSpacing: "0.08em",
            }}
          >
            i blunder words and overthink
          </p>
        </div>
        
        <nav 
          style={{ 
            fontFamily: "'Courier New', monospace",
            fontSize: "12px",
            textAlign: "right",
            lineHeight: 1.6,
          }}
        >
          <Link href="/" className="nav-link">home</Link>
          <br />
          <Link href="/archive" className="nav-link">archive</Link>
          <br />
          <Link href="/about" className="nav-link">about</Link>
        </nav>
      </div>
      
      <hr style={{ marginTop: "24px" }} />
    </header>
  )
}
