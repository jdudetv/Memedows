import { Filter, CustomFilterArgs, Source } from "@sceneify/core";

interface ThreeDTransformSettings {
  "Camera.Mode": number;
  "Camera.FieldOfView": number;
  Mipmapping: boolean;
  "Position.X": number;
  "Position.Y": number;
  "Position.Z": number;
  "Rotation.Order": number;
  "Rotation.X": number;
  "Rotation.Y": number;
  "Rotation.Z": number;
  "Scale.X": number;
  "Scale.Y": number;
  "Shear.X": number;
  "Shear.Y": number;
}
export class ThreeDTransform<S extends Source> extends Filter<
  ThreeDTransformSettings,
  S
> {
  constructor(args: CustomFilterArgs<ThreeDTransformSettings>) {
    super({
      ...args,
      kind: "streamfx-filter-transform",
    });
  }
}

export enum BlurType {
  Box = "box",
  BoxLinear = "box linear",
  Gaussian = "gaussian",
  GaussianLinear = "gaussian linear",
  DualFiltering = "dual filtering",
}

interface BlurSettings {
  "Filter.Blur.Angle": number;
  "Filter.Blur.Mask": boolean;
  "Filter.Blur.Mask.Region.Bottom": number;
  "Filter.Blur.Mask.Region.Left": number;
  "Filter.Blur.Mask.Region.Right": number;
  "Filter.Blur.Mask.Region.Top": number;
  "Filter.Blur.Mask.Type": number;
  "Filter.Blur.Size": number;
  "Filter.Blur.StepScale": boolean;
  "Filter.Blur.StepScale.X": number;
  "Filter.Blur.StepScale.Y": number;
  "Filter.Blur.SubType": string;
  "Filter.Blur.Type": string;
}

export class Blur<S extends Source> extends Filter<BlurSettings, S> {
  constructor(args: CustomFilterArgs<BlurSettings>) {
    super({
      ...args,
      kind: "streamfx-filter-blur",
    });
  }
}

interface SDFSettings {
  "Filter.SDFEffects.Glow.Outer": boolean;
  "Filter.SDFEffects.Glow.Outer.Color": number;
  "Filter.SDFEffects.Glow.Outer.Sharpness": number;
  "Filter.SDFEffects.Glow.Outer.Width": number;
  "Filter.SDFEffects.SDF.Scale": number;
}

export class SDFEffects<S extends Source> extends Filter<SDFSettings, S> {
  constructor(args: CustomFilterArgs<SDFSettings>) {
    super({
      ...args,
      kind: "streamfx-filter-sdf-effects",
    });
  }
}

export class FreezeFrame<S extends Source> extends Filter<{}, S> {
  constructor(args: CustomFilterArgs<{}>) {
    super({
      ...args,
      kind: "freeze_filter",
    });
  }
}

interface FaceTrackerSettings {
  Ki: number;
  Kp: number;
  Td: number;
  Tdlpf: number;
  aspect: string;
  debug_always_show: boolean;
  debug_faces: boolean;
  debug_notrack: boolean;
  e_deadband_x: number;
  e_deadband_y: number;
  e_deadband_z: number;
  e_nonlinear_x: number;
  e_nonlinear_y: number;
  e_nonlinear_z: number;
  presets: object;
  scale: number;
  scale_max: number;
  track_x: number;
  track_y: number;
  track_z: number;
  upsize_b: number;
  upsize_l: number;
  upsize_r: number;
  upsize_t: number;
}

export class FaceTracker<S extends Source> extends Filter<
  FaceTrackerSettings,
  S
> {
  constructor(args: CustomFilterArgs<FaceTrackerSettings>) {
    super({
      ...args,
      kind: "face_tracker_filter",
    });
  }
}

