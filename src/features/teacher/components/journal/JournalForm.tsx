'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw, Save } from 'lucide-react';
import { TeacherClass } from '@/features/teacher/types/teacher';

interface JournalFormData {
  date: string;
  class: string;
  subject: string;
  material: string;
  topic: string;
  teachingMethod: string;
  media: string;
  evaluation: string;
  notes: string;
  attendance: {
    total: number;
    present: number;
    sick: number;
    permit: number;
    absent: number;
  };
}

interface JournalFormProps {
  initialData?: JournalFormData;
  classes: TeacherClass[];
  subjects: string[];
  teachingMethods: string[];
  mediaOptions: string[];
  isSaving: boolean;
  onSave: (data: JournalFormData) => void;
  onCancel: () => void;
}

export const JournalForm: React.FC<JournalFormProps> = ({
  initialData,
  classes,
  subjects,
  teachingMethods,
  mediaOptions,
  isSaving,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<JournalFormData>(
    initialData || {
      date: new Date().toISOString().split('T')[0],
      class: '',
      subject: '',
      material: '',
      topic: '',
      teachingMethod: '',
      media: '',
      evaluation: '',
      notes: '',
      attendance: {
        total: 0,
        present: 0,
        sick: 0,
        permit: 0,
        absent: 0,
      },
    }
  );

  const handleInputChange = (field: keyof JournalFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAttendanceChange = (field: keyof JournalFormData['attendance'], value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      attendance: { ...prev.attendance, [field]: numValue }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Tanggal *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="class">Kelas *</Label>
          <Select value={formData.class} onValueChange={(value) => handleInputChange('class', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kelas" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.name}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subject">Mata Pelajaran *</Label>
          <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih mata pelajaran" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Material and Topic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="material">Materi Pembelajaran *</Label>
          <Input
            id="material"
            placeholder="Contoh: Turunan Fungsi"
            value={formData.material}
            onChange={(e) => handleInputChange('material', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="topic">Topik Pembelajaran *</Label>
          <Input
            id="topic"
            placeholder="Contoh: Turunan dari sin(x), cos(x), tan(x)"
            value={formData.topic}
            onChange={(e) => handleInputChange('topic', e.target.value)}
          />
        </div>
      </div>

      {/* Teaching Method and Media */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="teachingMethod">Metode Mengajar</Label>
          <Select value={formData.teachingMethod} onValueChange={(value) => handleInputChange('teachingMethod', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih metode mengajar" />
            </SelectTrigger>
            <SelectContent>
              {teachingMethods.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="media">Media Pembelajaran</Label>
          <Select value={formData.media} onValueChange={(value) => handleInputChange('media', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih media pembelajaran" />
            </SelectTrigger>
            <SelectContent>
              {mediaOptions.map((media) => (
                <SelectItem key={media} value={media}>
                  {media}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Attendance */}
      <div>
        <Label>Absensi Siswa</Label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="total" className="text-xs">Total Siswa</Label>
            <Input
              id="total"
              type="number"
              placeholder="0"
              value={formData.attendance.total}
              onChange={(e) => handleAttendanceChange('total', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="present" className="text-xs">Hadir</Label>
            <Input
              id="present"
              type="number"
              placeholder="0"
              value={formData.attendance.present}
              onChange={(e) => handleAttendanceChange('present', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sick" className="text-xs">Sakit</Label>
            <Input
              id="sick"
              type="number"
              placeholder="0"
              value={formData.attendance.sick}
              onChange={(e) => handleAttendanceChange('sick', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="permit" className="text-xs">Izin</Label>
            <Input
              id="permit"
              type="number"
              placeholder="0"
              value={formData.attendance.permit}
              onChange={(e) => handleAttendanceChange('permit', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="absent" className="text-xs">Alpa</Label>
            <Input
              id="absent"
              type="number"
              placeholder="0"
              value={formData.attendance.absent}
              onChange={(e) => handleAttendanceChange('absent', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Evaluation */}
      <div className="space-y-2">
        <Label htmlFor="evaluation">Evaluasi Pembelajaran</Label>
        <Textarea
          id="evaluation"
          placeholder="Contoh: Tugas individu, Quiz singkat, Observasi partisipasi siswa"
          value={formData.evaluation}
          onChange={(e) => handleInputChange('evaluation', e.target.value)}
          rows={3}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Catatan Tambahan</Label>
        <Textarea
          id="notes"
          placeholder="Catatan tentang proses pembelajaran, kendala yang dihadapi, atau hal lain yang perlu dicatat"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={4}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Menyimpan...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Simpan Jurnal</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};