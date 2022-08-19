import { Input, SourceFilters, CustomInputArgs } from "@sceneify/core";

interface Settings {
  bg: number;
  cx: number;
  cy: number;
  fg: number;
  use_bg: boolean;
}

export class ProgressBar<
  Filters extends SourceFilters = SourceFilters
> extends Input<Settings, Filters> {
  constructor(args: CustomInputArgs<Settings, Filters>) {
    super({
      ...args,
      kind: "progress_bar",
    });
  }
}
