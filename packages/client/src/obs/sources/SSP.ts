import { Input, SourceFilters, CustomInputArgs } from "@sceneify/core";

interface Settings {}

export class SSPSource<
  Filters extends SourceFilters = SourceFilters
> extends Input<Settings, Filters> {
  constructor(args: CustomInputArgs<Settings, Filters>) {
    super({
      ...args,
      kind: "ssp_source",
    });
  }
}
