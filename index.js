const jsonParser = require('@apidevtools/json-schema-ref-parser');
const _ = require('lodash')
/**
 *
 * @param {*} schemaObject
 * @return {*} 
 * @description Flatten the json schema and keep a reference to the property path, and other metadata.
 */
const flatten = async (schemaObject) => {
    const result = {};
    const getKeyName = (prefix, key) => prefix ? `${prefix}.${key}` : key;

    const flattenHelperFn = (propertySchema, prefix, ref) => {
        const { type, properties, items, ...rest } = propertySchema;
        if (type === 'object' && properties) {
            for (let [key, value] of Object.entries(properties)) {
                flattenHelperFn(value, getKeyName(prefix, key), getKeyName(ref, `properties.${key}`));
            }
        } else if (type === 'array' && items) {
            if (['array', 'object'].includes(items?.type)) {
                flattenHelperFn(items, prefix, getKeyName(ref, `items`))
            } else {
                flattenHelperFn(items, prefix, ref)
            }
        } else {
            result[prefix] = { type, ref, ...rest };
        }
    }

    const deReferencedSchema = await jsonParser.dereference(schemaObject);
    flattenHelperFn(deReferencedSchema, "", "");
    return result;
}

/**
 *
 * @param {*} schemaObject
 * @param {*} ref
 * @description Delete the input path from the schema if it exists
 */
const remove = (schemaObject, ref) => {
    if (!_.get(schemaObject, ref)) {
        throw new Error('ref path does not exists')
    }

    delete schemaObject[ref]
}

/**
 *
 * @param {*} schemaObject
 * @param {*} ref
 * @param {*} updatePayload
 * @description Path the json schema at the specified path. Throw error if the path does not exists
 */
const update = (schemaObject, ref, updatePayload) => {
    //  update the json schema with the new payload
}


module.exports = {
    flatten,
    remove,
    update
}
