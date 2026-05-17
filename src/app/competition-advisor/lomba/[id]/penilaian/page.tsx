"use client";

import React, { useState } from "react";
import { Star, Save, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import {
  PageHeader,
  EmptyState,
  ErrorState,
  SkeletonPageHeader,
  SkeletonTableRow,
} from "@/features/shared/components";
import {
  useCompetitionAdvisorAssessments,
  useSaveCompetitionAdvisorAssessments,
} from "@/features/competition-advisor/hooks/useCompetitionAdvisor";

export default function CompetitionAdvisorPenilaianPage() {
  const params = useParams();
  const extracurricularId = Number(params?.id);

  const { data, isLoading, error, refetch } = useCompetitionAdvisorAssessments(extracurricularId);
  const saveMutation = useSaveCompetitionAdvisorAssessments(extracurricularId);

  const [scores, setScores] = useState<Record<number, Record<string, { score: string; note: string }>>>({});
  const [aspects, setAspects] = useState<string[]>([]);
  const [newAspect, setNewAspect] = useState("");

  const members = data?.members || [];
  const currentAspects = aspects.length > 0 ? aspects : data?.aspects || [];

  const handleScoreChange = (membershipId: number, aspect: string, field: 'score' | 'note', value: string) => {
    setScores((prev) => ({
      ...prev,
      [membershipId]: {
        ...(prev[membershipId] || {}),
        [aspect]: {
          ...(prev[membershipId]?.[aspect] || {}),
          [field]: value,
        },
      },
    }));
  };

  const handleAddAspect = () => {
    if (newAspect.trim() && !currentAspects.includes(newAspect.trim())) {
      setAspects([...currentAspects, newAspect.trim()]);
      setNewAspect("");
    }
  };

  const handleRemoveAspect = (aspect: string) => {
    setAspects(currentAspects.filter((a) => a !== aspect));
  };

  const handleSave = () => {
    const payload = [];
    for (const [membershipId, aspectsData] of Object.entries(scores)) {
      for (const [aspect, data] of Object.entries(aspectsData)) {
        if (data.score) {
          payload.push({
            membership_id: Number(membershipId),
            aspect,
            score: Number(data.score),
            note: data.note || undefined,
          });
        }
      }
    }

    if (payload.length > 0) {
      saveMutation.mutate({ assessments: payload });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <SkeletonPageHeader />
        <Card>
          <CardContent className="p-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonTableRow key={i} cols={4} />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) return <ErrorState error={error.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Penilaian"
        titleHighlight="Latihan Lomba"
        icon={Star}
        description="Input nilai dan evaluasi anggota tim"
      >
        <Button
          className="bg-amber-800 hover:bg-amber-900 text-white"
          onClick={handleSave}
          disabled={saveMutation.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {saveMutation.isPending ? "Menyimpan..." : "Simpan Penilaian"}
        </Button>
      </PageHeader>

      {/* Aspect Management */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-slate-700">Aspek Penilaian:</span>
            {currentAspects.map((aspect) => (
              <Badge
                key={aspect}
                variant="secondary"
                className="bg-white border-slate-200 text-slate-700 flex items-center gap-1"
              >
                {aspect}
                <button
                  onClick={() => handleRemoveAspect(aspect)}
                  className="ml-1 hover:text-red-600"
                >
                  <Minus className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Tambah aspek..."
                value={newAspect}
                onChange={(e) => setNewAspect(e.target.value)}
                className="h-8 w-40 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleAddAspect()}
              />
              <Button size="sm" className="h-8 px-2" onClick={handleAddAspect}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Daftar Penilaian</CardTitle>
                <CardDescription>Input nilai per aspek untuk setiap anggota</CardDescription>
              </div>
            </div>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              {members.length} Anggota
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-12">No</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Nama</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Kelas</th>
                  {currentAspects.map((aspect) => (
                    <th
                      key={aspect}
                      className="text-center p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 min-w-[100px]"
                    >
                      {aspect}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={3 + currentAspects.length}>
                      <EmptyState
                        icon={Star}
                        title="Belum ada anggota"
                        description="Tambahkan anggota terlebih dahulu di menu Anggota Tim"
                      />
                    </td>
                  </tr>
                ) : (
                  members.map((member, index) => (
                    <tr
                      key={member.membership_id}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 text-sm text-slate-500">{index + 1}</td>
                      <td className="p-4 text-sm font-medium text-slate-800">{member.name}</td>
                      <td className="p-4">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-200">
                          {member.class}
                        </Badge>
                      </td>
                      {currentAspects.map((aspect) => {
                        const existingScore = member.scores[aspect]?.score;
                        const currentValue =
                          scores[member.membership_id]?.[aspect]?.score ??
                          (existingScore !== undefined ? String(existingScore) : "");

                        return (
                          <td key={aspect} className="p-4 text-center">
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              placeholder="0"
                              value={currentValue}
                              onChange={(e) =>
                                handleScoreChange(member.membership_id, aspect, "score", e.target.value)
                              }
                              className="h-8 w-20 mx-auto text-center text-sm"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
