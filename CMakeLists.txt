# Required CMake Version
###############



cmake_minimum_required(VERSION 3.4)



# WebAssembly Config for emscripten
###############
set(BUILD_WASM false CACHE BOOL "build webassembly")
set(BUILD_WASM_STANDALONE false CACHE BOOL "build webassembly standalone")
set(BUILD_TBB false CACHE BOOL "build tbb, no omp")

IF(NOT BUILD_TBB)
  set(BUILD_DIR_NAME "build")
ELSE(NOT BUILD_TBB)
  set(BUILD_DIR_NAME "buildtbb")
ENDIF(NOT BUILD_TBB)

IF(BUILD_WASM)
  # set(WASM_BOOST_LIB_DIR "$ENV{HPCWASM_LIB_DIR_BOOST}")
  # set(WASM_BOOST_INCLUDE_DIR "$ENV{HPCWASM_INCLUDE_DIR_BOOST}")
  # set(WASM_VTK_CMAKE_DIR "$ENV{HPCWASM_CONFIG_DIR_VTK}")  
  set(WASM_ROOT "/home/manstetten/github_vts")
  add_definitions(-DBUILD_WASM)
  add_definitions(-D_WASM)
  IF(NOT BUILD_TBB)
    set(BUILD_DIR_NAME "buildwasm")
  ELSE(NOT BUILD_TBB)
    set(BUILD_DIR_NAME "buildwasmtbb")
  ENDIF(NOT BUILD_TBB)

ELSE(BUILD_WASM)  
set(CMAKE_CXX_COMPILER "clang++" CACHE STRING "clang compiler" FORCE)
ENDIF(BUILD_WASM) 


# Project setup
###############
PROJECT(ViennaLS)

set(VERSION_MAJOR 2)
set(VERSION_MINOR 3)
set(VERSION_PATCH 1)
set(VERSION ${VERSION_MAJOR}.${VERSION_MINOR}.${VERSION_PATCH})

ADD_DEFINITIONS(-DVIENNATS_VERSION="${VERSION}")

# Default build type
##############
IF (NOT CMAKE_BUILD_TYPE)
  SET(CMAKE_BUILD_TYPE "Release")
ENDIF()

OPTION(VIENNATS_STATIC_BUILD "" OFF)

# Default compile options
#################
# disable-new-dtags is necessary for ld > 2.27
IF(NOT BUILD_WASM)
  SET(CMAKE_CXX_FLAGS "-Wall ")
ELSE(NOT BUILD_WASM)
  SET(CMAKE_CXX_FLAGS "-Wall ")
ENDIF(NOT BUILD_WASM) 
SET(CMAKE_CXX_FLAGS_RELWITHDEBINFO "-O3 -g")
SET(CMAKE_CXX_FLAGS_RELEASE "-O3 ")
SET(CMAKE_CXX_FLAGS_DEBUG  "-O0 -g")

# Check flags for C++11 (C++0x)
##############
IF(NOT BUILD_WASM)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14")
ELSE(NOT BUILD_WASM)
  add_definitions(-DNDEBUG)
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14 -Wno-overloaded-shift-op-parentheses -w")
ENDIF(NOT BUILD_WASM) 

# Specify general include directory
################
INCLUDE_DIRECTORIES(".")
INCLUDE_DIRECTORIES(${CMAKE_SOURCE_DIR}/viennats/)
INCLUDE_DIRECTORIES(${CMAKE_SOURCE_DIR}/viennats/LSlib/)
IF(BUILD_WASM)
  INCLUDE_DIRECTORIES(${CMAKE_SOURCE_DIR}/wasm/)
ENDIF(BUILD_WASM) 

# Specify that the output executable is placed in the root build directory
################
SET(EXECUTABLE_OUTPUT_PATH ${CMAKE_BINARY_DIR})

# Find prerequisites
####################

# Look for additional CMake modules in the cmake subdirectory ..
list(APPEND CMAKE_MODULE_PATH "${PROJECT_SOURCE_DIR}/cmake")

