# build instructions

## build dependencies & boilerplate ()
follow instructions in boilerplate repo


## active emscripten environment
```bash
export HPCWASM_BASE_DIR_BOILERPLATE=/home/manstetten/github_hpcwasm/boilerplate
export HPCWASM_LIB_DIR_BOOST=$HPCWASM_BASE_DIR_BOILERPLATE/boost/lib/emscripten
export HPCWASM_INCLUDE_DIR_BOOST=$HPCWASM_BASE_DIR_BOILERPLATE/boost
export HPCWASM_CONFIG_DIR_VTK=$HPCWASM_BASE_DIR_BOILERPLATE/vtk/install/lib/cmake/vtk-8.1
source "$HPCWASM_BASE_DIR_BOILERPLATE/emsdk/emsdk_env.sh"
```
# build

```bash
export VIENNATS_BASE_DIR=/home/manstetten/github_hpcwasm/viennats-dev
export VIENNATS_WEBAPP_DIR=/home/manstetten/github_hpcwasm/viennats-webapp
mkdir -p $VIENNATS_BASE_DIR/buildwasm
cd $VIENNATS_BASE_DIR/buildwasm
export EMCC_DEBUG=1 # shows helpfull console output
emcmake cmake -DBUILD_WASM=ON -DVIENNATS_STATIC_BUILD=ON  ..
emcmake cmake -DBUILD_WASM=ON -DVIENNATS_STATIC_BUILD=ON -DCMAKE_INSTALL_PREFIX=$VIENNATS_WEBAPP_DIR ..
```