import { LinguaRecorder } from './LinguaRecorder';

function recognize(blob, listener) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function(evt) {
    const req = evt.target;
    if(req.readyState === XMLHttpRequest.DONE && req.status === 200) {
      console.log("speechToText#Result - 1: ", xhr.responseText);
      const lines = xhr.responseText.split('\n');
      const content = lines && lines.length > 1 ? lines[1]: undefined;
      if (!content) {
        if (listener) {
          listener.onError(`沒有說話! responseText: ${xhr.responseText}`);
        }
        return;
      }

      const resObject = JSON.parse(content);
      console.log("speechToText#Result - resObject: ", resObject);
      if (!resObject) {
        if (listener) {
          listener.onError("convert error");
        }
        return;
      }

      const text = resObject["result"][0]["alternative"][0]["transcript"];
      console.log("speechToText#Result - 3: ", text);
      if (listener && text) {
        listener.onComplete(text);
      }
    }
  };
  const langs = {
    zh_tw: "cmn-Hant-TW",
    zh_cn: "cmn-Hans-CN",
    en_US: "en-US"
  }
  xhr.open("POST",`https://speech.65lzg.com/v1/speech:recognize?lang=${langs["zh_tw"]}`);
  xhr.send(blob);
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
      recognize(audioData, listener);
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
