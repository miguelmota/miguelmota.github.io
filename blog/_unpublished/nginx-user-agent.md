location ~ ^/invite/([0-9A-Za-z]+)$ {
  set $code $1
  set $redirect_url https://app.acorns.com/invite/$1;
  if ($http_user_agent ~* (iPhone|iPad|iPod)) {
    set $redirect_url https://app.adjust.com/jo5g1a?label=$1;
  }
  if ($http_user_agent ~* Android) {
    set $redirect_url https://app.adjust.com/63xy0s?label=$1;
  }
  return 302 $redirect_url;
}

~* means its case insensitive
location ~* /faq {}

