'use client';

import { useState, useMemo } from 'react';
import { useNidsStore } from '@/lib/store';
import { SEVERITY_COLORS } from '@/lib/api';
import { formatTimestampFull, formatConfidence, abbreviateThreat, cn } from '@/lib/utils';
import type { SeverityLevel } from '@/lib/types';
import { ChevronUp, ChevronDown, Filter } from 'lucide-react';

type SortKey = 'timestamp' | 'threat_type' | 'severity' | 'confidence' | 'latency_ms';
type SortDir = 'asc' | 'desc';

// Match these exactly with the Backend strings
const SEVERITY_ORDER: Record<string, number> = {
  CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1
};

const ALL_SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;

export default function ThreatTable() {
  const { events, setSelectedEventId, selectedEventId } = useNidsStore();
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filterSeverity, setFilterSeverity] = useState<string | 'ALL'>('ALL');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 8;

  const filtered = useMemo(() => {
    let rows = filterSeverity === 'ALL' ? events : events.filter(e => e.severity === filterSeverity);
    return [...rows].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'timestamp')   cmp = a.timestamp - b.timestamp;
      if (sortKey === 'confidence')  cmp = a.confidence - b.confidence;
      if (sortKey === 'latency_ms')  cmp = a.latency_ms - b.latency_ms;
      if (sortKey === 'severity')    cmp = (SEVERITY_ORDER[a.severity] || 0) - (SEVERITY_ORDER[b.severity] || 0);
      if (sortKey === 'threat_type') cmp = a.threat_type.localeCompare(b.threat_type);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [events, sortKey, sortDir, filterSeverity]);

  const page_rows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="nids-card flex flex-col">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05]">
        <span className="text-[12px] font-semibold text-white/70 uppercase tracking-wider">Event History</span>
        <div className="flex items-center gap-2">
          <Filter size={11} className="text-white/25" />
          <div className="flex items-center gap-1">
            <button 
                onClick={() => setFilterSeverity('ALL')}
                className={cn('text-[9px] uppercase px-2 py-1 rounded border font-semibold', 
                filterSeverity === 'ALL' ? 'bg-[#00d4ff]/15 border-[#00d4ff]/30 text-[#00d4ff]' : 'border-white/[0.06] text-white/25')}
            >ALL</button>
            {ALL_SEVERITIES.map((s) => (
              <button
                key={s}
                onClick={() => { setFilterSeverity(s); setPage(0); }}
                className={cn(
                  'text-[9px] uppercase tracking-wider px-2 py-1 rounded border transition-all font-semibold',
                  filterSeverity === s ? `badge-${s.toLowerCase()}` : 'border-white/[0.06] text-white/25'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.04] text-[10px] uppercase text-white/30">
              <th className="px-4 py-2.5 w-4" />
              <th className="px-2 py-2.5">Time</th>
              <th className="px-2 py-2.5">Type</th>
              <th className="px-2 py-2.5">Severity</th>
              <th className="px-2 py-2.5">Confidence</th>
              <th className="px-2 py-2.5">Latency</th>
            </tr>
          </thead>
          <tbody>
            {page_rows.map((event) => (
              <tr key={event.id} className="border-b border-white/[0.03] text-[11px]">
                <td className="px-4 py-2.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: SEVERITY_COLORS[event.severity] }} />
                </td>
                <td className="px-2 py-2.5 mono text-white/40">{formatTimestampFull(event.timestamp)}</td>
                <td className="px-2 py-2.5 font-medium" style={{ color: SEVERITY_COLORS[event.severity] }}>{abbreviateThreat(event.threat_type)}</td>
                <td className="px-2 py-2.5">
                    <span className={cn('px-1.5 py-0.5 rounded border text-[9px]', `badge-${event.severity.toLowerCase()}`)}>
                        {event.severity}
                    </span>
                </td>
                <td className="px-2 py-2.5 mono text-white/50">{formatConfidence(event.confidence)}</td>
                <td className="px-2 py-2.5 mono text-white/35">{event.latency_ms.toFixed(1)}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}