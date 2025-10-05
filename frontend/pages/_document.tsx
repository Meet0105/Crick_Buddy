import Document from 'next/document'

export default function MyDocument() {
  return (
    <Document.Html lang="en">
      <Document.Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Document.Head>
      <body>
        <Document.Main />
        <Document.NextScript />
      </body>
    </Document.Html>
  )
}