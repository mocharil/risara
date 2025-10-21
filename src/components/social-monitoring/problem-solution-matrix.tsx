// src/components/social-monitoring/problem-solution-matrix.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckSquare, AlertTriangle, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface ProblemSolutionItem {
  topic: string;
  mainIssue: string;
  problem: string;
  suggestion: string;
  urgency: number;
  platform: string;
}

export interface ProblemSolutionData {
  insights: ProblemSolutionItem[];
  stats: {
    total: number;
    critical: number;
    high: number;
    avgUrgency: number;
  };
  filters: {
    topics: string[];
  };
}

interface ProblemSolutionMatrixProps {
  data: ProblemSolutionData | null;
  isLoading: boolean;
  onFilterChange?: (topic: string) => void;
}

export function ProblemSolutionMatrix({ data, isLoading, onFilterChange }: ProblemSolutionMatrixProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const handleTopicChange = (value: string) => {
    setSelectedTopic(value);
    onFilterChange?.(value);
  };

  const getUrgencyBadge = (urgency: number) => {
    if (urgency >= 80) {
      return <Badge className="bg-red-100 text-red-700 border-red-300">Critical ({urgency})</Badge>;
    } else if (urgency >= 60) {
      return <Badge className="bg-orange-100 text-orange-700 border-orange-300">High ({urgency})</Badge>;
    } else if (urgency >= 40) {
      return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">Medium ({urgency})</Badge>;
    }
    return <Badge className="bg-green-100 text-green-700 border-green-300">Low ({urgency})</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-gray-500">Loading problem-solution matrix...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Problem vs Solution Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-gray-500 text-center">No insights available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-purple-600" />
              Problem vs Solution Matrix
            </CardTitle>
            <CardDescription>
              {data.stats.total} insights | {data.stats.critical} critical | Avg Urgency: {data.stats.avgUrgency.toFixed(1)}
            </CardDescription>
          </div>
          <Select value={selectedTopic} onValueChange={handleTopicChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {data.filters.topics.map(topic => (
                <SelectItem key={topic} value={topic}>{topic}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 text-red-600 mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium">Critical</span>
            </div>
            <div className="text-2xl font-bold text-red-700">{data.stats.critical}</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 text-orange-600 mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium">High</span>
            </div>
            <div className="text-2xl font-bold text-orange-700">{data.stats.high}</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <CheckSquare className="h-4 w-4" />
              <span className="text-xs font-medium">Total</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{data.stats.total}</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Filter className="h-4 w-4" />
              <span className="text-xs font-medium">Topics</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">{data.filters.topics.length}</div>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="w-32">Urgency</TableHead>
                  <TableHead className="w-40">Topic</TableHead>
                  <TableHead>Main Issue</TableHead>
                  <TableHead className="w-24">Platform</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.insights.map((item, index) => (
                  <React.Fragment key={index}>
                    <TableRow
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleRow(index)}
                    >
                      <TableCell>
                        {expandedRows.has(index) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </TableCell>
                      <TableCell>{getUrgencyBadge(item.urgency)}</TableCell>
                      <TableCell className="text-sm font-medium">{item.topic}</TableCell>
                      <TableCell className="text-sm">{item.mainIssue}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={item.platform === 'TikTok' ? 'bg-blue-100' : 'bg-gray-100'}>
                          {item.platform}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(index) && (
                      <TableRow>
                        <TableCell colSpan={5} className="bg-gray-50">
                          <div className="p-4 space-y-4">
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                Problem:
                              </h4>
                              <p className="text-sm text-gray-600 leading-relaxed pl-6">
                                {item.problem}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                                <CheckSquare className="h-4 w-4 text-green-600" />
                                Suggestion:
                              </h4>
                              <p className="text-sm text-gray-600 leading-relaxed pl-6">
                                {item.suggestion}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500 text-center">
          Click on any row to expand and view detailed problem & suggestion
        </div>
      </CardContent>
    </Card>
  );
}
