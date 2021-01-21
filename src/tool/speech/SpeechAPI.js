import { LinguaRecorder } from './LinguaRecorder';

function audio2file(blob, listener) {
    const anchor = document.createElement('a');
    document.body.appendChild(anchor);
    anchor.style = 'display: none';
    const url = window.URL.createObjectURL(blob);
    anchor.href = url;
    anchor.download = 'audio.wav';
    anchor.click();
    window.URL.revokeObjectURL(url);

    //
    console.log("speechToText#body - blob: ", blob);
    console.log("speechToText#body - listener: ", listener);
    listener.onComplete();
}

function createRecorder(listener) {
  let config = {
    autoStart: true,
    autoStop: true,
  };

  const recorder = new LinguaRecorder(config);
  recorder.on( 'ready', function() {
    console.log("AudioRecorder", "Ready");
    if (listener) {
      recorder.start();
      listener.onReady();
    } else {
      recorder.stop(true);
    }
  } ).on( 'stoped', function( audioRecord ) {
    console.log("AudioRecorder", "Stop");
    console.log("AudioTracks", recorder.stream.getAudioTracks());
    if (listener) {
      listener.onStop(audioRecord.getWAVE());
    }
    recorder.stream.getAudioTracks()[0].stop()
  } );
  return recorder;
}

let recorder = undefined;

function record(listener) {
  stopRecord();
  recorder = createRecorder({
    onReady: () => {
      if (listener) {
        listener.onStart();
      }
  }, onStop: (audioData) => {
      audio2file(audioData, listener);
    }
  });
}

function stopRecord() {
  console.log("stopRecord", recorder);
  if (recorder) {
    recorder.stop(true);
    console.log("stopRecord", "stop done!");
    recorder = undefined;
  }
}

export function speechToText(listener) {
  record(listener);
}

export function stopRecorder() {
  stopRecord()
}
