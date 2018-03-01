rem  cordova build android --release
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore trikitools.keystore platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk trikitools
mv platforms\android\app\build\outputs\apk\release\Trikitools.apk platforms\android\app\build\outputs\apk\release\Trikitools.apk.old -f
d:\Android\sdk\build-tools\27.0.3\zipalign.exe -v 4 platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk platforms\android\app\build\outputs\apk\release\Trikitools.apk
