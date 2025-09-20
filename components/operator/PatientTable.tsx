// components/PatientTable.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    SortingState,
    ColumnDef,
} from "@tanstack/react-table";
import { Patient, Tag, Stage, DebouncedInputProps } from "@/types";
import ChatModal from "./modals/ChatModal";
import { get } from "lodash";

// Helper functions
const getTagById = (tags: Tag[], id: number) => tags.find((t) => t.id === id);
const getStageById = (stages: Stage[], id: string) => stages.find((s) => s.id === id);
const getTagColorClasses = (color: string = "secondary") => {
    const colorMap: { [key: string]: string } = {
        success: "bg-green-100 text-green-700",
        warning: "bg-yellow-100 text-yellow-700",
        danger: "bg-red-100 text-red-700",
        primary: "bg-blue-100 text-blue-700",
        secondary: "bg-gray-100 text-gray-700",
    };
    return colorMap[color] || colorMap.secondary;
};


function DebouncedInput({ value: initialValue, onChange, debounce = 300, ...props }: DebouncedInputProps) {
    const [value, setValue] = useState(initialValue);

    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value, onChange, debounce]);

    return (
        <input
            {...props}
            value={value}
            onChange={e => setValue(e.target.value)}
        />
    );
}

interface PatientTableProps {
    patients: Patient[];
    tags: Tag[];
    stages: Stage[];
    onSelectPatient: (patient: Patient) => void;
    currentUser: {
        id: number;
        role: string;
        first_name?: string;
        last_name?: string;
    };
}

