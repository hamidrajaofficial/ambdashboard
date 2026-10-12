import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  Globe,
  MapPin,
  Share2,
  Mail,
  HeartHandshake,
  Radio,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Compass,
  FileText,
  Activity,
  CheckCircle,
  Eye,
  Percent,
  Sparkles,
  Search,
} from 'lucide-react';
import {
  summaryMetrics,
  channelBreakdownData,
  userHistoryData,
  trafficSourceData,
  topChannelsPerformance,
  topPagesPerformance,
  topConversionAssets,
  usGeoLeads,
  globalGeoLeads,
} from '../../data/mockData.ts';
import { GeoMap } from '../common/GeoMap.tsx';

interface AudienceAnalyticsTabProps {
  onNavigateToLeads: (filter?: string) => void;
}

export const AudienceAnalyticsTab: React.FC<AudienceAnalyticsTabProps> = ({
  onNavigateToLeads,
}) => {
  const [sessionHoverIndex, setSessionHoverIndex] = useState<number | null>(null);
  const [geoViewMode, setGeoViewMode] = useState<'us' | 'global'>('us');
  const [selectedGeoState, setSelectedGeoState] = useState<string | null>(null);
  const [channelPerformanceTab, setChannelPerformanceTab] = useState<'channels' | 'pages' | 'conversions'>('channels');

  // Lead Conversion Rate calculation from prompt specifications:
  // Leads % of Total Visitors: (Total Leads / Total Visitors) * 100
  const leadsPercentOfTotalVisitors = (
    (summaryMetrics.totalLeads / summaryMetrics.totalVisitors) *
    100
  ).toFixed(2);

  // Conversion %: (Converted Paying Clients / Total Leads) * 100
  const leadToPayingConversionPercent = (
    (summaryMetrics.convertedPayingClients / summaryMetrics.totalLeads) *
    100
  ).toFixed(1);

  // Icon mapper helper
  const getChannelIcon = (key: string) => {
    switch (key) {
      case 'website':
        return <Globe className="w-4 h-4 text-sky-600" />;
      case 'gbp':
        return <MapPin className="w-4 h-4 text-emerald-600" />;
      case 'social':
        return <Share2 className="w-4 h-4 text-indigo-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-purple-600" />;
      case 'referral':
        return <HeartHandshake className="w-4 h-4 text-[#149257]" />;
      case 'other':
        return <Radio className="w-4 h-4 text-slate-500" />;
      default:
        return <Globe className="w-4 h-4 text-slate-600" />;
    }
  };

  // Find selected state info if any
  const activeStateData = usGeoLeads.find((s) => s.stateCode === selectedGeoState);

  return (
    <div className="space-y-6 pb-12">
      {/* SECTION 1: TOP METRICS CARDS (KPI SUMMARY) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card 1: Total Visitors (Aggregate count across all platforms + New vs Returning performance) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Visitors
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 font-mono">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{summaryMetrics.totalVisitorsGrowth}%
              </span>
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
              {summaryMetrics.totalVisitors.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Aggregate count across all digital channels · Last 30 Days
            </p>

            {/* New User and Returning (Old) User breakdown with up/down performance */}
            <div className="grid grid-cols-2 gap-2.5 mt-3.5 pt-3 border-t border-slate-100">
              {/* New Visitors */}
              <div className="p-2.5 bg-[#eef3fc] rounded-lg border border-[#c9d7f3]/80">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#193d85]">
                    New Users
                  </span>
                  <span className="flex items-center gap-0.5 text-[10px] font-mono font-bold text-emerald-600">
                    <ArrowUpRight className="w-3 h-3" />
                    +{summaryMetrics.newVisitorsGrowth}%
                  </span>
                </div>
                <div className="mt-1 text-lg font-black text-[#193d85] font-mono tabular-nums">
                  {summaryMetrics.newVisitors.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  First-time visitors (64%)
                </div>
              </div>

              {/* Returning (Old) Visitors */}
              <div className="p-2.5 bg-[#e8f7ef] rounded-lg border border-[#bce5cf]/80">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#149257]">
                    Returning Users
                  </span>
                  <span className="flex items-center gap-0.5 text-[10px] font-mono font-bold text-emerald-600">
                    <ArrowUpRight className="w-3 h-3" />
                    +{summaryMetrics.returningVisitorsGrowth}%
                  </span>
                </div>
                <div className="mt-1 text-lg font-black text-[#149257] font-mono tabular-nums">
                  {summaryMetrics.returningVisitors.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Repeat practices (36%)
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Card 2: Traffic Channel Breakdown (of Total Leads) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Traffic Channel Breakdown
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {summaryMetrics.totalLeads.toLocaleString()} Leads Total
              </span>
            </div>

            {/* Breakdown Bars */}
            <div className="mt-3 space-y-2.5">
              {channelBreakdownData.map((item) => (
                <div key={item.channelKey} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                      {getChannelIcon(item.channelKey)}
                      <span>{item.name.replace(' Visitors', '')}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-slate-500">
                        {item.visitors.toLocaleString()} vis.
                      </span>
                      <span className="font-bold text-slate-900">
                        {item.leads.toLocaleString()} ({item.shareOfLeads}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.shareOfLeads}%`,
                        backgroundColor:
                          item.channelKey === 'website'
                            ? '#193d85'
                            : item.channelKey === 'gbp'
                            ? '#149257'
                            : item.channelKey === 'social'
                            ? '#2a5aae'
                            : item.channelKey === 'email'
                            ? '#0f7a47'
                            : item.channelKey === 'referral'
                            ? '#1eb26c'
                            : '#64748b',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Primary Drivers: Website (40%) & GBP (27%)</span>
            <span>Referrals & Other (13%)</span>
          </div>
        </div>

        {/* Card 3: Lead Conversion Rate Card */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Qualified Lead Conversions
              </span>
              <span className="text-[11px] text-[#193d85] font-bold bg-[#eef3fc] border border-[#c9d7f3] px-2.5 py-0.5 rounded font-mono">
                {summaryMetrics.totalLeads.toLocaleString()} Total Leads
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              {/* Metric 1: Qualified Leads */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[11px] font-semibold text-slate-700 leading-tight">
                  Qualified Leads
                </div>
                <div className="mt-1 text-2xl font-black text-[#193d85] font-mono tabular-nums">
                  {summaryMetrics.qualifiedLeads.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                  {summaryMetrics.qualifiedLeadsShare}% of total inquiries
                </div>
              </div>

              {/* Metric 2: Conversion rate from qualified leads */}
              <div className="p-3 bg-[#e8f7ef]/70 rounded-lg border border-[#bce5cf]">
                <div className="text-[11px] font-semibold text-[#0f7a47] leading-tight">
                  Conversion from Qualified
                </div>
                <div className="mt-1 text-2xl font-black text-[#149257] font-mono tabular-nums">
                  {summaryMetrics.qualifiedConversionPercent}%
                </div>
                <div className="text-[10px] text-[#149257] mt-0.5 font-medium">
                  {summaryMetrics.convertedPayingClients.toLocaleString()} paying practices
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
              <strong className="text-slate-900 font-semibold">{summaryMetrics.convertedPayingClients.toLocaleString()} paying medical practices</strong> onboarded from {summaryMetrics.qualifiedLeads.toLocaleString()} validated qualified leads.
            </p>

            {/* Comprehensive Conversion Rates Summary */}
            <div className="grid grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-slate-100">
              <div className="bg-slate-50 p-2 rounded-lg">
                <div className="text-[10px] text-slate-500 font-medium">Leads % of Visitors</div>
                <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">{leadsPercentOfTotalVisitors}%</div>
                <div className="text-[9.5px] text-slate-400">Total inquiries / visitors</div>
              </div>
              <div className="bg-emerald-50/60 p-2 rounded-lg border border-emerald-100/60">
                <div className="text-[10px] text-[#0f7a47] font-medium">Lead-to-Client Rate</div>
                <div className="text-sm font-bold text-[#149257] font-mono mt-0.5">{leadToPayingConversionPercent}%</div>
                <div className="text-[9.5px] text-emerald-600">Paying / Total leads</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2 & 3: USER HISTORY & TRAFFIC SOURCE DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 2. User History Card */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                User History & Session Cohorts
              </h3>
              <p className="text-xs text-slate-500">
                Comparison of first-time prospective practices vs returning clinical visitors
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#193d85]"></span>
                <span>New Sessions ({userHistoryData.newSessionsPercent}%)</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#149257]"></span>
                <span>Returning ({userHistoryData.returningSessionsPercent}%)</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="p-2.5 bg-slate-50 rounded-lg text-center">
              <div className="text-[11px] text-slate-500">Total User Sessions</div>
              <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                {userHistoryData.totalSessions.toLocaleString()}
              </div>
            </div>
            <div className="p-2.5 bg-[#eef3fc] rounded-lg text-center border border-[#c9d7f3]">
              <div className="text-[11px] text-[#193d85] font-semibold">New Sessions</div>
              <div className="text-lg font-bold text-[#193d85] font-mono tabular-nums">
                {userHistoryData.newSessions.toLocaleString()}
              </div>
            </div>
            <div className="p-2.5 bg-[#e8f7ef] rounded-lg text-center border border-[#bce5cf]">
              <div className="text-[11px] text-[#149257] font-semibold">Returning Sessions</div>
              <div className="text-lg font-bold text-[#149257] font-mono tabular-nums">
                {userHistoryData.returningSessions.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Timeline Bar Chart (Interactive) */}
          <div className="relative pt-2">
            <div className="h-44 flex items-end justify-between gap-1.5 px-1">
              {userHistoryData.sessionsTimeline.map((item, idx) => {
                const total = item.newSessions + item.returningSessions;
                const max = 30000;
                const heightPercent = Math.min(100, (total / max) * 100);
                const newRatio = (item.newSessions / total) * 100;
                const returnRatio = (item.returningSessions / total) * 100;
                const isHovered = sessionHoverIndex === idx;

                return (
                  <div
                    key={item.date}
                    className="flex-1 flex flex-col items-center group relative cursor-pointer"
                    onMouseEnter={() => setSessionHoverIndex(idx)}
                    onMouseLeave={() => setSessionHoverIndex(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-14 bg-slate-900 text-white text-[11px] p-2 rounded shadow-lg z-30 whitespace-nowrap font-mono pointer-events-none">
                        <div className="font-bold text-slate-100">{item.date}</div>
                        <div>New: {item.newSessions.toLocaleString()}</div>
                        <div>Returning: {item.returningSessions.toLocaleString()}</div>
                      </div>
                    )}

                    {/* Stacked Bar */}
                    <div
                      className={`w-full max-w-6 rounded-t transition-all ${
                        isHovered ? 'ring-2 ring-[#193d85]' : ''
                      } overflow-hidden flex flex-col justify-end`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div
                        className="w-full bg-[#149257]"
                        style={{ height: `${returnRatio}%` }}
                      />
                      <div
                        className="w-full bg-[#193d85]"
                        style={{ height: `${newRatio}%` }}
                      />
                    </div>

                    <span className="text-[10px] text-slate-400 mt-1.5 block font-mono">
                      {item.date.split(' ')[1]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Avg Session Duration: <strong className="text-slate-800 font-mono">{userHistoryData.avgSessionDuration}</strong></span>
            <span>Pages / Session: <strong className="text-slate-800 font-mono">{userHistoryData.avgPagesPerSession}</strong></span>
            <span>Repeat Velocity: <strong className="text-[#149257] font-mono">{userHistoryData.repeatEngagementIndex}</strong></span>
          </div>
        </div>

        {/* 3. Traffic Source Distribution Card */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                  Traffic Source Distribution
                </h3>
                <p className="text-xs text-slate-500">
                  Standard attribution across origin channels
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">100% Attributed</span>
            </div>

            {/* Horizontal Color Bar Distribution */}
            <div className="mt-4">
              <div className="h-3 w-full rounded-full overflow-hidden flex shadow-xs">
                {trafficSourceData.map((src) => (
                  <div
                    key={src.channel}
                    style={{
                      width: `${src.percentage}%`,
                      backgroundColor: src.color,
                    }}
                    title={`${src.channel}: ${src.percentage}%`}
                  />
                ))}
              </div>
            </div>

            {/* Channel rows */}
            <div className="mt-4 space-y-2.5">
              {trafficSourceData.map((src) => (
                <div
                  key={src.channel}
                  className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: src.color }}
                    />
                    <span className="font-semibold text-slate-800">{src.channel}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono tabular-nums text-[11px]">
                    <span className="text-slate-500">{src.visitors.toLocaleString()} vis.</span>
                    <span className="font-bold text-slate-900">{src.percentage}%</span>
                    <span className="text-emerald-700 font-medium">({src.conversionRate}% conv)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Highest conversion: Referral (2.83%)</span>
            <span>Highest volume: Organic Search (34%)</span>
          </div>
        </div>
      </div>

      {/* SECTION 4: PLATFORM & CHANNEL PERFORMANCE */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base tracking-tight">
              Platform & Channel Performance
            </h3>
            <p className="text-xs text-slate-500">
              Deep dive into lead drivers, high-traffic website routes, and conversion assets
            </p>
          </div>

          {/* Interactive switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setChannelPerformanceTab('channels')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                channelPerformanceTab === 'channels'
                  ? 'bg-[#193d85] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#193d85]'
              }`}
            >
              Top Channels by Leads
            </button>
            <button
              onClick={() => setChannelPerformanceTab('pages')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                channelPerformanceTab === 'pages'
                  ? 'bg-[#193d85] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#193d85]'
              }`}
            >
              Top Pages by Traffic
            </button>
            <button
              onClick={() => setChannelPerformanceTab('conversions')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                channelPerformanceTab === 'conversions'
                  ? 'bg-[#193d85] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#193d85]'
              }`}
            >
              Top Conversion Assets
            </button>
          </div>
        </div>

        {/* View 1: Top Channels by Lead Performance */}
        {channelPerformanceTab === 'channels' && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="pb-2.5">Marketing Channel</th>
                  <th className="pb-2.5 text-right">Leads Generated</th>
                  <th className="pb-2.5 text-right">Lead Share</th>
                  <th className="pb-2.5 text-right">Conversion Rate</th>
                  <th className="pb-2.5 text-right">Paying Clients</th>
                  <th className="pb-2.5 text-right">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topChannelsPerformance.map((ch, i) => (
                  <tr key={ch.channelName} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-semibold text-slate-900 flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-[11px]">0{i + 1}.</span>
                      <span>{ch.channelName}</span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {ch.leads.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono text-slate-600 tabular-nums">
                      {ch.share}
                    </td>
                    <td className="py-3 text-right font-mono font-semibold text-emerald-700 tabular-nums">
                      {ch.conversionRate}
                    </td>
                    <td className="py-3 text-right font-mono text-slate-800 tabular-nums font-semibold">
                      {ch.payingClients} practices
                    </td>
                    <td className="py-3 text-right font-medium text-slate-500">
                      {ch.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* View 2: Top Pages by Traffic */}
        {channelPerformanceTab === 'pages' && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="pb-2.5">Landing Page / Route</th>
                  <th className="pb-2.5 text-right">Pageviews</th>
                  <th className="pb-2.5 text-right">Unique Visitors</th>
                  <th className="pb-2.5 text-right">Avg Time</th>
                  <th className="pb-2.5 text-right">Leads Produced</th>
                  <th className="pb-2.5 text-right">Conv. Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topPagesPerformance.map((pg) => (
                  <tr key={pg.path} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-semibold text-slate-900">
                      <div>{pg.title}</div>
                      <div className="text-[11px] font-mono text-slate-400">{pg.path}</div>
                    </td>
                    <td className="py-3 text-right font-mono text-slate-800 tabular-nums">
                      {pg.pageviews.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono text-slate-600 tabular-nums">
                      {pg.uniqueVisitors.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono text-slate-600 tabular-nums">
                      {pg.avgTimeOnPage}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {pg.leadsGenerated.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                      {pg.convRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* View 3: Top Performance by Conversions */}
        {channelPerformanceTab === 'conversions' && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="pb-2.5">Asset / Campaign Name</th>
                  <th className="pb-2.5">Asset Type</th>
                  <th className="pb-2.5 text-right">Submissions</th>
                  <th className="pb-2.5 text-right">Conversion Rate</th>
                  <th className="pb-2.5 text-right">Paying Practices</th>
                  <th className="pb-2.5 text-right">Attributed Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topConversionAssets.map((asset) => (
                  <tr key={asset.assetName} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-semibold text-slate-900">
                      {asset.assetName}
                    </td>
                    <td className="py-3 text-slate-500">
                      {asset.type}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {asset.submissions.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                      {asset.conversionRate}%
                    </td>
                    <td className="py-3 text-right font-mono text-slate-800 tabular-nums font-semibold">
                      {asset.payingClients}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      ${(asset.revenueGenerated / 1000).toLocaleString()}k
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 5: GEO PERFORMANCE CARD */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base tracking-tight">
                GEO Performance & Acquisition Heatmap
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                Interactive State / City / Country Density
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Lead acquisition density across geographic territories with medical practice cluster analytics
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                onClick={() => setGeoViewMode('us')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  geoViewMode === 'us'
                    ? 'bg-[#193d85] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#193d85]'
                }`}
              >
                US States Heatmap
              </button>
              <button
                onClick={() => setGeoViewMode('global')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  geoViewMode === 'global'
                    ? 'bg-[#193d85] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#193d85]'
                }`}
              >
                Global / International
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Map Column */}
          <div className="lg:col-span-8">
            {geoViewMode === 'us' ? (
              <GeoMap
                usData={usGeoLeads}
                selectedState={selectedGeoState}
                onSelectState={(st) => setSelectedGeoState(st === selectedGeoState ? null : st)}
              />
            ) : (
              <div className="p-6 bg-slate-900 rounded-xl text-white border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-semibold text-slate-200">International Healthcare Inquiries</span>
                  <span className="font-mono text-[#149257] text-xs font-bold">5,920 Leads Total</span>
                </div>
                <div className="space-y-3">
                  {globalGeoLeads.map((item) => (
                    <div key={item.country} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/60">
                      <span className="font-medium text-slate-300">{item.country}</span>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-slate-400">{item.visitors.toLocaleString()} vis.</span>
                        <span className="font-bold text-white tabular-nums">{item.leads.toLocaleString()} leads</span>
                        <span className="text-emerald-400 font-semibold">{item.share}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Territory Ranking Column */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-900">
                Top Acquisition Hubs
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Ranked</span>
            </div>

            <div className="divide-y divide-slate-200/80 mt-2 max-h-72 overflow-y-auto">
              {usGeoLeads.map((st, idx) => (
                <div
                  key={st.stateCode}
                  onClick={() => setSelectedGeoState(st.stateCode === selectedGeoState ? null : st.stateCode)}
                  className={`py-2 px-1 text-xs flex items-center justify-between cursor-pointer rounded transition-colors ${
                    selectedGeoState === st.stateCode ? 'bg-[#eef3fc] text-[#193d85] font-bold' : 'hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <span className="text-slate-400 font-mono text-[10px]">{idx + 1}.</span>
                      <span>{st.stateName}</span>
                      <span className="text-slate-400 font-normal">({st.stateCode})</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {st.topCity} · {st.topSpecialty}
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="font-bold text-slate-900 tabular-nums">
                      {st.leads.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#149257] font-semibold">
                      {st.convRate}% conv
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {activeStateData && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <button
                  onClick={() => onNavigateToLeads(activeStateData.stateCode)}
                  className="w-full py-1.5 px-3 bg-[#193d85] hover:bg-[#132f67] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Filter Leads for {activeStateData.stateName}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
