# "kick off"

rules of engagment doc
- when
- limits
- scope
- point of contacts (in case something breaks)


# Evidence gathering

report at the end of everything
"KeepNote" app
gropu things based on vulnerablilty

document:
- http req and res for each vuln
- any unscheduled downtime or issues
- changes in test data
  - creating of additonal accounts, passwords, client-provided data
  - get revelent , legible screenshot of vuln

don't share any hacks or data online, never

highlight specific part of code or screenshot that caused vuln

list all known affected pages and params for a vuln

have a methodology and checklist to go by during each assement
 -OWASP has g good methodology adn checklist
  helps to keep you on track

# Discovery / OSINT (open source intelligence)

- search engines, pastebin, shodanhq, recon-ng, etc for anything related to the application
   - this is manual and time-consuming process but very rewarding
   - might find db types, schemas, passwords, through forumsn, pastestbin etc

automated scanning
 - find low hanging fruit
 - wide range of tests, quickly

 - a vuln scan is NOT a penetration assement
 - even though scanners help, manula verification is required. use in conjection with manual testing

 automated scannerin
  - Nessus
     SSL/TLS
  - IBM App Scan
    -  CSRF XSS SQL
  - BurpSuite Pro
      - content spider, brute force
   - Nikto
     - find default pages, CGI teting
     - use outside of Nessus
    - WPScan for wordpress
  - OWASP DirBuster
   - find files and directories
  - Saint
  - Nexpose

verify settings of scanner
dont check of DOS unless requested by client

take it further than the scanner if posssible
- for exm, scanner suspects SQL injection. see if you find exploite with somthting like SQLMap

# Manual testing
review the server response to help verify what the server is running (ISS, APache)) in headers

try sql injecti on via get or post parameters

Try XSS, CSRF SQL/LDAP injection, Local File Inclusion (LFI), Remote File Inclusion (RFI)

  -Xenotix by OWASp is a XSS tester
  - save the post of reg request and execute with SQLMap to search for SQL Injectio
  o
  check for sensitive info being passed via parameters
  - look for  vaulable comments in the responses

  authentication, can it be bypassed or broken.
  - can you access urls and functions as an authenticated user that you could while logged in
  - can you resuse the sssion token after loggin off? is there a log off feature?
  - can you have mulutpole session as the same user at the sam time

    -are there strong password requirements
   -ca n you re-use a previous password?

  is there an admin portal available? (cPanel, Apache Tomcat Manager, etc)
    - try defualts
  look at the host, not just the webapp
   ie PUT, COPY, DELETE, TRACE
   - nmap for open ports

   Look at SSL/TLL for weak or untrusted certifications


-------
unrelaoted

public key (blueprint for a key) anyone can create it but only you can open it with private key
certivate authorizyt verifies server is who it says it is
