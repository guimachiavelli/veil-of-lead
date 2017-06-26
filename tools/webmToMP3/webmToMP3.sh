#!/usr/bin/env bash

while [[ $# -gt 1 ]]
do
key="$1"

case $key in
    -i|--input)
    INPUT="$2"
    shift # past argument
    ;;
    -e|--extension)
    EXTENSION="$2"
    shift # past argument
    ;;
    -o|--output)
    OUTPUT="$2"
    shift # past argument
    ;;

    *)
            # unknown option
    ;;
esac
shift # past argument or value
done

EXTENSION=${EXTENSION:-wav}
OUTPUT=${OUTPUT:-${INPUT}/converted}

echo $INPUT
echo $EXTENSION
echo $OUTPUT

for file in ${INPUT}*.mp3
do
    echo "${file}"
    DEST=${file##*/}
    ffmpeg -i "${file}" -ar 44100 -ac 1 -b:a 320k "${OUTPUT}/${DEST%.*}.${EXTENSION}"
done
