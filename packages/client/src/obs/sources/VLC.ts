import { Input, SourceFilters, CustomInputArgs } from "@sceneify/core";

interface Settings {
  playlist: PlaylistItems[];
  shuffle: boolean;
  playback_behavior: string;
}

interface PlaylistItems {
  hidden: boolean;
  selected: boolean;
  value: string;
}

export class VLC_Source<
  Filters extends SourceFilters = SourceFilters
> extends Input<Settings, Filters> {
  constructor(args: CustomInputArgs<Settings, Filters>) {
    super({
      ...args,
      kind: "vlc_source",
    });
  }
}
