module.exports = {
    /**
     *
     * @param {*} val
     */
    log(val) {
        console.log(val);
        return val;
    },

    /**
     *
     * @param {*} list
     */
    getValues(list) {
        return list.values.map(_ => _.pop());
    },

    /**
     *
     * @param {*} values
     */
    addDate(values) {
        values.unshift((new Date()).toString());
        return values;
    }
};
