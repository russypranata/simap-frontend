'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Save, 
  X,
  Calendar,
  Users,
  Book,
  FileText,
  Lightbulb,
  Monitor,
  UserCheck,
  FileSearch,
  Clipboard,
  MessageSquare,
  Clock,
  BookOpen
} from 'lucide-react';
import { TeacherClass } from '@/features/teacher/types/teacher';
import { SUBJECTS, LESSON_HOURS } from '@/features/teacher/constants/attendance';

interface JournalFormData {
  date: string;
  class: string;
  subject: string;
  lessonHour: string[]; // Changed from string to string[] for multiple selection
  material: string;
  topic: string;
  teachingMethod: string[];
  media: string[];
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
      lessonHour: [], // Initialize as empty array instead of empty string
      material: '',
      topic: '',
      teachingMethod: [],
      media: [],
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
    // Prevent negative values
    const numValue = Math.max(0, parseInt(value) || 0);
    setFormData(prev => ({
      ...prev,
      attendance: { ...prev.attendance, [field]: numValue }
    }));
  };

  // Handle multiple selection for lesson hours
  const handleLessonHourChange = (value: string) => {
    setFormData(prev => {
      const currentHours = [...prev.lessonHour];
      const index = currentHours.indexOf(value);
      
      if (index >= 0) {
        // Remove if already selected
        currentHours.splice(index, 1);
      } else {
        // Add if not selected
        currentHours.push(value);
      }
      
      return { ...prev, lessonHour: currentHours };
    });
  };

  // Remove a selected lesson hour
  const removeLessonHour = (hour: string) => {
    setFormData(prev => ({
      ...prev,
      lessonHour: prev.lessonHour.filter(h => h !== hour)
    }));
  };

  // Handle multiple selection for teaching methods
  const handleTeachingMethodChange = (value: string) => {
    setFormData(prev => {
      const currentMethods = [...prev.teachingMethod];
      const index = currentMethods.indexOf(value);
      
      if (index >= 0) {
        // Remove if already selected
        currentMethods.splice(index, 1);
      } else {
        // Add if not selected
        currentMethods.push(value);
      }
      
      return { ...prev, teachingMethod: currentMethods };
    });
  };

  // Handle multiple selection for media
  const handleMediaChange = (value: string) => {
    setFormData(prev => {
      const currentMedia = [...prev.media];
      const index = currentMedia.indexOf(value);
      
      if (index >= 0) {
        // Remove if already selected
        currentMedia.splice(index, 1);
      } else {
        // Add if not selected
        currentMedia.push(value);
      }
      
      return { ...prev, media: currentMedia };
    });
  };

  // Remove a selected teaching method
  const removeTeachingMethod = (method: string) => {
    setFormData(prev => ({
      ...prev,
      teachingMethod: prev.teachingMethod.filter(m => m !== method)
    }));
  };

  // Remove a selected media
  const removeMedia = (media: string) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter(m => m !== media)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      {/* Academic Year and Semester Information as Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge className="bg-[#1E3A8A] text-white px-3 py-1 text-sm font-medium flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          2024/2025
        </Badge>
        <Badge className="bg-[#1E3A8A] text-white px-3 py-1 text-sm font-medium flex items-center gap-1">
          <BookOpen className="h-4 w-4" />
          Ganjil
        </Badge>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Tanggal *
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="class" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Kelas *
          </Label>
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
          <Label htmlFor="subject" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            Mata Pelajaran *
          </Label>
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
        
        {/* Add lesson hour field */}
        <div className="space-y-2">
          <Label htmlFor="lessonHour" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Jam Pelajaran *
          </Label>
          <Select onValueChange={handleLessonHourChange}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih jam pelajaran" />
            </SelectTrigger>
            <SelectContent>
              {LESSON_HOURS.map((hour) => (
                <SelectItem 
                  key={hour} 
                  value={hour}
                  disabled={formData.lessonHour.includes(hour)}
                >
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Display selected hours as tags */}
          {formData.lessonHour.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.lessonHour.map((hour) => (
                <Badge key={hour} className="flex items-center gap-1 pl-3 pr-1 py-1 bg-[#FACC15] text-white font-bold border border-white/20">
                  {hour}
                  <button 
                    type="button" 
                    onClick={() => removeLessonHour(hour)}
                    className="ml-1 hover:bg-white/10 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Material and Topic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="material" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Materi Pembelajaran *
          </Label>
          <Textarea
            id="material"
            placeholder="Masukkan materi pembelajaran"
            value={formData.material}
            onChange={(e) => handleInputChange('material', e.target.value)}
            rows={4}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="topic" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Kegiatan Pembelajaran *
          </Label>
          <Textarea
            id="topic"
            placeholder="Masukkan kegiatan pembelajaran"
            value={formData.topic}
            onChange={(e) => handleInputChange('topic', e.target.value)}
            rows={4}
          />
        </div>
      </div>

      {/* Teaching Method and Media */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="teachingMethod" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Metode Mengajar
          </Label>
          <Select onValueChange={handleTeachingMethodChange}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih metode mengajar" />
            </SelectTrigger>
            <SelectContent>
              {teachingMethods.map((method) => (
                <SelectItem 
                  key={method} 
                  value={method}
                  disabled={formData.teachingMethod.includes(method)}
                >
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Display selected methods as tags */}
          {formData.teachingMethod.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.teachingMethod.map((method) => (
                <Badge key={method} className="flex items-center gap-1 pl-3 pr-1 py-1 bg-[#FACC15] text-white font-bold border border-white/20">
                  {method}
                  <button 
                    type="button" 
                    onClick={() => removeTeachingMethod(method)}
                    className="ml-1 hover:bg-white/10 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="media" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Media Pembelajaran
          </Label>
          <Select onValueChange={handleMediaChange}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih media pembelajaran" />
            </SelectTrigger>
            <SelectContent>
              {mediaOptions.map((media) => (
                <SelectItem 
                  key={media} 
                  value={media}
                  disabled={formData.media.includes(media)}
                >
                  {media}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Display selected media as tags */}
          {formData.media.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.media.map((media) => (
                <Badge key={media} className="flex items-center gap-1 pl-3 pr-1 py-1 bg-[#FACC15] text-white font-bold border border-white/20">
                  {media}
                  <button 
                    type="button" 
                    onClick={() => removeMedia(media)}
                    className="ml-1 hover:bg-white/10 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Attendance */}
      <div>
        <Label className="flex items-center gap-2">
          <UserCheck className="h-4 w-4" />
          Absensi Siswa
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="total" className="text-xs flex items-center gap-1">
              <Users className="h-3 w-3" />
              Total Siswa
            </Label>
            <Input
              id="total"
              type="number"
              min="0"
              placeholder="0"
              value={formData.attendance.total}
              onChange={(e) => handleAttendanceChange('total', e.target.value)}
              readOnly={true}
              className="bg-muted cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="present" className="text-xs flex items-center gap-1">
              <UserCheck className="h-3 w-3" />
              Hadir
            </Label>
            <Input
              id="present"
              type="number"
              min="0"
              placeholder="0"
              value={formData.attendance.present}
              onChange={(e) => handleAttendanceChange('present', e.target.value)}
              readOnly={true}
              className="bg-muted cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sick" className="text-xs flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Sakit
            </Label>
            <Input
              id="sick"
              type="number"
              min="0"
              placeholder="0"
              value={formData.attendance.sick}
              onChange={(e) => handleAttendanceChange('sick', e.target.value)}
              readOnly={true}
              className="bg-muted cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="permit" className="text-xs flex items-center gap-1">
              <Clipboard className="h-3 w-3" />
              Izin
            </Label>
            <Input
              id="permit"
              type="number"
              min="0"
              placeholder="0"
              value={formData.attendance.permit}
              onChange={(e) => handleAttendanceChange('permit', e.target.value)}
              readOnly={true}
              className="bg-muted cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="absent" className="text-xs flex items-center gap-1">
              <X className="h-3 w-3" />
              Alpa
            </Label>
            <Input
              id="absent"
              type="number"
              min="0"
              placeholder="0"
              value={formData.attendance.absent}
              onChange={(e) => handleAttendanceChange('absent', e.target.value)}
              readOnly={true}
              className="bg-muted cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Evaluation */}
      <div className="space-y-2">
        <Label htmlFor="evaluation" className="flex items-center gap-2">
          <FileSearch className="h-4 w-4" />
          Evaluasi Pembelajaran
        </Label>
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
        <Label htmlFor="notes" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Catatan Tambahan
        </Label>
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