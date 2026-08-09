import { Helmet } from "react-helmet-async";
import { SEO_COPY } from "../data/siteCopy";

const defaults = {
  siteName: "1RareGh0st",
  siteUrl: "https://raregh0st.studio",
  image: "https://raregh0st.studio/og-image.jpg",
  twitterHandle: "@RareGh0st",
};

export const SEO = ({ title, description, path = "/", image }) => {
  const fullTitle = title
    ? `${title} | ${defaults.siteName}`
    : `${defaults.siteName} \u2014 Inner worlds made visible`;
  const fullUrl = `${defaults.siteUrl}${path}`;
  const desc = description || SEO_COPY.defaultDescription;
  const ogImage = image
    ? (image.startsWith("http") ? image : `${defaults.siteUrl}${image}`)
    : defaults.image;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={defaults.siteName} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={defaults.twitterHandle} />
      <meta name="twitter:creator" content={defaults.twitterHandle} />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};
