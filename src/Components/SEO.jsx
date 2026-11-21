import { Helmet } from "react-helmet-async";

const siteUrl = "https://royal-higher-life-ag25.vercel.app";
const siteName = "Royal HigherLife Christian Ministries";
const defaultDescription = "Royal HigherLife Christian Ministries (Outreach) is committed to spreading the Gospel of Jesus Christ through evangelism, discipleship, and compassionate outreach across Nigeria, Benin Republic, and Togo.";
const defaultImage = `${siteUrl}/royal-logo.jpeg`;

export function SEO({ 
  title, 
  description, 
  image, 
  url, 
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags
}) {
  const pageTitle = title ? `${title} | ${siteName}` : siteName;
  const pageDescription = description || defaultDescription;
  const pageImage = image || defaultImage;
  const pageUrl = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#14532D" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={siteName} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      {section && <meta property="article:section" content={section} />}
      {tags && tags.map(tag => <meta key={tag} property="article:tag" content={tag} />)}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={pageUrl} />
      
      {/* JSON-LD Structured Data for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteName,
          url: siteUrl,
          logo: `${siteUrl}/royal-logo.jpeg`,
sameAs: [
            "https://youtube.com",
            "https://wa.me/2349157754411"
        ],
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+234-915-775-4411",
            contactType: "customer service",
            availableLanguage: "English",
            areaServed: ["NG", "BJ", "TG"]
          },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Ibadan",
            addressRegion: "Oyo State",
            addressCountry: "NG"
          }
        })}
      </script>
      
      {/* JSON-LD for WebSite */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteName,
          url: siteUrl,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
}

export default SEO;
