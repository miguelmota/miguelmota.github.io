
[look at repo]


avoid *sparse* arrays (arrays with holes)
*dense* arrays, array with values from 0 to length, are optimized


Javascript is fast. Unbelievably, mind bendingly, blisteringly fast.
DOM manipulation is slow. Incredibly, mind numbingly, agonizingly slow.
Don't confuse the two!
Don't manipulate the DOM interspersed in your JS algorithms.
Don't keep your data on the DOM.
If you HAVE to interact with the DOM, take your element off the page first. Manipulate it in the ether. Then put it back on. If you do this without using async callbacks (timers, ajax, etc.), it won't flicker the page

http://ericleads.com/2013/04/youre-optimizing-the-wrong-things/

timeslicing


bitshifting num >> 0 instead of parseInt 9x faster
