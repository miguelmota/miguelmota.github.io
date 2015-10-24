sudo rm !$

! is the default history expander
!$ will be replaced during shell expansion by the argument of the last command

rm -r $1
will become
rm -f *.log
because preceded by ls *.log


cd /private/var/log/asl/
ls *.asl
sudo rm !$
