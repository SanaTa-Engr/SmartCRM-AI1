import { useState } from 'react';
import {
  Plus,
  Search,
  Sparkles,
  Mail,
  ArrowRight,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  List,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  Upload,
} from 'lucide-react';
import { Lead, LeadStage } from '../types';

interface LeadsViewProps {
  leads: Lead[];
  onAddLead: () => void;
  onOpenImport?: () => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  onStageChange: (lead: Lead, newStage: LeadStage) => void;
  onScoreLead: (lead: Lead) => void;
  onGenerateSummary: (lead: Lead) => void;
  onDraftEmail: (lead: Lead) => void;
  isScoringId: string | null;
}

const STAGES: { id: LeadStage; label: string; color: string; badgeColor: string }[] = [
  { id: 'New', label: 'New Inbound', color: 'border-t-blue-500', badgeColor: 'bg-blue-100 text-blue-700' },
  { id: 'Contacted', label: 'Contacted', color: 'border-t-purple-500', badgeColor: 'bg-purple-100 text-purple-700' },
  { id: 'Qualified', label: 'Qualified', color: 'border-t-amber-500', badgeColor: 'bg-amber-100 text-amber-700' },
  { id: 'Proposal', label: 'Proposal Sent', color: 'border-t-indigo-500', badgeColor: 'bg-indigo-100 text-indigo-700' },
  { id: 'Won', label: 'Closed Won', color: 'border-t-emerald-500', badgeColor: 'bg-emerald-100 text-emerald-700' },
  { id: 'Lost', label: 'Closed Lost', color: 'border-t-slate-400', badgeColor: 'bg-slate-100 text-slate-700' },
];

export function LeadsView({
  leads,
  onAddLead,
  onOpenImport,
  onEditLead,
  onDeleteLead,
  onStageChange,
  onScoreLead,
  onGenerateSummary,
  onDraftEmail,
  isScoringId,
}: LeadsViewProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredLeads = leads.filter(l => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'all' || l.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500 text-white';
    if (score >= 60) return 'bg-amber-500 text-white';
    return 'bg-slate-400 text-white';
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search leads..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={e => setSelectedStage(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">All Stages</option>
            {STAGES.map(s => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'kanban' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Pipeline</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Table</span>
            </button>
          </div>

          {/* Import Leads button */}
          {onOpenImport && (
            <button
              onClick={onOpenImport}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Import leads from CSV or Excel file"
            >
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Import Leads</span>
            </button>
          )}

          {/* Add lead button */}
          <button
            onClick={onAddLead}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Kanban Pipeline View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map(stage => {
            const stageLeads = filteredLeads.filter(l => l.stage === stage.id);
            const totalStageVal = stageLeads.reduce((sum, l) => sum + Number(l.estimatedValue), 0);

            return (
              <div
                key={stage.id}
                className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200 flex flex-col min-w-[240px] max-h-[calc(100vh-220px)]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">{stage.label}</span>
                    <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                      {stageLeads.length}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    ${(totalStageVal / 1000).toFixed(0)}k
                  </span>
                </div>

                {/* Cards list */}
                <div className="space-y-3 overflow-y-auto flex-1 pr-0.5">
                  {stageLeads.map(lead => (
                    <div
                      key={lead.id}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all relative group"
                    >
                      {/* Top row: Name & Score */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{lead.name}</h4>
                          <p className="text-[11px] text-slate-500 truncate">{lead.title || 'Lead'} • {lead.company}</p>
                        </div>
                        <div
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${getScoreColor(lead.score)}`}
                          title={`AI Predictive Score: ${lead.score}/100`}
                        >
                          {lead.score}
                        </div>
                      </div>

                      {/* Value & Source */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 my-2 pt-1 border-t border-slate-100">
                        <span className="font-bold text-slate-800">${Number(lead.estimatedValue).toLocaleString()}</span>
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 truncate max-w-[90px]">
                          {lead.source}
                        </span>
                      </div>

                      {/* AI Next Action if exists */}
                      {lead.nextAction && (
                        <div className="mb-2.5 p-1.5 bg-indigo-50/70 border border-indigo-100/80 rounded-lg text-[10px] text-indigo-950 leading-tight">
                          <span className="font-semibold text-indigo-600 block mb-0.5">Recommended Next Step:</span>
                          <span className="line-clamp-2">{lead.nextAction}</span>
                        </div>
                      )}

                      {/* Quick AI Action buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1">
                          {/* Score with AI */}
                          <button
                            onClick={() => onScoreLead(lead)}
                            disabled={isScoringId === lead.id}
                            title="Rescore with Gemini AI"
                            className="p-1 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Sparkles className={`w-3.5 h-3.5 ${isScoringId === lead.id ? 'animate-spin' : ''}`} />
                          </button>

                          {/* Email generator */}
                          <button
                            onClick={() => onDraftEmail(lead)}
                            title="Generate follow-up email"
                            className="p-1 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>

                          {/* AI Summary */}
                          <button
                            onClick={() => onGenerateSummary(lead)}
                            title="Generate AI Lead Summary"
                            className="p-1 rounded-md text-purple-600 hover:bg-purple-50 transition-colors"
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Stage transition & Edit dropdown */}
                        <div className="flex items-center gap-1">
                          <select
                            value={lead.stage}
                            onChange={e => onStageChange(lead, e.target.value as LeadStage)}
                            className="text-[10px] font-semibold py-0.5 px-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 border-none focus:ring-0 cursor-pointer"
                          >
                            {STAGES.map(s => (
                              <option key={s.id} value={s.id}>
                                Move: {s.id}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => onEditLead(lead)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700"
                            title="Edit Lead"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDeleteLead(lead.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="p-4 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-[11px]">
                      No leads
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Lead Name</th>
                  <th className="px-4 py-3">Company & Role</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Est. Value</th>
                  <th className="px-4 py-3">AI Score</th>
                  <th className="px-4 py-3">Next Action</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">{lead.name}</p>
                      <p className="text-[11px] text-slate-400">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{lead.company}</p>
                      <p className="text-[11px] text-slate-400">{lead.title || '-'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {lead.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      ${Number(lead.estimatedValue).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${getScoreColor(lead.score)}`}>
                        {lead.score}/100
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs text-slate-600 text-[11px] truncate">
                      {lead.nextAction || '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onScoreLead(lead)}
                          className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                          title="Score with AI"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDraftEmail(lead)}
                          className="p-1 text-slate-600 hover:bg-slate-100 rounded"
                          title="Draft follow-up email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditLead(lead)}
                          className="p-1 text-slate-600 hover:bg-slate-100 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteLead(lead.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