# OpenMP ..
IF(NOT BUILD_WASM)
  IF(NOT BUILD_TBB)
  ###############################################
  #  compiler dependent settings for OpenMP
  ###############################################
  if ("${CMAKE_CXX_COMPILER_ID}" STREQUAL "Clang")
      #MESSAGE(STATUS ${CMAKE_CXX_FLAGS})
      SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS}  -Werror -ferror-limit=2")
      SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fopenmp=libomp")
  elseif ("${CMAKE_CXX_COMPILER_ID}" STREQUAL "GNU")
      # disable-new-dtags is necessary for ld > 2.27
      SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS}  -Werror -fmax-errors=2")
      FIND_PACKAGE(OpenMP REQUIRED)
      SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${OpenMP_CXX_FLAGS}")
  elseif ("${CMAKE_CXX_COMPILER_ID}" STREQUAL "Intel")
      SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -qopenmp  ")
      SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS}  -fmax-errors=2")
  endif()  

  # SET(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -Wl,--disable-new-dtags")
  ELSE(NOT BUILD_TBB)
    SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS}  -Wno-unknown-pragmas")
    set(TBB_BIN_DIR "${WASM_ROOT}/tbb/${BUILD_DIR_NAME}/linux_intel64_gcc_cc7.3.0_libc2.27_kernel4.15.0_release")
    message("TBB_BIN_DIR=" ${TBB_BIN_DIR})
    set(TBB_INC_DIR "${WASM_ROOT}/tbb/include")
    message("TBB_INC_DIR=" ${TBB_INC_DIR})
    set(TBB_LIBRARIES "tbb")
    ADD_DEFINITIONS ( -pthread)
    INCLUDE_DIRECTORIES(${TBB_INC_DIR})
    LINK_DIRECTORIES(${TBB_BIN_DIR})
    add_definitions(-D_TBB)
    remove_definitions(-D_OPENMP)
  ENDIF(NOT BUILD_TBB)



ELSE(NOT BUILD_WASM)
  # no openmp
  remove_definitions(-D_OPENMP)
  IF(BUILD_TBB)
    set(TBB_INC_DIR "${WASM_ROOT}/tbb/include")
    set(TBB_OBJ_DIR "${WASM_ROOT}/tbb/build/linux_wasm32_emscripten_emscripten_wasm32_release/")
    # set(Tbb_TBB_LIBRARY "/home/manstetten/github_hpcwasm/wasmtbb/tbb/build/linux_wasm32_emscripten_emscripten_wasm32_release/libtbb.a")
    add_definitions(-D_TBB)
    add_definitions(-D__wasm32__) 
    add_definitions(-D__emscripten__) 
    add_definitions(-D__TBB_DYNAMIC_LOAD_ENABLED=0) 
    add_definitions(-D__TBB_SOURCE_DIRECTLY_INCLUDED=1) 
    ADD_DEFINITIONS ( -pthread)
    INCLUDE_DIRECTORIES(${TBB_INC_DIR})
    FILE(GLOB_RECURSE TBB_OBJECTS ${TBB_OBJ_DIR}*.o)  
    message("TBB_OBJECTS=" ${TBB_OBJECTS})
    message("TBB_OBJ_DIR=" ${TBB_OBJ_DIR})    
  ENDIF(BUILD_TBB)
ENDIF(NOT BUILD_WASM) 

SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS}  -Wno-inconsistent-missing-override")

# set(CMAKE_STATIC_LIBRARY_SUFFIX ".bc")

# disable-new-dtags sets RPATH which searches for libs recursively, instead of RUNPATH which does not


# Boost ..
IF(NOT BUILD_WASM)
  SET(BOOST_MIN_VERSION 1.46.0)
  FIND_PACKAGE(Boost ${BOOST_MIN_VERSION} REQUIRED COMPONENTS filesystem system)
  INCLUDE_DIRECTORIES(${Boost_INCLUDE_DIRS})
  LINK_DIRECTORIES(${Boost_LIBRARY_DIRS})
ELSE(NOT BUILD_WASM)
  message(STATUS "WASM_BOOST")
  set(BOOST_INC_DIR "${WASM_ROOT}/boost")
  # set(Boost_LIBRARIES "${WASM_BOOST_LIB_DIR}/boost_filesystem.bc;${WASM_BOOST_LIB_DIR}/boost_system.bc")
  IF(BUILD_TBB)
    set(THREADING_MULTI "threading-multi")
  ELSE(BUILD_TBB) 
    set(THREADING_MULTI "")
  ENDIF(BUILD_TBB)
  set(BOOST_OBJ_DIR_FILESYSTEM "${WASM_ROOT}/boost/${BUILD_DIR_NAME}/boost/bin.v2/libs/filesystem/build/clang-linux-emscripten/release/link-static/${THREADING_MULTI}/visibility-hidden/")
  set(BOOST_OBJ_DIR_SYSTEM "${WASM_ROOT}/boost/${BUILD_DIR_NAME}/boost/bin.v2/libs/system/build/clang-linux-emscripten/release/link-static/${THREADING_MULTI}/visibility-hidden/")    
  FILE(GLOB_RECURSE BOOST_OBJECTS_FILESYSTEM ${BOOST_OBJ_DIR_FILESYSTEM}*.o)    
  FILE(GLOB_RECURSE BOOST_OBJECTS_SYSTEM ${BOOST_OBJ_DIR_SYSTEM}*.o)   
  message("BOOST_OBJECTS_FILESYSTEM=" ${BOOST_OBJECTS_FILESYSTEM})
  message("BOOST_OBJECTS_SYSTEM=" ${BOOST_OBJECTS_SYSTEM})     
  INCLUDE_DIRECTORIES(${BOOST_INC_DIR})
