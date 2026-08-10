import { Link } from "react-router-dom";
import { P } from "../../data/palette";
import { HoverMorphText, ScrollMorphText } from "../MorphText";

export function SectionHead({ number, kicker, title, color = P.cyan, link, linkLabel }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 32,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 11,
            letterSpacing: 6,
            color,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          {number && <span style={{ color: P.ghost, marginRight: 12 }}>{number}</span>}
          {kicker}
        </div>
        <h2
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(27px, 4vw, 42px)",
            fontWeight: 400,
            letterSpacing: 0,
            color: P.ghost,
            margin: 0,
            lineHeight: 1.12,
          }}
        >
          <ScrollMorphText>{title}</ScrollMorphText>
        </h2>
        <div
          aria-hidden
          style={{
            width: 72,
            height: 1,
            marginTop: 13,
            background: `linear-gradient(to right, ${color}, transparent)`,
          }}
        />
      </div>
      {link && (
        <Link
          to={link}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 11,
            letterSpacing: 3,
            color: P.bone,
            textTransform: "uppercase",
            textDecoration: "none",
            opacity: 0.6,
            borderBottom: `1px solid ${P.steel}55`,
            paddingBottom: 4,
          }}
        >
          <HoverMorphText>{linkLabel}</HoverMorphText>
        </Link>
      )}
    </div>
  );
}
