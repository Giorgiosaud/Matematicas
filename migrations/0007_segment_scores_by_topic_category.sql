-- Segments the leaderboard by topic category on top of question_limit, so a
-- score set practising decimals doesn't compete against one set practising
-- fractions. Three fixed buckets — 'fracciones', 'decimales', 'mixto' — rather
-- than one per exact set of topics: with a handful of players, many tiny tables
-- are worse than a few populated ones.
--
-- Unlike 0004/0006 this can't be an ALTER: the change is to the primary key,
-- and SQLite only allows that by rebuilding the table. Existing rows predate
-- any topic other than fractions, so 'fracciones' is what they actually are.

CREATE TABLE scores_new (
  name TEXT NOT NULL,
  question_limit INTEGER NOT NULL,
  topic_category TEXT NOT NULL DEFAULT 'fracciones',
  best_streak INTEGER NOT NULL DEFAULT 0,
  best_accuracy INTEGER NOT NULL DEFAULT 0,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  best_score INTEGER NOT NULL DEFAULT 0,
  best_timer_seconds INTEGER NOT NULL DEFAULT 60,
  PRIMARY KEY (name, question_limit, topic_category),
  FOREIGN KEY (name) REFERENCES players(name)
);

INSERT INTO scores_new (
  name, question_limit, topic_category, best_streak, best_accuracy,
  total_sessions, updated_at, best_score, best_timer_seconds
)
SELECT
  name, question_limit, 'fracciones', best_streak, best_accuracy,
  total_sessions, updated_at, best_score, best_timer_seconds
FROM scores;

DROP TABLE scores;

ALTER TABLE scores_new RENAME TO scores;
