use table for bg
use nested tables for evertyhing else
use padding instead of margin (limited outlook support)
use no divs
inline everything, always, all styles, fonts
don't use thead,tbody only tr and td
use table attributes, then css attributes if not available (ie bgcolor, width=,align,border="0" cellpadding="0" cellspacing="0")
always use alt tag img

gmail strps style tag

use media queries for clients that do support them using classes and important

conditional comments for outlook
<!--[if mso]>
<![endif]>

<!--[if gte mso 12] && lt mso 15>
<![endif]>

word rendering engine renders line-height differently
<!--[if gte mso 12]>
<style>
td {
  mso-line-height-rule: exactly; // vendor property
  }
</style>
<![endif]>

outlook 2000 version 9
outlook 2002 version 10
outlook 2003 version 11
outlook 2007 version 12
outlook 2010 version 14
outlook 2013 version 15

in outlook 2013 if td is empty, it ignores set height, so use &nbsp;



mso-hide: all; // hide from mso

apple mail adds anchor tags to phone links, so wrap in span class and add a style tag a {}

<span class="client-link>951 </span>


apple mail renders font sizes smaller than 14px to 14px so add
````
-ms-text-size-adjust: none;
-webkit-text-size-adjust: none;
````
to prevent resize


on mobile, avoid zoom so add max-width and width100%

without media queries use table align="left" to stack inner tables on small sizes

Word or IE
<!--[if mso|(IE)]>
<![endif]-->


<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Championship Match!</title>
    <meta name="viewport" content="width=device-width" />
  </head>
<body style="margin: 0; padding: 0;">
</body>
</html>
