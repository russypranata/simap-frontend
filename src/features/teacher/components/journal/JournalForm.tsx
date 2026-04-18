/* eslint-disable @typescript-eslint/no-explicit-any , @typescript-eslint/no-unused-vars */
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
  BookOpen,
  Plus,
  Check,
  ChevronsUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const DUMMY_MATERIALS = [
  {
    id: '1',
    title: 'Aljabar Linear',
    learningObjectives: [
      'Memahami konsep dasar matriks dan vektor',
      'Menyelesaikan sistem persamaan linear dengan metode eliminasi',
      'Menghitung determinan dan invers matriks',
      'Memahami konsep transformasi linear'
    ]
  },
  {
    id: '2',
    title: 'Statistika & Peluang',
    learningObjectives: [
      'Menyajikan data dalam bentuk tabel dan diagram',
      'Menghitung ukuran pemusatan data (Mean, Median, Modus)',
      'Menghitung ukuran penyebaran data',
      'Memahami konsep peluang kejadian majemuk'
    ]
  },
  {
    id: '3',
    title: 'Geometri Dimensi Tiga',
    learningObjectives: [
      'Mendeskripsikan jarak dalam ruang',
      'Menghitung jarak antar titik dalam ruang',
      'Menghitung jarak titik ke garis dalam ruang',
      'Menghitung jarak titik ke bidang dalam ruang'
    ]
  },
  {
    id: '4',
    title: 'Trigonometri',
    learningObjectives: [
      'Memahami satuan ukuran sudut',
      'Menentukan nilai perbandingan trigonometri',
      'Menerapkan aturan sinus dan cosinus',
      'Menyelesaikan masalah luas segitiga'
    ]
  }
];
import { TeacherClass } from '@/features/teacher/types/teacher';
import { SUBJECTS, LESSON_HOURS } from '@/features/teacher/constants/attendance';