interface DynamicMaskSettings {
  "Filter.DynamicMask.Channel.Input.Channel.Alpha.Channel.Alpha": number;
  "Filter.DynamicMask.Channel.Input.Channel.Alpha.Channel.Blue": number;
  "Filter.DynamicMask.Channel.Input.Channel.Alpha.Channel.Green": number;
  "Filter.DynamicMask.Channel.Input.Channel.Alpha.Channel.Red": number;
  "Filter.DynamicMask.Channel.Input.Channel.Blue.Channel.Alpha": number;
  "Filter.DynamicMask.Channel.Input.Channel.Blue.Channel.Blue": number;
  "Filter.DynamicMask.Channel.Input.Channel.Blue.Channel.Green": number;
  "Filter.DynamicMask.Channel.Input.Channel.Blue.Channel.Red": number;
  "Filter.DynamicMask.Channel.Input.Channel.Green.Channel.Alpha": number;
  "Filter.DynamicMask.Channel.Input.Channel.Green.Channel.Blue": number;
  "Filter.DynamicMask.Channel.Input.Channel.Green.Channel.Green": number;
  "Filter.DynamicMask.Channel.Input.Channel.Green.Channel.Red": number;
  "Filter.DynamicMask.Channel.Input.Channel.Red.Channel.Alpha": number;
  "Filter.DynamicMask.Channel.Input.Channel.Red.Channel.Blue": number;
  "Filter.DynamicMask.Channel.Input.Channel.Red.Channel.Green": number;
  "Filter.DynamicMask.Channel.Input.Channel.Red.Channel.Red": number;
  "Filter.DynamicMask.Channel.Multiplier.Channel.Alpha": number;
  "Filter.DynamicMask.Channel.Multiplier.Channel.Blue": number;
  "Filter.DynamicMask.Channel.Multiplier.Channel.Green": number;
  "Filter.DynamicMask.Channel.Multiplier.Channel.Red": number;
  "Filter.DynamicMask.Channel.Value.Channel.Alpha": number;
  "Filter.DynamicMask.Channel.Value.Channel.Blue": number;
  "Filter.DynamicMask.Channel.Value.Channel.Green": number;
  "Filter.DynamicMask.Channel.Value.Channel.Red": number;
  "Filter.DynamicMask.Input": string;
}

export class DynamicMask<S extends Source> extends Filter<
  DynamicMaskSettings,
  S
> {
  constructor(args: CustomFilterArgs<DynamicMaskSettings>) {
    super({
      ...args,
      kind: "streamfx-filter-dynamic-mask",
    });
  }
}

interface TimeWarpSettings {
  line_color: number;
  line_opacity: number;
  line_width: number;
  rotation: number;
  scan_duration: number;
  transparent: true;
}
export class TimeWarpScan<S extends Source> extends Filter<
  TimeWarpSettings,
  S
> {
  constructor(args: CustomFilterArgs<TimeWarpSettings>) {
    super({
      ...args,
      kind: "time_warp_scan_filter",
    });
  }
}

interface UserShaderSettings {
  from_file: boolean;
  override_entire_effect: boolean;
  shader_file_name: string;
  use_shader_elapsed_time: boolean;
  use_sliders: boolean;
}

interface UserShaderFilterArgs<T extends UserShaderSettings>
  extends CustomFilterArgs<T> {
  shader_path: string;
}

export abstract class UserShaderFilter<
  T extends UserShaderSettings,
  S extends Source
> extends Filter<T, S> {
  constructor({ shader_path, settings, ...args }: UserShaderFilterArgs<T>) {
    super({
      ...args,
      settings: {
        ...settings,
        from_file: true,
        shader_file_name: shader_path,
      },
      kind: "shader_filter",
    });
  }
}

interface RainbowShaderSettings extends UserShaderSettings {
  Apply_To_Image: boolean;
  Saturation: number;
  Luminosity: number;
  Spread: number;
  Speed: number;
  Alpha_Percentage: number;
  Vertical: boolean;
  Rotational: boolean;
  Replace_Image_Color: boolean;
  Apply_To_Specific_Color: boolean;
  Color_To_Replace: number;
}
export class RainbowShader<S extends Source> extends UserShaderFilter<
  RainbowShaderSettings,
  S
> {
  constructor(args: CustomFilterArgs<RainbowShaderSettings>) {
    super({
      ...args,
      shader_path:
        "C:/Program Files/obs-studio/data/obs-plugins/obs-shaderfilter/examples/rainbow.shader",
    });
  }
}

interface ShineShaderSettings extends UserShaderSettings {
  l_tex: string;
  shine_color: number;
  speed_percent: number;
  gradient_percent: number;
  delay_perecent: number;
  Apply_To_Alpha_Layer: boolean;
  ease: boolean;
  hide: boolean;
  reverse: boolean;
  One_Direction: boolean;
  glitch: boolean;
  start_adjust: number;
  stop_adjust: number;
}
export class ShineShader<S extends Source> extends UserShaderFilter<
  ShineShaderSettings,
  S
> {
  constructor(args: CustomFilterArgs<ShineShaderSettings>) {
    super({
      ...args,
      shader_path:
        "C:/Program Files/obs-studio/data/obs-plugins/obs-shaderfilter/examples/shine.shader",
    });
  }
}

interface ShaderSettings {
  "Shader.Shader.Size.Height": string;
  "Shader.Shader.Size.Width": string;
  "Shader.Shader.Seed": number;
  "Shader.Shader.File": string;
}

