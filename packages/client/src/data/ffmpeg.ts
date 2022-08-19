import ffmpeg from "fluent-ffmpeg";
//@ts-ignore
import ffprobe_static from "ffprobe-static-electron";
//@ts-ignore
import ffmpeg_static from "ffmpeg-static-electron";
import path from "path";

ffmpeg.setFfprobePath(path.join(ffprobe_static.path));
ffmpeg.setFfmpegPath(path.join(ffmpeg_static.path));

export default ffmpeg;
