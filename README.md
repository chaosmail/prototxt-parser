# Prototxt-Parser

Parse `*.prototxt` files to JavaScript objects.

## Usage Browser

```html
<script src="prototxt-parser.min.js"></script>

<script>

  function fetchText(uri) {
    return fetch(new Request(uri)).then(function(res){
      return res.text();
    });
  }

  var uri = "https://rawgit.com/DeepScale/SqueezeNet/master/SqueezeNet_v1.1/deploy.prototxt";
  
  var proto;

  fetchText(uri).then(function(str){
    proto = parsePrototxt(str);
    console.log(proto);
  });

</script>
```

## Usage Typescript

```typescript
import { parsePrototxt } from 'prototxt-parser';

function fetchText(uri: string) : Promise<string> {
  return fetch(new Request(uri)).then((res) => res.text());
}

let proto: Object;

fetchText(uri).then(function(str){
  proto = parsePrototxt(str);
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