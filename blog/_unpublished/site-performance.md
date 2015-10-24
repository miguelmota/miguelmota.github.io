Add Expires http1.0 and Cache-Control 1.0 header to resources (max-age), doesn't make request
fingerprint (revving filenames) for cache busting
empty cache vs prime cache (browser cache) http doens't make request

mod_expires apache modules sets expires headers for you

Last-Modified
If-Last-Modified
browser asks server if should use browser cache version

use cdn
make fewer http requests, browwsers have limits, combine js and styl
use inline images such as svg or data
css sprites

comprssion, announce support using Accept-Encoding
servers identify compressed responsone using Content-Encoding
gzip is a free format and most popular and effective.
deflate is second most popular  but less popular.
browsers that suppport deflat also support gzip
compression html files and responses xml json, scripts, styles
not images or pdfs sinze theyere already compresses and can increase possible file size and waste cpu resources

apache module
mod_gzip_on
mode_gzip_item_include based on MIME type or file regex
mode_gzip_item_exclude

beware of proxy caching, ex first browser suppport gzip and server caches it but then second browser doesn't support.
Use Vary: Accept-Encoding on server respose header to vary caching based on compression support
mod_gzip adds header by default
ETags don't refect is gzip was used so proxies might srver wrong content

Keep-Alive suppport,
servers use the Connection: keep-alive header to indicate support
solves ineffiency of opening and closing multiple socket connections to the same server. For example an image server
browser can close by sending Connection: close

move stylesheets at the top in head so they are downloaded first and rendering isn't blocked.
with scripts progresssive rendering is blocked for all content below the script so move scripts lower in the page means more content is rendered progressively.
components below the script are blocked from being dowloaded
results in blank white screen

use external css and js becaue brwower cache thhem rather than inline
look at metrics for this

dynamic inlining - inline scripts and styles on frist request and then generate link a dnsource tags on onload. Then on second request check session coookie and inline link and scrip tag
