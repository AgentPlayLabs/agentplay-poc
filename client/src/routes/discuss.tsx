import { useParams } from "react-router";
import Chat from "@/components/chat";
import DiscussPreparation from "@/components/discuss-preparation";
import type { UUID } from "@elizaos/core";

export default function AgentRoute() {
    const { agentId1, agentId2 } = useParams<{ agentId1: UUID; agentId2: UUID }>();

    if (!agentId1) return <div>No data.</div>;

    if (!agentId2) return <DiscussPreparation agentId={agentId1} />;

    return <Chat agentId={agentId1} />;
}
