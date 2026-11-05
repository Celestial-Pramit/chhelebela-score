import { toBanglaDigits } from "./scoring";

export type ShareTextInput = {
  percent: number;
  title: string;
  eraLabel: string | null;
  siteUrl: string;
};

export function buildShareText({ percent, title, eraLabel, siteUrl }: ShareTextInput): string {
  const era = eraLabel ? ` ${eraLabel}।` : "";
  return `আমার ছেলেবেলা স্কোর ${toBanglaDigits(percent)}% - ${title}!${era} তোমার স্কোর কত? ${siteUrl}`;
}
