// types/index.ts

// Base types
export type Gender = "Erkak" | "Ayol" | "";
export type MessageType = 'text' | 'file' | 'system';
export type ToastType = "success" | "danger" | "warning";
export type UserRole = 'patient' | 'doctor' | 'operator';

// Toast notification
export interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
}

// User interface
export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    role?: UserRole;
    is_doctor?: boolean;
    is_staff?: boolean;
}

// History item for patient
export interface HistoryItem {
    date: string;
    author: string;
    text: string;
}

// Patient document
export interface PatientDocument {
    name: string;
    url: string;
}

// Patient details
export interface PatientDetails {
    passport: string;
    dob: string;
    gender: string;
    phone: string;
    email: string;
    complaints: string;
    previousDiagnosis: string;
    documents: unknown;
}

// Patient interface (asosiy)
export interface Patient {
    id: number;
    name: string;
    phone?: string;
    tagId?: number;
    stageId?: string;
    source?: string;
    createdBy?: string;
    lastUpdatedAt?: string;
    history?: HistoryItem[];
    details: PatientDetails;
    unreadMessages?: number; // Yangi xabarlar soni
}

// Tag interface
export interface Tag {
    id: number;
    text: string;
    color: string;
}

// Stage interface
export interface Stage {
    id: string;
    title: string;
    colorClass?: string;
}

// Message interface
export interface Message {
    id: number;
    type: MessageType;
    content?: string;
    reply_to?: number | null | any;
    sender: User;
    created_at: string;
    edited_at?: string | null;
    is_deleted: boolean;
    attachments?: Attachment[];
    conversation: number;
    results: any | unknown
}

// Attachment interface
export interface Attachment {
    id: number;
    file: string;
    original_name: string;
    mime_type: string;
    size: number;
    uploaded_at: string;
    uploader: User;
    message: number;
}

// Conversation interface
export interface Conversation {
    id: number;
    title?: string;
    patient: User;
    doctor?: User | null;
    is_active: boolean;
    last_message_at?: string;
    unread_count?: number;
    last_message?: Message;
    last_message_preview?: string;
    participants: Array<{
        id: number;
        role: UserRole;
        first_name?: string;
        last_name?: string;
    }>;
}

// Doctor summary
export interface DoctorSummary {
    id: number;
    diagnosis: string;
    recommendations: string;
    recommendations_list: string[];
    author: User;
    created_at: string;
    updated_at: string;
    conversation: number;
}

// Prescription
export interface Prescription {
    id: number;
    name: string;
    instruction: string;
    duration_days?: number;
    notes: string;
    author: User;
    created_at: string;
    conversation: number;
}

// Participant
export interface Participant {
    id: number;
    user: User;
    role: UserRole;
    joined_at: string;
    is_muted: boolean;
    conversation: number;
}

// API Response wrapper
export interface ApiResponse<T = any> {
    conversation?: Conversation;
    results?: T[];
    count?: number;
    next?: string | null;
    previous?: string | null;
    detail?: string;
}

type AllowedSendMessageType = 'text' | 'file';

export interface SendMessagePayload {
    content: string;
    type?: AllowedSendMessageType;
    reply_to?: any;
    files?: File[];
}

export interface UseChatProps {
    patientId: number;
    operatorId: number;
    onConversationCreated?: (conversationId: number) => void;
}

export interface UseChatReturn {
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

// Chat Modal props
export interface ChatModalProps {
    patient: {
        id: number;
        name: string;
        phone: string;
    };
    operatorId: number;
    isOpen: boolean;
    onClose: () => void;
}

// Patient Table props
export interface PatientTableProps {
    patients: Patient[];
    tags: Tag[];
    stages: Stage[];
    onSelectPatient: (patient: Patient) => void;
    currentUser: {
        id: number;
        role: UserRole;
        first_name?: string;
        last_name?: string;
    };
}

// Debounced input props
export interface DebouncedInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
}
// Message component props
export interface MessageProps {
    message: Message;
    currentUserId: number;
    onReply: (messageId: number) => void;
}
