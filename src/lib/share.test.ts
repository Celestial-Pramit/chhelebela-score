import { describe, expect, it } from "vitest";
import { buildShareText } from "./share";

describe("buildShareText", () => {
  it("builds the Bangla share message with an era label", () => {
    expect(
      buildShareText({
        percent: 75,
        title: "স্মৃতির ঝুলি ভরছে",
        eraLabel: "দুই দশকের সন্তান",
        siteUrl: "https://example.com",
      }),
    ).toBe(
      "আমার ছেলেবেলা স্কোর ৭৫% - স্মৃতির ঝুলি ভরছে! দুই দশকের সন্তান। তোমার স্কোর কত? https://example.com",
    );
  });

  it("omits the era punctuation when no era label exists", () => {
    expect(
      buildShareText({
        percent: 40,
        title: "স্মৃতির ঝুলি ভরছে",
        eraLabel: null,
        siteUrl: "https://example.com",
      }),
    ).toBe("আমার ছেলেবেলা স্কোর ৪০% - স্মৃতির ঝুলি ভরছে! তোমার স্কোর কত? https://example.com");
  });
});
