cd website || exit
npm run build --prod

rm -r ../esp8266/data
mkdir ../esp8266/data
cp dist/website/browser/* ../esp8266/data
