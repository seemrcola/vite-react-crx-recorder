export function useRecorder(sliceTime = 1000) {
  let mediaRecorder: MediaRecorder | null = null;
  let recordData: any[] = [];
  
  function startRecording(stream: MediaStream, options:MediaRecorderOptions = {}) {
    mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(sliceTime);
    
    mediaRecorder.addEventListener('stop', () => {
      // 停掉录制器
      mediaRecorder?.stream.getTracks().forEach(track => track.stop());
      stream.getTracks().forEach(track => track.stop());
      // 复原现场
      recordData = [];
      mediaRecorder = null;
      // 下载录制文件
      download();
    });
  }
  
  // 给三个监听事件添加额外的回调函数--------------------
  function endRecording() {
    if(mediaRecorder?.state === 'recording')
      mediaRecorder?.stop();
  }
  
  function addStartCallback(callback: () => void) {
    mediaRecorder?.addEventListener('start', callback);
  }
  
  function addStopCallback(callback: () => void) {
    mediaRecorder?.addEventListener('stop', callback);
  }
  // ------------------------------------------------
  
  function addDataAvailableCallback(callback: (event: BlobEvent) => void) {
    mediaRecorder?.addEventListener('dataavailable', callback);
  }
  
  function handleDataAvailable(event: BlobEvent) {
    if (event.data.size > 0) {
      recordData.push(event.data);
    }
  }
  
  function download() {
    const blob = new Blob(recordData, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = 'your-record.webm';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  return {
    startRecording,
    endRecording,
    addStartCallback,
    addStopCallback,
    addDataAvailableCallback,
    mediaRecorder,
  }
}
