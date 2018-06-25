export const createClient = () => ({
    ooc_name: "Name",

    /**
     * Everything below here relies on protocol implementation.
     */

    disconnect: () => {
        throw 'disconnect not implemented.'
    },

    sendMessage: (msg) => {
        throw 'sendMessage not implemented.'
    }
});