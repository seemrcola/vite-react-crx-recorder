export function useRecorder(sliceTime = 1000) {
  let mediaRecorder: MediaRecorder | null = null;
  
  function startRecording(stream: MediaStream, options:MediaRecorderOptions = {}) {
    mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.start(sliceTime);
    
    mediaRecorder.addEventListener('stop', () => {
      // 停掉录制器
      mediaRecorder?.stream.getTracks().forEach(track => track.stop());
      stream.getTracks().forEach(track => track.stop());
      // 复原现场
      mediaRecorder = null;
    });
  }
  
  function endRecording() {
    if(mediaRecorder?.state === 'recording')
      mediaRecorder?.stop();
  }
  
  // ########### 给三个监听事件添加额外的回调函数--------------------
  function addStartCallback(callback: () => void) {
    mediaRecorder?.addEventListener('start', callback);
  }
  
  function addStopCallback(callback: () => void) {
    mediaRecorder?.addEventListener('stop', callback);
  }
  
  function addDataAvailableCallback(callback: (event: BlobEvent) => void) {
    mediaRecorder?.addEventListener('dataavailable', callback);
  }
  // ########### -----------------------------------------------
  
  return {
    startRecording,
    endRecording,
    addStartCallback,
    addStopCallback,
    addDataAvailableCallback,
    mediaRecorder,
  }
}
