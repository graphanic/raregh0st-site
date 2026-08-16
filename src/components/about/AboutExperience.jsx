import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ABOUT_DISCOVERIES,
  ABOUT_HUMAN_ANCHORS,
  ABOUT_METHOD,
  ABOUT_SECTIONS,
  ABOUT_SYMBOLS,
} from "../../data/about";
import { getWorkById, getWorkHref } from "../../data/catalog";
import { SANITY_PROCESS_FEATURE } from "../../data/homeFeatures";
import { ARTIST_PORTRAIT_URL } from "../../data/siteCopy";

function SectionMarker({ label }) {
  return (
    <div className="about-section-marker" aria-hidden="true">
      <span>{label}</span>
      <i />
    </div>
  );
}

function DepthRail({ activeSection }) {
  return (
    <aside className="about-depth-rail" aria-label="About page sections">
      <span className="about-depth-rail-label">Orientation</span>
      <nav>
        {ABOUT_SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={activeSection === section.id ? "location" : undefined}
          >
            <span aria-hidden="true" />
            {section.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

function ArtworkDiscovery({ discovery, index }) {
  const work = getWorkById(discovery.workId);
  if (!work) return null;

  return (
    <Link
      to={getWorkHref(work)}
      className={`about-discovery about-discovery-${index + 1}`}
      aria-label={`Open ${work.title} artwork details`}
    >
      <img
        src={work.img}
        alt=""
        width="1200"
        height="1200"
        loading="lazy"
        style={{ objectPosition: discovery.crop }}
      />
      <span className="about-discovery-shade" aria-hidden="true" />
      <span className="about-discovery-index" aria-hidden="true">0{index + 1}</span>
      <span className="about-discovery-copy">
        <small>{discovery.note}</small>
        <strong>{work.title}</strong>
        <span>Enter the work <b aria-hidden="true">↗</b></span>
      </span>
    </Link>
  );
}

function ArtistSection() {
  return (
    <section id="artist" className="about-section about-hero" aria-labelledby="about-title">
      <SectionMarker label="The Artist" />
      <div className="about-hero-copy">
        <p className="about-kicker">About / Eric Fallis</p>
        <h1 id="about-title">I make inner worlds visible.</h1>
        <p className="about-hero-intro">
          1RareGh0st is a studio practice built through image, symbol, colour, contradiction,
          and the decision to keep looking.
        </p>
        <a className="about-text-link" href="#work">
          Begin with the work <span aria-hidden="true">↓</span>
        </a>
      </div>

      <figure className="about-hero-portrait">
        <div className="about-portrait-registration" aria-hidden="true">
          <span>EF / 1RG</span>
          <span>Calgary, AB</span>
        </div>
        <img
          src={ARTIST_PORTRAIT_URL}
          alt="Eric Fallis, artist behind 1RareGh0st"
          width="900"
          height="1125"
          loading="eager"
        />
        <figcaption>
          <span>Artist / Designer / Builder</span>
          <span>Inner worlds, layer by layer</span>
        </figcaption>
      </figure>
    </section>
  );
}

function WorkSection() {
  return (
    <section id="work" className="about-section about-work" aria-labelledby="about-work-title">
      <SectionMarker label="The Work" />
      <div className="about-work-copy">
        <p className="about-kicker">The Work</p>
        <h2 id="about-work-title">Each work is an excavation.</h2>
        <p>
          My name is Eric Fallis, and 1RareGh0st is the studio practice through which I make
          inner worlds visible. I create dense symbolic compositions for people drawn to beauty,
          rupture, consciousness, rebellion, and transformation.
        </p>
        <p>
          The work is built through Photoshop, photography, illustration, symbolic collage, and
          emerging AI-assisted processes. Individual pieces can grow through hundreds of layers,
          sometimes over the course of years. Every face, ruin, animal, machine, memory, joke,
          fragment of culture, and passage of light is placed in conversation with the whole.
        </p>
        <blockquote>The result is not simply surrealism for its own sake.</blockquote>
        <p>
          Trauma Integration Made Visible is where the practice began—but the world it opened now
          holds consciousness, technology, spirituality, culture, absurdity, love, death,
          rebellion, and transformation.
        </p>
      </div>

      <div className="about-discovery-grid" aria-label="Selected artwork details">
        {ABOUT_DISCOVERIES.map((discovery, index) => (
          <ArtworkDiscovery key={discovery.workId} discovery={discovery} index={index} />
        ))}
      </div>
    </section>
  );
}

function ProcessSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const work = getWorkById(SANITY_PROCESS_FEATURE.workId);
  if (!work) return null;

  return (
    <section id="inside" className="about-section about-process" aria-labelledby="about-process-title">
      <SectionMarker label="Inside the Work" />
      <div className="about-process-heading">
        <p className="about-kicker">Inside one work</p>
        <h2 id="about-process-title">Accumulation becomes a world.</h2>
        <p>
          Watch <em>{work.title}</em> emerge through sustained decisions, masks, textures,
          symbols, and adjustments.
        </p>
      </div>

      <div className="about-layer-stat" aria-label="More than 550 layers">
        <strong aria-hidden="true">550+</strong>
        <span aria-hidden="true">Layers</span>
      </div>

      <div className="about-process-grid">
        <div className="about-process-film">
          {isPlaying && !hasError ? (
            <>
              <video
                src={SANITY_PROCESS_FEATURE.videoSrc}
                poster={work.img}
                aria-label={`Process film for ${work.title}`}
                autoPlay
                controls
                playsInline
                preload="none"
                onError={() => {
                  setHasError(true);
                  setIsPlaying(false);
                }}
              />
              <button type="button" className="about-film-close" onClick={() => setIsPlaying(false)}>
                Close film
              </button>
            </>
          ) : (
            <button
              type="button"
              className="about-film-trigger"
              onClick={() => {
                setHasError(false);
                setIsPlaying(true);
              }}
              aria-label={`Play process film for ${work.title}`}
            >
              <img src={work.img} alt="" width="1200" height="1200" loading="lazy" />
              <span className="about-film-shade" aria-hidden="true" />
              <span className="about-film-play" aria-hidden="true">▶</span>
              <span className="about-film-copy">
                <strong>{hasError ? "Try process film again" : "Play process film"}</strong>
                <small>{hasError ? "The previous playback attempt failed." : "Sound available / video loads on request"}</small>
              </span>
            </button>
          )}
        </div>

        <Link
          to={getWorkHref(work)}
          className="about-process-final"
          aria-label={`Open ${work.title} artwork details`}
        >
          <img src={work.img} alt={work.title} width="1200" height="1200" loading="lazy" />
          <span>
            <small>Resolved composition / {work.year}</small>
            <strong>{work.title}</strong>
            <b>Enter the finished work ↗</b>
          </span>
        </Link>
      </div>
    </section>
  );
}

function SymbolField() {
  const [activeId, setActiveId] = useState(ABOUT_SYMBOLS[0].id);
  const activeSymbol = ABOUT_SYMBOLS.find((symbol) => symbol.id === activeId) || ABOUT_SYMBOLS[0];
  const works = activeSymbol.workIds.map(getWorkById).filter(Boolean);

  return (
    <section id="symbols" className="about-section about-symbols" aria-labelledby="about-symbols-title">
      <SectionMarker label="Symbol Field" />
      <div className="about-symbols-heading">
        <p className="about-kicker">Demonstrated recurrence</p>
        <h2 id="about-symbols-title">Forms return. Their meaning changes.</h2>
        <p>
          These motifs are here because they recur in the published work—not because a private
          meaning has been assigned to them.
        </p>
      </div>

      <div className="about-symbol-layout">
        <div className="about-symbol-tabs" aria-label="Recurring symbols">
          {ABOUT_SYMBOLS.map((symbol) => (
            <button
              key={symbol.id}
              type="button"
              aria-pressed={activeId === symbol.id}
              aria-controls="about-symbol-results"
              onClick={() => setActiveId(symbol.id)}
            >
              <span aria-hidden="true">{String(symbol.workIds.length).padStart(2, "0")}</span>
              {symbol.label}
            </button>
          ))}
        </div>

        <div id="about-symbol-results" className="about-symbol-results" aria-live="polite" aria-atomic="true">
          <div className="about-symbol-copy">
            <span>Recurring association</span>
            <h3>{activeSymbol.label}</h3>
            <p>{activeSymbol.association}</p>
            <small>Demonstrated across {works.length} published works.</small>
          </div>
          <div className="about-symbol-works">
            {works.map((work) => (
              <Link key={work.id} to={getWorkHref(work)} aria-label={`Open ${work.title} artwork details`}>
                <img src={work.img} alt="" width="900" height="900" loading="lazy" />
                <span>{work.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MethodSection() {
  return (
    <section id="method" className="about-section about-method" aria-labelledby="about-method-title">
      <SectionMarker label="The Method" />
      <div className="about-method-intro">
        <p className="about-kicker">How it is made</p>
        <h2 id="about-method-title">Discovery becomes structure.</h2>
        <p>
          My process is obsessive, intuitive, and deeply cumulative. I rarely begin with a complete
          plan. A work develops through discovery—one image calling forth another, one symbol
          changing the meaning of everything around it.
        </p>
      </div>

      <ol className="about-method-path">
        {ABOUT_METHOD.map((step, index) => (
          <li key={step.id}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{step.label}</h3>
              <p>{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="about-authorship">
        <p className="about-kicker">Authorship in an AI era</p>
        <h3>The material can be generated. The judgment cannot.</h3>
        <p>
          Artificial intelligence is one material within the process. It can generate raw visual
          possibility; authorship remains in selection, composition, symbolism, layering, colour,
          lighting, alteration, and final judgment. The finished work emerges through sustained
          decisions inside a larger Photoshop practice—not from a single prompt.
        </p>
        <Link to="/media" className="about-text-link">
          See the process in motion <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}

function HumanSection() {
  const portrait = ABOUT_HUMAN_ANCHORS.find((anchor) => anchor.image);

  return (
    <section id="human" className="about-section about-human" aria-labelledby="about-human-title">
      <SectionMarker label="Behind the Signal" />
      <div className="about-human-heading">
        <p className="about-kicker">Behind the signal</p>
        <h2 id="about-human-title">A person remains behind every layer.</h2>
      </div>

      <div className="about-human-layout">
        {portrait && (
          <figure className="about-human-image">
            <img
              src={portrait.image}
              alt={portrait.imageAlt}
              width="1100"
              height="1375"
              loading="lazy"
            />
            <figcaption>Calgary / workday / still looking</figcaption>
          </figure>
        )}

        <ol className="about-human-anchors">
          {ABOUT_HUMAN_ANCHORS.map((anchor, index) => (
            <li key={anchor.id}>
              <span aria-hidden="true">0{index + 1}</span>
              <div>
                <h3>{anchor.title}</h3>
                <p>{anchor.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const RETURN_LINKS = [
  { label: "Explore the work", detail: "Enter the complete portfolio.", to: "/portfolio", accent: "cyan" },
  { label: "Watch the process", detail: "Follow tutorials, films, and experiments.", to: "/media", accent: "magenta" },
  { label: "Commission your story", detail: "Build a symbolic world of your own.", to: "/contact?type=commission", accent: "gold" },
];

function ReturnSection() {
  return (
    <section id="return" className="about-section about-return" aria-labelledby="about-return-title">
      <SectionMarker label="Return" />
      <div className="about-return-copy">
        <p className="about-kicker">The invitation</p>
        <h2 id="about-return-title">Look longer.<br />Follow the symbols.<br />Find what survives.</h2>
        <p>
          These artworks are records of survival, but they are also invitations: to question the
          reality we inherited, and to recognize beauty where it should not have survived.
        </p>
      </div>

      <nav className="about-return-links" aria-label="Continue through RareGh0st">
        {RETURN_LINKS.map((item) => (
          <Link key={item.to} to={item.to} data-accent={item.accent}>
            <span>
              <strong>{item.label}</strong>
              <small>{item.detail}</small>
            </span>
            <b aria-hidden="true">↗</b>
          </Link>
        ))}
      </nav>
    </section>
  );
}

export function AboutExperience() {
  const sectionIds = useMemo(() => ABOUT_SECTIONS.map((section) => section.id), []);
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  useEffect(() => {
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (!("IntersectionObserver" in window) || !sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-24% 0px -58% 0px", threshold: [0.05, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [sectionIds]);

  return (
    <main className="about-page" data-about-page>
      <DepthRail activeSection={activeSection} />
      <div className="about-page-shell">
        <ArtistSection />
        <WorkSection />
        <ProcessSection />
        <SymbolField />
        <MethodSection />
        <HumanSection />
        <ReturnSection />
      </div>
    </main>
  );
}
