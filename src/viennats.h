#pragma once


#include <tbb/blocked_range.h>
#include <tbb/combinable.h>
#include <tbb/enumerable_thread_specific.h>
#include <tbb/parallel_for.h>
#include <tbb/task_arena.h>
#include <tbb/task_group.h>
#include <tbb/task_scheduler_init.h>
#include <tbb/tbb_thread.h>
#include <thread>


// extern tbb::task_scheduler_init *sched;