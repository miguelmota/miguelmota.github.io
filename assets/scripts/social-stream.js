(function() {
  'use strict';
  String.prototype.parseURL = function() {
    return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
      return '<a href="'+url+'" target="_blank">'+url+'</a>';
    });
  };

  String.prototype.parseUsername = function() {
    return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
      var username = u.replace("@","")
      return '<a href="http://twitter.com/'+username+'" target="_blank">'+u+'</a>';
    });
  };

  String.prototype.parseHashtag = function() {
    return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
      var tag = t.replace("#","%23")
      return '<a href="http://twitter.com/search?q='+tag+'" target="_blank">'+t+'</a>';
    });
  };

  var relativeDate = function (d, unix) {
    return d;
  };

  var streamDefaults = {
    count: 10,
    selectors: {
      delicious: '#delicious-stream',
      facebook: '#facebook-stream',
      foursquare: '#foursquare-stream',
      github: '#github-stream',
      instagram: '#instagram-stream',
      lastfm: '#lastfm-stream',
      stumbleupon: '#stumbleupon-stream',
      tumblr: '#tumblr-stream',
      twitter: '#twitter-stream',
      youtube: '#youtube-stream'
    },
    listClass: 'stream-list'
  };

  var stream = {

    load: {

      delicious: function (username, count, selector) {

        var
        _this = this,
        username = username || '',
        count = count || streamDefaults.count,
        selector = selector || streamDefaults.selectors.delicious,
        container = $(selector),
        list = $('<ul class="'+ streamDefaults.listClass +'"></ul>'),
        JSONURL = '//feeds.delicious.com/v2/json/'+ username +'?callback=?';

        $.getJSON(JSONURL,
          {
            count: count
          },
          function(data){

            $.each(data, function(i, item) {

              var
              title = item.d || '',
              url = item.u || '',
              date = item.dt || '',
              listItem = '<li><a href="'+ url +'" target="_blank">'+ title +'</a> <datetime datetime="'+ date +'">'+ relativeDate(date) +'</datetime></li>';

              list.append(listItem);

            });

            container.html(list);
          }
        );

      },

      facebook: function (username, count, selector) {

        var
        _this = this,
        username = username || '',
        count = count || streamDefaults.count,
        selector = selector || streamDefaults.selectors.facebook,
        container = $(selector),
        list = $('<ul class="'+ streamDefaults.listClass +'"></ul>'),
        JSONURL = '//graph.facebook.com/'+ username +'/feed&access_token=136918436443248|h21SkstVPoahrXI4sN5kh2A051k&callback=?';

        $.getJSON(JSONURL,
          function(data) {

            var limit = count;

            $.each(data.data, function(i, item) {
              if (i >= limit) {
                return false;
              }

              var
              post_id = item.id.substr(16),
              url = 'http://www.facebook.com/'+username;
              date = new Date(item.created_time).toUTCString(),
              post,
              link,
              caption,
              description,
              from,
              type,
              listItem;

              if (item.message) {
                post = item.message;
                url = url + '/posts/' + post_id;
              }

              if (item.story) {
                post = '<span>' + item.story + '</span>';
                url = url + '/allactivity';
              }

              if (item.link) {
                link = item.link;
              }
              if (item.caption) {
                caption = item.caption;
                post = post + '<span> | ' + caption + '</span>';
              }

              if (item.description) {
                description = item.description;
                post = post + '<span> - ' + description + '</span>';
              }

              if (item.to) {
                from = '<span>'+item.from.name + ':</span> ';
                post = from + post;
              }

              type = item.type;

              if (type == 'status') {
                type = 'text';
              } else if (type == 'link') {
                type = 'link';
              } else if (type == 'photo') {
                type = 'photo';
              } else if(type == 'video') {
                type = 'video';
              }

              listItem = '<li><a href="'+ url +'"" target="_blank"> '+ post +' <datetime datetime="'+ date +'">'+ relativeDate(date) +'</datetime></a></li>';

              list.append(listItem);

            });

            container.append(list);

          }
        );
      },

      foursquare: function (username, count, selector) {

        var
        _this = this,
        username = username || '',
        count = count || streamDefaults.count,
        selector = selector || streamDefaults.selectors.foursquare,
        container = $(selector),
        list = $('<ul class="'+ streamDefaults.listClass +'"></ul>'),
        JSONURL = '//api.foursquare.com/v2/users/'+ username +'/checkins?oauth_token=DATQU0DAPF0JA043XEXPOPH2FPHVQUM4YAEAQ0SRTWGZHQ43&v=20120522&callback=?';

        $.getJSON(JSONURL,
          function(data) {

            var limit = count;

            $.each(data.response.checkins.items, function(i, item) {

              if (i >= limit) {
                return false;
              }
              var
              name = item.venue["name"],
              city = item.venue["location"]["city"],
              state = item.venue["location"]["state"],
              url = 'https://foursquare.com/',
              date = item.createdAt,
              image,
              listItem;

              if (item.venue["url"]) {
                url = item.venue["url"];
              }

              image = item.venue["categories"][0]["icon"]["prefix"] + item.venue["categories"][0]["icon"]["sizes"][0] + item.venue["categories"][0]["icon"]["name"];

              listItem = '<li><img src="'+ image +
                '" alt=""> <a href="'+ url +'" target="_blank">'+ name +'</a> in '+ city +', '+ state +' <datetime datetime="'+ date +'">'+ relativeDate(date) + '</datetime></li>';

              list.append(listItem);

            });

            container.html(list);
          }
        );
      },

      github: function (username, count, selector) {

        var
        _this = this,
        username = username || '',
        count = count || streamDefaults.count,
        selector = selector || streamDefaults.selectors.github,
        container = $(selector),
        list = $('<ul class="'+ streamDefaults.listClass +'"></ul>'),
        JSONURL = 'https://github.com/'+ username +'.json?callback=?';

        $.getJSON(JSONURL,
          function(data) {

            var limit = count;

            $.each(data, function(i, item) {

              if (i >= limit) {
                return false;
              }

              var
              payloadHead = item.payload["head"],
              type = item["type"],
              repositoryName,
              repositoryURL,
              date,
              message,
              listItem;

              if (type == "PushEvent") {
                repositoryName = item.repository.name,
                repositoryURL = item.repository.url;
                date = item.repository.pushed_at;
                message = item.payload["shas"][0][2];
                listItem = '<li>Pushed "'+ message +'" to <a href="'+ repositoryURL +'" target="_blank">'+ repositoryName +'</a> <datetime datetime="'+ date +'">'+ relativeDate(date) +
                  '</datetime></li>';
              } else if (type == "PullEvent") {
                repositoryName = item.repository.name,
                repositoryURL = item.repository.url;
                listItem = '<li>Pulled <a href="'+ repositoryURL +'" target="_blank">'+ repositoryName +'</a> <datetime datetime="'+ date +'">'+ relativeDate(date) +
                  '</datetime></li>';
                listItem = 'adfa';
              } else if (type == "WatchEvent") {
                repositoryName = item.repository.name,
                repositoryURL = item.repository.url;
                date = item.created_at;
                listItem = '<li>Watched <a href="'+ repositoryURL +'" target="_blank">'+ repositoryName +'</a> <datetime datetime="'+ date +'">'+ relativeDate(date) +'</datetime></li>';
              } else  {
                listItem = '';
              }

              list.append(listItem);

            });

            container.html(list);

          }
        );
      },

      instagram: function (username, count, selector) {

        var
        _this = this,
        username = username || '',
        count = count || streamDefaults.count,
        selector = selector || streamDefaults.selectors.instagram,
        container = $(selector),
        list = $('<ul class="'+ streamDefaults.listClass +'"></ul>'),
        JSONURL = '//api.instagram.com/v1/users/37897377/media/recent?access_token=37897377.b530e2d.d7697e8cc7c74e25973697fe98746715';

        $.getJSON(JSONURL,
          function(data){
            $.each(data.data, function(i, item) {

              var
              caption = item.caption["text"],
              url = item.link,
              thumbnail = item.images["thumbnail"].url,
              likes,
              likesCount = item.likes["count"],
              date = item.created_time,
              listItem;

              listItem = '<li><a href="'+ url +'" target="_blank"><img src="'+ thumbnail +'" alt=""> '+
                caption +'</a> '+ likes +' <datetime datetime="'+ date +'">'+ relativeDate(date) +'</datetime></li>';

              list.append(listItem);

            });

            container.html(list);
          }
        );
      },

      lastfm: function (username, count, selector) {

        var
        _this = this,
        username = username || '',
        count = count || streamDefaults.count,
        selector = selector || streamDefaults.selectors.lastfm,
        container = $(selector),
        list = $('<ul class="'+ streamDefaults.listClass +'"></ul>'),
        JSONURL = '//ws.audioscrobbler.com/2.0/?callback=?';

        $.getJSON(JSONURL,
          {
            format: 'json',
            method: 'user.getRecentTracks',
            user: username,
            api_key: 'dc0e875b6c0fd8ac4891b0716897e6c1',
            limit: count
          },
          function(data){
            $.each(data.recenttracks.track, function(i, item) {

              var
              date = item.date['#text'] || '',
              url = item.url || '',
              name = item.name || '',
              artist = item.artist['#text'] || '',
              image = '/assets/images/social-stream/placeholder-34x34.png',
              listItem;

              if (item.image[0]['#text']) {
                image = item.image[0]['#text'];
              }

              listItem = '<li><img src="'+image+'" alt=""> <a href="'+ url +'" target="_blank">'+ name +'</a> by '+ artist +' <datetime datetime="'+ date +'">'+ relativeDate(date) +"</datetime></li>";

              list.append(listItem);

            });

            container.html(list);
          }
        );
      },

      stumbleupon: function (username, count, selector) {

        var
        _this = this,
        username = username || '',
        count = count || streamDefaults.count,
        selector = selector || streamDefaults.selectors.stumbleupon,
        container = $(selector),
        list = $('<ul class="'+ streamDefaults.listClass +'"></ul>'),
        URL = '//www.stumbleupon.com/rss/stumbler/miguelmota/likes',
        XMLURL = '//moogs.foodfail.org/proxy/contents?url='+URL;

        $.ajax({
          url: XMLURL,
          type: 'GET',
          dataType: 'text',
          success: function (data, textStatus, xhr) {

            var
            xmlDoc = $.parseXML(data),
            $xml = $( xmlDoc );

            $xml.find('item').each(function(i) {

              var
              _this = $(this),
              title = _this.find('title').text() || '',
              link = _this.find('link').text() || '',
              date = _this.find('pubDate').text() || '',

              listItem = '<li><a href="'+ link +'" target="_blank">'+ title +'</a> <datetime datetime="'+ date +'">'+ relativeDate(date) +"</datetime></li>";

              list.append(listItem);

            });

            container.html(list);

          }

        });

      },

      twitter: function (username, count, selector) {

        var
        _this = this,
        username = username || '',
        count = count || streamDefaults.count,
        selector = selector || streamDefaults.selectors.twitter,
        container = $(selector),
        list = $('<ul class="'+ streamDefaults.listClass +'"></ul>'),
        JSONURL = '//api.twitter.com/1/statuses/user_timeline.json?callback=?';

        $.getJSON(JSONURL,
          {
            include_entities: true,
            include_rts: true,
            screen_name: username,
            count: count
          },
          function(data){
            $.each(data, function(i, item) {

              var
              screenName = item.user.screen_name || '',
              text = item.text || '',
              id = item.id_str || '',
              date = item.created_at || '',
              listItem = '<li>'+ text.parseURL().parseUsername().parseHashtag() +' <datetime datetime="'+ date +'"><a href="http://twitter.com/'+ screenName +'/status/'+ id +
                '" target="_blank">'+ relativeDate(date) +"</a></datetime></li>";

              list.append(listItem);

            });

            container.html(list);
          }
        );
      },

      tumblr: function (username, count, selector) {

        var
        _this = this,
        username = username || '',
        count = count || streamDefaults.count,
        selector = selector || streamDefaults.selectors.tumblr,
        container = $(selector),
        list = $('<ul class="'+ streamDefaults.listClass +'"></ul>'),
        JSONURL = '//'+ username +'.tumblr.com/api/read/json?num='+ count +'&callback=?';

        $.getJSON(JSONURL,
          function(data){
            $.each(data.posts, function(i, item) {

              var
              date = this['date'] || '',
              url = this['url-with-slug'] || '',
              type = this.type || '',
              caption = this['photo-caption'] || '',
              title = this.slug.replace(/-/g,' ') || '',
              listItem;

              title = title.substring(0,1).toUpperCase() + title.substr(1,200);

              if (type == 'answer') {
                type = 'question';
              }

              if (type == null)
              {
                type = 'tumblr';
              }

              listItem = '<li><a href="'+ url +'" target="_blank">'+ title +'</a> <datetime datetime="'+ date +'">'+ relativeDate(date) +"</datetime></li>";


              list.append(listItem);

            });

            container.html(list);
          }
        );
      },

      youtube: function (username, count, selector) {

        var
        _this = this,
        username = username || '',
        count = count || streamDefaults.count,
        selector = selector || streamDefaults.selectors.youtube,
        container = $(selector),
        list = $('<ul class="'+ streamDefaults.listClass +'"></ul>'),
        JSONURL = '//gdata.youtube.com/feeds/api/users/'+ username +'/uploads?alt=json';

        $.getJSON(JSONURL,
          function(data){
            $.each(data.feed.entry, function(i, item) {

              var
              date,
              url,
              title,
              thumb,
              listItem;

              var titleKeys = Object.keys(item.title);
              for (var i = 0; i < titleKeys.length; i++) {
                if (i === 0) {
                  title = item.title[titleKeys[i]];
                }
              }

              var publishedKeys = Object.keys(item.title);
              for (var i = 0; i < publishedKeys.length; i++) {
                if (i === 0) {
                  date = item.published[publishedKeys[i]];
                }
              }

              var thumbKeys = Object.keys(item['media$group']['media$thumbnail']);
              for (var i = 0; i < thumbKeys.length; i++) {
                if (i === 0) {
                  thumb = item['media$group']['media$thumbnail'][thumbKeys[i]].url;
                }
              }

              var linkKeys = Object.keys(item.link);
              for (var i = 0; i < thumbKeys.length; i++) {
                if (i === 0) {
                  url = item.link[linkKeys[i]].href;
                }
              }

              listItem = '<li><img src="'+ thumb +'" alt=""> <a href="'+ url +'" target="_blank">'+ title +'</a> <datetime datetime="'+ date +'">'+ relativeDate(date) +"</datetime></li>";

              list.append(listItem);

            });

            container.html(list);
          }
        );
      }

    }

  };

  var usernames = {
    delicious: 'miguelmota',
    facebook: 'miguel.mota2',
    foursquare: '4418723',
    github: 'miguelmota',
    instagram: '__moogs',
    lastfm: 'miguel_mota',
    tumblr: 'miguelmota',
    twitter: '_moogs',
    youtube: 'mooooogs'
  }

  stream.load.delicious(usernames.delicious);
  //stream.load.facebook(usernames.facebook);
  stream.load.foursquare(usernames.foursquare);
  stream.load.github(usernames.github);
  //stream.load.instagram(usernames.instagram);
  stream.load.lastfm(usernames.lastfm);
  stream.load.tumblr(usernames.tumblr);
  stream.load.twitter(usernames.twitter);
  stream.load.stumbleupon(usernames.stumbleupon);
  stream.load.youtube(usernames.youtube);

})();
