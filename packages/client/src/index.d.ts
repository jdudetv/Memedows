interface ImportMetaEnv {
  VITE_TWITCH_ACCESS_TOKEN: string;
  VITE_TWITCH_CLIENT_ID: string;
  VITE_TWITCH_CLIENT_SECRET: string;
  VITE_TWITCH_CLIENT_REFRESH: string;
  VITE_TWITCH_CLIENT_USER_TOKEN: string;
  VITE_WEBHOOK_API_ENDPOINT: string;
  VITE_FIREBASE_EMAIL: string;
  VITE_FIREBASE_PASSWORD: string;
  VITE_SOUNDS_DIRECTORY: string;
  VITE_VIDEOS_DIRECTORY: string;
  VITE_VIDEOS_INGEST_DIRECTORY: string;
  VITE_ROOT_PATH: string;
  VITE_DB_PATH: string;
  VITE_AWS_ACCESS_KEY: string;
  VITE_AWS_SECRET_KEY: string;
  VITE_TMI_TOKEN: string;
  VITE_ALERTS_VIDEO_DIRECTORY: string;
}

declare module "speak-tts" {
  type SpeechEvents =
    | "onboundary"
    | "onend"
    | "onerror"
    | "onmark"
    | "onpause"
    | "onresume"
    | "onstart";

  export default class Speech {
    hasBrowserSupport(): boolean;

    init(
      props?: Partial<{
        volume: number;
        lang: string;
        rate: number;
        pitch: number;
        voice: string;
        splitSentences: boolean;
        listeners: {
          onvoiceschanged?: SpeechSynthesis["onvoiceschanged"];
        };
      }>
    ): Promise<{
      voices: SpeechSynthesisVoice[];
      lang: string;
      voice: string;
      volume: number;
      rate: number;
      pitch: number;
      splitSentences: boolean;
      browserSupport: boolean;
    }>;

    speak(props: {
      text: string;
      queue?: boolean;
      listeners?: Partial<
        {
          [key in SpeechEvents]: SpeechSynthesisUtterance[key];
        }
      >;
    }): Promise<void>;

    static setLanguage(lang: string): void;

    static setVoice(voice: string): void;

    static setRate(val: number): void;

    static setVolume(val: number): void;

    static setPitch(val: number): void;

    static pause(): void;

    static resume(): void;

    static cancel(): void;

    static pending(): boolean;

    static paused(): boolean;

    static speaking(): boolean;
  }
}
