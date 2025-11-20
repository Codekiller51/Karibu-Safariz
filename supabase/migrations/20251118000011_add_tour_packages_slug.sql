ALTER TABLE tour_packages
  ADD COLUMN IF NOT EXISTS slug text;

UPDATE tour_packages
SET slug = regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g') || '-' || substr(id::text, 1, 8)
WHERE slug IS NULL OR slug = '';

CREATE UNIQUE INDEX IF NOT EXISTS idx_tour_packages_slug_unique ON tour_packages(slug);

ALTER TABLE tour_packages
  ALTER COLUMN slug SET NOT NULL;