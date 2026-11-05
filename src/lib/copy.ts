export const SKIP_LABEL = "প্রযোজ্য নয়";
export const INSTRUCTION_LINE =
  "যেগুলো তোমার সঙ্গে মেলে, টিক দাও। বাদ দিতে চাইলে 'প্রযোজ্য নয়' নির্বাচন করো।";
export const INSTRUCTION_NOTE = "টিক না দিলে সেটা 'ছিল না' হিসেবে ধরা হবে।";
export const FINISH_YES_LINE = (count: number) =>
  `তুমি ${toBanglaDigits(count)}টি স্মৃতিতে টিক দিয়েছ।`;
export const FINISH_UNTOUCHED_LINE = (count: number) =>
  `আরও ${toBanglaDigits(count)}টি প্রশ্নের উত্তর দেওয়া হয়নি।`;
export const FINISH_QUESTION = "এভাবেই শেষ করবে?";
export const FINISH_REVIEW = "আরও দেখি";
export const FINISH_CONFIRM = "হ্যাঁ, শেষ করো";
export const KNOB_LABEL = (channel: string) => `চ্যানেল বদলাও, এখন চ্যানেল ${channel}`;
import { toBanglaDigits } from "./scoring";
