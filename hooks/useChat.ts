// hooks/useChat.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Message, Conversation, ApiResponse } from "@/types";
import api from "@/utils/api";

interface UseChatProps {
    patientId: number;
    operatorId: number;
    onConversationCreated?: (conversationId: number) => void;
}

interface SendMessagePayload {
    content?: string;
    type?: "text" | "file";
    reply_to?: number | null;
    files?: File[];
}

interface UseChatReturn {
    messages: Message[];
    conversation: Conversation | null;
    loading: boolean;
    conversationLoading: boolean;
    sending: boolean;
    error: string | null;
    fetchMessages: (sinceId?: number) => Promise<void>;
    sendMessage: (payload: SendMessagePayload) => Promise<Message | undefined>;
    markAsRead: (messageId?: number) => Promise<void>;
    createConversation: () => Promise<Conversation | null>;
}

export const useChat = ({ patientId, operatorId, onConversationCreated }: UseChatProps): UseChatReturn => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [conversationLoading, setConversationLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const conversationCreatedRef = useRef(false);

    // Validate IDs
    const validateIds = useCallback(() => {
        if (!patientId || isNaN(patientId) || patientId <= 0) {
            throw new Error("Noto'g'ri bemor ID");
        }
        if (!operatorId || isNaN(operatorId) || operatorId <= 0) {
            throw new Error("Noto'g'ri operator ID");
        }
    }, [patientId, operatorId]);

    // Create conversation if doesn't exist (operator uchun)
    const createConversation = useCallback(async (): Promise<Conversation | null> => {
        try {
            validateIds();

            if (!patientId || !operatorId || conversationCreatedRef.current) {
                return null;
            }

            setConversationLoading(true);
            setError(null);

            console.log(`Operator suhbat yaratilmoqda: Patient ID ${patientId}, Operator ID ${operatorId}`);

            const { data: newConversation } = await api.post<Conversation>('/consultations/conversations/', {
                patient_id: patientId,
                // doctor_id yubormaymiz, operator suhbat
                title: `Operator suhbat: Patient ${patientId}`
            });

            console.log("Yangi operator suhbat yaratildi:", newConversation);

            setConversation(newConversation);
            if (onConversationCreated) {
                onConversationCreated(newConversation.id);
            }
            conversationCreatedRef.current = true;
            return newConversation;
        } catch (error: any) {
            console.error("Operator suhbat yaratishda xato:", error);
            setError(error.response?.data?.detail || "Suhbat yaratishda xato");

            // Agar suhbat allaqachon mavjud bo'lsa
            if (error.response?.status === 400 &&
                error.response?.data?.detail?.includes("already exists")) {
                await fetchMessages();
            }
            return null;
        } finally {
            setConversationLoading(false);
        }
    }, [patientId, operatorId,]);

    // Fetch messages (operator uchun)
    const fetchMessages = useCallback(async (sinceId?: number): Promise<void> => {
        try {
            validateIds();

            if (!patientId || !operatorId) return;

            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (sinceId) {
                params.append('since_id', sinceId.toString());
            }

            console.log(`Operator xabarlar yuklanmoqda: Patient ID ${patientId}`);

            // Operator uchun endpoint
            const { data } = await api.get<ApiResponse<Message>>(
                `/consultations/conversations/operator/${1}/messages/`,
                { params }
            );

            console.log("Operator xabarlar yuklandi:", data);

            if (data.conversation) {
                setConversation(data.conversation);
                if (onConversationCreated && !conversationCreatedRef.current) {
                    onConversationCreated(data.conversation.id);
                    conversationCreatedRef.current = true;
                }
            }
            if (Array.isArray(data.results)) {
                const results = data.results; // endi TypeScript uni Message[] deb tushunadi
                if (sinceId) {
                    setMessages((prev) => [...prev, ...results]);
                } else {
                    setMessages(results);
                }
            }


        } catch (error: any) {
            console.error("Operator xabarlar yuklashda xato:", error);
            setError(error.response?.data?.detail || "Xabarlar yuklashda xato");

            // Agar suhbat topilmasa, yangi suhbat yaratamiz
            if (error.response?.data?.detail === "No Conversation matches the given query.") {
                console.log("Operator suhbat topilmadi, yangi suhbat yaratilmoqda...");
                await createConversation();
            }
        } finally {
            setLoading(false);
        }
    }, [patientId, operatorId,]);

    // Send message (operator uchun)
    const sendMessage = useCallback(async (payload: SendMessagePayload): Promise<Message | undefined> => {
        try {
            validateIds();

            // Agar suhbat yo'q bo'lsa, avval yaratamiz
            if (!conversation?.id) {
                await createConversation();
                if (!conversation?.id) {
                    throw new Error("Operator suhbat topilmadi yoki yaratilmadi");
                }
            }

            setSending(true);
            setError(null);

            const formData = new FormData();
            formData.append("type", payload.type || "text");
            if (payload.content) {
                formData.append("content", payload.content);
            }
            if (payload.reply_to) {
                formData.append("reply_to", payload.reply_to.toString());
            }

            payload.files?.forEach((file) => {
                formData.append("attachments", file);
            });

            console.log(`Operator xabar yuborilmoqda: Conversation ID ${conversation.id}`);

            // Standart messages endpoint (conversation ID bilan)
            const { data: newMessage } = await api.post<Message>(
                `/consultations/conversations/${conversation.id}/messages/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Operator xabar muvaffaqiyatli yuborildi:", newMessage);

            setMessages((prev) => [...prev, newMessage]);
            await markAsRead(newMessage.id);

            return newMessage;
        } catch (error: any) {
            console.error("Operator xabar yuborishda xato:", error);
            setError(error.response?.data?.detail || "Xabar yuborishda xato");
            throw error;
        } finally {
            setSending(false);
        }
    }, [conversation?.id,]);

    // Mark messages as read (operator uchun)
    const markAsRead = useCallback(async (messageId?: number): Promise<void> => {
        if (!conversation?.id) return;

        try {
            let url: string;
            if (messageId) {
                // Operator uchun alohida mark-read endpoint
                url = `/consultations/conversations/${conversation.id}/operator/mark-read`;
            } else {
                url = `/consultations/conversations/${conversation.id}/mark-read`;
            }

            await api.post(url);
            console.log(`Operator xabar o'qilgan deb belgilandi: ${messageId || 'all'}`);
        } catch (error: any) {
            console.error("Operator o'qilgan deb belgilashda xato:", error);
        }
    }, [conversation?.id]);

    // Load initial messages
    useEffect(() => {
        if (patientId && operatorId) {
            console.log(`Operator chat hook ishga tushdi: Patient ${patientId}, Operator ${operatorId}`);
            fetchMessages();
        }

        // Reset conversation created flag
        conversationCreatedRef.current = false;
        setError(null);
        setMessages([]);
        setConversation(null);
    }, [patientId]);

    // Auto-poll for new messages every 5 seconds
    useEffect(() => {
        if (!conversation?.id || messages.length === 0) return;

        const interval = setInterval(() => {
            const lastMessageId = messages[messages.length - 1]?.id;
            if (lastMessageId) {
                fetchMessages(lastMessageId);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [conversation?.id,]);

    return {
        messages,
        conversation,
        loading,
        conversationLoading,
        sending,
        error,
        fetchMessages,
        sendMessage,
        markAsRead,
        createConversation,
    };
};