# json-schema-flat
json-schema-flat is designed to flatten a json-schema object while keeping all its internal references. It even exposed API to delete and patch property schemas.
It can even parse a JSON Schema with $ref pointers to other files and/or URLs.

# Contributing & bugs
Please fork the repository, make the changes in your fork and include tests. Once you're done making changes, send in a pull request.

#### Bug reports
Please include a test which shows why the code fails.

## Installation
``` sh
npm i json-schema-flat
```

## Usage
``` sh
const jsonFlattener = require('json-schema-flat')

const schema = {
    "$id": "https://example.com/arrays.schema.json",
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "description": "A representation of a person, company, organization, or place",
    "type": "object",
    "properties": {
        "fruits": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "vegetables": {
            "type": "array",
            "items": { "$ref": "#/$defs/veggie" }
        }
    },
    "$defs": {
        "veggie": {
            "type": "object",
            "required": ["veggieName", "veggieLike"],
            "properties": {
                "veggieName": {
                    "type": "string",
                    "description": "The name of the vegetable."
                },
                "veggieLike": {
                    "type": "boolean",
                    "description": "Do I like this vegetable?"
                }
            }
        }
    }
};

(async () => {
    const response = await jsonFlattener.flatten(schema)
    console.log(response);
})()
```

## Output

```json
{
  fruits: { type: 'string', ref: 'properties.fruits' },
  'vegetables.veggieName': {
    type: 'string',
    ref: 'properties.vegetables.items.properties.veggieName',
    description: 'The name of the vegetable.'
  },
  'vegetables.veggieLike': {
    type: 'boolean',
    ref: 'properties.vegetables.items.properties.veggieLike',
    description: 'Do I like this vegetable?'
  }
}
```