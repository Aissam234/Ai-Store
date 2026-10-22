import type { Product } from "../src/types/catalog";
export const seedCategories = [
  { slug: "ai-automation", name: "AI & automation", description: "AI tools and API packages.", symbol: "✳" },
  { slug: "design", name: "Design", description: "Video editing and visual creation.", symbol: "◈" },
  { slug: "education", name: "Education", description: "Language learning.", symbol: "▦" },
  { slug: "entertainment", name: "Entertainment", description: "Movies, series and music.", symbol: "⌘" },
];
const offers = [
  {
    slug: "chatgpt-plus", name: "ChatGPT Plus", price: 119, durationMonths: 1, badge: "Popular", category: "AI & automation",
    descriptionEn: "Get ChatGPT Plus for one month. A practical AI solution for work, studying, writing, research and everyday tasks.",
    descriptionFr: "Profitez de ChatGPT Plus pendant un mois. Une solution pratique pour le travail, les études, la rédaction, la recherche et les tâches du quotidien.",
    descriptionAr: "استفد من اشتراك شات جي بي تي بلاس لمدة شهر. خيار عملي للعمل، والدراسة، والكتابة، والبحث، والمهام اليومية.",
    descriptionMa: "استافد من شات جي بي تي بلاس لمدة شهر. مناسب للخدمة، والقراية، والكتابة، والبحث، والاستعمال اليومي.",
  },
  {
    slug: "claude-api-100", name: "Claude API $100", price: 140, apiCreditUsd: 100, badge: "Developer", category: "AI & automation",
    descriptionEn: "A $100 Claude API package suitable for developers, AI projects, automation, integrations and application development.",
    descriptionFr: "Un pack Claude API de 100 dollars adapté aux développeurs, aux projets d’intelligence artificielle, à l’automatisation, aux intégrations et au développement d’applications.",
    descriptionAr: "باقة كلود للواجهة البرمجية بقيمة مئة دولار، مناسبة للمطورين، ومشاريع الذكاء الاصطناعي، والأتمتة، وعمليات الدمج، وتطوير التطبيقات.",
    descriptionMa: "باقة كلود للواجهة البرمجية بقيمة مئة دولار، مناسبة للمطورين، ومشاريع الذكاء الاصطناعي، والأتمتة، وربط الخدمات، وتطوير التطبيقات.",
  },
  {
    slug: "claude-api-500", name: "Claude API $500", price: 490, apiCreditUsd: 500, badge: "Best Value", category: "AI & automation",
    descriptionEn: "A $500 Claude API package for developers and projects that require higher API usage for AI applications, automation and integrations.",
    descriptionFr: "Un pack Claude API de 500 dollars destiné aux développeurs et aux projets nécessitant une utilisation plus importante pour les applications d’intelligence artificielle, l’automatisation et les intégrations.",
    descriptionAr: "باقة كلود للواجهة البرمجية بقيمة خمسمئة دولار، مخصصة للمطورين والمشاريع التي تحتاج إلى استخدام أكبر في تطبيقات الذكاء الاصطناعي، والأتمتة، وعمليات الدمج.",
    descriptionMa: "باقة كلود للواجهة البرمجية بقيمة خمسمئة دولار، مناسبة للمطورين والمشاريع اللي محتاجين استعمال أكبر فتطبيقات الذكاء الاصطناعي، والأتمتة، وربط الخدمات.",
  },
  {
    slug: "capcut-pro", name: "CapCut Pro", price: 49, durationMonths: 1, badge: "Creator", category: "Design",
    descriptionEn: "Enjoy CapCut Pro for one month and take your video editing further with a more complete editing experience for creative content and social media.",
    descriptionFr: "Profitez de CapCut Pro pendant un mois et améliorez vos montages vidéo avec une expérience plus complète pour la création de contenu et les réseaux sociaux.",
    descriptionAr: "استفد من كاب كات برو لمدة شهر وطوّر تجربة مونتاج الفيديو الخاصة بك، سواء للمحتوى الإبداعي أو لمنصات التواصل الاجتماعي.",
    descriptionMa: "استافد من كاب كات برو لمدة شهر وخلي المونتاج ديالك أحسن وأكثر احترافية، سواء للمحتوى، أو الفيديوهات القصيرة، أو مواقع التواصل الاجتماعي.",
  },
  {
    slug: "duolingo-super", name: "Duolingo Super", price: 49, durationMonths: 12, badge: "1 Year", category: "Education",
    descriptionEn: "Enjoy Duolingo Super for a full year and make your language-learning experience more comfortable, enjoyable and consistent.",
    descriptionFr: "Profitez de Duolingo Super pendant une année complète et rendez votre apprentissage des langues plus confortable, agréable et régulier.",
    descriptionAr: "استفد من دولينغو سوبر لمدة سنة كاملة، واجعل تجربة تعلم اللغات أكثر راحة ومتعة واستمرارية.",
    descriptionMa: "استافد من دولينغو سوبر لمدة عام كامل، وخلي تعلم اللغات أسهل، وأريح، وممتع أكثر.",
  },
  {
    slug: "netflix-premium", name: "Netflix Premium", price: 29, durationMonths: 1, badge: "Entertainment", category: "Entertainment",
    descriptionEn: "Enjoy Netflix Premium for one month and access your favorite movies, series and entertainment content.",
    descriptionFr: "Profitez de Netflix Premium pendant un mois pour regarder vos films, séries et contenus de divertissement préférés.",
    descriptionAr: "استفد من نتفليكس بريميوم لمدة شهر، واستمتع بمشاهدة أفلامك ومسلسلاتك ومحتواك الترفيهي المفضل.",
    descriptionMa: "استافد من نتفليكس بريميوم لمدة شهر، وتفرج فالأفلام، والسلسلات، والمحتوى الترفيهي اللي كيعجبك.",
  },
  {
    slug: "canva-student", name: "Canva Student", price: 23, durationMonths: 36, activation: "Via invitation", badge: "3 Years", category: "Design",
    descriptionEn: "Canva Student access via invitation for three years, ideal for creating designs, presentations, documents, social media posts and visual content.",
    descriptionFr: "Accès à Canva Student par invitation pendant trois ans, idéal pour créer des designs, des présentations, des documents, des publications pour les réseaux sociaux et du contenu visuel.",
    descriptionAr: "احصل على كانفا للطلبة لمدة ثلاث سنوات عن طريق دعوة. مناسب لإنشاء التصاميم، والعروض التقديمية، والوثائق، ومنشورات وسائل التواصل الاجتماعي، والمحتوى المرئي.",
    descriptionMa: "استافد من كانفا للطلبة لمدة ثلاث سنين عن طريق دعوة. مناسب للتصاميم، والعروض التقديمية، والوثائق، ومنشورات مواقع التواصل الاجتماعي، والمحتوى البصري.",
  },
  {
    slug: "spotify", name: "Spotify", price: 50, durationMonths: 1, badge: "Music", category: "Entertainment",
    descriptionEn: "Enjoy Spotify for one month and listen to your favorite music, artists and playlists whenever you want.",
    descriptionFr: "Profitez de Spotify pendant un mois et écoutez vos musiques, artistes et listes de lecture préférés quand vous le souhaitez.",
    descriptionAr: "استفد من سبوتيفاي لمدة شهر، واستمع إلى موسيقاك وفنانيك وقوائم التشغيل المفضلة لديك وقتما تشاء.",
    descriptionMa: "استافد من سبوتيفاي لمدة شهر، وسمع الموسيقى، والفنانين، وقوائم التشغيل اللي كيعجبوك فاش ما بغيتي.",
  },
];
// Import source only. Storefront reads exclusively from PostgreSQL; admin edits stay authoritative.
export const seedProducts: Product[] = offers.map((offer, index) => ({
  ...offer, id: `offer-${offer.slug}`, description: offer.descriptionEn, fullDescription: offer.descriptionEn,
  featured: index < 4, released: "2026-10-22", symbol: seedCategories.find(c => c.name === offer.category)!.symbol,
  color: "mint", features: [], format: "Digital service", availability: "ASK_AVAILABILITY",
}));
