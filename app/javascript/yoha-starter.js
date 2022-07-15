/**
 * Yoha hand tracking with click capabilities.
 * Adapted from official Yoha minimal JS hand-tracker example.
 */
import * as yoha from '@handtracking.io/yoha';
import {
  SetCursorColor,
  SetCursorPosition,
  SetCursorVisibility,
  InitializeCursor,
  SimulateClick,
} from '@javascript/cursor';

// eslint-disable-next-line import/prefer-default-export
export async function Run() {
  // Setup video feed.
  const streamRes = await yoha.CreateMaxFpsMaxResStream();
  if (streamRes.error) {
    // browser denied or other error
    // eslint-disable-next-line no-console
    console.error(`[YOHA]: setup_video error: ${streamRes.error}`);
    return;
  }
  const video = yoha.CreateVideoElementFromStream(streamRes.stream);

  // Download models.
  const modelFiles = await yoha.DownloadMultipleYohaTfjsModelBlobs(
    '/assets/yoha/box/model.json',
    '/assets/yoha/lan/model.json',
    (rec, total) => {
      // eslint-disable-next-line no-console
      console.debug(`[YOHA]: Download progress: ${(rec / total) * 100}%`);
    },
  );

  // eslint-disable-next-line no-console
  console.debug('[YOHA]: starting cursor');
  InitializeCursor();

  const wasmConfig = {
    wasmPaths: '/assets/tensor/',
  };

  const thresholds = yoha.RecommendedHandPoseProbabilityThresholds;

  // Run engine.
  // We configure small padding to avoid that users move their hand outside webcam view
  // when trying to move the cursor towards the border of the viewport.
  yoha.StartTfjsWasmEngine(
    { padding: 0.05 },
    wasmConfig,
    video,
    modelFiles,
    (res) => {
      if (res.isHandPresentProb < thresholds.IS_HAND_PRESENT) {
        SetCursorVisibility(false);
        return;
      }
      SetCursorVisibility(true);

      // Change cursor position.
      // We only use one coordinate here...
      SetCursorPosition(...res.coordinates[0]);

      // Change color depending on gesture.
      if (res.poses.fistProb > thresholds.FIST) {
        SetCursorColor('red');
      } else if (res.poses.pinchProb > thresholds.PINCH) {
        SimulateClick();
        SetCursorColor('green');
      } else {
        SetCursorColor('blue');
      }
    },
  );
}
