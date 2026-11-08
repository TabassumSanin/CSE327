export type HomeLanguage = "en" | "bn";

export const homeCopy = {
  en: {
    hero: {
      headline: "Leftover food from tonight's event can feed someone tonight.",
      body: "A wedding kitchen in Uttara has 45 kg of biryani left at 10:15 PM. List it, and the matching agent offers it to a registered kitchen within 5 km before the food cools.",
      primary: "Donate Food",
      secondary: "Find Food",
      safety: "Every listing gets a safety check before it is matched. Flagged food waits for an admin.",
      photoLabel: "Biryani trays at a wedding in Uttara",
      photoCaption:
        "Radisson Banquet Hall, Uttara · 45 kg left at 10:15 PM · collected by a community kitchen in Mirpur",
    },
    statsLabel: "Sample data for demonstration",
    statsNote: "Counts below come from the demo data set, not live production figures.",
    stats: {
      open: "Open donations now",
      recipients: "Registered recipients",
      reservations: "Reservations on record",
      collected: "Collected and confirmed",
    },
    how: {
      title: "Four steps, and a record at each one",
      description:
        "The full process, including account approvals and the manual safety review, is on the How it works page.",
      link: "Read the full process",
      steps: [
        {
          title: "Post the food",
          description:
            "Add the dish, weight, preparation time and pickup window. Photos help the safety check.",
          detail: "About two minutes on a phone.",
        },
        {
          title: "Run the safety check",
          description:
            "The risk agent reads storage, temperature and allergen details. Unclear listings go to an admin.",
          detail: "Most checks finish before the donor closes the page.",
        },
        {
          title: "Match a recipient",
          description:
            "The matching agent ranks eligible kitchens by urgency and distance. Dhanmondi surplus usually stays inside 5 km.",
          detail: "The recipient gets a provisional hold, not an open claim.",
        },
        {
          title: "Collect and close",
          description:
            "The recipient confirms a time, collects, and records the actual weight. The record stays for reports.",
          detail: "Donor, recipient and time are written to the audit trail.",
        },
      ],
    },
    benefits: {
      title: "Built for the way a Dhaka kitchen actually works",
      description: "No spreadsheets, no phone tree, no guessing who is allowed to collect.",
      featureTitle: "The safety check runs before the match",
      featureBody:
        "Expiry, hot or cold holding, allergens and packaging are checked when a listing is posted. If something is missing, the food is held for an admin, not offered to a recipient.",
      bullets: [
        "Temperature and holding time are compared with the food category.",
        "Missing allergen details start a review, not an automatic rejection.",
        "Every decision is written to the audit trail.",
      ],
      safetyTitle: "Community Food Safety",
      safetyText:
        "Automated checks are a safety aid, not a guarantee. Flagged donations always wait for an admin review.",
      items: [
        {
          title: "A short trip",
          description:
            "Most matches stay within 5 km. A Dhanmondi bakery can hand over in Mohammadpur without a cold chain breaking.",
        },
        {
          title: "One record per pickup",
          description:
            "Donor, recipient, quantity and time are stored. The admin report reads the same numbers.",
        },
        {
          title: "English and Bangla",
          description:
            "The toggle sits in the header. Both scripts are checked at 390 px before release.",
        },
      ],
    },
    categories: {
      title: "What moves through the exchange",
      description:
        "Each category takes a different route: hot food needs a fast pickup, packaged food can wait.",
      photoLabel: "Crates of spinach, tomatoes and gourds at a Savar depot",
      photoCaption: "Farm to City depot, Savar · harvested 5 November · 55 kg of fruit and vegetables",
      sample: "Sample data for demonstration",
      labels: {
        "Prepared Food": "Prepared food",
        "Packaged Food": "Packaged food",
        Produce: "Produce",
        Bakery: "Bakery",
        Refrigerated: "Refrigerated",
        Frozen: "Frozen",
      } as Record<string, string>,
      descriptions: {
        "Prepared Food": "Hot meals, rice and curry",
        "Packaged Food": "Sealed rice, lentils and milk powder",
        Produce: "Fruit and vegetables from farms",
        Bakery: "Bread, pastries and day-old bakes",
        Refrigerated: "Dairy, yoghurt and chilled meals",
        Frozen: "Meat and parathas at -18°C",
      } as Record<string, string>,
    },
    featured: {
      title: "Listed in Dhaka this week",
      description:
        "Three sample listings. Each card carries the risk agent's result and the reason behind it.",
      note: "Sample listings from the demo data set.",
      cta: "See all available food",
      view: "View details",
      awaiting: "Awaiting review",
      needsAdmin: "Needs admin review",
      available: "Available",
      listed: "Listed",
      collectBy: "Collect by",
      labels: { safe: "Safe", soon: "Use soon", review: "Needs review" },
      risks: {
        "DON-1001": {
          level: "safe" as const,
          reason: "Cooked at 8:00 AM and held above 60°C. Collect by 8 PM.",
        },
        "DON-1011": {
          level: "soon" as const,
          reason: "Ripe fruit from Savar. Best collected before 8 November.",
        },
        "DON-1005": {
          level: "review" as const,
          reason: "Two hours of cold-chain log are missing. An admin is checking before this is offered.",
        },
      } as Record<string, { level: "safe" | "soon" | "review"; reason: string }>,
    },
    cta: {
      headline:
        "Have extra food? List it in two minutes. A registered recipient nearby can collect it.",
      body: "Restaurants, bakeries, farms and event hosts across Dhaka can post surplus. The listing shows the pickup window before anyone confirms.",
      primary: "List surplus food",
      secondary: "Find food nearby",
      note: "This is a CSE 327 demonstration. Figures on this page are sample data.",
    },
  },
  bn: {
    hero: {
      headline: "আজ রাতের অনুষ্ঠানের বাড়তি খাবার আজ রাতেই কারও পাতে যেতে পারে।",
      body: "উত্তরার একটি বিবাহের রান্নাঘরে রাত ১০:১৫-এ ৪৫ কেজি বিরিয়ানি বাকি থাকে। তালিকা করলে ম্যাচিং এজেন্ট খাবার ঠান্ডা হওয়ার আগেই ৫ কিলোমিটারের মধ্যে নিবন্ধিত একটি রান্নাঘরে তা পৌঁছে দেয়।",
      primary: "খাবার দান করুন",
      secondary: "খাবার খুঁজুন",
      safety: "ম্যাচিংয়ের আগে প্রতিটি তালিকায় নিরাপত্তা যাচাই হয়। সন্দেহজনক খাবার অ্যাডমিনের জন্য অপেক্ষা করে।",
      photoLabel: "উত্তরার বিবাহবাড়িতে বিরিয়ানির ট্রে",
      photoCaption:
        "র‍্যাডিসন ব্যাঙ্কুয়েট হল, উত্তরার · রাত ১০:১৫-এ ৪৫ কেজি বাকি · মিরপুরের একটি কমিউনিটি রান্নাঘর সংগ্রহ করে",
    },
    statsLabel: "প্রদর্শনের জন্য নমুনা তথ্য",
    statsNote: "নিচের সংখ্যাগুলো ডেমো ডেটা সেট থেকে নেওয়া, সরাসরি ব্যবহারের হিসাব নয়।",
    stats: {
      open: "এখন খোলা অনুদান",
      recipients: "নিবন্ধিত গ্রহীতা",
      reservations: "সংরক্ষণের রেকর্ড",
      collected: "সংগৃহীত ও নিশ্চিত",
    },
    how: {
      title: "চারটি ধাপ, প্রতিটিতে একটি রেকর্ড",
      description:
        "অ্যাকাউন্ট অনুমোদন ও ম্যানুয়াল নিরাপত্তা পর্যালোচনাসহ পুরো প্রক্রিয়া 'কীভাবে কাজ করে' পৃষ্ঠায় আছে।",
      link: "পুরো প্রক্রিয়া পড়ুন",
      steps: [
        {
          title: "খাবার তালিকা করুন",
          description:
            "খাবারের নাম, ওজন, তৈরির সময় ও পিকআপের সময় লিখুন। ছবি নিরাপত্তা যাচাইয়ে সাহায্য করে।",
          detail: "ফোনে প্রায় দুই মিনিট লাগে।",
        },
        {
          title: "নিরাপত্তা যাচাই",
          description:
            "রিস্ক এজেন্ট সংরক্ষণ, তাপমাত্রা ও অ্যালার্জেন দেখে। অস্পষ্ট তালিকা অ্যাডমিনের কাছে যায়।",
          detail: "বেশিরভাগ যাচাই দাতার পৃষ্ঠা বন্ধ করার আগেই শেষ হয়।",
        },
        {
          title: "গ্রহীতা মিলিয়ে দিন",
          description:
            "ম্যাচিং এজেন্ট জরুরি অবস্থা ও দূরত্ব অনুযায়ী যোগ্য রান্নাঘর সাজায়। ধানমন্ডির বাড়তি খাবার সাধারণত ৫ কিমি ভেতরেই থাকে।",
          detail: "গ্রহীতা সাময়িক সংরক্ষণ পান, খোলা দাবি নয়।",
        },
        {
          title: "সংগ্রহ ও সমাপ্তি",
          description:
            "গ্রহীতা সময় নিশ্চিত করেন, খাবার নেন এবং প্রকৃত ওজন লিখেন। রেকর্ডটি প্রতিবেদনের জন্য থাকে।",
          detail: "দাতা, গ্রহীতা ও সময় অডিট ট্রেইলে লেখা থাকে।",
        },
      ],
    },
    benefits: {
      title: "ঢাকার রান্নাঘর যেভাবে কাজ করে, সেভাবেই বানানো",
      description: "স্প্রেডশিট নেই, ফোনের চেইন নেই, কে সংগ্রহ করতে পারবে তা নিয়ে অনুমান নেই।",
      featureTitle: "ম্যাচিংয়ের আগেই নিরাপত্তা যাচাই চলে",
      featureBody:
        "তালিকা দেওয়ার সময় মেয়াদ, গরম বা ঠান্ডা সংরক্ষণ, অ্যালার্জেন ও প্যাকেজিং দেখা হয়। কিছু বাকি থাকলে খাবার গ্রহীতার কাছে না গিয়ে অ্যাডমিনের কাছে থাকে।",
      bullets: [
        "তাপমাত্রা ও সংরক্ষণের সময় খাবারের বিভাগের সাথে মেলানো হয়।",
        "অ্যালার্জেনের তথ্য না থাকলে স্বয়ংক্রিয় প্রত্যাখ্যান নয়, পর্যালোচনা শুরু হয়।",
        "প্রতিটি সিদ্ধান্ত অডিট ট্রেইলে লেখা থাকে।",
      ],
      safetyTitle: "কমিউনিটি খাদ্য নিরাপত্তা",
      safetyText:
        "স্বয়ংক্রিয় যাচাই নিরাপত্তার সহায়ক, নিশ্চয়তা নয়। চিহ্নিত অনুদান সর্বদা অ্যাডমিনের পর্যালোচনার জন্য অপেক্ষা করে।",
      items: [
        {
          title: "কাছের পথ",
          description:
            "বেশিরভাগ ম্যাচ ৫ কিমির মধ্যে থাকে। ধানমন্ডির বেকারি থেকে মোহাম্মদপুরে খাবার পৌঁছায়, কোল্ড চেইন না ভেঙে।",
        },
        {
          title: "প্রতিটি পিকআপের রেকর্ড",
          description:
            "দাতা, গ্রহীতা, পরিমাণ ও সময় সংরক্ষিত থাকে। অ্যাডমিন প্রতিবেদনে একই সংখ্যা দেখা যায়।",
        },
        {
          title: "ইংরেজি ও বাংলা",
          description:
            "টগল হেডারে আছে। প্রকাশের আগে ৩৯০ পিক্সেলে দুই ভাষাই পরীক্ষা করা হয়েছে।",
        },
      ],
    },
    categories: {
      title: "এক্সচেঞ্জে কী কী আসে",
      description:
        "প্রতিটি বিভাগের পথ আলাদা: গরম খাবারে দ্রুত পিকআপ দরকার, প্যাকেটজাত খাবার অপেক্ষা করতে পারে।",
      photoLabel: "সাভারের ডিপোতে পালং, টমেটো ও লাউয়ের কাঠি",
      photoCaption: "ফার্ম টু সিটি ডিপো, সাভার · ৫ নভেম্বরে তোলা · ৫৫ কেজি ফল ও সবজি",
      sample: "প্রদর্শনের জন্য নমুনা তথ্য",
      labels: {
        "Prepared Food": "প্রস্তুত খাবার",
        "Packaged Food": "প্যাকেটজাত খাবার",
        Produce: "তাজা ফল ও সবজি",
        Bakery: "বেকারি",
        Refrigerated: "ফ্রিজে রাখা খাবার",
        Frozen: "হিমায়িত খাবার",
      } as Record<string, string>,
      descriptions: {
        "Prepared Food": "গরম খাবার, ভাত ও তরকারি",
        "Packaged Food": "সিল করা চাল, ডাল ও গুঁড়া দুধ",
        Produce: "খামার থেকে ফল ও সবজি",
        Bakery: "রুটি, পেস্ট্রি ও আগের দিনের বেক",
        Refrigerated: "দুধ, দই ও ঠান্ডা খাবার",
        Frozen: "মাংস ও পরোটা, -১৮°সে-তে",
      } as Record<string, string>,
    },
    featured: {
      title: "এই সপ্তাহে ঢাকায় তালিকাভুক্ত",
      description: "তিনটি নমুনা তালিকা। প্রতিটি কার্ডে রিস্ক এজেন্টের ফলাফল ও কারণ আছে।",
      note: "ডেমো ডেটা সেট থেকে নমুনা তালিকা।",
      cta: "সব খাবার দেখুন",
      view: "বিস্তারিত দেখুন",
      awaiting: "পর্যালোচনার অপেক্ষায়",
      needsAdmin: "অ্যাডমিন পর্যালোচনা প্রয়োজন",
      available: "উপলব্ধ",
      listed: "তালিকাভুক্ত",
      collectBy: "সংগ্রহের শেষ সময়",
      labels: { safe: "নিরাপদ", soon: "শিগগির ব্যবহার করুন", review: "পর্যালোচনা প্রয়োজন" },
      risks: {
        "DON-1001": {
          level: "safe" as const,
          reason: "সকাল ৮টায় রান্না, ৬০°সে-এর উপরে রাখা। রাত ৮টার মধ্যে সংগ্রহ করুন।",
        },
        "DON-1011": {
          level: "soon" as const,
          reason: "সাভার থেকে পাকা ফল। ৮ নভেম্বরের আগে সংগ্রহ করা ভালো।",
        },
        "DON-1005": {
          level: "review" as const,
          reason: "কোল্ড-চেইনের লগে দুই ঘণ্টার ফাঁক। অ্যাডমিন যাচাই করার আগে এটি কাউকে দেওয়া হবে না।",
        },
      } as Record<string, { level: "safe" | "soon" | "review"; reason: string }>,
    },
    cta: {
      headline:
        "বাড়তি খাবার আছে? দুই মিনিটে তালিকা করুন। কাছের নিবন্ধিত গ্রহীতা সংগ্রহ করতে পারবেন।",
      body: "ঢাকার রেস্তোরাঁ, বেকারি, খামার ও অনুষ্ঠান আয়োজকরা উদ্বৃত্ত খাবার দিতে পারেন। কেউ নিশ্চিত করার আগেই তালিকায় পিকআপের সময় দেখা যায়।",
      primary: "বাড়তি খাবার তালিকা করুন",
      secondary: "কাছের খাবার খুঁজুন",
      note: "এটি CSE 327-এর একটি প্রদর্শনী। এই পৃষ্ঠার সংখ্যাগুলো নমুনা তথ্য।",
    },
  },
} as const;

export type HomeCopy = (typeof homeCopy)["en"];
