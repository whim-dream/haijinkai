function playYouTube(video_id, start_sec, end_sec) {
  const script_tag = document.createElement('script');
  script_tag.src = 'https://www.youtube.com/iframe_api';
  document.body.appendChild(script_tag);
  let player;

  // iframe のセットアップ
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', { //div id
      videoId: video_id, // 動画ID
      width: 1280, // プレーヤーの幅
      height: 720, // プレーヤーの高さ
      playerVars: {
        'autoplay'  : 1, // 自動再生
        'mute'      : 1,
        'controls'  : 0, // コントロールの表示/非表示
        'loop'      : 0, // 繰り返し再生のオン/オフ
        'start'     : start_sec, //開始時間
        'end'       : end_sec //終了時間
      },
      events: {
        'onStateChange': onPlayerStateChange, // 再生状態の変化を検知
        'onPlaybackRateChange': onPlayerPlaybackRateChange, // 再生速度の変化を検知
        'onError': onPlayerError // エラーの発生を検知
      }
    });
    function onPlayerStateChange(event) {
        let checkTime; //監視システム
        if (event.data === YT.PlayerState.PLAYING) {
          // 動画が再生中のとき
          player.unMute();
          checkTime = setInterval(() => {
            const currentTime = player.getCurrentTime(); // 再生位置を取得
            if (currentTime >= end_sec) {
              //任意の処理
              console.log('指定した再生時間に達しました！');
              player.pauseVideo
              clearInterval(checkTime); // 監視を停止
            }
          }, 1000); //1000ms=1秒ごとに実行
        } else if (event.data === YT.PlayerState.PAUSED) {
          // 動画が一時停止されたとき
          clearInterval(checkTime); // 監視を停止
        }
    }
  }


}
