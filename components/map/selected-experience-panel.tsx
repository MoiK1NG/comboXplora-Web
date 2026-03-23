"use client";

import React from 'react';
import { MapPin, Clock, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { MapItem } from '../../lib/types';

interface SelectedExperiencePanelProps {
    item: MapItem;
    onClose: () => void;
}

export function SelectedExperiencePanel({ item, onClose }: SelectedExperiencePanelProps) {
    return (
        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative h-48 sm:h-64 w-full">
                {/* Decorative background for experiences without images in map-data yet or generic use */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                    <span className="text-gray-300 font-outfit font-black text-4xl opacity-20 uppercase tracking-tighter">ComboXplora</span>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-900 shadow-lg hover:bg-white transition-colors duration-300"
                >
                    <X size={20} />
                </button>

                <div className="absolute bottom-6 left-8 z-10 flex flex-wrap gap-2">
                    {item.categories.map((cat, idx) => (
                        <span key={idx} className="px-4 py-1.5 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-widest shadow-lg">
                            {cat}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-8 sm:p-10">
                <h3 className="font-outfit text-2xl sm:text-3xl font-black text-gray-900 mb-4 leading-tight">
                    {item.title}
                </h3>

                <p className="font-sans text-gray-500 mb-8 leading-relaxed text-sm sm:text-base">
                    {item.shortDescription}
                </p>

                <div className="flex flex-col gap-4 mb-10 text-sm font-medium text-gray-500">
                    {item.type === 'experience' && item.locationLabel && (
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary mt-1">
                                <MapPin size={16} />
                            </div>
                            <div>
                                <span className="block font-bold text-gray-900">{item.locationLabel}</span>
                                <span className="text-xs">{item.neighborhood}</span>
                                {item.meetingPoint && (
                                    <span className="block text-xs text-gray-400 mt-1">Punto de encuentro: {item.meetingPoint}</span>
                                )}
                            </div>
                        </div>
                    )}
                    {(!item.type || item.type !== 'experience' || !item.locationLabel) && (
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary">
                                <MapPin size={16} />
                            </div>
                            <span>{item.type === 'experience' ? item.neighborhood : 'Presencial'}</span>
                        </div>
                    )}

                    {item.type === 'experience' && (
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary">
                                <Clock size={16} />
                            </div>
                            <span>{item.duration}</span>
                        </div>
                    )}
                </div>

                <Link
                    href={`/experiencias/${item.slug}`}
                    className="inline-flex items-center justify-center gap-3 bg-gray-900 hover:bg-primary text-white hover:text-black px-10 py-4 rounded-full font-sans font-black text-sm uppercase tracking-widest transition-all duration-300 group shadow-xl hover:shadow-primary/20 hover:-translate-y-1"
                >
                    Ver experiencia completa
                    <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