interface JournalFormData {
  date: string;
  class: string;
  subject: string;
  lessonHour: string; // Changed from string[] to string for single selection
  material: string;
  learningObjective: string;
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
  mode?: 'create' | 'edit';
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
  mode = 'create',
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<JournalFormData>(
    initialData || {
      date: new Date().toISOString().split('T')[0],
      class: '',
      subject: '',
      lessonHour: '', // Initialize as empty string
      material: '',
      learningObjective: '',
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

  const [customMethod, setCustomMethod] = useState('');
  const [customMedia, setCustomMedia] = useState('');
  const [showCustomMethodInput, setShowCustomMethodInput] = useState(false);
  const [showCustomMediaInput, setShowCustomMediaInput] = useState(false);

  // States for search filters
  const [openMaterial, setOpenMaterial] = useState(false);
  const [openTp, setOpenTp] = useState(false);

  const availableTPs = DUMMY_MATERIALS.find(m => m.title === formData.material)?.learningObjectives || [];

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

  // Add custom teaching method
  const addCustomMethod = () => {
    if (customMethod.trim() && !formData.teachingMethod.includes(customMethod.trim())) {
      setFormData(prev => ({
        ...prev,
        teachingMethod: [...prev.teachingMethod, customMethod.trim()]
      }));
      setCustomMethod('');
      setShowCustomMethodInput(false);
    }
  };

  // Add custom media
  const addCustomMedia = () => {
    if (customMedia.trim() && !formData.media.includes(customMedia.trim())) {
      setFormData(prev => ({
        ...prev,
        media: [...prev.media, customMedia.trim()]
      }));
      setCustomMedia('');
      setShowCustomMediaInput(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-6">
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
            <SelectTrigger className="bg-white border-slate-200 shadow-sm">
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
            <SelectTrigger className="bg-white border-slate-200 shadow-sm">
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

        {/* Lesson hour field - Single Selection */}
        <div className="space-y-2">
          <Label htmlFor="lessonHour" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Jam Pelajaran *
          </Label>
          <Select
            value={formData.lessonHour}
            onValueChange={(value) => handleInputChange('lessonHour', value)}
          >
            <SelectTrigger className="bg-white border-slate-200 shadow-sm">
              <SelectValue placeholder="Pilih jam pelajaran" />
            </SelectTrigger>
            <SelectContent>
              {LESSON_HOURS.map((hour) => (
                <SelectItem
                  key={hour}
                  value={hour}
                >
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Material and Topic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Material Dropdown */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Materi Pembelajaran *
          </Label>
          <Popover open={openMaterial} onOpenChange={setOpenMaterial}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openMaterial}
                className="w-full justify-between"
              >
                <span className="truncate text-left font-normal">
                  {formData.material ? formData.material : "Pilih materi..."}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Cari materi..." />
                <CommandList>
                  <CommandEmpty>Materi tidak ditemukan.</CommandEmpty>
                  <CommandGroup>
                    {DUMMY_MATERIALS.map((material) => (
                      <CommandItem
                        key={material.id}
                        value={material.title}
                        onSelect={(currentValue) => {
                          handleInputChange('material', currentValue === formData.material ? "" : currentValue);
                          // Reset TP when material changes
                          handleInputChange('learningObjective', "");
                          setOpenMaterial(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 shrink-0",
                            formData.material === material.title ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {material.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* TP Dropdown (Dependent) */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Tujuan Pembelajaran *
          </Label>
          <Popover open={openTp} onOpenChange={setOpenTp}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openTp}
                disabled={!formData.material}
                className="w-full justify-between"
              >
                <span className="truncate text-left font-normal">
                  {formData.learningObjective
                    ? formData.learningObjective
                    : "Pilih tujuan pembelajaran..."}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Cari TP..." />
                <CommandList>
                  <CommandEmpty>TP tidak ditemukan.</CommandEmpty>
                  <CommandGroup>
                    {availableTPs.map((tp) => (
                      <CommandItem
                        key={tp}
                        value={tp}
                        onSelect={(currentValue) => {
                          handleInputChange('learningObjective', currentValue === formData.learningObjective ? "" : currentValue);
                          setOpenTp(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 shrink-0",
                            formData.learningObjective === tp ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {tp}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
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

      {/* Teaching Method and Media */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="teachingMethod" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Metode Mengajar
          </Label>
          <div className="flex gap-2">
            <Select onValueChange={handleTeachingMethodChange}>
              <SelectTrigger className="flex-1 bg-white border-slate-200 shadow-sm">
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

            {!showCustomMethodInput && (
              <Button
                type="button"
                size="icon"
                onClick={() => setShowCustomMethodInput(true)}
                className="shrink-0 bg-blue-800 hover:bg-blue-900 text-white"
                title="Tambah metode kustom"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Custom method input */}
          {showCustomMethodInput && (
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Masukkan metode kustom"
                value={customMethod}
                onChange={(e) => setCustomMethod(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomMethod())}
              />
              <Button type="button" size="sm" onClick={addCustomMethod} className="bg-blue-800 hover:bg-blue-900 text-white">
                <Plus className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => { setShowCustomMethodInput(false); setCustomMethod(''); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Display selected methods as tags */}
          {formData.teachingMethod.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.teachingMethod.map((method) => (
                <Badge key={method} className="flex items-center gap-1 pl-3 pr-1 py-1 bg-primary/10 text-primary border border-primary/20">
                  {method}
                  <button
                    type="button"
                    onClick={() => removeTeachingMethod(method)}
                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
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
          <div className="flex gap-2">
            <Select onValueChange={handleMediaChange}>
              <SelectTrigger className="flex-1 bg-white border-slate-200 shadow-sm">
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

            {!showCustomMediaInput && (
              <Button
                type="button"
                size="icon"
                onClick={() => setShowCustomMediaInput(true)}
                className="shrink-0 bg-blue-800 hover:bg-blue-900 text-white"
                title="Tambah media kustom"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Custom media input */}
          {showCustomMediaInput && (
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Masukkan media kustom"
                value={customMedia}
                onChange={(e) => setCustomMedia(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomMedia())}
              />
              <Button type="button" size="sm" onClick={addCustomMedia} className="bg-blue-800 hover:bg-blue-900 text-white">
                <Plus className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => { setShowCustomMediaInput(false); setCustomMedia(''); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Display selected media as tags */}
          {formData.media.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.media.map((media) => (
                <Badge key={media} className="flex items-center gap-1 pl-3 pr-1 py-1 bg-primary/10 text-primary border border-primary/20">
                  {media}
                  <button
                    type="button"
                    onClick={() => removeMedia(media)}
                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
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
        <Label className="flex items-center gap-2 mb-3">
          <UserCheck className="h-4 w-4" />
          Rekapitulasi Absensi Siswa
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex flex-col items-center justify-center space-y-1">
            <span className="text-xs font-medium text-primary/80 uppercase tracking-wider flex items-center gap-1">
              <Users className="h-3 w-3" />
              Total
            </span>
            <span className="text-2xl font-bold text-primary">
              {formData.attendance.total}
            </span>
            <span className="text-[10px] text-primary/60">Siswa</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-col items-center justify-center space-y-1">
            <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider flex items-center gap-1">
              <UserCheck className="h-3 w-3" />
              Hadir
            </span>
            <span className="text-2xl font-bold text-emerald-700">
              {formData.attendance.present}
            </span>
            <span className="text-[10px] text-emerald-500">Siswa</span>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex flex-col items-center justify-center space-y-1">
            <span className="text-xs font-medium text-yellow-600 uppercase tracking-wider flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Sakit
            </span>
            <span className="text-2xl font-bold text-yellow-700">
              {formData.attendance.sick}
            </span>
            <span className="text-[10px] text-yellow-500">Siswa</span>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex flex-col items-center justify-center space-y-1">
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wider flex items-center gap-1">
              <Clipboard className="h-3 w-3" />
              Izin
            </span>
            <span className="text-2xl font-bold text-blue-700">
              {formData.attendance.permit}
            </span>
            <span className="text-[10px] text-blue-500">Siswa</span>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex flex-col items-center justify-center space-y-1">
            <span className="text-xs font-medium text-rose-600 uppercase tracking-wider flex items-center gap-1">
              <X className="h-3 w-3" />
              Alpa
            </span>
            <span className="text-2xl font-bold text-rose-700">
              {formData.attendance.absent}
            </span>
            <span className="text-[10px] text-rose-500">Siswa</span>
          </div>
        </div>
      </div>

      {/* Evaluation */}
      <div className="space-y-2">
        <Label htmlFor="evaluation" className="flex items-center gap-2">
          <FileSearch className="h-4 w-4" />
          Asesmen
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
        <Button onClick={handleSubmit} disabled={isSaving} className="bg-blue-800 hover:bg-blue-900 text-white">
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
    </div >
  );
};