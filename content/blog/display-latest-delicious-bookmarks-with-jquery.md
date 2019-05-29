---
layout: blog-post
title: Display latest delicious bookmarks with jQuery
type: blog
tag: [JavaScript, jQuery, JSON, Delicious, demo]
description: Tutorial on how to display your latest Delicious bookmarks using jQuery.
date: 2011-10-11T00:00:00-00:00
draft: false
---
If you look below you see my three most recently saved bookmarks from (delicious)[http://delicious.com/miguelmota]:

<div class="highlight">
	<ul id="delicious-bookmarks"></ul>
	<div class="ajax-loader">fetching bookmarks...</div>
</div>

<script>
var niceTime = (function(){
	var ints = {
	second: 1,
	minute: 60,
	hour: 3600,
	day: 86400,
	week: 604800,
	month: 2592000,
	year: 31536000
	};
	return function(time){
	time = +new Date(time);
	var gap = ((+new Date()) - time) / 1000,
	amount, measure;
	for (var i in ints){
	if (gap > ints[i]){ measure = i; }
	}
	amount = gap / ints[measure];
	amount = gap > ints.day ? (Math.round(amount)) : Math.round(amount);
	amount += ' ' + measure + (amount > 1 ? 's' : '') + ' ago';
	return amount;
	};
})();
$.getJSON("http://feeds.delicious.com/v2/json/miguelmota?callback=?",
	{
	count: "3"
	},
	function(data){
		$.each(data, function(i, item){
			var title = item.d;
	      	var url = item.u;
	      	var date = item.dt;
	      	$("#delicious-bookmarks").append('<li>['+title+']('+url+') <time class="status-date">'+niceTime(date)+'<time></li>');
		});
		$(".ajax-loader").css("display","none");
	}
);
</script>

First let's create an empty unordered list with a div below it that will serve as a loader (if you want to get fancy, you can use
an animated loading gif):

```html
<ul id="delicious-bookmarks"></ul>
<div class="ajax-loader">fetching bookmarks...</div>
```

We are using the `$.getJSON()` function. Let's add our json request url and and then loop though the requested data with the `$.each()` function and get the
`title`, `url` and `date`. Then we are appending a list item to our unordered list that we created earlier which will include our variables.
So now after it complete the jquery, let's remove the loader:

```javascript
$.getJSON("http://feeds.delicious.com/v2/json/miguelmota?callback=?",
	{
	count: "3"
	},
	function(data){
		$.each(data, function(i, item){
			var title = item.d;
	      	var url = item.u;
	      	var date = item.dt;
	      	$("#delicious-bookmarks").append('<li>['+title+']('+url+') <time>'+niceTime(date)+'<time></li>');
		});
		$(".ajax-loader").css("display","none");
	}
);
```

But hold on, if we leave it like that, the date will show in ISO-8601 standard which will look like <script>var d = new Date().toISOString();</script>`<script>document.write(d);</script>`.
We want to display it as `time ago` so we will use [James Padolsey's "pretty-date" function](http://james.padolsey.com/javascript/recursive-pretty-date/).
Before the `$.getJSON()` function, add:

```javascript
var niceTime = (function(){
	var ints = {
	second: 1,
	minute: 60,
	hour: 3600,
	day: 86400,
	week: 604800,
	month: 2592000,
	year: 31536000
	};
	return function(time){
	time = +new Date(time);
	var gap = ((+new Date()) - time) / 1000,
	amount, measure;
	for (var i in ints){
	if (gap > ints[i]){ measure = i; }
	}
	amount = gap / ints[measure];
	amount = gap > ints.day ? (Math.round(amount)) : Math.round(amount);
	amount += ' ' + measure + (amount > 1 ? 's' : '') + ' ago';
	return amount;
	};
})();
```

Now include the `date` variable as the `niceTime()` function argument like so:

```javascript
<time class="date">'+niceTime(date)+'<time>
```

Obviously replace my username with yours and that's it!

I know there might be better ways of doing this, if so let us know in the comments!
