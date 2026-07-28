import { Helmet } from "react-helmet-async";

const defaults = {
  siteName: "1RareGh0st",
  siteUrl: "https://raregh0st.com",
  image: "/og-image.jpg",
  twitterHandle: "@RareGh0st",
};

export const SEO = ({ title, description, path = "/" }) => {
  const fullTitle = title
    ? `${title} | ${defaults.siteName}`
    : `${defaults.siteName} \u2014 Trauma Integration Made Visible`;
  const fullUrl = `${defaults.siteUrl}${path}`;
  const desc = description || "Dark digital collage art, prints, apparel, and creative tools. Explore the artwork and philosophy of 1RareGh0st.";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={defaults.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={defaults.image} />
    </Helmet>
  );
};
