/* jshint node: true */

'use strict';

function usage() {
    console.log('usage: node hours-from-pieces.js <NUMBER OF PIECES> [PIECE DURATION] [INTERLUDE DURATION]');
}

function main() {
    let args, pieces, duration, silence, time;

    args = process.argv.slice(2);

    if (args.length < 1 || args[0].includes('help') || args[0].includes('-h')) {
        usage();
        process.exit();
    }

    [pieces, duration, silence] = args;

    duration = duration ? parseInt(duration, 10) : 15;
    silence = silence ? parseInt(silence, 10) : 2;

    time = Math.round((duration * pieces) + (silence * (pieces - 1)));

    console.log(`pieces: ${pieces}`);
    console.log(`piece duration: ${duration} minutes`);
    console.log(`interludes: ${pieces - 1}`);
    console.log(`interlude duration: ${silence} minutes`);
    console.log('---');
    console.log(`total duration: ${time} minutes (${time/60} hours)`);
}

main();
