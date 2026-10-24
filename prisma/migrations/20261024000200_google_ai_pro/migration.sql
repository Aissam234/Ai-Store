-- Additive catalog entry; never overwrite subsequent admin edits.
INSERT INTO "Category" ("id", "slug", "name", "description", "symbol", "updatedAt")
VALUES ('category-ai-google', 'ai-automation', 'AI & automation', 'AI tools and API packages.', '✳', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

INSERT INTO "Product" (
"id", "slug", "name", "nameEn", "nameFr", "nameAr", "nameMa",
"description", "descriptionEn", "descriptionFr", "descriptionAr", "descriptionMa",
"fullDescription", "priceMinor", "durationMonths", "badge", "active", "availability",
"releasedAt", "symbol", "color", "features", "format", "categoryId", "updatedAt"
)
SELECT 'offer-google-ai-pro', 'google-ai-pro', 'Google AI Pro',
'Google AI Pro', 'Google AI Pro', 'Google AI Pro', 'Google AI Pro',
'Get Google AI Pro for 18 months and access a powerful Google AI ecosystem for productivity, creativity and research.

Use Gemini, Google Flow, AI video generation with Veo, Gemini Notebook and other supported Google AI tools, with enhanced access and higher usage limits where available.', 'Get Google AI Pro for 18 months and access a powerful Google AI ecosystem for productivity, creativity and research.

Use Gemini, Google Flow, AI video generation with Veo, Gemini Notebook and other supported Google AI tools, with enhanced access and higher usage limits where available.', 'Profitez de Google AI Pro pendant 18 mois et accédez à un puissant écosystème d’intelligence artificielle pour la productivité, la création et la recherche.

Utilisez Gemini, Google Flow, la génération de vidéos par intelligence artificielle avec Veo, Gemini Notebook ainsi que d’autres outils Google AI pris en charge, avec un accès étendu et des limites d’utilisation supérieures lorsqu’ils sont disponibles.', 'استفد من Google AI Pro لمدة 18 شهرًا، واحصل على مجموعة قوية من أدوات الذكاء الاصطناعي من Google للإنتاجية، والإبداع، والبحث.

يمكنك الاستفادة من Gemini، وGoogle Flow، وإنشاء الفيديوهات بالذكاء الاصطناعي باستخدام Veo، وGemini Notebook، بالإضافة إلى أدوات أخرى مدعومة ضمن Google AI Pro، مع حدود استخدام أعلى حسب التوفر والمنطقة.', 'استافد من Google AI Pro لمدة 18 شهر، وخدم بمجموعة قوية ديال أدوات الذكاء الاصطناعي من Google للخدمة، والإبداع، والبحث.

كيشمل Gemini، وGoogle Flow، وإنشاء الفيديوهات بالذكاء الاصطناعي باستعمال Veo، وGemini Notebook، وزيد عليهم أدوات أخرى مدعومة فـ Google AI Pro، مع حدود استعمال أكبر على حساب التوفر والمنطقة.',
'Get Google AI Pro for 18 months and access a powerful Google AI ecosystem for productivity, creativity and research.

Use Gemini, Google Flow, AI video generation with Veo, Gemini Notebook and other supported Google AI tools, with enhanced access and higher usage limits where available.', 6900, 18, '18 Months', true, 'AVAILABLE',
CURRENT_TIMESTAMP, '✳', 'rose', ARRAY[]::TEXT[], 'Digital service', "id", CURRENT_TIMESTAMP
FROM "Category" WHERE "slug" = 'ai-automation'
ON CONFLICT DO NOTHING;

