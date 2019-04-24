# how to build the viennats webassembly fork

## 1. get & build LLVM_WASM_BACKEND
->
## 2. get & configure emscripten
->
## 3. build boost for wasm
->
## 4. build vtk for wasm
->
## 5. compile viennats webassembly

```bash
export VIENNATS_BASE_DIR=/home/manstetten/github_hpcwasm/viennats-dev
export VIENNATS_WEBAPP_DIR=/home/manstetten/github_hpcwasm/viennats-webapp

# for emscripten
export HPCWASM_BASE_DIR=/home/manstetten/ProgramsDev/hpcwasm
export HPCWASM_BASE_DIR_EMSDK=$HPCWASM_BASE_DIR/emsdk
export EM_CONFIG=$HPCWASM_BASE_DIR_EMSDK/.emscripten
source $HPCWASM_BASE_DIR_EMSDK/emsdk_env.sh
```

```bash
mkdir -p $VIENNATS_BASE_DIR/buildwasm
cd $VIENNATS_BASE_DIR/buildwasm

emcmake cmake -DBUILD_WASM=ON -DCMAKE_INSTALL_PREFIX=$VIENNATS_WEBAPP_DIR/src/assets/buildwasm/ ..
```

## 6. compile viennats (build)
```bash
mkdir -p $VIENNATS_BASE_DIR/build
cd $VIENNATS_BASE_DIR/build

cmake -DBUILD_WASM=OFF ..

```
