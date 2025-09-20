// components/modals/ChatModal.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatModalProps, MessageProps, SendMessagePayload } from "@/types"; //


const MessageComponent: React.FC<MessageProps> = ({ message, currentUserId, onReply }) => {
    const isOwn = message.sender.id === currentUserId;
    const hasAttachments = message.attachments && message.attachments.length > 0;
    const replyTo = message.reply_to;

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return 'bi-image';
        if (mimeType.includes('pdf')) return 'bi-file-earmark-pdf';
        if (mimeType.includes('word') || mimeType.includes('document')) return 'bi-file-earmark-word';
        return 'bi-file-earmark';
    };

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 group`}>
            <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : ''}`}>
                {/* Reply indicator */}
                {replyTo && (
                    <div className="mb-1 text-xs text-gray-400 italic">
                        ↳ Javob: {replyTo.content?.substring(0, 30)}${replyTo.content && replyTo.content.length > 30 ? '...' : ''}
                    </div>
                )}

                {/* Message bubble */}
                <div className={`p-3 rounded-2xl shadow-sm ${isOwn
                    ? 'bg-purple-500 text-white'  // Operator uchun purple
                    : 'bg-gray-100 text-gray-900'
                    }`}>
                    {message.is_deleted ? (
                        <div className="text-xs italic opacity-50">Bu xabar o'chirildi</div>
                    ) : (
                        <>
                            {message.content && (
                                <div className="whitespace-pre-wrap break-words leading-relaxed">
                                    {message.content}
                                </div>
                            )}
                            {hasAttachments && (
                                <div className="mt-2 space-y-1">
                                    {message.attachments?.map((attachment) => (
                                        <div key={attachment.id} className="flex items-center gap-2 p-2 bg-white/20 rounded-lg">
                                            <i className={`${getFileIcon(attachment.mime_type)} text-sm flex-shrink-0`}></i>
                                            <a
                                                href={attachment.file}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`text-sm truncate hover:underline flex-1 ${isOwn ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-blue-600'
                                                    }`}
                                                download={attachment.original_name}
                                            >
                                                {attachment.original_name || 'Fayl'}
                                            </a>
                                            <span className="text-xs opacity-75 flex-shrink-0">
                                                {Math.round(attachment.size / 1024)} KB
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {message.type === 'system' && !message.content && (
                                <div className="text-xs opacity-75 italic">Tizim xabari</div>
                            )}
                        </>
                    )}
                    {message.edited_at && (
                        <div className="text-xs opacity-75 mt-1 flex justify-end">
                            <i className="bi bi-pencil mr-1"></i>Tahrirlandi
                        </div>
                    )}
                </div>

                {/* Message time & actions */}
                <div className={`flex items-center justify-${isOwn ? 'end' : 'start'} mt-1 text-xs text-gray-400 space-x-2`}>
                    <span className="text-xs">
                        {new Date(message.created_at).toLocaleTimeString('uz-UZ', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                    {!isOwn && !message.is_deleted && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onReply(message.id);
                            }}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                            title="Javob berish"
                        >
                            <i className="bi bi-reply text-sm"></i>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
type AllowedSendMessageType = 'text' | 'file';

export default function ChatModal({ patient, operatorId, isOpen, onClose }: ChatModalProps) {
    const [conversationId, setConversationId] = useState<number | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [showFilesPreview, setShowFilesPreview] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        messages,
        conversation,
        loading,
        conversationLoading,
        sending,
        error,
        fetchMessages,
        sendMessage,
        markAsRead
    } = useChat({
        patientId: patient.id,
        operatorId,
        onConversationCreated: (convId) => setConversationId(convId)
    });

    // Auto-scroll to bottom
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages, scrollToBottom]);

    // Initialize conversation
    useEffect(() => {
        if (isOpen && patient.id && operatorId) {
            fetchMessages();
            // Mark all as read when opening chat
            if (conversationId) {
                markAsRead();
            }
        }
    }, [isOpen, patient.id, operatorId, fetchMessages, conversationId, markAsRead]);

    // Reset state when closing
    useEffect(() => {
        if (!isOpen) {
            setNewMessage('');
            setReplyTo(null);
            setFiles([]);
            setShowFilesPreview(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [isOpen]);

    const handleSendMessage = async () => {
        if ((!newMessage.trim() && files.length === 0) || sending) return;

        try {
            const payload: SendMessagePayload = {
                content: newMessage,
                type: (files.length > 0 ? 'file' : 'text') as AllowedSendMessageType,
                reply_to: replyTo || undefined,
                files
            };

            await sendMessage(payload);

            // Reset form
            setNewMessage('');
            setReplyTo(null);
            setFiles([]);
            setShowFilesPreview(false);
            if (fileInputRef.current) fileInputRef.current.value = '';

            // Scroll to bottom
            setTimeout(scrollToBottom, 100);
        } catch (error) {
            console.error('Operator xabar yuborishda xato:', error);
            // Toast notification qo'shishingiz mumkin
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
            setShowFilesPreview(true);
        }
    };

    const removeFile = (indexToRemove: number) => {
        setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const clearReply = () => {
        setReplyTo(null);
    };

    if (!isOpen) return null;

    const isLoading = loading || conversationLoading;
    const canSend = !isLoading && !sending && (newMessage.trim().length > 0 || files.length > 0);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">
                            {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">{patient.name}</h3>
                            <p className="text-sm text-gray-500">{patient.phone}</p>
                            {conversation && (
                                <p className="text-xs text-gray-400">
                                    {conversation.title || `Operator suhbat #${conversation.id}`}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {conversation?.unread_count && conversation.unread_count > 0 && (
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
                                {conversation.unread_count} yangi
                            </span>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                            aria-label="Yopish"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <div className="flex items-start gap-2">
                                    <i className="bi bi-exclamation-triangle text-red-500 mt-0.5 flex-shrink-0"></i>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-red-800">Xatolik yuz berdi</p>
                                        <p className="text-sm text-red-600 mt-1">{error}</p>
                                        <button
                                            onClick={() => {
                                                // setError(null);
                                                fetchMessages();
                                            }}
                                            className="text-red-600 hover:text-red-800 text-sm mt-2 underline inline-flex items-center gap-1"
                                        >
                                            <i className="bi bi-arrow-clockwise"></i>
                                            Qaytadan urinish
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Loading state */}
                        {isLoading && messages.length === 0 ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">
                                            {conversationLoading
                                                ? 'Operator suhbat tayyorlanmoqda...'
                                                : 'Xabarlar yuklanmoqda...'
                                            }
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">Iltimos kuting...</p>
                                    </div>
                                </div>
                            </div>
                        ) : messages.length === 0 && !isLoading ? (
                            <div className="text-center py-12 text-gray-500">
                                <i className="bi bi-chat-square-text text-6xl mb-4 block opacity-50"></i>
                                <p className="text-lg font-medium text-gray-700">Operator suhbat boshlanmadi</p>
                                <p className="text-sm text-gray-500 mt-1">Birinchi xabarni yuboring</p>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <MessageComponent
                                    key={message.id}
                                    message={message}
                                    currentUserId={operatorId}
                                    onReply={setReplyTo}
                                />
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-200 p-4 bg-white">
                        <div className="max-w-4xl mx-auto">
                            {/* Reply indicator */}
                            {replyTo && (
                                <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <i className="bi bi-arrow-return-right text-purple-600 text-sm"></i>
                                            <span className="text-sm text-purple-800">Javob berilmoqda...</span>
                                        </div>
                                        <button
                                            onClick={clearReply}
                                            className="text-purple-600 hover:text-purple-800 p-1 rounded-full hover:bg-purple-100 transition-colors"
                                            aria-label="Javobni bekor qilish"
                                        >
                                            <i className="bi bi-x text-sm"></i>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Input form */}
                            <div className="flex items-end gap-3">
                                {/* File upload */}
                                <label
                                    className={`p-3 rounded-lg transition-colors ${files.length > 0
                                        ? 'bg-purple-100 text-purple-600'
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                        }`}
                                    title="Fayl biriktirish"
                                >
                                    <i className={`bi bi-paperclip text-lg ${files.length > 0 ? 'bi-check-circle-fill' : ''}`}></i>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/*,.pdf,.doc,.docx,.txt"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        disabled={isLoading || sending}
                                    />
                                </label>

                                {/* Text input */}
                                <div className="flex-1 relative">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder={replyTo ? "Javob yozing..." : "Operator sifatida xabar yozing..."}
                                        rows={1}
                                        className={`w-full resize-none border rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${isLoading || sending
                                            ? 'bg-gray-100 cursor-not-allowed'
                                            : 'hover:border-purple-300'
                                            }`}
                                        style={{
                                            minHeight: '44px',
                                            maxHeight: '120px',
                                            borderColor: canSend ? '#a855f7' : '#d1d5db'
                                        }}
                                        disabled={isLoading || sending}
                                    />

                                    {/* Files preview */}
                                    {showFilesPreview && files.length > 0 && (
                                        <div className="absolute bottom-full left-0 mb-2 w-full bg-white border rounded-lg p-2 shadow-lg max-h-32 overflow-y-auto z-10">
                                            {files.slice(0, 5).map((file, idx) => (
                                                <div key={idx} className="flex items-center justify-between text-sm text-gray-600 py-1">
                                                    <span className="truncate flex-1" title={file.name}>
                                                        {file.name.length > 25 ? `${file.name.substring(0, 25)}...` : file.name}
                                                    </span>
                                                    <button
                                                        onClick={() => removeFile(idx)}
                                                        className="ml-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                                                        title="O'chirish"
                                                    >
                                                        <i className="bi bi-x text-xs"></i>
                                                    </button>
                                                </div>
                                            ))}
                                            {files.length > 5 && (
                                                <div className="text-xs text-gray-500 mt-1 border-t pt-1">
                                                    +{files.length - 5} fayl qo'shildi
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Send button */}
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!canSend}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all shadow-sm ${canSend
                                        ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-purple-200 hover:shadow-purple-300'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                    aria-label={canSend ? "Xabar yuborish" : "Xabar yuborib bo'lmaydi"}
                                >
                                    {sending ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <i className={`bi text-sm ${newMessage.trim() || files.length > 0
                                            ? 'bi-send-fill'
                                            : 'bi-plus-circle'
                                            }`}></i>
                                    )}
                                </button>
                            </div>

                            {/* Files preview (mobile uchun) */}
                            {files.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {files.slice(0, 3).map((file, idx) => (
                                        <div key={idx} className="bg-purple-50 px-2 py-1 rounded text-xs text-purple-700 border border-purple-200">
                                            <span className="truncate max-w-20" title={file.name}>
                                                {file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name}
                                            </span>
                                            <button
                                                onClick={() => removeFile(idx)}
                                                className="ml-1 text-red-500 hover:text-red-700"
                                            >
                                                <i className="bi bi-x text-xs"></i>
                                            </button>
                                        </div>
                                    ))}
                                    {files.length > 3 && (
                                        <div className="bg-purple-50 px-2 py-1 rounded text-xs text-purple-700 border border-purple-200">
                                            +{files.length - 3} fayl
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}