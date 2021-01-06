@echo off
setLocal EnableDelayedExpansion

for /F "tokens=*" %%I in ('dir /L /B /s') do (
	set f=%%I
	set f=!f:%%~dpI=!
	ren "%%I" "!f!"
	echo "%%I" "!f!"
)

echo "Done!"

setLocal DisableDelayedExpansion