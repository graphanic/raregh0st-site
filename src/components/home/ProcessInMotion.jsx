import { useState } from "react";
import { Link } from "react-router-dom";
import { getWorkById, getWorkHref } from "../../data/catalog";
import { P } from "../../data/palette";
import { HoverMorphText } from "../MorphText";
import { SectionHead } from "./SectionHead";
import "./processInMotion.css";

const FEATURE_COPY = {
  kicker: "Process in Motion",
  title: "550 Layers. One World.",
  body: "Watch Sanity Is In Rare Supply emerge one layer at a time—550 decisions, masks, textures, symbols, and adjustments accumulating into the finished world.",
};

function ProcessPoster({ artwork, mode, onActivate }) {
  const isPlayable = mode === "playable";
  const isError = mode === "error";

  const content = (
    <>
      <img
        src={artwork.img}
        alt=""
        width="1600"
        height="1600"
        loading="lazy"
      />
      <span className="process-film-shade" aria-hidden />
      <span className="process-film-index" aria-hidden>001 / 550</span>
      <span className="process-film-copy">
        {isPlayable && (
          <>
            <strong>Play process film</strong>
            <small>550 layers · sound available</small>
          </>
        )}
        {mode === "placeholder" && (
          <>
            <strong>Process film slot · 550 layers</strong>
            <small>Development preview · awaiting final MP4</small>
          </>
        )}
        {isError && (
          <>
            <strong>Process film temporarily unavailable</strong>
            <small>The finished world is still open to explore.</small>
          </>
        )}
      </span>
    </>
  );

  if (isPlayable) {
    return (
      <button
        type="button"
        className="process-panel process-film-trigger"
        onClick={onActivate}
        aria-label={`Play the 550-layer process film for ${artwork.title}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={`process-panel process-film-poster${isError ? " process-film-error" : ""}`}
      role={isError ? "status" : undefined}
    >
      {content}
    </div>
  );
}

export function ProcessInMotion({ feature, state }) {
  const [isActivated, setIsActivated] = useState(false);
  const [hasError, setHasError] = useState(false);
  const artwork = getWorkById(feature.workId);

  if (!state.isVisible || !artwork) return null;

  const posterMode = hasError
    ? "error"
    : state.isPlaceholder
      ? "placeholder"
      : "playable";

  return (
    <section
      className="process-in-motion"
      aria-labelledby="process-in-motion-title"
      style={{ "--process-art": `url("${artwork.img}")` }}
    >
      <div className="process-in-motion-inner">
        <div id="process-in-motion-title">
          <SectionHead
            number="03"
            kicker={FEATURE_COPY.kicker}
            title={FEATURE_COPY.title}
            color={P.magenta}
          />
        </div>

        <p className="process-in-motion-intro">{FEATURE_COPY.body}</p>

        <div className="process-diptych">
          <div className="process-media-cell">
            {state.hasVideo && isActivated && !hasError ? (
              <div className="process-panel process-video-frame">
                <video
                  src={feature.videoSrc}
                  poster={artwork.img}
                  aria-label={`550-layer process film for ${artwork.title}`}
                  autoPlay
                  controls
                  playsInline
                  preload="metadata"
                  onError={() => {
                    setHasError(true);
                    setIsActivated(false);
                  }}
                />
              </div>
            ) : (
              <ProcessPoster
                artwork={artwork}
                mode={posterMode}
                onActivate={() => setIsActivated(true)}
              />
            )}
            <div className="process-panel-caption">
              <span>Process film</span>
              <span>Layered construction</span>
            </div>
          </div>

          <div className="process-bridge" aria-hidden="true">
            <span>001</span>
            <i />
            <span>550</span>
          </div>

          <div className="process-media-cell">
            <Link
              to={getWorkHref(artwork)}
              className="process-panel process-artwork-link"
              aria-label={`View ${artwork.title} artwork details`}
            >
              <img
                src={artwork.img}
                alt={artwork.title}
                width="1600"
                height="1600"
                loading="lazy"
              />
              <span className="process-artwork-shade" aria-hidden />
              <span className="process-artwork-copy">
                <small>Final composition</small>
                <strong>{artwork.title}</strong>
                <span>Enter the artwork →</span>
              </span>
            </Link>
            <div className="process-panel-caption">
              <span>Resolved world</span>
              <span>{artwork.year}</span>
            </div>
          </div>
        </div>

        <div className="process-media-cta-wrap">
          <Link to="/media" className="process-media-cta">
            <HoverMorphText>Explore the Media World</HoverMorphText>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
