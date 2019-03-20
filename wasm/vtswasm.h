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
    vtswasm::callbackFunction = cb;
  }
  static void executeJSCallback(std::string message) {
    vtswasm::callbackFunction(message);
  }
  static void SimulationReady(double runtime) {
    json j = {{"simready", true}, {"runtime", runtime}};
    vtswasm::executeJSCallback(j.dump(4));
  }
  static void FileReady(std::string filename) {
    json j = {{"fileready", true}, {"filename", filename}};
    vtswasm::executeJSCallback(j.dump(4));
  }
};

} // namespace wasm

#endif /*VTSWASM_H_*/