interface ShaderFilterArgs<T extends ShaderSettings>
  extends CustomFilterArgs<T> {
  shader_path: string;
}

export abstract class ShaderFilter<
  T extends ShaderSettings,
  S extends Source
> extends Filter<T, S> {
  constructor({ shader_path, settings, ...args }: ShaderFilterArgs<T>) {
    super({
      ...args,
      settings: {
        ...settings,
        "Shader.Shader.File": shader_path,
      },
      kind: "streamfx-filter-shader",
    });
  }
}

interface CRTShaderSettings extends ShaderSettings {
  _0_strength: number;
  "_1_border[0]": number;
  "_1_border[1]": number;
  "_1_border[2]": number;
  "_1_border[3]": number;
  _2_feathering: number;
}

export class CRTShader<S extends Source> extends ShaderFilter<
  CRTShaderSettings,
  S
> {
  constructor(args: CustomFilterArgs<CRTShaderSettings>) {
    super({
      ...args,
      shader_path:
        "C:/Program Files/obs-studio/data/obs-plugins/StreamFX/examples/shaders/filter/crt-curvature.effect",
    });
  }
}

interface ScanlineSettings extends ShaderSettings {
  _0_Strength: number;
  "_1_Intensity[0]": number;
  "_1_Intensity[1]": number;
  _1_Scanlines: number;
  _2_EnableBleed: number;
  _4_Speed: number;
}

export class ScanlineShader<S extends Source> extends ShaderFilter<
  ScanlineSettings,
  S
> {
  constructor(args: CustomFilterArgs<ScanlineSettings>) {
    super({
      ...args,
      shader_path:
        "C:/Program Files/obs-studio/data/obs-plugins/StreamFX/examples/shaders/filter/crt-scanlines.effect",
    });
  }
}

interface PixelateSettings extends ShaderSettings {
  PixelScale: number;
}

export class PixelateShader<S extends Source> extends ShaderFilter<
  PixelateSettings,
  S
> {
  constructor(args: CustomFilterArgs<PixelateSettings>) {
    super({
      ...args,
      shader_path:
        "C:/Program Files/obs-studio/data/obs-plugins/StreamFX/examples/shaders/filter/pixelation.effect",
    });
  }
}
interface CartoonSettings extends UserShaderSettings {
  hue_steps: number;
  value_steps: number;
}
export class CartoonShader<S extends Source> extends UserShaderFilter<
  CartoonSettings,
  S
> {
  constructor(args: CustomFilterArgs<CartoonSettings>) {
    super({
      ...args,
      shader_path:
        "C:/Program Files/obs-studio/data/obs-plugins/obs-shaderfilter/examples/cartoon.effect",
    });
  }
}

interface ShakeSettings extends UserShaderSettings {
  speed_percent: number;
  Axis_X: number;
  Axis_Y: number;
  Axis_Z: number;
  Angle_Degrees: number;
  Rotate_Transform: boolean;
  Rotate_Pixels: boolean;
  Rotate_Colors: boolean;
  center_width_percentage: number;
  center_height_percentage: number;
}

export class ShakeShader<S extends Source> extends UserShaderFilter<
  ShakeSettings,
  S
> {
  constructor(args: CustomFilterArgs<ShakeSettings>) {
    super({
      ...args,
      shader_path:
        "C:/Program Files/obs-studio/data/obs-plugins/obs-shaderfilter/examples/rotatoe.effect",
    });
  }
}

interface VHSSEttings extends UserShaderSettings {
  range: number;
  noiseQuality: number;
  noiseIntensity: number;
  offsetIntensity: number;
  colorOffsetIntensity: number;
  lumaMin: number;
  lumMinSMooth: number;
  Alpha_Percentage: number;
  Apply_To_Image: boolean;
  Replace_Image_Color: boolean;
}

export class VHSSHader<S extends Source> extends UserShaderFilter<
  VHSSEttings,
  S
> {
  constructor(args: CustomFilterArgs<VHSSEttings>) {
    super({
      ...args,
      shader_path:
        "C:/Program Files/obs-studio/data/obs-plugins/obs-shaderfilter/examples/VHS.shader",
    });
  }
}

interface BloomSettings extends UserShaderSettings {
  Angle_Steps: number;
  Radius_Steps: number;
  ampFactor: number;
}

export class BloomShader<S extends Source> extends UserShaderFilter<
  BloomSettings,
  S
> {
  constructor(args: CustomFilterArgs<BloomSettings>) {
    super({
      ...args,
      shader_path:
        "C:/Program Files/obs-studio/data/obs-plugins/obs-shaderfilter/examples/bloom.shader",
    });
  }
}
