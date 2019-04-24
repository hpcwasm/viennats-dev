#ifndef VTSWASM_H_
#define VTSWASM_H_

#include "json.hpp"
#include <emscripten/bind.h>
#include <emscripten/val.h>

using json = nlohmann::json;

namespace wasm {

class vtswasm {
public:
  // generall callback function passing a (json) string
  static emscripten::val callbackFunction;
  static void SetCallback(emscripten::val cb) {
    wasm::vtswasm::callbackFunction = cb;
  }
  static void executeJSCallback(std::string message) {
    wasm::vtswasm::callbackFunction(message);
  }
  static void SimulationReady(double runtime) {
    json j = {{"simready", true}, {"runtime", runtime}};
    wasm::vtswasm::executeJSCallback(j.dump(4));
  }
  static void FileReady(std::string filename) {
    json j = {{"fileready", true}, {"filename", filename}};
    wasm::vtswasm::executeJSCallback(j.dump(4));
  }
};

} // namespace wasm

#endif /*VTSWASM_H_*/