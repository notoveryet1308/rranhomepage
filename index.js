
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
    workSection.style.height = `${workTitle.clientHeight + workDisplay.clientHeight + 550}px`;
  } else {
    workSection.style.height = "592px"
  }
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 1200) {
    workSection.style.height = `${workTitle.clientHeight + workDisplay.clientHeight + 550}px`;
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
  if ((600 < screenSize) && (screenSize < 1336)) {

    coverImages["980"].map(data => {
      let cvImg = new Image();
      cvImg.src = data;
      images.push(cvImg)
    })
    wrapper.style.backgroundImage = `url(${images[0].src})`
  }
  if (screenSize >= 1366) {

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

const replaceTweetData = (text, id_str, display_url, profile_image_url_https, name, screen_name, tweetSection, favorite_count, retweet_count, type, video_url, tweet_url) => {

  let media = "";

  if(type === "photo"){
    media = ` <img src=${display_url} alt="" class="tweet-media" />`
  }else if(type === "video"){
    media = `<video src=${video_url} type='video/mp4' controls></video>`
  }
  
  let tweetHtml =  `
  <div class="tweet-card-wrapper">
   <div class="content">
    <p class="tweet-text">${text}</p>
    ${media}
    <div class="profile">
      <img src="${profile_image_url_https}" alt="" class="profile-img" />
      <div class="profile-info">
        <h3 class="name">${name}</h3>
        <h4 class="screen-name">@${screen_name}</h4>
      </div>
    </div>
    <div class="tweet-action-btn-box">
    <div class="action-btns">
      <a href="https://twitter.com/intent/tweet?in_reply_to=${id_str}" target="_blank" title="reply">
        <i class="ph-arrow-bend-down-left"></i>
      </a>
      <a href="https://twitter.com/intent/retweet?tweet_id=${id_str}" target="_blank" title="retweet">      
        <i class="ph-repeat"></i> <span class="number">${retweet_count}</span>
      </a>
      <a href="https://twitter.com/intent/favorite?tweet_id=${id_str}" target="_blank" title="like">
        <i class="ph-heart"></i> <span class="number">${favorite_count}</span>
      </a>
      </div>
      <div class="twitter-logo">
        <i class="ph-twitter-logo-fill"></i>
      </div>
    </div>
    </div>
  </div>`

  tweetSection.insertAdjacentHTML('beforeend', tweetHtml)
}

const LOCAL_URL = "http://localhost:8080/api/twitter/users-timeline"
const HOSTED_URL = "https://dev-dot-kp-vanilla.el.r.appspot.com/api/twitter/users-timeline"

function tweetTimeline() {
  const tweetSection = document.querySelector(".tweet-section");

  let tweets = "";
  fetch(HOSTED_URL)
    .then(async response => {
      tweets = await response.json()
      console.log(tweets)
      tweets.map(data => {
        
        let tweet_url="";
        let { text, id_str, in_reply_to_screen_name, favorite_count, retweet_count, type, media_url_https, video_info, video_url } = extractData(data);


        let { id, name, screen_name, profile_image_url_https } = data.user;

        if (!in_reply_to_screen_name) {
          text = linkify(text, tweet_url);
          text = hashtagify(text)
          replaceTweetData(
            text,
            id_str,
            media_url_https,
            profile_image_url_https,
            name,
            screen_name,
            tweetSection,
            favorite_count,
            retweet_count,
            type,
            video_url,
            tweet_url
          )

        }
      })

      resizeAllGridItems();
      window.addEventListener("resize", resizeAllGridItems);
    })
    .catch(err => console.log(err))
}

function linkify(text, tweet_url) {
  let urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return text.replace(urlRegex, function (url) {
    tweet_url = url
    return '<a class="tweet-link" href="' + url + '" target="_blank">' + url + '</a>';
  });
}

function hashtagify(text) {
  let urlRegex = /(^|\s)(#[a-z\d-]+)/ig;
  return text.replace(urlRegex, (hashTag) => {
    // console.log(typeof hashTag)
    let tag = `${hashTag}`;
    tag = tag.slice(1)
    // console.log(tag.slice(1))
    return `<a href="https://twitter.com/search?q=%23${tag.slice(1)}" target="_blank" class="hashtag">${hashTag}</a>`;
  })
}

function extractData(data) {
  let { text, id_str, in_reply_to_screen_name, favorite_count, retweet_count } = data;
  const { id, name, screen_name, profile_image_url_https } = data.user;

  let video_info = "";
  let type = "";
  let media_url_https = "";
  let video_url = "";

  if (data.extended_entities) {
    video_info = data.extended_entities.media["0"].video_info;
    media_url_https = data.extended_entities.media["0"].media_url_https;
    type = data.extended_entities.media["0"].type;
  }

  if (video_info) {
    video_url = video_info.variants[0].url;
  }

  return { text, id_str, in_reply_to_screen_name, favorite_count, retweet_count, video_info, type, media_url_https, video_info, video_url };

}

function resizeGridItem(item) {
  let grid = document.getElementsByClassName("grid")[0];
  let rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
  let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
  let rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));

  item.style.gridRowEnd = "span " + rowSpan;
}

function resizeAllGridItems() {

  let tweetCards = document.getElementsByClassName("tweet-card-wrapper");

  let x;
  for (x = 0; x < tweetCards.length; x++) {
    resizeGridItem(tweetCards[x]);
  }

}

function resizeInstance(instance) {
  let item = instance.elements[0];
  resizeGridItem(item);
}

init();
changeHeroImg();
tweetTimeline()
