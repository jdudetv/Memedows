import { Input, SourceFilters, CustomInputArgs } from "@sceneify/core";

interface Settings {
  "Source.Mirror.Source": string;
}

export class MirrorSource<
  Filters extends SourceFilters = SourceFilters
> extends Input<Settings, Filters> {
  constructor(args: CustomInputArgs<Settings, Filters>) {
    super({
      ...args,
      kind: "streamfx-source-mirror",
    });
  }
}
