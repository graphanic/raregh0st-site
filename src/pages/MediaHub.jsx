import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SEO } from "../components/SEO";
import { SOCIALS } from "../data/socials";
import {
  VIDEO_CATEGORIES,
  VIDEOS,
  filterVideos,
  getFeaturedVideo,
  sortVideosNewestFirst,
} from "../data/videos";
import "./mediaHub.css";

const CATEGORY_LABELS = new Map(VIDEO_CATEGORIES.map((category) => [category.id, category.label]));

const thumbnailFor = (video) => `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
const watchUrlFor = (video) => `https://www.youtube.com/watch?v=${video.youtubeId}`;

function formatArchiveDate(value) {
  const [year, month, day] = value.split("-");
  return `${year}.${month}.${day}`;
}

function VideoThumbnail({ video, eager = false }) {
  const [failed, setFailed] = useState(false);

  return (
    <>
      {!failed ? (
        <img
          src={thumbnailFor(video)}
          alt=""
          loading={eager ? "eager" : "lazy"}
          fetchpriority={eager ? "high" : "auto"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="media-thumbnail-fallback" aria-hidden="true">
          <span>Signal unavailable</span>
        </span>
      )}
    </>
  );
}

function PlayMark() {
  return (
    <span className="media-play-mark" aria-hidden="true">
      <span />
    </span>
  );
}

function VideoLightbox({ video, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => closeRef.current?.focus());

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])')];
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="media-lightbox-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section
        ref={dialogRef}
        className="media-lightbox"
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-lightbox-title"
        aria-describedby="media-lightbox-description"
      >
        <header className="media-lightbox-header">
          <div>
            <span>Now receiving</span>
            <h2 id="media-lightbox-title">{video.title}</h2>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close video player">
            Close
          </button>
        </header>

        <div className="media-lightbox-player">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={`${video.title} video player`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        <footer className="media-lightbox-footer">
          <p id="media-lightbox-description">{video.description}</p>
          <a href={watchUrlFor(video)} target="_blank" rel="noopener noreferrer">
            Watch on YouTube <span aria-hidden="true">↗</span>
          </a>
        </footer>
      </section>
    </div>
  );
}

export const MediaHub = () => {
  const [category, setCategory] = useState("all");
  const [activeVideo, setActiveVideo] = useState(null);
  const lastTriggerRef = useRef(null);

  const sortedVideos = useMemo(() => sortVideosNewestFirst(VIDEOS), []);
  const featuredVideo = useMemo(() => getFeaturedVideo(sortedVideos), [sortedVideos]);
  const filteredVideos = useMemo(() => filterVideos(sortedVideos, category), [category, sortedVideos]);

  const openVideo = useCallback((video, trigger) => {
    lastTriggerRef.current = trigger;
    setActiveVideo(video);
  }, []);

  const closeVideo = useCallback(() => {
    setActiveVideo(null);
    window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }, []);

  return (
    <main className="media-archive-page">
      <SEO
        title="Media Archive"
        description="Enter the 1RareGh0st transmission archive—tutorials, creative process films, experiments, and gaming videos."
        path="/media"
      />

      <div className="media-archive-shell">
        <header className="media-archive-hero">
          <div className="media-archive-eyebrow">
            <span>Media</span>
            <span aria-hidden="true">/</span>
            <span>Transmission Archive</span>
          </div>
          <div className="media-archive-hero-grid">
            <h1>Transmissions from inside the work.</h1>
            <p>Tutorials, process films, visual experiments, and the games that became part of the language.</p>
          </div>

          <nav className="media-signal-bar" aria-label="RareGh0st channels and social profiles">
            {SOCIALS.map((social, index) => (
              <a
                key={social.id}
                href={social.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="media-signal-link"
                style={{ "--signal-color": social.color }}
              >
                <span className="media-signal-index">{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <strong>{social.label}</strong>
                  <small>{social.handle}</small>
                </span>
                <span className="media-signal-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
        </header>

        {featuredVideo && (
          <section className="media-feature" aria-labelledby="media-feature-title">
            <div className="media-feature-rail" aria-hidden="true">
              <span>Opening signal</span>
              <span>00:00:00</span>
            </div>

            <button
              type="button"
              className="media-feature-visual"
              onClick={(event) => openVideo(featuredVideo, event.currentTarget)}
              aria-label={`Play ${featuredVideo.title}`}
            >
              <VideoThumbnail video={featuredVideo} eager />
              <span className="media-feature-scan" aria-hidden="true" />
              <span className="media-feature-play">
                <PlayMark />
                <span>Play transmission</span>
              </span>
              <span className="media-feature-duration">{featuredVideo.duration}</span>
            </button>

            <div className="media-feature-copy">
              <div className="media-feature-meta">
                <span>{CATEGORY_LABELS.get(featuredVideo.category)}</span>
                <time dateTime={featuredVideo.publishedAt}>{formatArchiveDate(featuredVideo.publishedAt)}</time>
              </div>
              <h2 id="media-feature-title">{featuredVideo.title}</h2>
              <p>{featuredVideo.description}</p>
              <div className="media-feature-actions">
                <button type="button" onClick={(event) => openVideo(featuredVideo, event.currentTarget)}>
                  Watch here
                </button>
                <a href={watchUrlFor(featuredVideo)} target="_blank" rel="noopener noreferrer">
                  YouTube <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </section>
        )}

        <section className="media-index" aria-labelledby="media-index-title">
          <header className="media-index-header">
            <div>
              <span>Chronological index</span>
              <h2 id="media-index-title">Every recorded signal.</h2>
            </div>
            <p>{String(filteredVideos.length).padStart(2, "0")} transmission{filteredVideos.length === 1 ? "" : "s"}</p>
          </header>

          <div className="media-filter-bar" aria-label="Filter videos by category">
            {VIDEO_CATEGORIES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={category === item.id}
                onClick={() => setCategory(item.id)}
              >
                {item.label}
                <span>{item.id === "all" ? sortedVideos.length : sortedVideos.filter((video) => video.category === item.id).length}</span>
              </button>
            ))}
          </div>

          {filteredVideos.length > 0 ? (
            <div className="media-timeline">
              {filteredVideos.map((video, index) => (
                <article key={video.id} className="media-timeline-entry">
                  <div className="media-timecode" aria-label={`Published ${video.publishedAt}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <time dateTime={video.publishedAt}>{formatArchiveDate(video.publishedAt)}</time>
                    <span className="media-timecode-line" aria-hidden="true" />
                  </div>

                  <button
                    type="button"
                    className="media-timeline-thumbnail"
                    onClick={(event) => openVideo(video, event.currentTarget)}
                    aria-label={`Play ${video.title}`}
                  >
                    <VideoThumbnail video={video} />
                    <PlayMark />
                    <span className="media-timeline-duration">{video.duration}</span>
                  </button>

                  <div className="media-timeline-copy">
                    <div className="media-timeline-meta">
                      <span>{CATEGORY_LABELS.get(video.category)}</span>
                      {video.featured && <span>Opening signal</span>}
                    </div>
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                    <div className="media-timeline-actions">
                      <button type="button" onClick={(event) => openVideo(video, event.currentTarget)}>
                        Play here
                      </button>
                      <a href={watchUrlFor(video)} target="_blank" rel="noopener noreferrer">
                        YouTube <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="media-index-empty" role="status">
              No transmissions are filed in this category yet. Choose another signal to continue.
            </div>
          )}
        </section>
      </div>

      {activeVideo && createPortal(
        <VideoLightbox video={activeVideo} onClose={closeVideo} />,
        document.body,
      )}
    </main>
  );
};
