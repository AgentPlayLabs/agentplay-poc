import { DatabaseAdapter, UUID, Memory, elizaLogger } from "@elizaos/core";

export interface ChatParticipant {
    id: UUID;
    name: string;
    role: "host" | "participant";
}

export class MultiAgentChat {
    private roomId: UUID | null = null;
    private participants: Map<UUID, ChatParticipant> = new Map();

    constructor(private databaseAdapter: DatabaseAdapter<any>) {}

    async createChatRoom(): Promise<UUID> {
        this.roomId = await this.databaseAdapter.createRoom();
        elizaLogger.info("Created chat room", { roomId: this.roomId });
        return this.roomId;
    }

    async addParticipant(participant: ChatParticipant): Promise<void> {
        if (!this.roomId) {
            throw new Error("Chat room not created yet");
        }

        await this.databaseAdapter.addParticipant({
            roomId: this.roomId,
            userId: participant.id,
            role: participant.role
        });

        this.participants.set(participant.id, participant);
        elizaLogger.info("Added participant to chat room", { 
            roomId: this.roomId, 
            participantId: participant.id,
            participantName: participant.name
        });
    }

    async sendMessage(senderId: UUID, content: string): Promise<void> {
        if (!this.roomId) {
            throw new Error("Chat room not created yet");
        }

        const sender = this.participants.get(senderId);
        if (!sender) {
            throw new Error("Sender is not a participant in this chat room");
        }

        await this.databaseAdapter.createMemory({
            roomId: this.roomId,
            content: content,
            agentId: senderId,
            type: "chat_message"
        });

        elizaLogger.info("Message sent to chat room", {
            roomId: this.roomId,
            senderId,
            senderName: sender.name
        });
    }

    async getMessages(limit?: number): Promise<Memory[]> {
        if (!this.roomId) {
            throw new Error("Chat room not created yet");
        }

        return await this.databaseAdapter.getMemoriesByRoomIds({
            roomIds: [this.roomId],
            tableName: "chat_message",
            limit
        });
    }

    async getParticipants(): Promise<ChatParticipant[]> {
        if (!this.roomId) {
            throw new Error("Chat room not created yet");
        }

        const participantIds = await this.databaseAdapter.getParticipantsForRoom(this.roomId);
        return participantIds
            .map(id => this.participants.get(id))
            .filter((p): p is ChatParticipant => p !== undefined);
    }

    async cleanup(): Promise<void> {
        if (this.roomId) {
            await this.databaseAdapter.removeRoom(this.roomId);
            this.roomId = null;
            this.participants.clear();
            elizaLogger.info("Chat room cleaned up");
        }
    }
}
