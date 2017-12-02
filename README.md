[![Build Status](https://travis-ci.org/chaosmail/prototxt-parser.svg?branch=master)](https://travis-ci.org/chaosmail/prototxt-parser)

# Prototxt-Parser

Parse `*.prototxt` files to JavaScript objects.

## Usage Browser

```html
<script src="https://unpkg.com/prototxt-parser"></script>
<script>

  function fetchText(uri) {
    return fetch(new Request(uri)).then(function(res){
      return res.text();
    });
  }

  var uri = "https://rawgit.com/DeepScale/SqueezeNet/master/SqueezeNet_v1.1/deploy.prototxt";
  
  var proto;
  fetchText(uri).then(function(str){
    proto = prototxtParser.parse(str);
    console.log(proto);
  });

</script>
```

## Usage Typescript

```typescript
import * as prototxtParser from 'prototxt-parser';

function fetchText(uri: string) : Promise<string> {
  return fetch(new Request(uri)).then((res) => res.text());
}

let proto: Object;

fetchText(uri).then(function(str){
  proto = prototxtParser.parse(str);
  console.log(proto);
});

```

## Development

```sh
# Install dependencies
npm install

# Build the JS file and TS declaration
npm run build

# Run the tests
npm run test
```


## License

The software is provided under MIT license.