ENDIF(NOT BUILD_WASM) 

# HDF5
IF(NOT BUILD_WASM)
  IF(NOT VIENNATS_STATIC_BUILD)
    FIND_PACKAGE(HDF5 COMPONENTS CXX)
    IF(HDF5_FOUND)
      IF(HDF5_CXX_FOUND)
        add_definitions(-DUSE_HDF5)
        add_definitions(${HDF5_DEFINITIONS})
        INCLUDE_DIRECTORIES(${HDF5_INCLUDE_DIRS})
        SET(LIBRARIES ${LIBRARIES} ${HDF5_CXX_LIBRARIES})
      ELSE(HDF5_CXX_FOUND)
        message(STATUS "Missing HDF5 C++ library: ViennaTS will be built without TDR file support")
      ENDIF(HDF5_CXX_FOUND)
    ELSE(HDF5_FOUND)
      message(STATUS "Missing HDF5 library: ViennaTS will be built without TDR file support")
    ENDIF(HDF5_FOUND)
  ENDIF(NOT VIENNATS_STATIC_BUILD)
ENDIF(NOT BUILD_WASM) 

# VTK
# VTK_DIR needs to point to the VTK installation and to VTK/lib/cmake/vtk-{vtk-version}
IF(NOT BUILD_WASM)
  IF(VIENNATS_STATIC_BUILD)
    set(VTK_DIR $ENV{VTK_STATIC_DIR})
  ELSE(VIENNATS_STATIC_BUILD)
    # set(VTK_DIR $ENV{VTK_DIR})
  ENDIF(VIENNATS_STATIC_BUILD)  
ELSE(NOT BUILD_WASM)
  set(VTK_DIR "${WASM_ROOT}/vtk/${BUILD_DIR_NAME}/install/lib/cmake/vtk-8.2")
ENDIF(NOT BUILD_WASM) 




find_package(VTK NO_MODULE)

IF(VTK_FOUND)
  message(STATUS "VTK found (include: ${VTK_INCLUDE_DIRS}, lib: ${VTK_LIBRARY_DIRS})")
  include(${VTK_USE_FILE})
  #only link necessary VTK libraries
  IF(NOT BUILD_WASM)
    set(VTK_LIBRARIES vtksys;vtkFiltersCore;vtkFiltersGeneral;vtkFiltersGeometry;vtkIOXML;vtkFiltersParallel;vtkFiltersParallelDIY2)
  ELSE()
    # problem with vtkFiltersParallel, so remove it, seems to be not used
    # set(VTK_LIBRARIES vtksys;vtkFiltersCore;vtkFiltersGeneral;vtkFiltersGeometry;vtkIOXML)
    set(VTK_INC_DIR "${WASM_ROOT}/vtk/${BUILD_DIR_NAME}/install/include/vtk-8.2")
    IF(BUILD_TBB)    
      set(VTK_OBJ_DIR "${WASM_ROOT}/vtk/${BUILD_DIR_NAME}/")
    ELSE(BUILD_TBB)   
      set(VTK_OBJ_DIR "${WASM_ROOT}/vtk/${BUILD_DIR_NAME}/") 
    ENDIF(BUILD_TBB)
    INCLUDE_DIRECTORIES(${VTK_INC_DIR})
    FILE(GLOB_RECURSE VTK_OBJECTS ${VTK_OBJ_DIR}*.o)  
    message("VTK_OBJ_DIR=" ${VTK_OBJ_DIR})
    message("VTK_OBJECTS=" ${VTK_OBJECTS})
  ENDIF()
  message(STATUS "Including following VTK Libraries: ${VTK_LIBRARIES}")
  IF(VIENNATS_STATIC_BUILD)
    message(STATUS "BUILDING STATIC BINARY")
  ENDIF(VIENNATS_STATIC_BUILD)

