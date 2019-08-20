# build instructions

## build dependencies & boilerplate ()
follow instructions in boilerplate repo

## set folders
```bash
export HPCWASM_BASE_DIR_BOILERPLATE=/home/manstetten/github_hpcwasm/boilerplate
export            VIENNATS_BASE_DIR=/home/manstetten/github_hpcwasm/viennats-dev
export          VIENNATS_INSTALL_DIR=/home/manstetten/github_hpcwasm/viennats-webapp/src/assets/buildwasm

export HPCWASM_BASE_DIR_EMSDK=$HPCWASM_BASE_DIR_BOILERPLATE/emsdk
```


## active emscripten 
```bash
$HPCWASM_BASE_DIR_EMSDK/emsdk activate --embedded latest-upstream # creates fresh  ./emscripten
source "$HPCWASM_BASE_DIR_EMSDK/emsdk_env.sh" # sets paths
# change WASM backend to WASM_LLVM_BACKEND by replacing string in ./emscripten
sed -i "/LLVM_ROOT =/c\LLVM_ROOT = '$HPCWASM_BIN_DIR_LLVM'" $HPCWASM_BASE_DIR_EMSDK/.emscripten 
export EMCC_DEBUG=1 # shows helpfull console output
emcc -v # check config
```

# build viennats-dev (wasm)

```bash

# external include and link folders
export HPCWASM_LIB_DIR_BOOST=$HPCWASM_BASE_DIR_BOILERPLATE/boost/lib/emscripten
export HPCWASM_INCLUDE_DIR_BOOST=$HPCWASM_BASE_DIR_BOILERPLATE/boost
export HPCWASM_CONFIG_DIR_VTK=$HPCWASM_BASE_DIR_BOILERPLATE/vtk/install/lib/cmake/vtk-8.1

mkdir -p $VIENNATS_BASE_DIR/buildwasm
cd $VIENNATS_BASE_DIR/buildwasm

# emcmake cmake -DBUILD_WASM=ON -DVIENNATS_STATIC_BUILD=ON  ..
emcmake cmake -DBUILD_WASM=ON -DVIENNATS_STATIC_BUILD=ON -DCMAKE_INSTALL_PREFIX=$VIENNATS_INSTALL_DIR ..
emcmake cmake -DBUILD_WASM=ON -DBUILD_TBB=ON ..
```