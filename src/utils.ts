/**
 * shorten stellar address.
 *
 * achieved by showing the first and last six characters dividen by ...
 * e.g., GA5ZSE…K4KZVN
 *
 * @param address
 */
export function shortenAddress(address: string) {
    return address.slice(0, 6) + "..." + address.slice(50, 56)
}

export function updateClipboard(newClip) {
    navigator.clipboard.writeText(newClip).then(function() {
        /* clipboard successfully set */
    }, function() {
        /* clipboard write failed */
    });
}