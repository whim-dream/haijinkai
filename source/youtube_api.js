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

class YouTubePlayer {
  constructor() {
    this.player = null;
  }

  static async initialize() {
    const player = new YouTubePlayer();
    console.log("this is DEBUG");
    player.player = await player.setupYouTubePlayer();
    console.log("player is set up");
    return player;
  }

  loadYouTubeAPI() {
    return new Promise((resolve) => {
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
  }

  async setupYouTubePlayer() {
    console.log("waiting loadYouTubeAPI");
    await this.loadYouTubeAPI();
    console.log("loadYouTubeAPI done");
    const { promise, resolve } = Promise.withResolvers();
    let player = new YT.Player('player', { //div id
      // videoId: "vfmEVlSFmWE", // 動画ID
      width: "960", // プレーヤーの幅
      height: "540", // プレーヤーの高さ
      // playerVars: {
        // 'autoplay'  : 1, // 自動再生
        // 'mute'      : 1,
        // 'controls'  : 0, // コントロールの表示/非表示
        // 'loop'      : 0, // 繰り返し再生のオン/オフ
        // 'start'     : start_sec, //開始時間
        // 'end'       : end_sec //終了時間
      // },
      events: {
        'onReady': resolve,
      //   'onStateChange': onPlayerStateChange, // 再生状態の変化を検知
        // 'onPlaybackRateChange': onPlayerPlaybackRateChange, // 再生速度の変化を検知
        // 'onError': onPlayerError // エラーの発生を検知
      }
    });
    // wait until player is correctly setup
    await promise;
    return player;
  }

  createAutoStopFunction(player, end_sec) {
    return function (event) {
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

  playYouTube(video_id, start_sec, end_sec) {
    this.player.loadVideoById({videoId: video_id,
                               startSeconds:start_sec});
    this.player.addEventListener("onStateChange", this.createAutoStopFunction(this.player, end_sec));
  }
}

async function playYouTube(video_id, start_sec, end_sec) {
  console.log("this is DEBUG");
  // let player = await setupYouTubePlayer();
  let player = await YouTubePlayer.initialize();
  console.log("player is set up");
  player.playYouTube(video_id, start_sec, end_sec);
  // player.loadVideoById({videoId: video_id,
  //                       startSeconds:start_sec});
  // player.addEventListener("onStateChange", createAutoStopFunction(player, end_sec));
}

console.log("read js file");
