import React from 'react';
import { Utensils, Heart, Shield, Terminal, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenTestRunner: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenTestRunner }) => {
  return (
    <footer className="bg-[#064C33] text-white border-t border-[#075C3C] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#168052] flex items-center justify-center text-white">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">Food Share</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              "Reduce Waste, Feed Need" — Connecting food providers, non-profit organizations, and community volunteers to eliminate surplus food waste and combat hunger.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium">
              <Shield className="w-4 h-4" />
              <span>Full-Stack Social Impact Platform</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-white transition-colors">
                  Available Food Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition-colors">
                  How Donation Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('impact')} className="hover:text-white transition-colors">
                  Impact & Analytics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('food-safety')} className="hover:text-white transition-colors">
                  Food Safety Guidelines
                </button>
              </li>
            </ul>
          </div>

          {/* User Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-3">
              Role Portals
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <button onClick={() => onNavigate('dashboard-provider')} className="hover:text-white transition-colors">
                  Food Provider Hub
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard-ngo')} className="hover:text-white transition-colors">
                  NGO Distribution Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard-volunteer')} className="hover:text-white transition-colors">
                  Volunteer Rescue Operations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard-admin')} className="hover:text-white transition-colors">
                  Administrator Console
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('create-donation')} className="text-emerald-300 font-bold hover:underline flex items-center gap-1">
                  Post Food Donation <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Verification & Academic info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">
              Engineering & Tests
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Developed as a production-grade full-stack computer science project with persistent relational storage and atomic allocation transactions.
            </p>
            <button
              onClick={onOpenTestRunner}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-xs font-semibold text-emerald-100 border border-emerald-600 transition-colors shadow-xs"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-300" />
              <span>Run Automated Test Suite</span>
            </button>
          </div>
        </div>

        {/* Food Safety Notice banner */}
        <div className="p-4 rounded-xl bg-[#075C3C]/60 border border-emerald-700/50 mb-8 text-[11px] text-white/75 leading-relaxed">
          <strong className="text-white font-semibold">Food Safety Notice:</strong> Food Share is a coordination and distribution network. Food donors are required to adhere to safe holding temperatures (hot meals &gt;60°C, chilled items &lt;4°C) and accurately disclose allergen information. Recipients must verify physical container integrity prior to community distribution.
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#075C3C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} Food Share. Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>for zero waste and zero hunger.</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button onClick={() => onNavigate('food-safety')} className="hover:text-white">
              Safety Terms
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('how-it-works')} className="hover:text-white">
              FAQs
            </button>
            <span>•</span>
            <span className="text-emerald-300 font-mono">B.Tech CSE Capstone Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
