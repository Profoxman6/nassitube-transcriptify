export interface Subtitle {
  languageName: string;
  languageCode: string;
  isTranslatable: boolean;
  url: string;
}

export interface TranscriptResponse {
  subtitles: Subtitle[];
  format: string;
  msg: string;
  translationLanguages: Array<{
    languageCode: string;
    languageName: string;
  }>;
}