ELSE(VTK_FOUND)
  message(STATUS "VTK not found.")
ENDIF(VTK_FOUND)


# Subdirectories
################
#add_subdirectory(src)

# Add visibility of headers
# Necessary for Qt-Creator usage.
################
file( GLOB_RECURSE MAKE_HEADERS_VISIBLE_SRC *.hpp *.h)
add_custom_target( MAKE_HEADERS_VISIBLE SOURCES ${MAKE_HEADERS_VISIBLE_SRC} )



# add executable and link
# file name with version
#set(viennaTS "viennats-${VERSION_MAJOR}.${VERSION_MINOR}.${VERSION_PATCH}")
set(viennaTS "viennats")

IF(NOT BUILD_WASM)
  ADD_EXECUTABLE(${viennaTS} src/viennats.cpp)
  # set_target_properties(${viennaTS} PROPERTIES 
  # COMPILE_FLAGS "-O1 -fsanitize=null -fsanitize=undefined -fsanitize=address -Wcast-align "
  # LINK_FLAGS "-O1 -fsanitize=null -fsanitize=undefined -fsanitize=address -Wcast-align " )   
ELSE(NOT BUILD_WASM)
  ADD_EXECUTABLE(${viennaTS} src/viennats.cpp wasm/vtswasm.cpp ${TBB_OBJECTS} ${VTK_OBJECTS} ${BOOST_OBJECTS_FILESYSTEM} ${BOOST_OBJECTS_SYSTEM})
  # copy files to assets folder
  file(MAKE_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}/assets)
  configure_file(${CMAKE_CURRENT_LIST_DIR}/js/callbacks.js ${CMAKE_CURRENT_BINARY_DIR}/callbacks.js COPYONLY)
  configure_file(${CMAKE_CURRENT_LIST_DIR}/js/callbacks_angular.js ${CMAKE_CURRENT_BINARY_DIR}/callbacks_angular.js COPYONLY)  
  configure_file(${CMAKE_CURRENT_LIST_DIR}/js/vtsworker.js ${CMAKE_CURRENT_BINARY_DIR}/vtsworker.js COPYONLY)
  configure_file(${CMAKE_CURRENT_LIST_DIR}/js/bootstrap.js ${CMAKE_CURRENT_BINARY_DIR}/bootstrap.js COPYONLY)
  configure_file(${CMAKE_CURRENT_LIST_DIR}/js/main.html ${CMAKE_CURRENT_BINARY_DIR}/main.html  COPYONLY)
  configure_file(${CMAKE_CURRENT_LIST_DIR}/js/SimpleHTTPServer.py ${CMAKE_CURRENT_BINARY_DIR}/SimpleHTTPServer.py COPYONLY)
  configure_file(${CMAKE_CURRENT_LIST_DIR}/assets-wasm/example/3d_hole.vtk ${CMAKE_CURRENT_BINARY_DIR}/assets/3d_hole.vtk COPYONLY)
  configure_file(${CMAKE_CURRENT_LIST_DIR}/assets-wasm/example/deposition3D.txt ${CMAKE_CURRENT_BINARY_DIR}/assets/deposition3D.txt COPYONLY)   
  configure_file(${CMAKE_CURRENT_LIST_DIR}/assets-wasm/debug_example/trench.vtk ${CMAKE_CURRENT_BINARY_DIR}/assets/trench.vtk COPYONLY)
  configure_file(${CMAKE_CURRENT_LIST_DIR}/assets-wasm/debug_example/trench.txt ${CMAKE_CURRENT_BINARY_DIR}/assets/trench.txt COPYONLY)                                 

  message("using WASM")
  IF(BUILD_WASM_STANDALONE)
    set(WASM_SUFFIX ".html")
  ELSE(BUILD_WASM_STANDALONE)
    set(WASM_SUFFIX ".js")
  ENDIF(BUILD_WASM_STANDALONE)

  #     -s LOAD_SOURCE_MAP=1 -g4 \
  # -fsanitize=undefined -fsanitize-minimal-runtime \
  # -s DEFAULT_PTHREAD_STACK_SIZE=8388608 \
  # -s BINARYEN_EXTRA_PASSES=\"--disable-bulk-memory\" 
  # 536870912, 268435456, 134217728
  set(OLEVEL "O3 --llvm-lto 1")
  # set(OLEVEL "O1")
  IF(BUILD_TBB)
  set(USE_PTHREADS "-s USE_PTHREADS=1")
  set(EXPORT_ES6 "-s EXPORT_ES6=0")
  set(WORKER_POOL "-s PTHREAD_POOL_SIZE=4")
  ELSE(BUILD_TBB)
  set(EXPORT_ES6 "-s EXPORT_ES6=0")
  set(USE_PTHREADS "-s USE_PTHREADS=0")
  ENDIF(BUILD_TBB)
  
  set_target_properties(${viennaTS} PROPERTIES 
  SUFFIX "${WASM_SUFFIX}" 
  COMPILE_FLAGS " -s EXTRA_EXPORTED_RUNTIME_METHODS=['FS'] -s WASM_ASYNC_COMPILATION=1  -s ERROR_ON_UNDEFINED_SYMBOLS=0 -Wcast-align -Wover-aligned -s TOTAL_MEMORY=512mb -s WASM_MEM_MAX=1536mb  --bind -v -s ALLOW_MEMORY_GROWTH=1 -s SAFE_HEAP=0 -s WARN_UNALIGNED=1 -s MODULARIZE=1 ${EXPORT_ES6} -s EXPORT_NAME=VTS ${USE_PTHREADS} ${WORKER_POOL} -${OLEVEL} -s ASSERTIONS=0 --pre-js callbacks_angular.js \
  --embed-file assets/3d_hole.vtk@/3d_hole.vtk \
  --embed-file assets/deposition3D.txt@/deposition3D.txt \
  --embed-file assets/trench.txt@/trench.txt \
  --embed-file assets/trench.vtk@/trench.vtk"
  LINK_FLAGS "  -s EXTRA_EXPORTED_RUNTIME_METHODS=['FS'] -s WASM_ASYNC_COMPILATION=1  -s ERROR_ON_UNDEFINED_SYMBOLS=0 -Wcast-align -Wover-aligned -s TOTAL_MEMORY=512mb  -s WASM_MEM_MAX=1536mb   --bind -v -s ALLOW_MEMORY_GROWTH=1 -s SAFE_HEAP=0 -s WARN_UNALIGNED=1 -s MODULARIZE=1 ${EXPORT_ES6} -s EXPORT_NAME=VTS ${USE_PTHREADS} ${WORKER_POOL} -${OLEVEL} -s ASSERTIONS=0 --pre-js callbacks_angular.js \
  --embed-file assets/3d_hole.vtk@/3d_hole.vtk \
  --embed-file assets/deposition3D.txt@/deposition3D.txt \
  --embed-file assets/trench.txt@/trench.txt \
  --embed-file assets/trench.vtk@/trench.vtk" ) 
