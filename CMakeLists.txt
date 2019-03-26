# Required CMake Version
###############
cmake_minimum_required(VERSION 3.4)



# WebAssembly Config for emscripten
###############
set(BUILD_WASM true CACHE BOOL "build webassembly")

IF(BUILD_WASM)
  set(WASM_BOOST_LIB_DIR "/home/manstetten/ProgramsDev/hpcwasm/boost/lib/emscripten")
  set(WASM_BOOST_INCLUDE_DIR "/home/manstetten/ProgramsDev/hpcwasm/boost")
  set(WASM_VTK_CMAKE_DIR "/home/manstetten/ProgramsDev/hpcwasm/vtk/install/lib/cmake/vtk-8.1")  
  add_definitions(-DBUILD_WASM)
ENDIF(BUILD_WASM) 

# Project setup
###############
PROJECT(ViennaLS)

set(VERSION_MAJOR 2)
set(VERSION_MINOR 2)
set(VERSION_PATCH 0)
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
SET(CMAKE_CXX_FLAGS "-Wall -pedantic -fmax-errors=5")
SET(CMAKE_CXX_FLAGS_RELWITHDEBINFO "-O3 -g")
SET(CMAKE_CXX_FLAGS_RELEASE "-O3 ")
SET(CMAKE_CXX_FLAGS_DEBUG  "-O0 -g")

# Check flags for C++11 (C++0x)
##############
IF(NOT BUILD_WASM)
  include(CheckCXXCompilerFlag)
  CHECK_CXX_COMPILER_FLAG("-std=c++11" COMPILER_SUPPORTS_CXX11)
  CHECK_CXX_COMPILER_FLAG("-std=c++0x" COMPILER_SUPPORTS_CXX0X)
  if(COMPILER_SUPPORTS_CXX11)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")
  elseif(COMPILER_SUPPORTS_CXX0X)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++0x")
  else()
          message(STATUS "The compiler ${CMAKE_CXX_COMPILER} has no C++11 support. Please use a different C++ compiler.")
  endif()
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
  FIND_PACKAGE(OpenMP REQUIRED)
  SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${OpenMP_CXX_FLAGS}")
ELSE(NOT BUILD_WASM)
  # no openmp
  remove_definitions(-D_OPENMP)
ENDIF(NOT BUILD_WASM) 

# Boost ..
IF(NOT BUILD_WASM)
  SET(BOOST_MIN_VERSION 1.46.0)
  FIND_PACKAGE(Boost ${BOOST_MIN_VERSION} REQUIRED COMPONENTS filesystem system)
  INCLUDE_DIRECTORIES(${Boost_INCLUDE_DIRS})
  LINK_DIRECTORIES(${Boost_LIBRARY_DIRS})
ELSE(NOT BUILD_WASM)
  message(STATUS "WASM_BOOST")
  set(Boost_LIBRARIES "-lboost_system -lboost_filesystem")
  INCLUDE_DIRECTORIES(${WASM_BOOST_INCLUDE_DIR})
  LINK_DIRECTORIES(${WASM_BOOST_LIB_DIR})
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
  set(VTK_DIR $ENV{VTK_DIR})
ELSE(NOT BUILD_WASM)
  set(VTK_DIR ${WASM_VTK_CMAKE_DIR})
ENDIF(NOT BUILD_WASM) 

find_package(VTK REQUIRED)

IF(VTK_FOUND)
message(STATUS "VTK found (include: ${VTK_INCLUDE_DIRS}, lib: ${VTK_LIBRARY_DIRS})")
include(${VTK_USE_FILE})
#only link necessary VTK libraries in order for static linking to work (-lGL fails)
IF(VIENNATS_STATIC_BUILD)
  set(VTK_LIBRARIES vtksys;vtkFiltersCore;vtkFiltersGeneral;vtkFiltersGeometry;vtkIOXML)
  message(STATUS "Static build: Only including following VTK Libraries: ${VTK_LIBRARIES}")
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
ELSE(NOT BUILD_WASM)
  ADD_EXECUTABLE(${viennaTS} src/viennats.cpp)
  # copy files to assets folder
  file(MAKE_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}/assets)

  add_custom_command(TARGET ${viennaTS} PRE_BUILD
                   COMMAND ${CMAKE_COMMAND} -E copy_directory
                       ${CMAKE_CURRENT_LIST_DIR}/assets-wasm $<TARGET_FILE_DIR:${viennaTS}>/assets)

  add_custom_command(TARGET ${viennaTS} PRE_BUILD
                   COMMAND ${CMAKE_COMMAND} -E copy_directory
                       ${CMAKE_CURRENT_LIST_DIR}/js $<TARGET_FILE_DIR:${viennaTS}>)                                         

  set(WASM_SUFFIX ".js")

  # 1gb = 1073741824, 1gb-1*64kb = 1073676288, 1gb-100*64kb = 1067188224
  # 256mb = 1073741824, 1gb-1*64kb = 1073676288, 1gb-100*64kb = 1067188224
  # further emscripten options: -s DEMANGLE_SUPPORT=1 -s ASSERTIONS=1 
  # 265814016 ~= 256mb

  # 2gb-10*64kb = 2*1024**3-10*256**2 = 2146828288
  # -s ALLOW_MEMORY_GROWTH=1 \
  # -s DISABLE_EXCEPTION_CATCHING=1 \
  # more info on linker flags: /home/manstetten/ProgramsDev/hpcwasm/emsdk/emscripten/1.38.29/src/settings.js
  # --embed-file ${CMAKE_CURRENT_BINARY_DIR}/assets/geometry2.dx@/geometry2.dx \
  # --embed-file ${CMAKE_CURRENT_BINARY_DIR}/assets/parwasm.txt@/parwasm.txt \

  message("using WASM")
  set_target_properties(${viennaTS} PROPERTIES 
  SUFFIX "${WASM_SUFFIX}" 
  LINK_FLAGS " --bind -v \
  -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
  --preload-file ${CMAKE_CURRENT_BINARY_DIR}/assets@/assets \
  -s WASM=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s TOTAL_MEMORY=265814016 \
  -s WASM_MEM_MAX=2146828288 \
  -s \"BINARYEN_METHOD='native-wasm'\" \
  -s \"BINARYEN_TRAP_MODE='allow'\"")  
ENDIF(NOT BUILD_WASM) 

IF(VIENNATS_STATIC_BUILD)
  TARGET_LINK_LIBRARIES(${viennaTS} ${LIBRARIES} ${Boost_LIBRARIES} ${VTK_LIBRARIES} "-static")
ELSE()
  TARGET_LINK_LIBRARIES(${viennaTS} ${LIBRARIES} ${Boost_LIBRARIES} ${VTK_LIBRARIES})
ENDIF(VIENNATS_STATIC_BUILD)
