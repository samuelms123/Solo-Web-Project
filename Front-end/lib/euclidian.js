/**
 *
 * @param {number[]} start geoJSON point 1
 * @param {number[]} finish geoJSON point 2
 * @returns distance between point 1 - 2
 */

export function distance(start, finish) {
  return Math.sqrt(
    Math.pow(finish[0] - start[0], 2) + Math.pow(finish[1] - start[1], 2)
  );
}
