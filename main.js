const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const PLAYER_STORAGE_KEY = '';
    const playlist = $('.playlist');
    const heading = $('header h2');
    const cdThumb = $('.cd-thumb');
    const audio = $('#audio');
    const play = $('.player');
    const cd = $('.cd');
    const playBtn = $('.btn-toggle-play');
    const progress = $('#progress');
    const width = cd.offsetWidth;
    const nextBtn = $('.btn-next');
    const preBtn = $('.btn-prev');
    const repeatBtn = $('.btn-repeat');
    const randomBtn = $('.btn-random');
    const currentTime = $('.current-time');
    const durationTime = $('.duration-time');
    var arrPlayed = [];
    const html = $('html');
    const check = $('#checkbox');
    //darkmode
    // check.addEventListener('change', function() {
    //   html.classList.toggle('dark');
    // });

    const app = {
      currentIndex: 0,
      isRandom: false,
      isPlaying: false,
      isRepeat: false,
      config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
      songs: [
        {
          name: 'Blueming',
          singer: 'IU',
          path: './assets/songs/Blueming-IU.mp3',
          image: './assets/img/blueming.jpg'
        },
        {
          name: 'Lilac',
          singer: 'IU',
          path: './assets/songs/lilac.mp3',
          image: './assets/img/lilac.jpg'
        },
        {
          name: 'Celebrity',
          singer: 'IU',
          path: './assets/songs/celebrity.mp3',
          image: './assets/img/celebrity.jpg'
        },
        {
          name: 'Lần cuối',
          singer: 'Ngọt',
          path: './assets/songs/lancuoi.mp3',
          image: './assets/img/lancuoi.jpg'
        },
        {
          name: 'Cho tôi lang thang',
          singer: 'Ngọt',
          path: './assets/songs/chotoilangthang.mp3',
          image: './assets/img/chotoilangthang.jpg'
        },
        {
          name: 'Tôi đi trú đông',
          singer: 'Ngọt',
          path: './assets/songs/toiditrudong.mp3',
          image: './assets/img/lancuoi.jpg'
        },
        {
          name: 'Cơn mer bâng quer',
          singer: 'Kiên',
          path: './assets/songs/conmerbangquer.mp3',
          image: './assets/img/conmerbangquer.jpg'
        },
        {
          name: 'Em ăn sáng chưa',
          singer: 'Kiên',
          path: './assets/songs/emansangchua.mp3',
          image: './assets/img/emansangchua.jpg'
        },
        {
          name: 'Quả tim màu lửa',
          singer: 'Kiên',
          path: './assets/songs/quatimmaulua.mp3',
          image: './assets/img/quatimmaulua.jpg'
        },
        {
          name: 'Em trang trí',
          singer: 'Ngọt',
          path: './assets/songs/emtrangtri.mp3',
          image: './assets/img/emtrangtri.jpg'
        },
       

      ],
      setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
      },

      defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
          get: function () {
            return this.songs[this.currentIndex]
          }
        })
      },

      convertTime: function (time, typeTime) {
        var s = parseInt(time % 60);
        var m = parseInt((time / 60) % 60);
        if (s >= 10 && m >= 10) typeTime.innerHTML = `${m}:${s}`;
        else if (s < 10 && m > 10) typeTime.innerHTML = `${m}:0${s}}`;
        else if (s < 10 && m < 10) typeTime.innerHTML = `0${m}:0${s}`;
        else if (s >= 10 && m < 10) typeTime.innerHTML = `0${m}:${s}`;
      },

      handleEvents: function () {
        _this = this;

        //xu li quay cd
        const cdThumbAnimate = cdThumb.animate([
          { transform: 'rotate(360deg)' }
        ], {
          duration: 10000,
          iterations: Infinity
        })


        cdThumbAnimate.pause();

        // xu li thu phong cd khi scroll

        document.onscroll = function () {
          const newWidth = width - document.documentElement.scrollTop;
          cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
          cd.style.opacity = newWidth / width;
        }

        //xu li khi click play
        playBtn.onclick = function () {
          if (_this.isPlaying) audio.pause();
          else audio.play();
        }

        audio.onplay = function () {
          _this.isPlaying = true;
          play.classList.add('playing');
          cdThumbAnimate.play();
        }
        audio.onpause = function () {
          _this.isPlaying = false;
          play.classList.remove('playing');
          cdThumbAnimate.pause();
        }

        //xu li khi bai hat dang chay
        audio.ontimeupdate = function () {

          //xu li thanh hien thi thoi gian
          if (audio.duration) {
            const progressPercent = Math.floor(audio.currentTime * 100 / audio.duration);
            progress.value = progressPercent;
          }

          //xu li hien thi thoi gian hien tai cua bai hat
          _this.convertTime(audio.currentTime, currentTime);
        }

        //xu li hien thi thoi gian bai hat
        audio.oncanplay = function () {
          _this.convertTime(audio.duration, durationTime);
        }

        //xu li tua
        progress.oninput = function (e) {
          const timeSeek = audio.duration * e.target.value / 100;
          audio.currentTime = timeSeek;
        }

        //xu li tu dong chuyen bai khi het bai cu~
        audio.onended = function () {
          if (_this.isRepeat) {
            cdThumbAnimate.cancel();
            _this.loadCurrentSong();
            audio.play();
            _this.scrollToActiveSong();
          } else
            nextBtn.click();
        }

        //xu li nut phat bai tiep theo
        nextBtn.onclick = function () {
          if (_this.isRandom) {
            cdThumbAnimate.cancel();
            _this.randomSong();
            audio.play();
            _this.scrollToActiveSong();
          } else {
            cdThumbAnimate.cancel();
            _this.nextSong();
            audio.play();
            _this.scrollToActiveSong();
          }
        }

        //xu li phat bai truoc
        preBtn.onclick = function () {
          if (_this.isRandom) {
            cdThumbAnimate.cancel();
            _this.randomSong();
            audio.play();
            _this.scrollToActiveSong();
          } else {
            cdThumbAnimate.cancel();
            _this.preSong();
            audio.play();
            _this.scrollToActiveSong();
          }
        }

        //xu li nut repeat
        repeatBtn.onclick = function () {
          _this.isRepeat = !_this.isRepeat;
          _this.setConfig('isRepeat', _this.isRepeat);
          repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        randomBtn.onclick = function () {
          _this.isRandom = !_this.isRandom;
          _this.setConfig('isRandom', _this.isRandom);
          randomBtn.classList.toggle('active', _this.isRandom);
        }

        //chon bai hat va render ra man hinh

        playlist.onclick = function (e) {
          const songNode = e.target.closest('.song:not(.active)');
          if (songNode && !e.target.closest('.option')) {
            cdThumbAnimate.cancel();
            _this.scrollToActiveSong();
            _this.currentIndex = songNode.dataset.index;
            _this.loadCurrentSong();
            audio.play();
          }
        }
        // const allSongs = $$('.song');
        // allSongs.forEach(function(song, index) {
        //   song.onclick = function() {
        //     cdThumbAnimate.cancel();
        //     _this.currentIndex = index;
        //     _this.loadCurrentSong();
        //     audio.play();
        //   }
        // })

      },

      scrollToActiveSong: function () {
        setTimeout(() => {
          $(".song.active").scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 300);
      },

      loadCurrentSong: function () {
        //render
        this.setConfig('currentIndex', this.currentIndex);
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

        //active
        const allSongs = $$('.song');
        allSongs.forEach(function (song) {
          song.classList.remove('active');
        })
        allSongs[this.currentIndex].classList.add('active');
      },

      loadConfig: function () {
        this.isRandom = this.config.isRandom;
        randomBtn.classList.toggle('active', this.isRandom);

        this.isRepeat = this.config.isRepeat;
        repeatBtn.classList.toggle('active', this.isRepeat);

        if (this.config.currentSong) {
          this.currentIndex = this.config.currentIndex;
          this.scrollToActiveSong();
        }
      },

      nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) this.currentIndex = 0;
        this.loadCurrentSong();
      },

      preSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) this.currentIndex = this.songs.length - 1;
        this.loadCurrentSong();
      },

      randomSong: function () {
        do {
          var isPlayed = false;
          this.currentIndex = Math.floor(Math.random() * this.songs.length);
          for(let i = 0; i <= arrPlayed.length; i++) {
            if(arrPlayed[i] === _this.currentIndex){
              isPlayed = true;
            }
          };
        } while (isPlayed || endIndex === this.currentIndex);
        arrPlayed.push(this.currentIndex);
        if(arrPlayed.length == this.songs.length) arrPlayed = []
        var endIndex = this.currentIndex;
        this.loadCurrentSong();
      },

      // handleTime: function (time) {
      //   if(time < 60) 
      // },

      render: function () {
        const html = this.songs.map((arr, index) => {
          return `<div class="song" data-index="${index}">
                <div class="thumb" style="background-image: url('${arr.image}')">
                </div>
                <div class="body">
                  <h3 class="title">${arr.name}</h3>
                  <p class="author">${arr.singer}</p>
                </div>
                <div class="option">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`;
        })
        playlist.innerHTML = html.join('');

        // this.loadCurrentSong();
      },


      start: function () {
        this.loadConfig();

        //render bai hat ra screen
        this.render();

        //dinh nghia cac thuoc tinh cho object
        this.defineProperties();

        // lang nghe, xu li su kien (DOM events)
        this.handleEvents();


        //tai thong tin bai hat dau tien vao UI
        this.loadCurrentSong();


      },
    }
    app.start();