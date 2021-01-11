
const coverImages = {
  "600": [
    "./assets/coverImg/rranhome_0_600_205.png",
    "./assets/coverImg/rranhome_1_600_205.png",
    "./assets/coverImg/rranhome_2_600_205.png",
    "./assets/coverImg/rranhome_3_600_205.png",
    "./assets/coverImg/rranhome_4_600_205.png",
    "./assets/coverImg/rranhome_5_600_205.png",
    "./assets/coverImg/rranhome_6_600_205.png",
  ],
  "980": [
    "./assets/coverImg/rranhome_0_980_334.png",
    "./assets/coverImg/rranhome_1_980_334.png",
    "./assets/coverImg/rranhome_2_980_334.png",
    "./assets/coverImg/rranhome_3_980_334.png",
    "./assets/coverImg/rranhome_4_980_334.png",
    "./assets/coverImg/rranhome_5_980_334.png",
    "./assets/coverImg/rranhome_6_980_334.png",
  ],
  "1366": [
    "./assets/coverImg/rranhome_0_1366_466.png",
    "./assets/coverImg/rranhome_1_1366_466.png",
    "./assets/coverImg/rranhome_2_1366_466.png",
    "./assets/coverImg/rranhome_3_1366_466.png",
    "./assets/coverImg/rranhome_4_1366_466.png",
    "./assets/coverImg/rranhome_5_1366_466.png",
    "./assets/coverImg/rranhome_6_1366_466.png",
  ],
}
const heroBox = document.querySelector('.hero-section');
const workSection = document.querySelector('.work-section');

const workTitle = document.querySelector(".work-section--content--title");
const workDisplay = document.querySelector(".work-section--content--display");


function init() {
  // console.log(":inner width ", window.innerWidth)
  if (window.innerWidth <= 1200) {
    workSection.style.height = `${workTitle.clientHeight + workDisplay.clientHeight + 500}px`;
  } else {
    workSection.style.height = "100vh"
  }
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 1200) {
    workSection.style.height = `${workTitle.clientHeight + workDisplay.clientHeight + 500}px`;
  } else {
    workSection.style.height = "100vh"
  }
})

const precacheImages = (wrapper) => {
  const images = [];
  const screenSize = window.innerWidth;
  if (screenSize <= 600) {
    coverImages["600"].map(data => {
      let cvImg = new Image(600, 205);
      cvImg.src = data;
      images.push(cvImg)
    })
    wrapper.style.backgroundImage = `url(${images[0].src})`
  }
  if (screenSize <= 980) {

    coverImages["980"].map(data => {
      let cvImg = new Image();
      cvImg.src = data;
      images.push(cvImg)
    })
    wrapper.style.backgroundImage = `url(${images[0].src})`
  }
  if (screenSize <= 1366) {

    coverImages["1366"].map(data => {
      let cvImg = new Image();
      cvImg.src = data;
      images.push(cvImg)
    })
    wrapper.style.backgroundImage = `url(${images[0].src})`
  }
  return images;
}


const changeHeroImg = () => {
  const preCachedCoverImages = precacheImages(heroBox);
  let num = 0;

  let imgChangeHandler = setInterval(() => {

    if (num === 6) num = 0;
    else num = num + 1;

    heroBox.style.backgroundImage = `url(${preCachedCoverImages[num].src})`
  }, (3000));
  return () => clearInterval(imgChangeHandler);
}

const replaceTweetData = (text, id_str, display_url, profile_image_url_https, name, screen_name, tweetSection, favorite_count, retweet_count) => {
  let tweetHtml = `
  <div class="tweet-card-wrapper">
    <p class="tweet-text">${text}</p>
    <img src="${display_url}" alt="" class="tweet-media" />
    <div class="profile">
      <img src="${profile_image_url_https}" alt="" class="profile-img" />
      <div class="profile-info">
        <h3 class="name">${name}</h3>
        <h4 class="screen-name">@${screen_name}</h4>
      </div>
    </div>
    <div class="tweet-action-btn-box">
      <a href="https://twitter.com/intent/tweet?in_reply_to=${id_str}" target="_blank" title="reply">
        <i class="fas fa-reply"></i>
      </a>
      <a href="https://twitter.com/intent/retweet?tweet_id=${id_str}" target="_blank" title="retweet">      
        <i class="fas fa-retweet"></i> ${retweet_count}
      </a>
      <a href="https://twitter.com/intent/favorite?tweet_id=${id_str}" target="_blank" title="like">
        <i class="far fa-heart"></i> ${favorite_count}
      </a>
    </div>
  </div>`


  tweetSection.insertAdjacentHTML('beforeend', tweetHtml)
}

const LOCAL_URL = "http://localhost:8080/api/twitter/users-timeline"
const HOSTED_URL = "https://dev-dot-kp-vanilla.el.r.appspot.com/api/twitter/users-timeline"

function tweetTimeline() {
  const tweetSection = document.querySelector(".tweet-section");

  let tweets = "";
  fetch(LOCAL_URL)
    .then(async response => {
      tweets = await response.json()
      console.log(tweets)
      tweets.map(data => {
        let { text, id_str, in_reply_to_screen_name, favorite_count, retweet_count } = data;
        const media_url_https = data.entities.media && data.entities.media[0].media_url_https;
        // console.log(media_url_https)
        const { id, name, screen_name, profile_image_url_https } = data.user;
        if (!in_reply_to_screen_name) {
          text = linkify(text);
          replaceTweetData(text, id_str, media_url_https, profile_image_url_https, name, screen_name, tweetSection, favorite_count, retweet_count)

        }
      })

    })
}

function linkify(text) {
    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });
}

init();
changeHeroImg();
tweetTimeline()