ENDIF(NOT BUILD_WASM) 

IF(NOT BUILD_WASM) 
message("Boost_LIBRARIES=" ${Boost_LIBRARIES})
IF(VIENNATS_STATIC_BUILD)
  TARGET_LINK_LIBRARIES(${viennaTS} ${LIBRARIES}  ${VTK_LIBRARIES}  ${TBB_LIBRARIES} ${Boost_LIBRARIES} "-static")
ELSE(VIENNATS_STATIC_BUILD)
  TARGET_LINK_LIBRARIES(${viennaTS} ${LIBRARIES}  ${VTK_LIBRARIES}   ${TBB_LIBRARIES} ${Boost_LIBRARIES})
ENDIF(VIENNATS_STATIC_BUILD)
ENDIF(NOT BUILD_WASM) 

## install targets
IF(BUILD_WASM)
  INSTALL(FILES "${CMAKE_CURRENT_BINARY_DIR}/viennats.js" DESTINATION "${CMAKE_INSTALL_PREFIX}")
  INSTALL(FILES "${CMAKE_CURRENT_BINARY_DIR}/viennats.wasm" DESTINATION "${CMAKE_INSTALL_PREFIX}") 
  IF(BUILD_TBB)
    INSTALL(FILES "${CMAKE_CURRENT_BINARY_DIR}/viennats.js.mem" DESTINATION "${CMAKE_INSTALL_PREFIX}") 
    INSTALL(FILES "${CMAKE_CURRENT_BINARY_DIR}/viennats.worker.js" DESTINATION "${CMAKE_INSTALL_PREFIX}") 
  ENDIF(BUILD_TBB)  
ENDIF(BUILD_WASM)
