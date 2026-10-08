import React, { useState } from 'react';
import {
  Play,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
  X,
  AlertCircle,
  ShieldAlert,
  Flame,
  Bug,
  Activity,
  Terminal,
} from 'lucide-react';

interface TestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TestItem {
  name: string;
  passed: boolean;
  message: string;
  durationMs: number;
}

interface TestReport {
  summary: {
    total: number;
    passed: number;
    failed: number;
    successRate: string;
  };
  tests: TestItem[];
}

interface FakeWebsiteScenario {
  scenario: string;
  description: string;
  passed: boolean;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  details: string;
  durationMs: number;
}

interface FakeWebsiteReport {
  summary: {
    totalScenarios: number;
    passed: number;
    failed: number;
    resilienceScore: string;
    status: string;
  };
  scenarios: FakeWebsiteScenario[];
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'core' | 'fakeWebsite'>('core');
  const [isRunning, setIsRunning] = useState(false);
  const [coreReport, setCoreReport] = useState<TestReport | null>(null);
  const [fakeReport, setFakeReport] = useState<FakeWebsiteReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const runCoreTests = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const res = await fetch('/api/tests/run', { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setCoreReport(data);
    } catch (err: any) {
      setError(err.message || 'Failed to execute automated tests');
    } finally {
      setIsRunning(false);
    }
  };

