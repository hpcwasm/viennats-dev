# build instructions

## build boilerplate + dependnecies 
follow instructions

## active emscripten
```bash
export WASM_ROOT="/home/manstetten/github_vts"
${WASM_ROOT}/emsdk/emsdk activate --embedded 1.38.40-upstream # Make the "latest" SDK "active" for the current user ( this generates local .emscripten file) 
source "${WASM_ROOT}/emsdk/emsdk_env.sh"  # Activate PATH and other environment variables in the current session 
export EMCC_WASM_BACKEND=1
```

## compile vts

### native (openMP)
```bash
mkdir build && cd build
emcmake cmake -DBUILD_WASM=OFF -DBUILD_TBB=OFF  ..
```

### native (tbb)
```bash
mkdir build && cd build
emcmake cmake -DBUILD_WASM=OFF -DBUILD_TBB=ON  ..
```

### for wasm (without tbb)
```bash
mkdir buildwasm && cd buildwasm
emcmake cmake -DBUILD_WASM=ON -DBUILD_TBB=OFF ..
```

### for wasm (with tbb)
```bash
mkdir buildwasmtbb && cd buildwasmtbb
emcmake cmake -DBUILD_WASM=ON -DBUILD_TBB=ON ..
```