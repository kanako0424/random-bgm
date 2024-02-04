document.addEventListener('DOMContentLoaded', () => {
    const clientId = 'a397c7fb0a1a489a802411025ab63268'; // あなたのSpotifyアプリケーションのClient IDを入力してください
    const redirectUri = 'https://random-bgm.web.app'; // あなたのSpotifyアプリケーションのRedirect URIを入力してください
    const apiUrl = 'https://api.spotify.com/v1';

    const randomButton = document.getElementById('random-button');
    const songInfo = document.getElementById('song-info');

    // ランダムな曲を再生する関数
    async function playRandomSong() {
        try {
            // SpotifyのAPIからランダムな曲を取得
            const randomOffset = Math.floor(Math.random() * 1000); // ランダムなoffset
            const response = await fetch(`${apiUrl}/browse/new-releases?limit=1&offset=${randomOffset}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch song');
            }

            const data = await response.json();
            const track = data.albums.items[0];

            // 曲の情報を表示
            songInfo.innerHTML = `
                <h2>${track.name}</h2>
                <p>By ${track.artists[0].name}</p>
                <img src="${track.images[0].url}" alt="Album Artwork" style="width: 200px;">
                <audio controls autoplay>
                    <source src="${track.external_urls.spotify}" type="audio/mp3">
                    Your browser does not support the audio element.
                </audio>
            `;
        } catch (error) {
            console.error('Error:', error);
            songInfo.innerHTML = '<p>Failed to play song. Please try again later.</p>';
        }
    }

    // ボタンクリック時のイベントリスナー
    randomButton.addEventListener('click', playRandomSong);

    // ページのロード時にアクセストークンを取得
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');

    if (!accessToken) {
        // アクセストークンがない場合、Spotifyの認証ページにリダイレクト
        window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=user-read-private%20user-read-email&state=123`;
    }
});
