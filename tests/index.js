const fs = require('fs');
const inputJSONSchema = require('./data.json');
const { flatten, remove, update } = require('../index');

(async (schema) => {
    try {
        const flattenedResult = await flatten(schema);
        fs.writeFileSync('./output.json', JSON.stringify(flattenedResult));
    }
    catch (err) {
        console.error(err);
    }

})(inputJSONSchema)