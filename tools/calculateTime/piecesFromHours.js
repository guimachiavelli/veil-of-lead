/* jshint node: true */

'use strict';

function usage() {
    console.log('usage: node pieces-from-hours.js <HOURS> [PIECE DURATION] [INTERLUDE DURATION]');
}

function main() {
    let args, hours, time, duration, silence, pieces, total;

    args = process.argv.slice(2);

    if (args.length < 1 || args[0].includes('help') || args[0].includes('-h')) {
        usage();
        process.exit();
    }

    [time, duration, silence] = args;

    hours = time;
    time = time * 60;
    duration = duration ? parseInt(duration, 10) : 15;
    silence = silence ? parseInt(silence, 10) : 2;

    pieces = Math.round((time - silence)/(duration + silence));
    total = (duration * pieces) + (silence * (pieces - 1));

    console.log(`hours to fill: ${hours} hours`);
    console.log(`composition duration: ${duration} minutes`);
    console.log(`interlude duration: ${silence} minutes`);
    console.log('---');
    console.log(`pieces needed: ${pieces} pieces`);
    console.log(`total length: ${total} minutes (${total/60} hours)`);

}

main();
