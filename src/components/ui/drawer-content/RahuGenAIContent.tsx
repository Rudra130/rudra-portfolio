import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Workflow,
  ShieldAlert,
  Terminal,
  CheckCircle2,
  Award,
  Database,
} from 'lucide-react';

interface RahuGenAIContentProps {
  containerVariants: any;
  itemVariants: any;
}

export const RahuGenAIContent: React.FC<RahuGenAIContentProps> = ({
  containerVariants,
  itemVariants,
}) => {
  const [activeTab, setActiveTab] = useState<'agents' | 'rag' | 'safety' | 'protocols'>('agents');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* 1. Hero Overview Card */}
      <motion.div
        variants={itemVariants}
        className="glass-card p-6 border border-indigo-500/30 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-display font-bold text-white tracking-wide">
                Autonomous AI Agents & Generative AI Architecture
              </h4>
              <p className="text-xs font-mono text-indigo-400">
                LangGraph • Advanced RAG • AI Guardrails • MCP • OpenAI SDK • Google Agentic Kit
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-[11px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            Enterprise Scale
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Architecting resilient, production-ready Generative AI systems. Moving beyond simple prompt-and-response
          wrappers into stateful multi-agent DAGs, hybrid retrieval pipelines, strict safety guardrails, universal
          tool protocols (MCP), and enterprise tool-calling SDKs.
        </p>

        {/* Verified Certifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex items-center gap-3">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white">
                Oracle Agentic AI Certified Foundations Associate
              </p>
              <p className="text-[10px] font-mono text-indigo-300">
                Oracle University • Verified Credential
              </p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex items-center gap-3">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white">
                OCI Certified Generative AI Professional
              </p>
              <p className="text-[10px] font-mono text-indigo-300">
                Oracle Cloud Infrastructure • Verified Credential
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            'LangGraph (Cyclic Graphs)',
            'LangChain',
            'Advanced RAG (Hybrid/RRF)',
            'AI Guardrails (NeMo)',
            'OpenAI SDK (Tools/JSON)',
            'Model Context Protocol (MCP)',
            'Google Agentic Dev Kit',
            'NVIDIA NIM',
            'Vector DBs (Chroma/FAISS)',
            'Spring AI Log Analysis',
          ].map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-indigo-950/40 text-indigo-200 border border-indigo-500/30 hover:border-indigo-400 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>

      {/* 2. Interactive Pillar Navigation */}
      <div className="flex border-b border-white/10 pb-2 gap-2 overflow-x-auto text-xs font-mono">
        <button
          onClick={() => setActiveTab('agents')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'agents'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>LangGraph & Multi-Agents</span>
        </button>
        <button
          onClick={() => setActiveTab('rag')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'rag'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Advanced RAG</span>
        </button>
        <button
          onClick={() => setActiveTab('safety')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'safety'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Safety & Guardrails</span>
        </button>
        <button
          onClick={() => setActiveTab('protocols')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'protocols'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>MCP & OpenAI / Google SDK</span>
        </button>
      </div>

      {/* 3. LangGraph & Multi-Agent Workflows */}
      {(activeTab === 'agents' || activeTab === undefined) && (
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 border border-white/10 space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-display font-bold text-white">
                LangGraph & Cyclical Multi-Agent Workflows
              </h4>
              <p className="text-[11px] font-mono text-indigo-400">
                Stateful Graphs • Supervisor Architecture • Self-Correction Loops
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Constructing autonomous multi-agent networks where models collaborate, reason in cycles, execute tools,
            and inspect outputs before returning final answers.
          </p>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Cyclical StateGraph Architecture:</strong> Engineered stateful multi-agent
                graphs using LangGraph featuring conditional edge routing, cyclical feedback loops, and state persistence
                via checkpoints to enable long-running agent workflows.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Supervisor-Worker Pattern:</strong> Implemented hierarchical multi-agent
                systems where a centralized Supervisor agent parses high-level business goals, generates DAG execution
                plans, and delegates specialized subtasks to worker agents (SQL Generator, Data Cleaner, Synthesis Critic).
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Autonomous Error Reflection & Retry:</strong> Built self-healing loops
                where tools feeding back compiler warnings, SQL execution errors, or API rate limits trigger reflection nodes
                that analyze stack traces and rewrite arguments autonomously without pipeline crashes.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Human-in-the-Loop (HITL) Checkpoints:</strong> Implemented interrupt gates
                prior to high-stakes mutations (e.g., database writes, payment triggers, email dispatches), pausing agent
                state until human verification or approval is supplied.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Spring AI Microservice Integration:</strong> Deployed Spring AI log analysis
                agents across distributed microservices, parsing structured OpenTelemetry traces to root-cause distributed
                system errors in seconds.
              </div>
            </li>
          </ul>
        </motion.div>
      )}

      {/* 4. Advanced RAG (Retrieval-Augmented Generation) */}
      {activeTab === 'rag' && (
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 border border-white/10 space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-display font-bold text-white">
                Advanced RAG & High-Precision Vector Systems
              </h4>
              <p className="text-[11px] font-mono text-cyan-400">
                Hybrid Search • Reciprocal Rank Fusion • Cross-Encoder Re-Ranking
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Eliminating hallucinations by grounding LLM generation in verified enterprise knowledge bases with
            multi-stage retrieval architectures.
          </p>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Hybrid Retrieval (Dense + Sparse):</strong> Blended dense vector embeddings
                (cosine similarity over semantic embeddings) with sparse keyword matching (BM25) using Reciprocal Rank Fusion
                (RRF) to ensure high-recall search across domain terminology and code tokens.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Contextual Chunking & Parent-Doc Retrieval:</strong> Implemented hierarchical
                chunking preserving parent document structure while indexing atomic child snippets, preventing semantic fragmentation
                and lost contextual anchors.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Cross-Encoder Semantic Re-Ranking:</strong> Screened initial top-50 candidate
                retrievals through cross-encoder re-ranking models, pruning irrelevant noise and preventing
                "lost-in-the-middle" context degradation in the LLM’s input prompt.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Vector Store Orchestration:</strong> Engineered vector indexing and metadata
                partitioning using FAISS, Chroma, and PostgreSQL with <code className="text-cyan-300 bg-cyan-950/40 px-1 py-0.5 rounded text-[11px]">pgvector</code> for
                high-throughput enterprise query latency under 12ms.
              </div>
            </li>
          </ul>
        </motion.div>
      )}

      {/* 5. Safety, Hallucination Defense & Guardrails */}
      {activeTab === 'safety' && (
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 border border-white/10 space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-display font-bold text-white">
                AI Safety, Hallucination Defense & Guardrails
              </h4>
              <p className="text-[11px] font-mono text-amber-400">
                NeMo Guardrails • Schema Validation • Injection Defense
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Deploying multi-layer security perimeters around LLM inputs and outputs to prevent prompt injection,
            suppress hallucinations, and enforce strict deterministic output formats.
          </p>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Input Perimeters & Injection Defense:</strong> Integrated semantic and regex
                jailbreak detectors, automated PII sanitization/redaction, and out-of-scope intent classifiers to neutralize
                prompt injection attacks before reaching model context.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">NeMo & Llama Guard Principles:</strong> Configured programmable safety rails
                enforcing dialogue boundaries, toxic content filtering, and strict conversational domain adherence.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Post-Generation Factuality Verification:</strong> Evaluated generated model
                claims against retrieved ground-truth text chunks, scoring answer faithfulness and triggering automated
                regeneration if hallucination likelihood exceeds defined thresholds.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Deterministic Schema Enforcers:</strong> Leveraged Pydantic data models
                to validate every JSON key, data type, and enum before passing LLM payloads to production microservices.
              </div>
            </li>
          </ul>
        </motion.div>
      )}

      {/* 6. Protocols & Tool SDKs (MCP, OpenAI SDK, Google Agentic Dev Kit) */}
      {activeTab === 'protocols' && (
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 border border-white/10 space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-display font-bold text-white">
                Model Context Protocol (MCP) & Agent SDKs
              </h4>
              <p className="text-[11px] font-mono text-purple-400">
                Anthropic MCP • OpenAI Function Calling • Google Agentic Dev Kit
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Standardizing tool interfaces and client-server architectures across foundation models.
          </p>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Model Context Protocol (MCP) Implementation:</strong> Adopted Anthropic’s
                open MCP standard, cleanly decoupling model reasoning engines from external enterprise data sources and tool
                servers via standardized JSON-RPC protocols.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Custom MCP Server Architecture:</strong> Built high-performance MCP tool
                servers exposing database querying, file system access, and live web research tools with dynamic capability
                negotiation and isolated sandboxing.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">OpenAI SDK Tool & Function Calling:</strong> Implemented native OpenAI
                function calling (<code className="text-purple-300 bg-purple-950/40 px-1 py-0.5 rounded text-[11px]">tools</code> and
                <code className="text-purple-300 bg-purple-950/40 px-1 py-0.5 rounded text-[11px]"> tool_choice</code>) with concurrent
                multi-tool execution, SSE token streaming, and strict <code className="text-purple-300 bg-purple-950/40 px-1 py-0.5 rounded text-[11px]">json_schema</code> output
                guarantees.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Google Agentic Development Kit (ADK):</strong> Developed multi-turn
                autonomous agent workflows utilizing Google's generative agent toolkits, schema declarations, and real-time
                Google Search grounding.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">NVIDIA NIM Low-Latency Inference:</strong> Integrated NVIDIA NIM microservice
                endpoints for rapid self-hosted model execution with TensorRT-LLM acceleration.
              </div>
            </li>
          </ul>
        </motion.div>
      )}

      {/* 7. Architecture Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
          <p className="text-lg font-display font-bold text-indigo-400">&lt; 15ms</p>
          <p className="text-[10px] text-slate-400 font-mono">Vector Recall Latency</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
          <p className="text-lg font-display font-bold text-cyan-400">99.8%</p>
          <p className="text-[10px] text-slate-400 font-mono">Schema Compliance</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
          <p className="text-lg font-display font-bold text-amber-400">0%</p>
          <p className="text-[10px] text-slate-400 font-mono">Unchecked Halucination</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
          <p className="text-lg font-display font-bold text-purple-400">MCP + ADK</p>
          <p className="text-[10px] text-slate-400 font-mono">Universal Tooling</p>
        </div>
      </div>
    </motion.div>
  );
};
