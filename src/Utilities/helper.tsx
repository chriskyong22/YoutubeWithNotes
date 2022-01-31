
interface sameType<S> {
    (value: S): S;
}

interface twoTypes<I, O> {
    (input: I): O;
}

const enum secondConversions {
    hour = 3600,
    minute = 60,
    millisecond = 1000
}

/**
 * Return a HH-MM-SS or a MM-SS timestamp,
 * depending if the seconds are more than an hour.
 * @param seconds the seconds
 * @returns HH-MM-SS or MM-SS timestamp
 */
export const getTimestamp: twoTypes<number, string> = (seconds) => {
    // console.log(seconds);
    if (seconds < secondConversions.hour) {
        return new Date(seconds * secondConversions.millisecond).toISOString().substr(14, 5);
    } else {
        return new Date(seconds * secondConversions.millisecond).toISOString().substr(11, 8);
    }
}