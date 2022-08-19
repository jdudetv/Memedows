import { Input, SourceFilters, CustomInputArgs } from "@sceneify/core";

interface Settings {
  audio_source: string;
  bar_space: number;
  color: number;
  corner_points: number;
  corner_radius: number;
  detail: number;
  falloff: number;
  fifo_path: string;
  filter_mode: number;
  filter_strength: number;
  gravity: number;
  height: number;
  log_freq_scale: boolean;
  log_freq_scale_hpf_curve: number;
  log_freq_scale_quality: number;
  log_freq_scale_start: number;
  log_freq_scale_use_hpf: boolean;
  round_corners: boolean;
  sample_rate: number;
  scale_boost: number;
  scale_size: number;
  sgs_passes: number;
  sgs_points: number;
  source_mode: number;
  stereo: boolean;
  use_auto_scale: boolean;
  width: number;
  wire_mode: number;
  wire_thickness: number;
}

export class Visualiser<
  Filters extends SourceFilters = SourceFilters
> extends Input<Settings, Filters> {
  constructor(args: CustomInputArgs<Settings, Filters>) {
    super({
      ...args,
      kind: "spectralizer",
    });
  }
}