export default function PatientTable({
    patients,
    tags,
    stages,
    onSelectPatient,
    currentUser,
}: PatientTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [chatOpen, setChatOpen] = useState(false);

    // Chat modal uchun
    const handleChatClick = (patient: Patient) => {
        if (currentUser?.role === 'operator') {
            setSelectedPatient(patient);
            setChatOpen(true);
        }
    };

    const handleRowClick = (patient: Patient) => {
        onSelectPatient(patient);
    };

    const columns = useMemo<ColumnDef<Patient>[]>(() => [
        {
            accessorKey: "name",
            header: "Bemor",
            cell: info => {
                const patientName = info.getValue() as string;
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                            {patientName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-bold text-gray-900 text-sm">{patientName}</div>
                            {currentUser?.role === 'operator' && (
                                <div className="text-xs text-gray-500">Operator kuzatuvida</div>
                            )}
                        </div>
                    </div>
                );
            },
            size: 200,
        },
        {
            accessorKey: "phone",
            header: "Telefon",
            cell: info => (
                <span className="text-sm text-gray-700 font-medium">
                    {(info.getValue() as string | number) || "Noma'lum"}
                </span>
            ),
            size: 150,
        },
        {
            accessorKey: "tagId",
            header: "Holati",
            cell: info => {
                const tagId = info.getValue() as number;
                const tag = getTagById(tags, tagId);
                return (
                    <span
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getTagColorClasses(
                            tag?.color
                        )}`}
                    >
                        {tag?.text || "Noma'lum"}
                    </span>
                );
            },
            size: 120,
        },
        {
            accessorKey: "stageId",
            header: "Bosqich",
            cell: info => {
                const stageId = info.getValue() as string;
                const stage = getStageById(stages, stageId);
                return (
                    <span className="text-sm text-gray-700">
                        {stage?.title || "Noma'lum"}
                    </span>
                );
            },
            size: 120,
        },
        {
            accessorKey: "lastUpdatedAt",
            header: "Oxirgi o'zgarish",
            cell: info => {
                const dateValue = info.getValue() as string;
                return (
                    <span className="text-sm text-gray-600">
                        {dateValue ? new Date(dateValue).toLocaleDateString("uz-UZ", {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        }) : "Hech qachon"}
                    </span>
                );
            },
            size: 140,
        },
        {
            id: "actions",
            header: () => <div className="text-right">Amallar</div>,
            cell: ({ row }) => {
                const patient = row.original;
                const hasUnreadMessages = patient?.unreadMessages && patient?.unreadMessages > 0;

                return (
                    <div className="flex items-center justify-end gap-1">
                        {/* WhatsApp */}
                        <a
                            href={`https://wa.me/${patient.details?.phone?.replace(/\D/g, "") || patient.phone?.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-green-50 hover:text-green-600 transition-all duration-200 group"
                            title="WhatsApp"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <i className="bi bi-whatsapp text-lg group-hover:-translate-y-0.5 transition-transform"></i>
                        </a>

                        {/* Telegram */}
                        <a
                            href={`https://t.me/${patient.details?.phone || patient.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200 group"
                            title="Telegram"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <i className="bi bi-telegram text-lg group-hover:-translate-y-0.5 transition-transform"></i>
                        </a>

                        {/* Message - Operator uchun */}
                        {currentUser?.role === 'operator' && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleChatClick(patient);
                                    }}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 relative group ${hasUnreadMessages
                                        ? 'text-red-500 hover:bg-red-50 hover:text-red-600'
                                        : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600'
                                        }`}
                                    title={hasUnreadMessages ? `${patient.unreadMessages} ta yangi xabar` : "Operator suhbat"}
                                    aria-label="Operator suhbat ochish"
                                >
                                    <i className="bi bi-chat-dots text-lg group-hover:-translate-y-0.5 transition-transform"></i>
                                    {hasUnreadMessages && (
                                        <span className="absolute -top-1 -right-1 min-w-[18px] h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                                            {(get(patient, "unreadMessages") as number) > 99 ? '99+' : patient.unreadMessages}
                                        </span>
                                    )}
                                </button>
                            </>
                        )}

                        {/* Batafsil ko'rish */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(patient);
                            }}
                            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                            title="Batafsil ma'lumot"
                            aria-label="Bemor batafsil ma'lumotlari"
                        >
                            <i className="bi bi-eye-fill text-lg group-hover:-translate-y-0.5 transition-transform"></i>
                        </button>
                    </div>
                );
            },
            size: 180,
            align: 'right' as const,
        },
    ], [tags, stages, onSelectPatient, currentUser, handleChatClick]);

    const table = useReactTable({
        data: patients,
        columns,
        state: {
            sorting,
            globalFilter,
            pagination: {
                pageIndex: 0,
                pageSize: 10,
            },
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        columnResizeMode: "onChange",
    });

    // Global filter functionality
    const filteredPatients = useMemo(() => {
        if (!globalFilter) return patients;
        return patients.filter(patient =>
            patient.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
            (patient.phone && patient.phone.includes(globalFilter)) ||
            (patient.details?.phone && patient.details.phone.includes(globalFilter))
        );
    }, [patients, globalFilter]);

    return (
        <>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-4 sm:p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Bemorlar ro'yxati</h3>
                        {currentUser?.role === 'operator' && (
                            <p className="text-sm text-gray-500 mt-1">Operator sifatida kuzatuvdagi bemorlar</p>
                        )}
                    </div>
                    <div className="relative">
                        <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <DebouncedInput
                            value={globalFilter ?? ''}
                            onChange={value => setGlobalFilter(String(value))}
                            className="pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm hover:shadow-md w-full md:w-64"
                            placeholder="Bemor nomi yoki telefon bo'yicha qidirish..."
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max">
                        <thead className="bg-slate-50">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200"
                                            style={{ width: header.getSize() }}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={header.column.getCanSort()
                                                        ? 'cursor-pointer select-none flex items-center gap-2 group'
                                                        : 'flex items-center gap-2'
                                                    }
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {header.column.getIsSorted() === 'asc' && (
                                                            <i className="bi bi-arrow-up text-xs"></i>
                                                        )}
                                                        {header.column.getIsSorted() === 'desc' && (
                                                            <i className="bi bi-arrow-down text-xs"></i>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map(row => (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-slate-50 hover:shadow-sm transition-all duration-200 cursor-pointer border-b border-slate-100 group"
                                        onClick={() => handleRowClick(row.original)}
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <td
                                                key={cell.id}
                                                className="p-4 whitespace-nowrap text-sm text-gray-700 align-top"
                                                style={{ width: cell.column.getSize() }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="text-center p-12 text-gray-500"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <i className="bi bi-inbox text-6xl text-gray-300"></i>
                                            <div>
                                                <p className="text-base font-medium text-gray-700">Bemorlar topilmadi</p>
                                                <p className="text-sm text-gray-400">
                                                    {/* {globalFilter
                                                        ? `"${globalFilter}" qidiruv so'rovingizga mos bemorlar topilmadi`
                                                        : 'Hozircha hech qanday bemor qo'shilmagan
                                                    } */}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {table.getPageCount() > 1 && (
                    <div className="flex items-center justify-between mt-6 flex-wrap gap-4 pt-4 border-t border-slate-200">
                        <span className="text-sm text-gray-600">
                            Ko'rsatilmoqda {table.getRowModel().rows.length} ta
                            {filteredPatients.length !== patients.length && (
                                <span className="text-xs text-gray-400 ml-2">
                                    (jami: {patients.length} ta)
                                </span>
                            )}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                                <i className="bi bi-chevron-double-left"></i>
                            </button>
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            <span className="px-3 py-2 text-sm text-gray-700 min-w-[80px] text-center">
                                {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                            </span>
                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>
                            <button
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                                <i className="bi bi-chevron-double-right"></i>
                            </button>
                            <select
                                value={table.getState().pagination.pageSize}
                                onChange={e => {
                                    table.setPageSize(Number(e.target.value));
                                }}
                                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500"
                            >
                                {[10, 20, 30, 50].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        {pageSize} ta
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Modal - Operator uchun */}
            {selectedPatient && chatOpen && currentUser?.role === 'operator' && (
                <ChatModal
                    patient={{
                        id: selectedPatient.id,
                        name: selectedPatient.name,
                        phone: selectedPatient.phone || selectedPatient.details?.phone || '',
                    }}
                    operatorId={currentUser.id}
                    isOpen={chatOpen}
                    onClose={() => {
                        setChatOpen(false);
                        setSelectedPatient(null);
                    }}
                />
            )}
        </>
    );
}