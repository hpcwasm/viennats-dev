#ifndef MYTIMER_H_
#define MYTIMER_H_

/* =========================================================================
   Copyright (c)    2008-2015, Institute for Microelectronics, TU Wien.

                            -----------------
                 ViennaTS - The Vienna Topography Simulator
                            -----------------

   Contact:         viennats@iue.tuwien.ac.at

   License:         MIT (X11), see file LICENSE in the base directory
============================================================================= */

#if defined(_OPENMP)
  #include <omp.h>
#else
  #include <chrono>
#endif

namespace my {
  ///Namespace for time or timing related methods.
  namespace time {

    double GetTime() {
#if defined(_OPENMP) 
      return omp_get_wtime();
#else
      const auto now = std::chrono::system_clock::now();
      const auto duration = now.time_since_epoch();
      const auto millis = std::chrono::duration_cast<std::chrono::milliseconds>(duration).count();
      return millis/1000.0;
#endif
    }

  }
}


#endif /*MYTIMER_H_*/
