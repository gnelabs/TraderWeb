DEPRECATED

## Installation

### Cloning package

This assumes you have git installed.

``` bash
# clone the repo
$ git clone https://github.com/gnelabs/TraderWeb.git TraderWeb

# go into the project directory and install app's dependencies
$ npm install
```

### Testing and Debugging

``` bash
# Run tests to make sure it will compile. Thats all the tests do, but its an easy way to check project-wide.
$ npm test
# Hit A for all tests. Q to quit once its ran.
```

This will run a dev server. CoreUI must have this built in somewhere as a dependency.
Make sure you have SSH'd to your EC2 dev instance with -L 3000:localhost:3000 to forward the port.

``` bash
# dev server  with hot reload at http://localhost:3000
$ npm start
```

### Building for production

Run `build` to build the project. The build artifacts will be stored in the `build/` directory. CoreUI must have webpack setup.

```bash
# build for production with minification
$ npm run build
```


