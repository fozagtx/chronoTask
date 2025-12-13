"use client";

import { X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CivicAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name?: string | null;
    email?: string | null;
    picture?: string | null;
  } | null;
}

export function CivicAuthModal({ isOpen, onClose, user }: CivicAuthModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-float-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors z-10"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Success icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          {/* Welcome text */}
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome!</h2>
          <p className="text-slate-500 mb-6">You have successfully signed in</p>

          {/* User info card */}
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14">
                <AvatarImage src={user.picture || undefined} alt={user.name || "User"} />
                <AvatarFallback className="bg-orange-100 text-orange-600 text-lg font-semibold">
                  {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-left flex-1 min-w-0">
                {user.name && (
                  <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                )}
                {user.email && (
                  <p className="text-sm text-slate-500 truncate">{user.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action button */}
          <Button
            onClick={onClose}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
