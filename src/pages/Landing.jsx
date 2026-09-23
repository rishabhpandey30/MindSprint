import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Code2, Sparkles, ShieldCheck, ExternalLink } from 'lucide-react';
import styles from './Landing.module.css';

const GAME_TYPES = [
  {
    id: 'bubbles',
    name: 'Select Bubbles',
    description: 'Solve mathematical expressions mentally and select bubbles in ascending order (smallest to largest) under rapid 15s countdowns.',
    tag: 'Numerical Processing',
    badgeText: '25 Levels · 15s / level',
    preview: (
      <div className={styles.previewBubblesWrapper}>
        <div className={styles.previewBubbleCard}>
          <div className={styles.previewBubbleHeader}>
            <span>A</span>
            <span className={styles.previewOrderBadge}>1</span>
          </div>
          <div className={styles.previewExpr}>18 ÷ 3</div>
          <div className={styles.previewVal}>= 6</div>
        </div>
        <div className={styles.previewBubbleCard}>
          <div className={styles.previewBubbleHeader}>
            <span>B</span>
            <span className={styles.previewOrderBadge}>2</span>
          </div>
          <div className={styles.previewExpr}>7 + 5</div>
          <div className={styles.previewVal}>= 12</div>
        </div>
        <div className={styles.previewBubbleCard}>
          <div className={styles.previewBubbleHeader}>
            <span>C</span>
          </div>
          <div className={styles.previewExpr}>4 × 4</div>
          <div className={styles.previewVal}>= 16</div>
        </div>
      </div>
    ),
  },
  {
    id: 'maze',
    name: 'Invisible Maze',
    description: 'Exploratory spatial navigation. Walls are completely invisible. Hitting a wall resets you to Start — memorize the layout, collect the Key, and reach the Door.',
    tag: 'Spatial Navigation & Memory',
    badgeText: '25 Levels · 3 min / level',
    preview: (
      <div className={styles.previewMazeGrid}>
        {[
          ['S', '', '', ''],
          ['', 'P', '', ''],
          ['', '', 'K', ''],
          ['', '', '', 'D'],
        ].map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={[
                styles.previewMazeCell,
                cell === 'S' ? styles.previewMazeStart :
                cell === 'P' ? styles.previewMazePlayer :
                cell === 'K' ? styles.previewMazeKey :
                cell === 'D' ? styles.previewMazeDoor :
                styles.previewMazeEmpty,
              ].join(' ')}
            >
              {cell === 'S' ? 'S' : cell === 'P' ? '🧭' : cell === 'K' ? '🔑' : cell === 'D' ? '🚪' : ''}
            </div>
          ))
        )}
      </div>
    ),
  },
  {
    id: 'pathfinder',
    name: 'Pathfinder',
    description: 'Spatial reasoning and path configuration. Click and swap scrambled track tiles with fixed orientation to create one continuous route from Start to End.',
    tag: 'Spatial Arrangement',
    badgeText: '25 Levels · 4 min / level',
    preview: (
      <div className={styles.previewPathGrid}>
        {[
          ['S', '─', '┐'],
          ['│', '└', '┘'],
          ['└', '─', 'E'],
        ].map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={[
                styles.previewPathCell,
                cell === 'S' ? styles.previewPathStart :
                cell === 'E' ? styles.previewPathEnd :
                styles.previewPathTrack,
              ].join(' ')}
            >
              {cell}
            </div>
          ))
        )}
      </div>
    ),
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Choose Any Game',
    desc: 'Select from Select Bubbles, Invisible Maze, or Pathfinder. Play and complete games in any order with safe exit & resume controls.',
  },
  {
    step: '02',
    title: 'Genuine Cognitive Challenges',
    desc: 'Solve ascending mental calculations, navigate memory-based invisible mazes, and arrange continuous path routes with independent level timers.',
  },
  {
    step: '03',
    title: 'Actionable Performance Skills',
    desc: 'Review speed, accuracy, and route efficiency metrics broken down by game type and practice performance indicators.',
  },
];

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <div className={styles.logo}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="#4F46E5" />
              <path
                d="M8 22L13 10L18 18L21 14L24 22"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>MindSprint</span>
          </div>
          <nav className={styles.nav} aria-label="Main navigation">
            <a href="#how-it-works">How It Works</a>
            <a href="#games">Practice Games</a>
            <a href="#about">About</a>
          </nav>
          <Link to="/assessment" className={styles.ctaBtn}>
            Start Practice
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroContent}>
              <div className={styles.eyebrow}>GAME-BASED COGNITIVE PRACTICE</div>
              <h1 className={styles.heroHeadline}>
                Train the skills that<br className={styles.break} /> hiring assessments test.
              </h1>
              <p className={styles.heroSubtext}>
                Build mental math speed, spatial memory navigation, and path configuration skills
                through three authentic cognitive assessment games.
              </p>
              <div className={styles.heroCtas}>
                <Link to="/assessment" className={styles.heroPrimary}>
                  <span>Start Practice</span>
                  <ArrowRight size={18} />
                </Link>
                <a href="#games" className={styles.heroSecondary}>
                  Explore 3 Games
                </a>
              </div>
              <p className={styles.heroDisclaimer}>
                Free to use · 75 interactive procedural levels · Independent countdown timers
              </p>
            </div>

            {/* UI Preview: Select Bubbles Game */}
            <div className={styles.heroPreview} aria-hidden="true">
              <div className={styles.previewWindow}>
                <div className={styles.previewTopBar}>
                  <div className={styles.previewDots}>
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className={styles.previewTitle}>
                    MindSprint · Select Bubbles · Level 07 / 25
                  </div>
                  <div className={styles.previewTimer}>00:11</div>
                </div>

                <div className={styles.previewBody}>
                  <div className={styles.previewQ}>
                    Select bubbles in <strong>ASCENDING ORDER</strong> (Smallest → Largest)
                  </div>

                  <div className={styles.heroBubblesContainer}>
                    <div className={`${styles.heroBubble} ${styles.heroBubbleActive}`}>
                      <div className={styles.heroBubbleTop}>
                        <span className={styles.heroBubbleTag}>A</span>
                        <span className={styles.heroBubbleBadge}>1</span>
                      </div>
                      <div className={styles.heroBubbleExpr}>18 ÷ 3</div>
                      <div className={styles.heroBubbleSub}>Selected #1</div>
                    </div>

                    <div className={`${styles.heroBubble} ${styles.heroBubbleActive}`}>
                      <div className={styles.heroBubbleTop}>
                        <span className={styles.heroBubbleTag}>B</span>
                        <span className={styles.heroBubbleBadge}>2</span>
                      </div>
                      <div className={styles.heroBubbleExpr}>7 + 5</div>
                      <div className={styles.heroBubbleSub}>Selected #2</div>
                    </div>

                    <div className={styles.heroBubble}>
                      <div className={styles.heroBubbleTop}>
                        <span className={styles.heroBubbleTag}>C</span>
                      </div>
                      <div className={styles.heroBubbleExpr}>4 × 4</div>
                      <div className={styles.heroBubbleSub}>Click to select</div>
                    </div>
                  </div>

                  <div className={styles.heroPreviewFooter}>
                    <span>Selected: 2 / 3</span>
                    <span className={styles.heroOrderTag}>Order: A → B</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className={styles.howItWorks} id="how-it-works">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>How it works</h2>
              <p>Three independent games designed to prepare candidates for modern cognitive assessments.</p>
            </div>
            <div className={styles.stepsGrid}>
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className={styles.step}>
                  <div className={styles.stepNumber}>{item.step}</div>
                  <h3 className={styles.stepTitle}>{item.title}</h3>
                  <p className={styles.stepDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Game Types */}
        <section className={styles.games} id="games">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Three cognitive game types</h2>
              <p>Each game targets specific cognitive abilities under independent countdown timers.</p>
            </div>
            <div className={styles.gameCards}>
              {GAME_TYPES.map((game) => (
                <div key={game.id} className={styles.gameCard}>
                  <div className={styles.gamePreview}>{game.preview}</div>
                  <div className={styles.gameInfo}>
                    <span className={styles.gameTag}>{game.tag}</span>
                    <h3 className={styles.gameName}>{game.name}</h3>
                    <div className={styles.gameTimeBadge}>{game.badgeText}</div>
                    <p className={styles.gameDesc}>{game.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action & About Section */}
        <section className={styles.ctaSection} id="about">
          <div className="container">
            <div className={styles.ctaCard}>
              <div className={styles.ctaContent}>
                <div className={styles.ctaBadge}>
                  <Sparkles size={16} />
                  <span>Ready to Practice?</span>
                </div>
                <h2 className={styles.ctaTitle}>Sharpen your cognitive edge today</h2>
                <p className={styles.ctaDescription}>
                  Jump into 75 procedural assessment levels across Select Bubbles, Invisible Maze,
                  and Pathfinder. No login or registration required.
                </p>
                <Link to="/assessment" className={styles.ctaActionBtn}>
                  <span>Start Practice Assessment</span>
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* Developer Profile Card */}
              <div className={styles.developerCard}>
                <div className={styles.devHeader}>
                  <div className={styles.devAvatar}>RP</div>
                  <div className={styles.devInfo}>
                    <span className={styles.devRole}>Developed by</span>
                    <h3 className={styles.devName}>Rishabh Pandey</h3>
                  </div>
                </div>

                <p className={styles.devBio}>
                  Crafted for students and job seekers practicing for modern graduate and corporate game-based hiring assessments.
                </p>

                <div className={styles.devLinks}>
                  <a
                    href="mailto:rishabhpandey3011@gmail.com"
                    className={styles.devLinkBtn}
                    title="Send Email"
                  >
                    <Mail size={16} className={styles.devLinkIcon} />
                    <span>rishabhpandey3011@gmail.com</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/rishabh-pandey-78r0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.devLinkBtn} ${styles.devLinkedinBtn}`}
                    title="LinkedIn Profile"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={styles.devLinkIcon}>
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerInner}>
            <div className={styles.footerTop}>
              <div className={styles.footerBrand}>
                <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <rect width="32" height="32" rx="8" fill="#4F46E5" />
                  <path
                    d="M8 22L13 10L18 18L21 14L24 22"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className={styles.footerBrandName}>MindSprint</span>
              </div>
              <p className={styles.footerTagline}>Train your thinking. Sharpen your edge.</p>
            </div>

            <div className={styles.footerDivider} />

            <div className={styles.footerBottom}>
              <p className={styles.footerDisclaimer}>
                Independent practice platform · Not affiliated with any official assessment provider · All data stays in your browser
              </p>
              <div className={styles.footerDevCredit}>
                Created with care by <a href="https://www.linkedin.com/in/rishabh-pandey-78r0/" target="_blank" rel="noopener noreferrer">Rishabh Pandey</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