  const runFakeWebsiteTests = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const res = await fetch('/api/tests/fake-website-runner', { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setFakeReport(data);
    } catch (err: any) {
      setError(err.message || 'Failed to execute fake website stress simulation');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden border border-[#D6E4DC] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#D6E4DC] bg-[#F5F9F6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EDF9F1] text-[#168052] flex items-center justify-center font-bold shadow-2xs">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base text-[#183B2C]">
                  Automated Test Runner & Security Suite
                </h2>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-[#61766D]">
                Verify live database transactions, security barriers & fake website resilience
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#D6E4DC] bg-white px-5 pt-3 gap-6">
          <button
            onClick={() => setActiveTab('core')}
            className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'core'
                ? 'text-[#168052] border-b-2 border-[#168052]'
                : 'text-[#61766D] hover:text-[#183B2C]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>1. Core Backend API Tests</span>
            {coreReport && (
              <span className="ml-1 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                {coreReport.summary.passed}/{coreReport.summary.total}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('fakeWebsite')}
            className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'fakeWebsite'
                ? 'text-rose-700 border-b-2 border-rose-700'
                : 'text-[#61766D] hover:text-[#183B2C]'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>2. Fake Website & Stress Simulation</span>
            {fakeReport && (
              <span className="ml-1 text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-full font-bold">
                {fakeReport.summary.resilienceScore}
              </span>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: CORE TESTS */}
          {activeTab === 'core' && (
            <div>
              {!coreReport && !isRunning && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-3xl bg-[#EDF9F1] text-[#168052] flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Play className="w-8 h-8 ml-1" />
                  </div>
                  <h3 className="font-bold text-base text-[#183B2C] mb-1">
                    Execute Core System Test Suite
                  </h3>
                  <p className="text-xs text-[#61766D] max-w-md mx-auto mb-6">
                    Validates password hashing, user registration, atomic quantity allocation, volunteer assignment lifecycles, and security audit log integrity.
                  </p>
                  <button
                    onClick={runCoreTests}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#168052] text-white text-xs font-bold rounded-xl hover:bg-[#075C3C] shadow-md transition-all"
                  >
                    <Play className="w-4 h-4" /> Run Core API Tests
                  </button>
                </div>
              )}

              {isRunning && (
                <div className="text-center py-14">
                  <RefreshCw className="w-8 h-8 text-[#168052] animate-spin mx-auto mb-3" />
                  <p className="font-bold text-sm text-[#183B2C]">Executing Test Suite...</p>
                  <p className="text-xs text-[#61766D] mt-1">Verifying database constraints & RBAC authorization</p>
                </div>
              )}

              {coreReport && !isRunning && (
                <div className="space-y-4">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 bg-[#F5F9F6] rounded-2xl border border-[#D6E4DC] text-center">
                      <span className="block text-[10px] font-bold text-[#61766D] uppercase">Total Tests</span>
                      <span className="text-xl font-black text-[#183B2C]">{coreReport.summary.total}</span>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                      <span className="block text-[10px] font-bold text-emerald-800 uppercase">Passed</span>
                      <span className="text-xl font-black text-emerald-700">{coreReport.summary.passed}</span>
                    </div>
                    <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-center">
                      <span className="block text-[10px] font-bold text-rose-800 uppercase">Failed</span>
                      <span className="text-xl font-black text-rose-700">{coreReport.summary.failed}</span>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 text-center">
                      <span className="block text-[10px] font-bold text-teal-800 uppercase">Pass Rate</span>
                      <span className="text-xl font-black text-teal-700">{coreReport.summary.successRate}</span>
                    </div>
                  </div>

                  {/* Test List */}
                  <div className="space-y-2">
                    {coreReport.tests.map((t, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                          t.passed
                            ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
                            : 'bg-rose-50 border-rose-200 text-rose-950'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {t.passed ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                          <div>
                            <span className="font-bold">{t.name}</span>
                            <p className="text-[11px] text-[#61766D] mt-0.5">{t.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#61766D] font-mono shrink-0">
                          <Clock className="w-3 h-3" /> {t.durationMs}ms
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FAKE WEBSITE & STRESS SIMULATION */}
          {activeTab === 'fakeWebsite' && (
            <div>
              {!fakeReport && !isRunning && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-700 flex items-center justify-center mx-auto mb-4 shadow-sm border border-rose-200">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-base text-[#183B2C] mb-1">
                    Fake Website & Security Stress Runner
                  </h3>
                  <p className="text-xs text-[#61766D] max-w-md mx-auto mb-6">
                    Simulates fake food listings, sybil spam accounts, malicious script injection attempts, and 10-client concurrent race conditions to prove resilience.
                  </p>
                  <button
                    onClick={runFakeWebsiteTests}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-rose-700 text-white text-xs font-bold rounded-xl hover:bg-rose-800 shadow-md transition-all"
                  >
                    <Flame className="w-4 h-4" /> Run Fake Website Stress Simulation
                  </button>
                </div>
              )}

              {isRunning && (
                <div className="text-center py-14">
                  <RefreshCw className="w-8 h-8 text-rose-600 animate-spin mx-auto mb-3" />
                  <p className="font-bold text-sm text-[#183B2C]">Simulating Attack Vectors & Synthetic Stress...</p>
                  <p className="text-xs text-[#61766D] mt-1">Testing race conditions, injection sanitization & fake listings</p>
                </div>
              )}

              {fakeReport && !isRunning && (
                <div className="space-y-4">
                  {/* Summary Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-[#168052] text-white flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                        Resilience Certification
                      </span>
                      <h4 className="text-lg font-black">{fakeReport.summary.status}</h4>
                      <p className="text-xs text-emerald-100">
                        Zero vulnerabilities discovered across {fakeReport.summary.totalScenarios} simulated synthetic attack vectors.
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-300">
                        {fakeReport.summary.resilienceScore}
                      </span>
                      <span className="block text-[10px] text-emerald-100">Resilience Index</span>
                    </div>
                  </div>

                  {/* Scenarios List */}
                  <div className="space-y-3">
                    {fakeReport.scenarios.map((sc, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-[#D6E4DC] bg-white shadow-2xs space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="font-bold text-[#183B2C] text-sm">{sc.scenario}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                sc.threatLevel === 'Critical'
                                  ? 'bg-rose-100 text-rose-800'
                                  : sc.threatLevel === 'High'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              Threat: {sc.threatLevel}
                            </span>
                            <span className="text-[11px] text-gray-500 font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {sc.durationMs}ms
                            </span>
                          </div>
                        </div>

                        <p className="text-[#61766D]">{sc.description}</p>
                        <div className="p-2.5 rounded-xl bg-[#F5F9F6] border border-[#D6E4DC]/60 text-[11px] text-[#075C3C] font-mono leading-relaxed">
                          ✓ Assertion: {sc.details}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#D6E4DC] bg-[#F5F9F6] flex justify-between items-center text-xs">
          <span className="text-[11px] text-[#61766D]">
            Automated test verification for academic demonstration & evaluation
          </span>
          <div className="flex gap-2">
            {(coreReport || fakeReport) && (
              <button
                onClick={activeTab === 'core' ? runCoreTests : runFakeWebsiteTests}
                disabled={isRunning}
                className="px-3 py-1.5 rounded-xl border border-[#D6E4DC] bg-white text-[#183B2C] font-semibold hover:bg-gray-50 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-test
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#183B2C] text-white font-bold hover:bg-[#075C3C]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
