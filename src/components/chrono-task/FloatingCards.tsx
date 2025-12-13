"use client";

import { Clock, CheckSquare } from "lucide-react";

export function FloatingCards() {
  return (
    <>
      {/* Sticky Note - Top Left */}
      <div
        className="absolute top-32 left-8 lg:left-16 xl:left-32 w-48 h-40 bg-yellow-100 rounded-lg shadow-md p-4 rotate-[-3deg] animate-float-in-delay-1 hover:shadow-lg hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-200"
        style={{ zIndex: 10 }}
      >
        <p
          className="text-sm text-slate-700 font-medium leading-relaxed"
          style={{ fontFamily: "cursive" }}
        >
          Take notes to keep track of crucial details, and accomplish more tasks
          with ease.
        </p>
      </div>

      {/* Checkbox Card - Bottom Left of Sticky */}
      <div
        className="absolute top-64 left-4 lg:left-12 xl:left-28 w-12 h-12 bg-orange-500 rounded-xl shadow-lg flex items-center justify-center rotate-[2deg] animate-float-in-delay-2 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
        style={{ zIndex: 15 }}
      >
        <CheckSquare className="w-6 h-6 text-white" />
      </div>

      {/* Reminders Card - Top Right */}
      <div
        className="absolute top-28 right-8 lg:right-16 xl:right-32 w-56 bg-white rounded-xl shadow-md p-4 rotate-[2deg] animate-float-in-delay-1 hover:shadow-lg hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-200"
        style={{ zIndex: 10 }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-slate-900 text-sm font-heading">
            Reminders
          </span>
          <span className="text-xs text-slate-400">Meetings</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
            <span>Today&apos;s Meeting</span>
          </div>
          <p className="text-xs text-slate-400 pl-3.5">
            Call with marketing team
          </p>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <Clock className="w-3 h-3 text-slate-400" />
          <span className="text-slate-500">13:00 - 13:45</span>
        </div>
      </div>

      {/* Clock Badge - Top Right Corner */}
      <div
        className="absolute top-24 right-4 lg:right-8 xl:right-24 w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center rotate-[0deg] animate-float-in-delay-3 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
        style={{ zIndex: 15 }}
      >
        <div className="w-10 h-10 border-2 border-slate-300 rounded-full flex items-center justify-center relative">
          <div
            className="absolute w-0.5 h-3 bg-slate-700 origin-bottom rotate-[30deg]"
            style={{ bottom: "50%" }}
          />
          <div
            className="absolute w-0.5 h-2 bg-red-500 origin-bottom rotate-[120deg]"
            style={{ bottom: "50%" }}
          />
          <div className="w-1 h-1 bg-slate-700 rounded-full" />
        </div>
      </div>

      {/* Task Preview Card - Bottom Right */}
      <div
        className="absolute bottom-32 left-8 lg:left-16 xl:left-32 w-64 bg-white rounded-xl shadow-md p-4 rotate-[-2deg] animate-float-in-delay-2 hover:shadow-lg hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-200"
        style={{ zIndex: 10 }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-slate-900 text-sm font-heading">
            Today&apos;s tasks
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center text-xs text-red-600 font-medium">
              1
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-700">New ideas for campaign</p>
              <p className="text-xs text-slate-400">Sep 10</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-slate-200" />
              <div className="w-5 h-5 rounded-full bg-slate-300 -ml-2" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="w-3/5 h-full bg-orange-500 rounded-full" />
              </div>
              <span className="text-xs text-slate-400">60%</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center text-xs text-green-600 font-medium">
              3
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-700">Design PPT #4</p>
              <p className="text-xs text-slate-400">Sep 18</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-slate-200" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="w-full h-full bg-green-500 rounded-full" />
              </div>
              <span className="text-xs text-slate-400">112%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Integrations Card - Bottom Right */}
      <div
        className="absolute bottom-28 right-8 lg:right-16 xl:right-32 w-56 bg-white rounded-xl shadow-md p-4 rotate-[3deg] animate-float-in-delay-3 hover:shadow-lg hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-200"
        style={{ zIndex: 10 }}
      >
        <span className="font-semibold text-slate-900 text-sm font-heading">
          100+ Integrations
        </span>
        <div className="flex items-center gap-3 mt-3">
          <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
              />
              <path
                fill="#34A853"
                d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
              />
              <path
                fill="#4A90E2"
                d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
              />
              <path
                fill="#FBBC05"
                d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
              />
            </svg>
          </div>
          <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path
                fill="#E01E5A"
                d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
              />
            </svg>
          </div>
          <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path
                fill="#4285F4"
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
