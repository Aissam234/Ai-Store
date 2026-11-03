BEGIN;

-- A fresh installation can run migrations before its optional catalog seed.
INSERT INTO "Category" ("id", "slug", "name", "description", "symbol", "updatedAt")
VALUES ('category-education', 'education', 'Education', 'Language learning.', '▦', now()),
       ('category-entertainment', 'entertainment', 'Entertainment', 'Movies, series and music.', '⌘', now())
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "Product" (
  "id", "slug", "name", "description", "descriptionEn", "descriptionFr", "descriptionAr", "descriptionMa",
  "fullDescription", "priceMinor", "durationMonths", "badge", "releasedAt", "symbol", "color", "features", "format", "categoryId", "updatedAt"
)
SELECT 'offer-' || v.slug, v.slug, v.name, v.en, v.en, v.fr, v.ar, v.ma,
       v.en, 2900, v.months, v.badge, now(), c.symbol, 'mint', ARRAY[]::text[], 'Digital service', c.id, now()
FROM (VALUES
  ('duolingo-super-annual', 'Duolingo Super', 12, '1 Year', 'education',
    'Enjoy Super Duolingo for one full year with an ad-free learning experience, unlimited hearts, personalized practice, and extra exercises to improve your language skills.',
    'Profitez de Super Duolingo pendant une année complète, sans publicité, avec des vies illimitées, des exercices personnalisés et des activités supplémentaires pour améliorer vos compétences linguistiques.',
    'استفد من دولينغو سوبر لمدة سنة كاملة، وتعلم اللغات دون إعلانات ومع قلوب غير محدودة. استمتع بتمارين إضافية ومراجعة مخصصة للأخطاء، وأنشطة تساعدك على تطوير مهارات الاستماع والنطق والمفردات.',
    'تعلم اللغات مع دولينغو سوبر لمدة عام كامل، بلا إعلانات وبلا حدود ديال القلوب. استافد من تمارين إضافية ومراجعة مخصصة باش تحسن مستواك، وتدرب على الاستماع والنطق والمفردات بطريقة ممتعة وسهلة.'),
  ('youtube-premium-music', 'YouTube Premium + Music', 1, 'Premium', 'entertainment',
    'Enjoy YouTube Premium for one month with ad-free videos, offline downloads, background playback, and YouTube Music Premium included.',
    'Profitez de YouTube Premium pendant un mois avec des vidéos sans publicité, des téléchargements hors ligne, la lecture en arrière-plan et YouTube Music Premium inclus.',
    'استمتع بيوتيوب بريميوم لمدة شهر كامل، وشاهد الفيديوهات بدون إعلانات، وحمّل المحتوى للمشاهدة دون اتصال بالإنترنت، واستفد من التشغيل في الخلفية. يشمل الاشتراك أيضًا يوتيوب ميوزيك بريميوم.',
    'استافد من يوتيوب بريميوم لمدة شهر كامل. تفرج فالفيديوهات بلا إعلانات، وحمّل الفيديوهات باش تشوفهم بلا إنترنت، وخلي الفيديوهات والموسيقى خدامين فالخلفية حتى إلا طفيتي الشاشة. الاشتراك كيشمل حتى يوتيوب ميوزيك بريميوم باش تسمع الموسيقى ديالك براحتك.')
) AS v(slug, name, months, badge, category, en, fr, ar, ma)
JOIN "Category" c ON c.slug = v.category
ON CONFLICT ("id") DO NOTHING;

-- Only retire legacy listings after verifying the replacement is available.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM "Product" WHERE id = 'offer-duolingo-super-annual' AND slug = 'duolingo-super-annual'
      AND active AND "priceMinor" = 2900 AND "durationMonths" = 12
  ) THEN
    RAISE EXCEPTION 'Annual Duolingo listing could not be verified; legacy listings were not changed';
  END IF;
END $$;

UPDATE "Product" SET active = false, "updatedAt" = now()
WHERE active AND id <> 'offer-duolingo-super-annual'
  AND (id IN ('offer-duolingo-super', 'offer-duolingo-super-new')
       OR slug IN ('duolingo-super', 'duolingo-super-new')
       OR lower(trim(name)) = 'duolingo super');

COMMIT;
