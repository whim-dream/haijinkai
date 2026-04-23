// const player;
// const script_tag = document.createElement('script');
// script_tag.src = "https://www.youtube.com/iframe_api";
// document.body.appendChild(script_tag);

// this function is called when API is Ready
// function onYouTubeIframeAPIReady() {
//   console.log("onYouTubeIframeAPIReady");
// }
// {
//   const { promise, resolve } = Promise.withResolvers();
//   window.onYouTubeIframeAPIReady = resolve;
//   await promise;
// }
const loadYouTubeAPI = new Promise((resolve) => {
  // すでに読み込まれているかチェック
  if (window.YT && window.YT.Player) {
    resolve(window.YT);
    return;
  }

  // グローバル関数にresolveを割り当てる
  window.onYouTubeIframeAPIReady = () => {
    console.log("API loaded");
    resolve(window.YT);
  };

  // APIスクリプトを動的に読み込む
  const script_tag = document.createElement('script');
  script_tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(script_tag);
  console.log("API set");
});

async function setupYouTubePlayer() {
  await loadYouTubeAPI;
  return new YT.Player('player', { //div id
    // videoId: video_id, // 動画ID
    width: "1280", // プレーヤーの幅
    height: "720", // プレーヤーの高さ
    playerVars: {
      // 'autoplay'  : 1, // 自動再生
      // 'mute'      : 1,
      'controls'  : 0, // コントロールの表示/非表示
      'loop'      : 0, // 繰り返し再生のオン/オフ
      // 'start'     : start_sec, //開始時間
      // 'end'       : end_sec //終了時間
    },
    events: {
      'onStateChange': onPlayerStateChange, // 再生状態の変化を検知
      // 'onPlaybackRateChange': onPlayerPlaybackRateChange, // 再生速度の変化を検知
      // 'onError': onPlayerError // エラーの発生を検知
    }
  });
}

async function playYouTube(video_id, start_sec, end_sec) {
  console.log("this is DEBUG");
  let player = await setupYouTubePlayer();
  console.log("player is set up");
  player.loadVideoById({videoId: video_id,
                        startSeconds: start_sec,
                        endSeconds: end_sec});
}
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
          player.pauseVideo();
          clearInterval(checkTime); // 監視を停止
        }
      }, 1000); //1000ms=1秒ごとに実行
    } else if (event.data === YT.PlayerState.PAUSED) {
      // 動画が一時停止されたとき
      clearInterval(checkTime); // 監視を停止
    }
}

async function setupYouTubeAPI() {

  const script_tag = document.createElement('script');
  script_tag.src = "https://www.youtube.com/iframe_api";
  //  body終了前にタグを出力
  document.body.appendChild(script_tag);

  const { promise, resolve } = Promise.withResolvers();
  window.onYouTubeIframeAPIReady = resolve;
  await promise;
  return new YT.Player('player', { //div id
    // videoId: video_id, // 動画ID
    width: "960", // プレーヤーの幅
    height: "540", // プレーヤーの高さ
    playerVars: {
      // 'autoplay'  : 1, // 自動再生
      // 'mute'      : 1,
      'controls'  : 0, // コントロールの表示/非表示
      'loop'      : 0, // 繰り返し再生のオン/オフ
      // 'start'     : start_sec, //開始時間
      // 'end'       : end_sec //終了時間
    },
    events: {
      'onStateChange': onPlayerStateChange, // 再生状態の変化を検知
      'onPlaybackRateChange': onPlayerPlaybackRateChange, // 再生速度の変化を検知
      'onError': onPlayerError // エラーの発生を検知
    }
  });
}


function playYouTube_before(video_id, start_sec, end_sec) {
  console.log("this is DEBUG");
  // const script_tag = document.createElement('script');
  // script_tag.src = "https://www.youtube.com/iframe_api";
  // document.body.appendChild(script_tag);
  // let player;

  // iframe のセットアップ
  player = new YT.Player('player', { //div id
    // videoId: video_id, // 動画ID
    videoId: video_id, // 動画ID
    width: "1280", // プレーヤーの幅
    height: "720", // プレーヤーの高さ
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
      // 'onPlaybackRateChange': onPlayerPlaybackRateChange, // 再生速度の変化を検知
      // 'onError': onPlayerError // エラーの発生を検知
    }
  });
  console.log(video_id);
  console.log(start_sec);
  console.log(end_sec);

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
            player.pauseVideo();
            clearInterval(checkTime); // 監視を停止
          }
        }, 1000); //1000ms=1秒ごとに実行
      } else if (event.data === YT.PlayerState.PAUSED) {
        // 動画が一時停止されたとき
        clearInterval(checkTime); // 監視を停止
      }
  }
}

console.log("read js file");
