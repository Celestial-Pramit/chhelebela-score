import { describe, expect, it } from "vitest";
import {
  FINISH_CONFIRM,
  FINISH_QUESTION,
  FINISH_REVIEW,
  FINISH_UNTOUCHED_LINE,
  FINISH_YES_LINE,
  INSTRUCTION_LINE,
  INSTRUCTION_NOTE,
  KNOB_LABEL,
  SKIP_LABEL,
} from "./copy";

describe("product copy", () => {
  it("matches the required Phase 3B Bangla copy", () => {
    expect(SKIP_LABEL).toBe("প্রযোজ্য নয়");
    expect(INSTRUCTION_LINE).toBe(
      "যেগুলো তোমার সঙ্গে মেলে, টিক দাও। বাদ দিতে চাইলে 'প্রযোজ্য নয়' নির্বাচন করো।",
    );
    expect(INSTRUCTION_NOTE).toBe("টিক না দিলে সেটা 'ছিল না' হিসেবে ধরা হবে।");
    expect(FINISH_YES_LINE(3)).toBe("তুমি ৩টি স্মৃতিতে টিক দিয়েছ।");
    expect(FINISH_UNTOUCHED_LINE(2)).toBe("আরও ২টি প্রশ্নের উত্তর দেওয়া হয়নি।");
    expect(FINISH_QUESTION).toBe("এভাবেই শেষ করবে?");
    expect(FINISH_REVIEW).toBe("আরও দেখি");
    expect(FINISH_CONFIRM).toBe("হ্যাঁ, শেষ করো");
    expect(KNOB_LABEL("০২")).toBe("চ্যানেল বদলাও, এখন চ্যানেল ০২");
  });
});
