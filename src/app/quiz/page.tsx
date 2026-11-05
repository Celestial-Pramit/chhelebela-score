import type { Metadata } from "next";
import QuizApp from "@/components/quiz/QuizApp";

export const metadata: Metadata = {
  title: "ছেলেবেলা স্কোর — কুইজ",
  description: "তোমার ছেলেবেলার স্মৃতিগুলো টিক দিয়ে মজার স্কোর দেখো।",
  openGraph: {
    type: "website",
    locale: "bn_BD",
    title: "ছেলেবেলা স্কোর — কুইজ",
    description: "তোমার ছেলেবেলার স্মৃতিগুলো টিক দিয়ে মজার স্কোর দেখো।",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "ছেলেবেলা স্কোর কুইজ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ছেলেবেলা স্কোর — কুইজ",
    description: "তোমার ছেলেবেলার স্মৃতিগুলো টিক দিয়ে মজার স্কোর দেখো।",
    images: ["/og.png"],
  },
};

export default function QuizPage() {
  return <QuizApp />;
}
