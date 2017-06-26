#!/usr/bin/env bash

while [[ $# -gt 1 ]]
do
key="$1"

case $key in
    -i|--input)
    INPUT="$2"
    shift # past argument
    ;;

    *)
            # unknown option
    ;;
esac
shift # past argument or value
done

FILES=''
TONE="tone.mp3"

for file in ${INPUT}/*.mp3
do
    echo $file
    FILES+="${file}|${TONE}|"
done

echo $FILES

ffmpeg -i concat:"${FILES}" -ar 44100 -ac 2 -b:a 320k "final.mp3"
