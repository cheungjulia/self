import Link from "next/link"

export function SiteHeader() {
  return (
    <header style={{ marginBottom: "40px" }}>
      <h1
        style={{
          fontWeight: "normal",
          fontSize: "24px",
          margin: "0 0 5px 0",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          elevator convos with 慧慧
        </Link>
      </h1>
      <p
        style={{
          fontSize: "12px",
          color: "#666666",
          margin: "0 0 10px 0",
          fontFamily: "'Courier New', Courier, monospace",
        }}
      >
        i blunder words and overthink
      </p>
      <nav style={{ fontSize: "14px" }}>
        <Link href="/">home</Link>
        {" · "}
        <Link href="/archive">archive</Link>
        {" · "}
        <Link href="/about">about</Link>
      </nav>
      <hr />
    </header>
  )
}
